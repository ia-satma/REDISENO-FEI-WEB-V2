import { Router, Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { orchestrator } from "../core/AgentOrchestrator";
import { contentAuditorAgent } from "../specialized/ContentAuditorAgent";
import { ComplianceCouncilService } from "../../services/ComplianceCouncilService";

const router = Router();

/** Admin-only guard for mutating agent routes (passport session). */
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated && req.isAuthenticated()) {
    next();
    return;
  }
  res.status(401).json({ error: "Authentication required" });
}

// ---------------------------------------------------------------------------
// GET /status — orchestrator status + queue length + registered agents
// ---------------------------------------------------------------------------
router.get("/status", (_req: Request, res: Response) => {
  try {
    const status = orchestrator.getStatus();
    res.json(status);
  } catch (err) {
    console.error("[agents/status] Error:", err);
    res.json({
      queueLength: 0,
      activeJobs: 0,
      registeredAgents: [],
      processing: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

// ---------------------------------------------------------------------------
// POST /pipeline/:postId — run content pipeline on a blog post
// ---------------------------------------------------------------------------
router.post("/pipeline/:postId", requireAuth, async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      res.status(400).json({ error: "ID de post inválido" });
      return;
    }

    // Run the default pipeline: formatter → orthography → seo → fiscal → council
    const pipelineResult = await orchestrator.runPipeline(postId);

    // If pipeline succeeded, run compliance council
    let councilVerdict = null;
    if (pipelineResult.success) {
      try {
        const council = new ComplianceCouncilService();
        councilVerdict = await council.evaluate(postId);
      } catch (councilErr) {
        console.warn("[agents/pipeline] Council evaluation failed:", councilErr);
      }
    }

    res.json({
      success: pipelineResult.success,
      stagesCompleted: pipelineResult.results.size,
      councilVerdict,
    });
  } catch (err) {
    console.error("[agents/pipeline] Error:", err);
    res.status(500).json({
      error: "Error ejecutando pipeline",
      details: err instanceof Error ? err.message : "Unknown",
    });
  }
});

// ---------------------------------------------------------------------------
// POST /queue — enqueue a job (agentType, payload, priority)
// ---------------------------------------------------------------------------
router.post("/queue", requireAuth, async (req: Request, res: Response) => {
  try {
    const { agentType, payload, priority } = req.body;
    if (!agentType) {
      res.status(400).json({ error: "agentType es requerido" });
      return;
    }
    const job = await orchestrator.enqueueJob(agentType, payload ?? {}, {
      priority: priority ?? "normal",
    });
    res.status(201).json({ success: true, job });
  } catch (err) {
    console.error("[agents/queue] Error:", err);
    res.status(500).json({
      error: "Error encolando trabajo",
      details: err instanceof Error ? err.message : "Unknown",
    });
  }
});

// ---------------------------------------------------------------------------
// POST /processing/start — start job processor
// ---------------------------------------------------------------------------
router.post("/processing/start", requireAuth, (_req: Request, res: Response) => {
  try {
    orchestrator.startProcessing();
    res.json({ success: true, message: "Procesador iniciado" });
  } catch (err) {
    console.error("[agents/processing/start] Error:", err);
    res.status(500).json({
      error: "Error iniciando procesador",
      details: err instanceof Error ? err.message : "Unknown",
    });
  }
});

// ---------------------------------------------------------------------------
// POST /processing/stop — stop job processor
// ---------------------------------------------------------------------------
router.post("/processing/stop", requireAuth, (_req: Request, res: Response) => {
  try {
    orchestrator.stopProcessing();
    res.json({ success: true, message: "Procesador detenido" });
  } catch (err) {
    console.error("[agents/processing/stop] Error:", err);
    res.status(500).json({
      error: "Error deteniendo procesador",
      details: err instanceof Error ? err.message : "Unknown",
    });
  }
});

// ---------------------------------------------------------------------------
// POST /audit — run content audit via ContentAuditorAgent
// ---------------------------------------------------------------------------
router.post("/audit", requireAuth, async (_req: Request, res: Response) => {
  try {
    const context = {
      jobId: randomUUID(),
      agentType: "content_auditor" as const,
      startedAt: new Date(),
      parentJobId: null,
      metadata: {},
    };
    const result = await contentAuditorAgent.execute(context, {});
    res.json(result.data);
  } catch (err) {
    console.error("[agents/audit] Error:", err);
    res.status(500).json({
      error: "Error ejecutando auditoría",
      details: err instanceof Error ? err.message : "Unknown",
    });
  }
});

// ---------------------------------------------------------------------------
// GET /health — run system health check
// ---------------------------------------------------------------------------
router.get("/health", async (_req: Request, res: Response) => {
  try {
    const { SystemHealthCheck } = await import("../SystemHealthCheck");
    const checker = new SystemHealthCheck();
    const report = await checker.run();
    res.json(report);
  } catch (err) {
    console.error("[agents/health] Error:", err);
    res.json({
      score: 0,
      status: "error",
      totalIssues: 1,
      bySeverity: { critical: 1, warning: 0, info: 0 },
      issues: [{ severity: "critical", category: "system", message: err instanceof Error ? err.message : "Health check failed" }],
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
