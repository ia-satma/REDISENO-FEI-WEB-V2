// ---------------------------------------------------------------------------
// FEI Agent — Content Formatter
// ---------------------------------------------------------------------------

import { BaseAgent } from "../core/BaseAgent";
import type { AgentConfig, AgentResult, ExecutionContext, AgentEvent } from "../core/types";
import { getDb } from "../../db";
import { blogPosts } from "../../../shared/schema";
import { eq } from "drizzle-orm";

const CONFIG: AgentConfig = {
  agentType: "formatter",
  name: "Content Formatter",
  description: "Limpia y formatea artículos de blog para consultoría fiscal mexicana.",
  systemPrompt: `Eres un formateador de contenido para una firma de consultoría fiscal mexicana (FEI Consultores).

Tu tarea es limpiar y formatear artículos de blog sobre materialidad fiscal, cumplimiento tributario y temas fiscales mexicanos.

Reglas:
- Corrige estructura de párrafos y encabezados (usa ## para subtítulos).
- Elimina espacios dobles, líneas en blanco excesivas y caracteres basura.
- Asegura que las listas usen formato consistente (- para viñetas).
- NO cambies el contenido sustancial ni las cifras legales.
- NO agregues información que no esté en el original.
- Mantén un tono profesional y formal.
- Genera un excerpt conciso (máximo 200 caracteres) si no existe.

Devuelve SOLO un JSON con esta estructura (sin markdown wrapping):
{
  "title": "título limpio",
  "content": "contenido formateado completo",
  "excerpt": "resumen de máximo 200 caracteres"
}`,
  model: "claude-sonnet-4-20250514",
  temperature: 0.2,
  maxTokens: 4096,
  skills: ["formatting", "cleanup"],
  enabled: true,
  concurrency: 1,
  retryPolicy: { maxRetries: 2, baseDelayMs: 1000, backoffMultiplier: 2 },
};

class ContentFormatterAgent extends BaseAgent {
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

    events.push(this.createEvent(context.jobId, "started", `Formateando post ${postId}`));

    try {
      // Leer post de la DB
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

      const originalLength = post.content.length;

      // Enviar al LLM
      const llmResponse = await this.callLLM([
        {
          role: "user",
          content: `Formatea el siguiente artículo de blog fiscal:\n\nTítulo: ${post.title}\n\nContenido:\n${post.content}`,
        },
      ]);

      // Parsear respuesta
      let parsed: { title: string; content: string; excerpt: string };
      try {
        parsed = JSON.parse(llmResponse);
      } catch {
        // Si el LLM no devuelve JSON válido, usar el texto como contenido limpio
        parsed = {
          title: post.title,
          content: llmResponse,
          excerpt: post.excerpt ?? llmResponse.substring(0, 200),
        };
      }

      // Actualizar en DB
      await db
        .update(blogPosts)
        .set({
          title: parsed.title,
          content: parsed.content,
          excerpt: parsed.excerpt,
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, postId));

      const cleanedLength = parsed.content.length;

      events.push(
        this.createEvent(context.jobId, "completed", `Post ${postId} formateado`, {
          originalLength,
          cleanedLength,
        }),
      );

      return this.successResult(
        { postId, title: parsed.title, excerpt: parsed.excerpt },
        { originalLength, cleanedLength, reductionPct: Math.round((1 - cleanedLength / originalLength) * 100) },
        events,
        Date.now() - start,
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      events.push(this.createEvent(context.jobId, "failed", errorMsg));
      return this.failureResult(errorMsg, events, Date.now() - start);
    }
  }
}

export const formatterAgent = new ContentFormatterAgent();
