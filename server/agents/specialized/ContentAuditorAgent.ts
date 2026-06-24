// ---------------------------------------------------------------------------
// FEI Agent — Content Auditor
// ---------------------------------------------------------------------------

import { BaseAgent } from "../core/BaseAgent";
import type { AgentConfig, AgentResult, ExecutionContext, AgentEvent } from "../core/types";
import { getDb } from "../../db";
import { blogPosts } from "../../../shared/schema";
import { eq, desc } from "drizzle-orm";

const CONFIG: AgentConfig = {
  agentType: "content_auditor",
  name: "Content Auditor",
  description: "Audita contenido publicado periódicamente para detectar problemas de calidad.",
  systemPrompt: `Eres un auditor de contenido para FEI Consultores, firma de consultoría fiscal mexicana.

Revisa artículos de blog publicados y detecta:
1. Contenido desactualizado (referencias a leyes o tasas que hayan cambiado)
2. Links rotos o referencias internas faltantes
3. Calidad del contenido (legibilidad, estructura, profundidad)
4. Consistencia de tono y voz de marca
5. Problemas de SEO (títulos duplicados, meta descriptions vacías)

Devuelve SOLO un JSON (sin markdown wrapping):
{
  "overallScore": 85,
  "findings": [
    {
      "severity": "high|medium|low",
      "category": "outdated|quality|seo|consistency",
      "postId": 1,
      "title": "título del post",
      "issue": "descripción del problema",
      "recommendation": "acción sugerida"
    }
  ]
}`,
  model: "claude-sonnet-4-20250514",
  temperature: 0.2,
  maxTokens: 4096,
  skills: ["content_audit", "quality_check"],
  enabled: true,
  concurrency: 1,
  retryPolicy: { maxRetries: 1, baseDelayMs: 2000, backoffMultiplier: 2 },
};

class ContentAuditorAgent extends BaseAgent {
  constructor() {
    super(CONFIG);
  }

  async execute(
    context: ExecutionContext,
    _payload: Record<string, unknown>,
  ): Promise<AgentResult> {
    const start = Date.now();
    const events: AgentEvent[] = [];

    events.push(this.createEvent(context.jobId, "started", "Iniciando auditoría de contenido"));

    try {
      const db = getDb();

      // Obtener los últimos 20 posts publicados
      const posts = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(20);

      if (posts.length === 0) {
        events.push(this.createEvent(context.jobId, "info", "No hay posts publicados para auditar"));
        return this.successResult(
          { findings: [], overallScore: 100 },
          { postsAudited: 0, findings: 0 },
          events,
          Date.now() - start,
        );
      }

      // Construir resumen de posts para el LLM
      const postSummaries = posts.map((p) => ({
        id: p.id,
        title: p.title,
        excerpt: p.content.substring(0, 500),
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        seoScore: p.seoScore,
        agentProcessed: p.agentProcessed,
        publishedAt: p.publishedAt?.toISOString(),
      }));

      events.push(
        this.createEvent(context.jobId, "progress", `Auditando ${posts.length} posts`),
      );

      // Enviar al LLM para auditoría
      const llmResponse = await this.callLLM([
        {
          role: "user",
          content: `Audita los siguientes ${posts.length} artículos de blog de FEI Consultores:\n\n${JSON.stringify(postSummaries, null, 2)}`,
        },
      ]);

      let overallScore = 80;
      let findings: Array<{
        severity: string;
        category: string;
        postId: number;
        title: string;
        issue: string;
        recommendation: string;
      }> = [];

      try {
        const parsed = JSON.parse(llmResponse);
        overallScore = parsed.overallScore ?? 80;
        findings = parsed.findings ?? [];
      } catch {
        // LLM no devolvió JSON — generar auditoría básica
        findings = this.basicAudit(posts);
        overallScore = findings.length === 0 ? 90 : Math.max(50, 90 - findings.length * 5);
      }

      events.push(
        this.createEvent(context.jobId, "completed", `Auditoría completada: score ${overallScore}`, {
          overallScore,
          findingsCount: findings.length,
        }),
      );

      return this.successResult(
        { overallScore, findings, postsAudited: posts.length },
        {
          postsAudited: posts.length,
          findings: findings.length,
          highSeverity: findings.filter((f) => f.severity === "high").length,
          overallScore,
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

  private basicAudit(
    posts: Array<{
      id: number;
      title: string;
      seoTitle: string | null;
      seoDescription: string | null;
      seoScore: number | null;
      agentProcessed: boolean | null;
    }>,
  ) {
    const findings: Array<{
      severity: string;
      category: string;
      postId: number;
      title: string;
      issue: string;
      recommendation: string;
    }> = [];

    for (const post of posts) {
      if (!post.seoTitle) {
        findings.push({
          severity: "medium",
          category: "seo",
          postId: post.id,
          title: post.title,
          issue: "Sin título SEO",
          recommendation: "Ejecutar agente SEO para generar título optimizado",
        });
      }
      if (!post.seoDescription) {
        findings.push({
          severity: "medium",
          category: "seo",
          postId: post.id,
          title: post.title,
          issue: "Sin meta description SEO",
          recommendation: "Ejecutar agente SEO para generar meta description",
        });
      }
      if (!post.agentProcessed) {
        findings.push({
          severity: "high",
          category: "quality",
          postId: post.id,
          title: post.title,
          issue: "Post no procesado por pipeline de agentes",
          recommendation: "Ejecutar pipeline completo para este artículo",
        });
      }
    }

    return findings;
  }
}

export const contentAuditorAgent = new ContentAuditorAgent();
