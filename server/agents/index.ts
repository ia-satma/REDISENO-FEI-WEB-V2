// ---------------------------------------------------------------------------
// FEI Agent System — Initialization & Registration
// ---------------------------------------------------------------------------

import { orchestrator } from "./core/AgentOrchestrator";
import { formatterAgent } from "./specialized/ContentFormatterAgent";
import { orthographyAgent } from "./specialized/SpanishOrthographyAgent";
import { seoOptimizerAgent } from "./specialized/SEOOptimizerAgent";
import { fiscalValidatorAgent } from "./specialized/FiscalValidatorAgent";
import { contentAuditorAgent } from "./specialized/ContentAuditorAgent";

/**
 * Registers all agents with the orchestrator and starts background processing.
 * Called once at server startup.
 */
export async function initializeAgents(): Promise<void> {
  console.log("[agents] Inicializando sistema de agentes FEI...");

  // Register all specialized agents
  orchestrator.registerAgent(formatterAgent);
  orchestrator.registerAgent(orthographyAgent);
  orchestrator.registerAgent(seoOptimizerAgent);
  orchestrator.registerAgent(fiscalValidatorAgent);
  orchestrator.registerAgent(contentAuditorAgent);

  // Start background job processing (polls every 10 seconds)
  orchestrator.startProcessing(10_000);

  const status = orchestrator.getStatus();
  console.log(
    `[agents] Sistema iniciado: ${status.registeredAgents.length} agentes registrados, procesador activo.`,
  );
}

export { orchestrator };
