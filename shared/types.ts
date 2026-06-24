export interface AgentStatus {
  id: string;
  name: string;
  status: "active" | "idle" | "error" | "processing";
  lastRun?: string;
  metrics?: Record<string, number>;
}

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "down";
  agents: AgentStatus[];
  database: boolean;
  uptime: number;
  timestamp: string;
}

export interface AgentJobResult {
  success: boolean;
  output?: unknown;
  error?: string;
  duration?: number;
}

export interface WebSocketMessage {
  type: "agent_progress" | "agent_complete" | "health_update" | "notification";
  agentId?: string;
  data: unknown;
  timestamp: string;
}
