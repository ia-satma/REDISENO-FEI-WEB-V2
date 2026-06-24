// ---------------------------------------------------------------------------
// FEI — Compliance Council Service (Tribunal de 3 agentes)
// ---------------------------------------------------------------------------

import { BaseAgent } from "../agents/core/BaseAgent";
import type { AgentConfig, AgentResult, ExecutionContext, AgentEvent } from "../agents/core/types";
import { getDb } from "../db";
import { blogPosts } from "../../shared/schema";
import { eq } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Council member configs — each votes independently
// ---------------------------------------------------------------------------

function makeCouncilConfig(
  role: "legal" | "fiscal_accuracy" | "quality",
  name: string,
  systemPrompt: string,
): AgentConfig {
  return {
    agentType: "compliance_council",
    name,
    description: `Miembro del consejo de cumplimiento — ${role}`,
    systemPrompt,
    model: "claude-sonnet-4-20250514",
    temperature: 0.15,
    maxTokens: 1024,
    skills: ["compliance", role],
    enabled: true,
    concurrency: 1,
    retryPolicy: { maxRetries: 1, baseDelayMs: 1000, backoffMultiplier: 2 },
  };
}

const COUNCIL_MEMBERS = [
  makeCouncilConfig(
    "legal",
    "Council: Legal Review",
    `Eres un revisor legal de contenido fiscal mexicano. Vota APROBADO o RECHAZADO.

Evalúa:
- ¿Las afirmaciones legales son correctas?
- ¿Las citas a leyes son precisas?
- ¿Hay riesgo de mal asesoramiento?

Devuelve SOLO JSON: { "vote": "approved|rejected|revision", "confidence": 0.9, "reason": "explicación breve" }`,
  ),
  makeCouncilConfig(
    "fiscal_accuracy",
    "Council: Fiscal Accuracy",
    `Eres un auditor de precisión fiscal. Vota APROBADO o RECHAZADO.

Evalúa:
- ¿Las tasas y cifras son correctas y actuales?
- ¿Los conceptos fiscales están bien explicados?
- ¿Hay información que pueda inducir a error?

Devuelve SOLO JSON: { "vote": "approved|rejected|revision", "confidence": 0.85, "reason": "explicación breve" }`,
  ),
  makeCouncilConfig(
    "quality",
    "Council: Quality Assurance",
    `Eres un revisor de calidad editorial. Vota APROBADO o RECHAZADO.

Evalúa:
- ¿El contenido es claro y bien estructurado?
- ¿El tono es apropiado para una firma de consultoría?
- ¿El contenido aporta valor al lector?

Devuelve SOLO JSON: { "vote": "approved|rejected|revision", "confidence": 0.8, "reason": "explicación breve" }`,
  ),
];

// ---------------------------------------------------------------------------
// Council member — anonymous inner agent
// ---------------------------------------------------------------------------

class CouncilMember extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  async execute(
    context: ExecutionContext,
    payload: Record<string, unknown>,
  ): Promise<AgentResult> {
    const start = Date.now();
    const events: AgentEvent[] = [];
    const content = payload.content as string;

    try {
      const llmResponse = await this.callLLM([
        { role: "user", content: `Evalúa este contenido fiscal:\n\n${content.substring(0, 3000)}` },
      ]);

      let vote = "approved";
      let confidence = 0.7;
      let reason = "Sin detalle";

      try {
        const parsed = JSON.parse(llmResponse);
        vote = parsed.vote ?? "approved";
        confidence = parsed.confidence ?? 0.7;
        reason = parsed.reason ?? "Sin detalle";
      } catch {
        // Si no parsea, default approved with low confidence
        confidence = 0.5;
        reason = "LLM no devolvió JSON válido — aprobación por defecto";
      }

      events.push(
        this.createEvent(context.jobId, "completed", `${this.name}: ${vote} (${confidence})`, {
          vote,
          confidence,
        }),
      );

      return this.successResult(
        { vote, confidence, reason, member: this.name },
        { confidence },
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

// ---------------------------------------------------------------------------
// Compliance Council Service
// ---------------------------------------------------------------------------

export interface CouncilVerdict {
  decision: "approved" | "rejected" | "revision";
  votes: Array<{
    member: string;
    vote: string;
    confidence: number;
    reason: string;
  }>;
  approvedCount: number;
  requiredVotes: number;
  averageConfidence: number;
}

export class ComplianceCouncilService {
  private members: CouncilMember[];
  private requiredVotes: number;
  private confidenceThreshold: number;

  constructor(requiredVotes = 2, confidenceThreshold = 0.7) {
    this.members = COUNCIL_MEMBERS.map((config) => new CouncilMember(config));
    this.requiredVotes = requiredVotes;
    this.confidenceThreshold = confidenceThreshold;
  }

  async evaluate(postId: number): Promise<CouncilVerdict> {
    const db = getDb();
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1);

    const post = rows[0];
    if (!post) {
      throw new Error(`Post ${postId} no encontrado`);
    }

    // Todos los miembros votan en paralelo
    const results = await Promise.allSettled(
      this.members.map((member) =>
        member.execute(
          {
            jobId: crypto.randomUUID(),
            agentType: "compliance_council",
            startedAt: new Date(),
            parentJobId: null,
            metadata: { postId },
          },
          { content: post.content, title: post.title },
        ),
      ),
    );

    const votes: CouncilVerdict["votes"] = [];

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.success) {
        const data = result.value.data as {
          vote: string;
          confidence: number;
          reason: string;
          member: string;
        };
        votes.push(data);
      } else {
        votes.push({
          member: "unknown",
          vote: "revision",
          confidence: 0,
          reason: result.status === "rejected" ? String(result.reason) : "Agent failed",
        });
      }
    }

    const approvedCount = votes.filter(
      (v) => v.vote === "approved" && v.confidence >= this.confidenceThreshold,
    ).length;

    const avgConfidence =
      votes.length > 0
        ? votes.reduce((sum, v) => sum + v.confidence, 0) / votes.length
        : 0;

    let decision: CouncilVerdict["decision"] = "rejected";
    if (approvedCount >= this.requiredVotes) {
      decision = "approved";
    } else if (votes.some((v) => v.vote === "revision")) {
      decision = "revision";
    }

    // Si aprobado, marcar post como agent_processed
    if (decision === "approved") {
      await db
        .update(blogPosts)
        .set({
          agentProcessed: true,
          status: post.status === "draft" ? "published" : post.status,
          publishedAt: post.publishedAt ?? new Date(),
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, postId));
    }

    return {
      decision,
      votes,
      approvedCount,
      requiredVotes: this.requiredVotes,
      averageConfidence: Math.round(avgConfidence * 100) / 100,
    };
  }
}
