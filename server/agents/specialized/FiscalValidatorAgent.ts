// ---------------------------------------------------------------------------
// FEI Agent — Fiscal Validator
// ---------------------------------------------------------------------------

import { BaseAgent } from "../core/BaseAgent";
import type { AgentConfig, AgentResult, ExecutionContext, AgentEvent } from "../core/types";
import { getDb } from "../../db";
import { blogPosts } from "../../../shared/schema";
import { eq } from "drizzle-orm";

// Leyes y artículos válidos que pueden citarse
const VALID_LEGAL_REFS = [
  { law: "LISR", articles: Array.from({ length: 210 }, (_, i) => i + 1) },
  { law: "CFF", articles: Array.from({ length: 150 }, (_, i) => i + 1) },
  { law: "LIVA", articles: Array.from({ length: 50 }, (_, i) => i + 1) },
  { law: "CPEUM", articles: Array.from({ length: 136 }, (_, i) => i + 1) },
  { law: "LFPIORPI", articles: Array.from({ length: 70 }, (_, i) => i + 1) },
];

const CONFIG: AgentConfig = {
  agentType: "fiscal_validator",
  name: "Fiscal Validator",
  description: "Valida citas legales y referencias fiscales en contenido de blog.",
  systemPrompt: `Eres un validador fiscal mexicano. Tu tarea es revisar artículos de blog sobre temas fiscales y verificar:

1. Que las referencias a artículos de ley sean correctas (LISR, CFF, LIVA, CPEUM, LFPIORPI)
2. Que los conceptos fiscales estén usados correctamente
3. Que no haya afirmaciones legales incorrectas o peligrosas
4. Que las cifras de tasas impositivas sean actuales (ISR 30% personas morales, IVA 16%, etc.)

Devuelve SOLO un JSON (sin markdown wrapping):
{
  "valid": true,
  "issues": [
    { "type": "error|warning|info", "text": "descripción del problema", "location": "texto citado" }
  ],
  "legalReferences": [
    { "law": "LISR", "article": "25", "valid": true, "context": "deducción autorizada" }
  ],
  "riskLevel": "low|medium|high"
}

IMPORTANTE: Si el artículo no tiene citas legales, eso NO es un error — simplemente reporta legalReferences vacío.`,
  model: "claude-sonnet-4-20250514",
  temperature: 0.1,
  maxTokens: 2048,
  skills: ["fiscal_validation", "legal_verification"],
  enabled: true,
  concurrency: 1,
  retryPolicy: { maxRetries: 2, baseDelayMs: 1000, backoffMultiplier: 2 },
};

class FiscalValidatorAgent extends BaseAgent {
  constructor() {
    super(CONFIG);
  }

  async execute(
    context: ExecutionContext,
    payload: Record<string, unknown>,
  ): Promise<AgentResult> {
    const start = Date.now();
    const events: AgentEvent[] = [];
    const postId = payload.postId as number;

    if (!postId) {
      return this.failureResult("postId es requerido", events, Date.now() - start);
    }

    events.push(this.createEvent(context.jobId, "started", `Validando fiscal post ${postId}`));

    try {
      const db = getDb();
      const rows = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, postId))
        .limit(1);

      const post = rows[0];
      if (!post) {
        return this.failureResult(`Post ${postId} no encontrado`, events, Date.now() - start);
      }

      // Pasada 1: Regex para detectar referencias legales
      const regexRefs = this.extractLegalRefs(post.content);
      const invalidRefs = regexRefs.filter((ref) => !this.isValidRef(ref.law, ref.article));

      events.push(
        this.createEvent(context.jobId, "progress", "Pasada regex completada", {
          totalRefs: regexRefs.length,
          invalidRefs: invalidRefs.length,
        }),
      );

      // Pasada 2: LLM para validación semántica
      let llmIssues: Array<{ type: string; text: string; location: string }> = [];
      let riskLevel = "low";

      try {
        const llmResponse = await this.callLLM([
          {
            role: "user",
            content: `Valida las referencias fiscales y legales del siguiente artículo:\n\nTítulo: ${post.title}\n\nContenido:\n${post.content.substring(0, 4000)}`,
          },
        ]);

        try {
          const parsed = JSON.parse(llmResponse);
          llmIssues = parsed.issues ?? [];
          riskLevel = parsed.riskLevel ?? "low";
        } catch {
          // LLM no devolvió JSON válido
        }
      } catch {
        events.push(
          this.createEvent(context.jobId, "info", "Validación LLM omitida — solo regex"),
        );
      }

      // Combinar resultados
      const allIssues = [
        ...invalidRefs.map((ref) => ({
          type: "error" as const,
          text: `Referencia inválida: artículo ${ref.article} de ${ref.law}`,
          location: ref.raw,
        })),
        ...llmIssues,
      ];

      const errors = allIssues.filter((i) => i.type === "error").length;
      const warnings = allIssues.filter((i) => i.type === "warning").length;

      if (errors > 0) riskLevel = "high";
      else if (warnings > 0 && riskLevel === "low") riskLevel = "medium";

      events.push(
        this.createEvent(context.jobId, "completed", `Validación fiscal: ${errors} errores, ${warnings} warnings`, {
          riskLevel,
          errors,
          warnings,
        }),
      );

      return this.successResult(
        {
          postId,
          valid: errors === 0,
          issues: allIssues,
          legalReferences: regexRefs,
          riskLevel,
        },
        {
          totalReferences: regexRefs.length,
          invalidReferences: invalidRefs.length,
          errors,
          warnings,
        },
        events,
        Date.now() - start,
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      events.push(this.createEvent(context.jobId, "failed", errorMsg));
      return this.failureResult(errorMsg, events, Date.now() - start);
    }
  }

  private extractLegalRefs(text: string): Array<{ law: string; article: number; raw: string }> {
    const refs: Array<{ law: string; article: number; raw: string }> = [];
    // Match patterns like "artículo 25 de la LISR", "Art. 5-A del CFF", etc.
    const regex = /art[íi]culo\s+(\d+)(?:-[A-Z])?\s+(?:de\s+(?:la|el)\s+)?(LISR|CFF|LIVA|CPEUM|LFPIORPI)/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
      refs.push({
        law: match[2].toUpperCase(),
        article: parseInt(match[1], 10),
        raw: match[0],
      });
    }
    return refs;
  }

  private isValidRef(law: string, article: number): boolean {
    const lawDef = VALID_LEGAL_REFS.find((l) => l.law === law);
    if (!lawDef) return false;
    return lawDef.articles.includes(article);
  }
}

export const fiscalValidatorAgent = new FiscalValidatorAgent();
