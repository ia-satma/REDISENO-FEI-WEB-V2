// ---------------------------------------------------------------------------
// FEI Agent System — Core Types
// ---------------------------------------------------------------------------

export type AgentType =
  | "formatter"
  | "orthography"
  | "seo_optimizer"
  | "fiscal_validator"
  | "content_auditor"
  | "health_check"
  | "compliance_council"
  | "orchestrator";

export type AgentStatus = "idle" | "busy" | "error" | "disabled";

export type JobStatus = "pending" | "queued" | "running" | "completed" | "failed" | "cancelled";

export type JobPriority = "low" | "normal" | "high" | "critical";

export interface AgentJob {
  id: string;
  agentType: AgentType;
  status: JobStatus;
  priority: JobPriority;
  payload: Record<string, unknown>;
  result: unknown | null;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  parentJobId: string | null;
}

export interface AgentEvent {
  id: string;
  jobId: string | null;
  agentType: AgentType;
  eventType: "started" | "progress" | "completed" | "failed" | "retrying" | "info";
  message: string;
  data: Record<string, unknown> | null;
  timestamp: Date;
}

export interface AgentConfig {
  agentType: AgentType;
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  skills: string[];
  enabled: boolean;
  concurrency: number;
  retryPolicy: {
    maxRetries: number;
    baseDelayMs: number;
    backoffMultiplier: number;
  };
}

export interface ExecutionContext {
  jobId: string;
  agentType: AgentType;
  startedAt: Date;
  parentJobId: string | null;
  metadata: Record<string, unknown>;
}

export interface AgentResult<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
  metrics: Record<string, number>;
  events: AgentEvent[];
  durationMs: number;
}
