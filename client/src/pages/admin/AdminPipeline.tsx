import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

interface PipelineStatus {
  slug: string;
  clientDir: string;
  operations: string[];
  checkpoint: Record<string, unknown> | null;
  lastModified: string | null;
}

export default function AdminPipeline() {
  const [statuses, setStatuses] = useState<PipelineStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatuses();

    // WebSocket for real-time updates
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "health_update" && msg.data?.event === "checkpoint_changed") {
          fetchStatuses();
        }
      } catch {
        // ignore
      }
    };
    return () => ws.close();
  }, []);

  async function fetchStatuses() {
    try {
      const res = await fetch("/api/admin/pipeline/status");
      if (res.ok) {
        const data = await res.json();
        setStatuses(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AdminShell title="Pipeline Status" subtitle="Estado del pipeline de contenido por cliente">
        <p className="text-sm text-slate-500">Cargando...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Pipeline Status"
      subtitle="Estado del pipeline de contenido por cliente"
      actions={
        <button onClick={fetchStatuses} className="btn-ghost-l inline-flex items-center gap-2 px-4 py-2 text-sm">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      }
    >
      {statuses.length === 0 ? (
        <div className="card-l !p-8 text-center">
          <p className="text-sm text-slate-500">No se encontraron clientes en el directorio.</p>
          <p className="mt-2 text-xs text-slate-400">
            Verifica que FEI_CLIENTES_PATH apunte al directorio correcto.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statuses.map((s) => (
            <div key={s.slug} className="card-l !p-6">
              <h3 className="font-heading text-base font-bold text-navy">{s.slug}</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Operaciones:</span>
                  <span className="font-medium text-navy">{s.operations.length || "N/A"}</span>
                </div>
                {s.operations.length > 0 && (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">OPs:</span>
                    <span className="font-mono text-xs text-navy">{s.operations.join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Checkpoint:</span>
                  <span className={s.checkpoint ? "font-semibold text-emerald-600" : "text-slate-400"}>
                    {s.checkpoint ? "Disponible" : "Sin datos"}
                  </span>
                </div>
                {s.lastModified && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modificado:</span>
                    <span className="text-xs text-slate-400">
                      {new Date(s.lastModified).toLocaleDateString("es-MX")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
