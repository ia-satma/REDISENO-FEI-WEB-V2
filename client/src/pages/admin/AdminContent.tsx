import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, RotateCcw } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ContentField from "@/components/admin/ContentField";
import { deepMerge } from "@/hooks/useSiteContent";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { homeContent } from "@config/content/home";
import { serviciosContent } from "@config/content/servicios";
import { faqContent } from "@config/content/faq";
import { seguridadContent } from "@config/content/seguridad";
import { footerContent } from "@config/content/footer";
import { legalContent } from "@config/content/legal";
import { materialidadContent } from "@config/content/materialidad";

const GROUPS: { key: string; label: string; def: Record<string, unknown> }[] = [
  { key: "home", label: "Inicio", def: homeContent as Record<string, unknown> },
  { key: "servicios", label: "Servicios", def: serviciosContent as Record<string, unknown> },
  { key: "materialidad", label: "Materialidad", def: materialidadContent as Record<string, unknown> },
  { key: "seguridad", label: "Seguridad", def: seguridadContent as Record<string, unknown> },
  { key: "faq", label: "Preguntas frecuentes", def: faqContent as Record<string, unknown> },
  { key: "footer", label: "Pie de página", def: footerContent as Record<string, unknown> },
  { key: "legal", label: "Documentos legales", def: legalContent as Record<string, unknown> },
];

interface Override {
  key: string;
  value: Record<string, unknown>;
  updatedAt: string;
}

export default function AdminContent() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeKey, setActiveKey] = useState("home");
  const [draft, setDraft] = useState<unknown | null>(null);

  const overrides = useQuery<Override[]>({ queryKey: ["/api/admin/content"] });
  const group = GROUPS.find((g) => g.key === activeKey)!;
  const override = overrides.data?.find((o) => o.key === activeKey)?.value;
  const hasOverride = !!override;

  const baseDraft = useMemo(
    () => deepMerge(group.def, override ?? {}),
    [activeKey, overrides.data], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const current = (draft ?? baseDraft) as Record<string, unknown>;

  const save = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PUT", `/api/admin/content/${activeKey}`, { value: current });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Contenido guardado", description: "Los cambios ya están en vivo en el sitio." });
      qc.invalidateQueries({ queryKey: ["/api/admin/content"] });
      qc.invalidateQueries({ queryKey: ["/api/content"] });
      setDraft(null);
    },
    onError: () => toast({ title: "Error al guardar", variant: "destructive" }),
  });

  const reset = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/admin/content/${activeKey}`);
    },
    onSuccess: () => {
      toast({ title: "Restaurado al contenido original" });
      qc.invalidateQueries({ queryKey: ["/api/admin/content"] });
      qc.invalidateQueries({ queryKey: ["/api/content"] });
      setDraft(null);
    },
  });

  return (
    <AdminShell title="Gestión de contenido" subtitle="Edita los textos, listas e imágenes de cada página del sitio">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_1fr]">
        {/* Group selector */}
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          {GROUPS.map((g) => {
            const edited = overrides.data?.some((o) => o.key === g.key);
            return (
              <button
                key={g.key}
                onClick={() => {
                  setActiveKey(g.key);
                  setDraft(null);
                }}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
                  g.key === activeKey ? "bg-cyan/10 text-cyan-700" : "text-slate-500 hover:bg-slate-50 hover:text-navy",
                )}
              >
                {g.label}
                {edited && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" title="Editado" />}
              </button>
            );
          })}
        </nav>

        {/* Editor */}
        <div className="card-l !p-6 md:!p-8">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-navy">{group.label}</h2>
              {hasOverride && (
                <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan/20">Editado</span>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {hasOverride && (
                <button onClick={() => reset.mutate()} disabled={reset.isPending} className="btn-ghost-l px-4 py-2 text-sm">
                  <RotateCcw className="h-4 w-4" />
                  Restaurar
                </button>
              )}
              <button onClick={() => save.mutate()} disabled={save.isPending} className="btn-cyan px-5 py-2 text-sm disabled:opacity-60">
                <Save className="h-4 w-4" />
                {save.isPending ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>

          {overrides.isLoading ? (
            <p className="text-sm text-slate-400">Cargando…</p>
          ) : (
            <ContentField value={current} onChange={(v) => setDraft(v)} />
          )}
        </div>
      </div>
    </AdminShell>
  );
}
