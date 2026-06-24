// ---------------------------------------------------------------------------
// FEI Agent — SEO Optimizer
// ---------------------------------------------------------------------------

import { BaseAgent } from "../core/BaseAgent";
import type { AgentConfig, AgentResult, ExecutionContext, AgentEvent } from "../core/types";
import { getDb } from "../../db";
import { blogPosts } from "../../../shared/schema";
import { eq } from "drizzle-orm";

const CONFIG: AgentConfig = {
  agentType: "seo_optimizer",
  name: "SEO Optimizer",
  description: "Genera títulos SEO, meta descriptions y calcula score para artículos de blog fiscal.",
  systemPrompt: `Eres un experto en SEO para contenido fiscal mexicano (FEI Consultores — feiconsultores.com).

Tu tarea es optimizar artículos de blog para posicionamiento en buscadores, enfocado en el mercado mexicano de consultoría fiscal.

Analiza el artículo y devuelve SOLO un JSON (sin markdown wrapping):
{
  "seoTitle": "título SEO optimizado (máximo 60 caracteres)",
  "seoDescription": "meta description (máximo 155 caracteres)",
  "seoScore": 85,
  "suggestions": [
    "Sugerencia 1 para mejorar SEO",
    "Sugerencia 2"
  ]
}

Reglas de scoring (0-100):
- Título contiene keyword principal: +20
- Meta description persuasiva y con keyword: +20
- Contenido >800 palabras: +15
- Tiene subtítulos H2/H3: +15
- Menciona términos legales específicos (LISR, CFF, SAT): +10
- Tiene datos/cifras concretas: +10
- Tiene call-to-action: +10

Keywords prioritarias para FEI: materialidad fiscal, evidencia fiscal, cumplimiento tributario, auditoría SAT, deducción fiscal, CFDI, razón de negocios.`,
  model: "claude-sonnet-4-20250514",
  temperature: 0.3,
  maxTokens: 2048,
  skills: ["seo", "keyword_analysis"],
  enabled: true,
  concurrency: 1,
  retryPolicy: { maxRetries: 2, baseDelayMs: 1000, backoffMultiplier: 2 },
};

class SEOOptimizerAgent extends BaseAgent {
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

    events.push(this.createEvent(context.jobId, "started", `Optimizando SEO post ${postId}`));

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

      // Llamar al LLM
      const llmResponse = await this.callLLM([
        {
          role: "user",
          content: `Optimiza el SEO del siguiente artículo fiscal:\n\nTítulo: ${post.title}\n\nContenido (primeros 3000 chars):\n${post.content.substring(0, 3000)}`,
        },
      ]);

      let seoTitle = post.title;
      let seoDescription = post.excerpt ?? "";
      let seoScore = 50;
      let suggestions: string[] = [];

      try {
        const parsed = JSON.parse(llmResponse);
        seoTitle = parsed.seoTitle || seoTitle;
        seoDescription = parsed.seoDescription || seoDescription;
        seoScore = typeof parsed.seoScore === "number" ? parsed.seoScore : seoScore;
        suggestions = parsed.suggestions ?? [];
      } catch {
        // Fallback: calcular score básico sin LLM
        seoScore = this.calculateBasicScore(post.title, post.content);
      }

      // Actualizar en DB
      await db
        .update(blogPosts)
        .set({
          seoTitle,
          seoDescription,
          seoScore,
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, postId));

      events.push(
        this.createEvent(context.jobId, "completed", `SEO optimizado: score ${seoScore}`, {
          seoScore,
          suggestionsCount: suggestions.length,
        }),
      );

      return this.successResult(
        { postId, seoTitle, seoDescription, seoScore, suggestions },
        { seoScore, suggestionsCount: suggestions.length },
        events,
        Date.now() - start,
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      events.push(this.createEvent(context.jobId, "failed", errorMsg));
      return this.failureResult(errorMsg, events, Date.now() - start);
    }
  }

  private calculateBasicScore(title: string, content: string): number {
    let score = 30; // base
    const text = (title + " " + content).toLowerCase();

    // Keywords fiscales
    const keywords = ["materialidad", "fiscal", "sat", "lisr", "cff", "cfdi", "deducción", "auditoría"];
    const keywordHits = keywords.filter((kw) => text.includes(kw)).length;
    score += Math.min(keywordHits * 5, 20);

    // Longitud de contenido
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 800) score += 15;
    else if (wordCount > 400) score += 8;

    // Subtítulos
    if (content.includes("##")) score += 10;

    // Cifras
    if (/\$[\d,]+/.test(content) || /\d+%/.test(content)) score += 10;

    return Math.min(score, 100);
  }
}

export const seoOptimizerAgent = new SEOOptimizerAgent();
