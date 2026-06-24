// ---------------------------------------------------------------------------
// FEI Agent System — Base Agent (Anthropic SDK)
// ---------------------------------------------------------------------------

import Anthropic from "@anthropic-ai/sdk";
import type {
  AgentConfig,
  AgentEvent,
  AgentResult,
  AgentType,
  ExecutionContext,
} from "./types";

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (anthropicClient) return anthropicClient;
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "[BaseAgent] ANTHROPIC_API_KEY no configurada — las llamadas LLM devolverán fallback.",
    );
    return null;
  }
  anthropicClient = new Anthropic();
  return anthropicClient;
}

export abstract class BaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  get type(): AgentType {
    return this.config.agentType;
  }

  get name(): string {
    return this.config.name;
  }

  get enabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Cada agente especializado implementa su lógica aquí.
   */
  abstract execute(
    context: ExecutionContext,
    payload: Record<string, unknown>,
  ): Promise<AgentResult>;

  /**
   * Llamada al LLM vía Anthropic SDK.
   * Si no hay API key, devuelve un mensaje de fallback graceful.
   */
  protected async callLLM(
    messages: { role: "user" | "assistant"; content: string }[],
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    const client = getClient();

    if (!client) {
      return "[LLM no disponible — ANTHROPIC_API_KEY no configurada. Contenido no procesado.]";
    }

    const model = this.config.model || "claude-sonnet-4-20250514";
    const temperature = options?.temperature ?? this.config.temperature;
    const maxTokens = options?.maxTokens ?? this.config.maxTokens;

    try {
      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: this.config.systemPrompt,
        messages,
      });

      // Extraer texto de la respuesta
      const textBlocks = response.content.filter(
        (block) => block.type === "text",
      );
      return textBlocks.map((block) => block.text).join("\n") || "";
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error desconocido en llamada LLM";
      console.error(`[${this.config.name}] Error LLM:`, errorMsg);
      throw new Error(`Error en llamada LLM: ${errorMsg}`);
    }
  }

  /**
   * Crea un evento de agente para el log.
   */
  protected createEvent(
    jobId: string | null,
    eventType: AgentEvent["eventType"],
    message: string,
    data?: Record<string, unknown>,
  ): AgentEvent {
    return {
      id: crypto.randomUUID(),
      jobId,
      agentType: this.config.agentType,
      eventType,
      message,
      data: data ?? null,
      timestamp: new Date(),
    };
  }

  /**
   * Construye un AgentResult exitoso.
   */
  protected successResult<T>(
    data: T,
    metrics: Record<string, number>,
    events: AgentEvent[],
    durationMs: number,
  ): AgentResult<T> {
    return { success: true, data, error: null, metrics, events, durationMs };
  }

  /**
   * Construye un AgentResult fallido.
   */
  protected failureResult(
    error: string,
    events: AgentEvent[],
    durationMs: number,
  ): AgentResult {
    return {
      success: false,
      data: null,
      error,
      metrics: {},
      events,
      durationMs,
    };
  }
}
