// ---------------------------------------------------------------------------
// FEI Agent System — Orchestrator
// ---------------------------------------------------------------------------

import type {
  AgentJob,
  AgentResult,
  AgentType,
  ExecutionContext,
  JobPriority,
  JobStatus,
} from "./types";
import type { BaseAgent } from "./BaseAgent";
import * as storage from "../../storage";
import { broadcastAgentEvent } from "../../routes";

const PRIORITY_ORDER: Record<JobPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

/**
 * Pipeline por defecto: formatea → ortografía → SEO → fiscal → council
 */
const DEFAULT_PIPELINE: AgentType[] = [
  "formatter",
  "orthography",
  "seo_optimizer",
  "fiscal_validator",
  "compliance_council",
];

class AgentOrchestrator {
  private agents = new Map<AgentType, BaseAgent>();
  private queue: AgentJob[] = [];
  private activeJobs = new Map<string, AgentJob>();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  // ── Registro ───────────────────────────────────────────────────────────

  registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.type, agent);
    console.log(`[Orchestrator] Agente registrado: ${agent.name} (${agent.type})`);
  }

  getAgent(type: AgentType): BaseAgent | undefined {
    return this.agents.get(type);
  }

  // ── Cola de trabajos ───────────────────────────────────────────────────

  async enqueueJob(
    agentType: AgentType,
    payload: Record<string, unknown>,
    options?: { priority?: JobPriority; parentJobId?: string; maxRetries?: number },
  ): Promise<AgentJob> {
    const job: AgentJob = {
      id: crypto.randomUUID(),
      agentType,
      status: "queued",
      priority: options?.priority ?? "normal",
      payload,
      result: null,
      error: null,
      retryCount: 0,
      maxRetries: options?.maxRetries ?? 3,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      parentJobId: options?.parentJobId ?? null,
    };

    // Persistir en DB
    try {
      await storage.createJob({
        agentId: agentType,
        type: agentType,
        status: "pending",
        input: payload,
      });
    } catch (err) {
      console.warn("[Orchestrator] No se pudo persistir job en DB:", err);
    }

    // Agregar a la cola en memoria, ordenada por prioridad
    this.queue.push(job);
    this.queue.sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
    );

    this.broadcast(agentType, "queued", { jobId: job.id });
    return job;
  }

  // ── Pipeline secuencial ────────────────────────────────────────────────

  async runPipeline(
    postId: number,
    stages?: AgentType[],
  ): Promise<{ results: Map<AgentType, AgentResult>; success: boolean }> {
    const pipeline = stages ?? DEFAULT_PIPELINE;
    const results = new Map<AgentType, AgentResult>();
    let pipelineSuccess = true;

    console.log(
      `[Orchestrator] Iniciando pipeline para post ${postId}: ${pipeline.join(" → ")}`,
    );

    for (const agentType of pipeline) {
      const agent = this.agents.get(agentType);
      if (!agent) {
        console.warn(`[Orchestrator] Agente ${agentType} no registrado, saltando.`);
        continue;
      }
      if (!agent.enabled) {
        console.log(`[Orchestrator] Agente ${agentType} deshabilitado, saltando.`);
        continue;
      }

      const jobId = crypto.randomUUID();
      const context: ExecutionContext = {
        jobId,
        agentType,
        startedAt: new Date(),
        parentJobId: null,
        metadata: { postId, pipelineStage: agentType },
      };

      this.broadcast(agentType, "started", { jobId, postId });

      try {
        const result = await agent.execute(context, { postId });
        results.set(agentType, result);

        if (!result.success) {
          console.error(
            `[Orchestrator] Agente ${agentType} falló: ${result.error}`,
          );
          this.broadcast(agentType, "failed", {
            jobId,
            postId,
            error: result.error,
          });
          pipelineSuccess = false;
          break;
        }

        this.broadcast(agentType, "completed", {
          jobId,
          postId,
          metrics: result.metrics,
        });

        // Persistir evento
        try {
          await storage.createEvent({
            agentId: agentType,
            eventType: "stage_completed",
            data: { postId, metrics: result.metrics },
          });
        } catch {
          // No crítico
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error desconocido";
        console.error(`[Orchestrator] Error en ${agentType}:`, errorMsg);
        this.broadcast(agentType, "failed", {
          jobId,
          postId,
          error: errorMsg,
        });
        pipelineSuccess = false;
        break;
      }
    }

    console.log(
      `[Orchestrator] Pipeline ${pipelineSuccess ? "completado" : "fallido"} para post ${postId}`,
    );
    return { results, success: pipelineSuccess };
  }

  // ── Procesamiento de cola ──────────────────────────────────────────────

  async processNextJob(): Promise<void> {
    if (this.queue.length === 0) return;

    const job = this.queue.shift()!;
    const agent = this.agents.get(job.agentType);

    if (!agent || !agent.enabled) {
      job.status = "cancelled";
      job.completedAt = new Date();
      return;
    }

    job.status = "running";
    job.startedAt = new Date();
    this.activeJobs.set(job.id, job);

    const context: ExecutionContext = {
      jobId: job.id,
      agentType: job.agentType,
      startedAt: job.startedAt,
      parentJobId: job.parentJobId,
      metadata: {},
    };

    try {
      const result = await agent.execute(context, job.payload);
      job.result = result.data;
      job.status = result.success ? "completed" : "failed";
      job.error = result.error;
      job.completedAt = new Date();

      this.broadcast(job.agentType, result.success ? "completed" : "failed", {
        jobId: job.id,
        metrics: result.metrics,
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error desconocido";
      job.retryCount++;

      if (job.retryCount < job.maxRetries) {
        job.status = "queued";
        job.error = `Intento ${job.retryCount}/${job.maxRetries}: ${errorMsg}`;
        this.queue.push(job);
        this.broadcast(job.agentType, "retrying" as never, {
          jobId: job.id,
          attempt: job.retryCount,
        });
      } else {
        job.status = "failed";
        job.error = `Fallido después de ${job.maxRetries} intentos: ${errorMsg}`;
        job.completedAt = new Date();
        this.broadcast(job.agentType, "failed", {
          jobId: job.id,
          error: job.error,
        });
      }
    } finally {
      this.activeJobs.delete(job.id);
    }
  }

  // ── Polling ────────────────────────────────────────────────────────────

  startProcessing(intervalMs = 5000): void {
    if (this.intervalId) return;
    console.log(
      `[Orchestrator] Procesamiento iniciado (intervalo: ${intervalMs}ms)`,
    );
    this.intervalId = setInterval(() => {
      this.processNextJob().catch((err) =>
        console.error("[Orchestrator] Error en processNextJob:", err),
      );
    }, intervalMs);
  }

  stopProcessing(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[Orchestrator] Procesamiento detenido.");
    }
  }

  // ── Status ─────────────────────────────────────────────────────────────

  getStatus(): {
    queueLength: number;
    activeJobs: number;
    registeredAgents: string[];
    processing: boolean;
  } {
    return {
      queueLength: this.queue.length,
      activeJobs: this.activeJobs.size,
      registeredAgents: Array.from(this.agents.keys()),
      processing: this.intervalId !== null,
    };
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  private broadcast(
    agentType: AgentType,
    status: string,
    data: Record<string, unknown>,
  ): void {
    broadcastAgentEvent({
      type: "agent_progress",
      agentId: agentType,
      data: { ...data, status },
      timestamp: new Date().toISOString(),
    });
  }
}

export const orchestrator = new AgentOrchestrator();
