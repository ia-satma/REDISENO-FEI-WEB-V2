import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Activity, Database, Clock, Bot, Newspaper, GitBranch, Users, ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdminShell from "@/components/admin/AdminShell";
import { brand } from "@config/brand";

interface HealthData { status: string; database: boolean; uptime: number; timestamp: string; }
interface AgentStatus { queueLength: number; activeJobs: number; registeredAgents: string[]; processing: boolean; }

export default function AdminDashboard() {
  const health = useQuery<HealthData>({ queryKey: ["/api/health"] });
  const agents = useQuery<AgentStatus>({ queryKey: ["/api/agents/status"] });

  const uptimeMinutes = health.data ? Math.floor(health.data.uptime / 60) : 0;
  const status = health.data?.status;
  const dbOk = health.data?.database;

  const links = [
    { href: "/admin/blog", title: "Blog", desc: "Gestiona los artículos del blog", icon: Newspaper },
    { href: "/admin/agents", title: "Agentes AI", desc: `${agents.data?.processing ? "Procesador activo" : "Inactivo"} · Cola: ${agents.data?.queueLength ?? 0}`, icon: Bot },
    { href: "/admin/pipeline", title: "Pipeline", desc: "Estado del pipeline de contenido", icon: GitBranch },
    { href: "/admin/clients", title: "Clientes", desc: "Accesos y expedientes del portal", icon: Users },
  ];

  return (
    <AdminShell title="Panel de administración" subtitle={`${brand.name} — resumen del sistema`}>
      <SEOHead title="Admin — FEI Consultores" />

      {/* Status stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-l !p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Estado</span>
            <span className="chip-icon !h-9 !w-9"><Activity className="h-4 w-4" /></span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className={"h-2.5 w-2.5 rounded-full " + (status === "healthy" ? "bg-emerald-500" : status === "degraded" ? "bg-amber-500" : "bg-rose-500")} />
            <span className="font-heading text-2xl font-bold capitalize text-navy">{status ?? "…"}</span>
          </div>
        </div>

        <div className="card-l !p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Base de datos</span>
            <span className="chip-icon !h-9 !w-9"><Database className="h-4 w-4" /></span>
          </div>
          <span className={"mt-4 block font-heading text-2xl font-bold " + (dbOk ? "text-emerald-600" : "text-rose-500")}>
            {dbOk ? "Conectada" : "Desconectada"}
          </span>
        </div>

        <div className="card-l !p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Uptime</span>
            <span className="chip-icon !h-9 !w-9"><Clock className="h-4 w-4" /></span>
          </div>
          <span className="mt-4 block font-heading text-2xl font-bold text-navy">{uptimeMinutes} min</span>
        </div>

        <div className="card-l !p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Agentes</span>
            <span className="chip-icon !h-9 !w-9"><Bot className="h-4 w-4" /></span>
          </div>
          <span className="mt-4 block font-heading text-2xl font-bold text-cyan-700">{agents.data?.registeredAgents?.length ?? 0}</span>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {links.map(({ href, title, desc, icon: Icon }) => (
          <Link key={href} href={href}>
            <div className="card-l card-l-hover card-lift group flex cursor-pointer items-center gap-4 !p-6">
              <span className="chip-icon"><Icon className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="font-heading text-base font-bold text-navy">{title}</p>
                <p className="mt-0.5 truncate text-sm text-slate-500">{desc}</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-700" />
            </div>
          </Link>
        ))}
      </div>

      {/* Registered agents */}
      {agents.data?.registeredAgents && agents.data.registeredAgents.length > 0 && (
        <div className="card-l mt-6 !p-6">
          <p className="font-heading text-base font-bold text-navy">Agentes registrados</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {agents.data.registeredAgents.map((agent) => (
              <span key={agent} className="rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan/15">
                {agent}
              </span>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
