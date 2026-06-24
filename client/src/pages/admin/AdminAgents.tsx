import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Square, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/hooks/use-toast";

interface AgentStatus {
  queueLength: number;
  activeJobs: number;
  registeredAgents: string[];
  processing: boolean;
}

interface HealthReport {
  score: number;
  status: string;
  totalIssues: number;
  bySeverity: Record<string, number>;
  issues: Array<{
    severity: string;
    category: string;
    message: string;
  }>;
  timestamp: string;
}

export default function AdminAgents() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const status = useQuery<AgentStatus>({ queryKey: ["/api/agents/status"] });
  const healthReport = useQuery<HealthReport>({ queryKey: ["/api/agents/health"] });

  const startProcessing = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/agents/processing/start", {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Procesador iniciado" });
      qc.invalidateQueries({ queryKey: ["/api/agents/status"] });
    },
  });

  const stopProcessing = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/agents/processing/stop", {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Procesador detenido" });
      qc.invalidateQueries({ queryKey: ["/api/agents/status"] });
    },
  });

  const runAudit = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/agents/audit", {});
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: `Auditoría completada — Score: ${data?.overallScore ?? "N/A"}` });
      qc.invalidateQueries({ queryKey: ["/api/agents/health"] });
    },
    onError: () => {
      toast({ title: "Error ejecutando auditoría", variant: "destructive" });
    },
  });

  const agentLabels: Record<string, string> = {
    formatter: "Content Formatter",
    orthography: "Spanish Orthography",
    seo_optimizer: "SEO Optimizer",
    fiscal_validator: "Fiscal Validator",
    content_auditor: "Content Auditor",
  };

  return (
    <AdminShell
      title="Sistema de Agentes AI"
      subtitle="Procesamiento de contenido y salud del sistema"
      actions={
        status.data?.processing ? (
          <button
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            onClick={() => stopProcessing.mutate()}
          >
            <Square className="h-4 w-4" />
            Detener procesador
          </button>
        ) : (
          <button
            className="btn-cyan inline-flex items-center gap-2 px-4 py-2 text-sm"
            onClick={() => startProcessing.mutate()}
          >
            <Play className="h-4 w-4" />
            Iniciar procesador
          </button>
        )
      }
    >
      <SEOHead title="Agentes AI — FEI Consultores" />

      {/* Pipeline Info */}
      <div className="card-l mb-6 !p-6">
        <h2 className="font-heading text-base font-bold text-navy">Pipeline de contenido</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {["formatter", "orthography", "seo_optimizer", "fiscal_validator", "compliance_council"].map(
            (stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-300">→</span>}
                <span className="rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan/15">{stage}</span>
              </div>
            ),
          )}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Cada artículo pasa por formateo → ortografía → SEO → validación fiscal → consejo de cumplimiento
        </p>
      </div>

      {/* Status Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-l !p-6">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Cola de trabajos</p>
          <p className="mt-3 font-heading text-2xl font-bold text-navy">{status.data?.queueLength ?? 0}</p>
        </div>
        <div className="card-l !p-6">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Trabajos activos</p>
          <p className="mt-3 font-heading text-2xl font-bold text-navy">{status.data?.activeJobs ?? 0}</p>
        </div>
        <div className="card-l !p-6">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Procesador</p>
          <p className={`mt-3 font-heading text-2xl font-bold ${status.data?.processing ? "text-emerald-600" : "text-amber-600"}`}>
            {status.data?.processing ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>

      {/* Registered Agents */}
      <div className="card-l mb-6 !p-6">
        <h2 className="font-heading text-base font-bold text-navy">Agentes registrados</h2>
        <div className="mt-4 space-y-3">
          {status.data?.registeredAgents?.map((agent) => (
            <div
              key={agent}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
            >
              <div>
                <p className="font-medium text-navy">{agentLabels[agent] ?? agent}</p>
                <p className="text-xs text-slate-400">{agent}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600">Activo</span>
              </div>
            </div>
          )) ?? <p className="text-sm text-slate-500">No hay agentes registrados</p>}
        </div>
      </div>

      {/* Health Report */}
      <div className="card-l mb-6 !p-6">
        <div className="flex flex-row items-center justify-between gap-4">
          <h2 className="font-heading text-base font-bold text-navy">Health Check</h2>
          <button
            className="btn-ghost-l inline-flex items-center gap-1.5 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => runAudit.mutate()}
            disabled={runAudit.isPending}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {runAudit.isPending ? "Ejecutando..." : "Ejecutar auditoría"}
          </button>
        </div>
        <div className="mt-4">
          {healthReport.data ? (
            <div>
              <div className="mb-4 flex items-center gap-4">
                <div
                  className={`font-heading text-3xl font-bold ${
                    healthReport.data.score >= 80
                      ? "text-emerald-600"
                      : healthReport.data.score >= 50
                        ? "text-amber-600"
                        : "text-rose-500"
                  }`}
                >
                  {healthReport.data.score}/100
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    healthReport.data.status === "healthy"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : healthReport.data.status === "degraded"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {healthReport.data.status}
                </span>
              </div>
              {healthReport.data.issues?.length > 0 && (
                <div className="space-y-2">
                  {healthReport.data.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border-l-4 px-4 py-2.5 text-sm ${
                        issue.severity === "critical"
                          ? "border-rose-500 bg-rose-50 text-rose-600"
                          : issue.severity === "warning"
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-cyan-500 bg-cyan-50 text-cyan-700"
                      }`}
                    >
                      <span className="font-semibold">[{issue.category}]</span> {issue.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Ejecuta una auditoría para ver el reporte de salud</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
