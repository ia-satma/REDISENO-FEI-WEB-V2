import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { FolderClosed, FileText, LogOut, ArrowRight, ShieldCheck } from "lucide-react";
import { brand } from "@config/brand";

interface PortalUser {
  id: number;
  email: string;
  fullName: string;
  companyName: string;
  feiSlug: string;
  role: string;
}

interface OperationInfo {
  id: string;
  folderCount: number;
  docxCount: number;
  checkpoint: Record<string, unknown> | null;
}

export default function PortalPage() {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [operations, setOperations] = useState<OperationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const [userRes, opsRes] = await Promise.all([
          fetch("/api/portal/me"),
          fetch("/api/portal/operations"),
        ]);

        if (!userRes.ok) {
          navigate("/acceso");
          return;
        }

        const userData = await userRes.json();
        setUser(userData);

        if (opsRes.ok) {
          const opsData = await opsRes.json();
          setOperations(opsData);
        }
      } catch {
        navigate("/acceso");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  async function handleLogout() {
    await fetch("/api/portal/auth/logout", { method: "POST" });
    navigate("/acceso");
  }

  if (loading) {
    return (
      <div className="site-light flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="site-light min-h-screen bg-[#f7f9fc]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <img src={brand.logo.main} alt={brand.name} className="h-8 w-auto object-contain" />
            <span className="hidden text-sm text-slate-400 sm:inline">{user.companyName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-navy sm:inline">{user.fullName}</span>
            <button onClick={handleLogout} className="btn-ghost-l !px-4 !py-2 text-sm">
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan/15">
            <ShieldCheck className="h-3.5 w-3.5" />
            Portal seguro
          </span>
          <h1 className="mt-3 display-md">Tus operaciones</h1>
          <p className="mt-2 text-slate-500">Consulta y descarga la documentacion de tus expedientes.</p>
        </div>

        {operations.length === 0 ? (
          <div className="card-l flex flex-col items-center !p-10 text-center">
            <span className="chip-icon !h-12 !w-12">
              <FolderClosed className="h-5 w-5" />
            </span>
            <p className="mt-4 font-medium text-navy">No hay operaciones disponibles todavia.</p>
            <p className="mt-1 text-sm text-slate-400">
              Tu expediente estara disponible aqui cuando este listo.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {operations.map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => navigate(`/portal/op/${op.id}`)}
                className="card-l card-l-hover card-lift !p-6 text-left"
              >
                <div className="flex items-start justify-between">
                  <span className="chip-icon !h-10 !w-10">
                    <FolderClosed className="h-5 w-5" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan/15">
                    <FileText className="h-3 w-3" />
                    {op.docxCount} documentos
                  </span>
                </div>
                <h2 className="mt-4 font-heading text-lg font-bold text-navy">{op.id}</h2>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm text-slate-400">{op.folderCount} carpetas</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700">
                    Ver expediente
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
