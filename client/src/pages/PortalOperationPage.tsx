import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, FolderClosed, FileText, Download, ChevronDown } from "lucide-react";
import { brand } from "@config/brand";

interface FolderInfo {
  name: string;
  docxFiles: string[];
}

const FOLDER_LABELS: Record<string, string> = {
  "00-PORTADA-CONTROL": "Portada y Control",
  "01-IDENTIDAD": "Identidad Fiscal",
  "02-CONTRATACION": "Contratacion",
  "03-REGULARIZACION": "Regularizacion",
  "04-EJECUCION": "Ejecucion",
  "05-ENTREGABLES": "Entregables Tecnicos",
  "06-CIERRE": "Cierre",
  "07-FISCAL-CONTABLE": "Fiscal-Contable",
};

export default function PortalOperationPage() {
  const [, params] = useRoute("/portal/op/:opId");
  const opId = params?.opId || "";
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/portal/operations/${opId}/folders`);
        if (!res.ok) {
          if (res.status === 401) navigate("/acceso");
          return;
        }
        const data = await res.json();
        setFolders(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [opId, navigate]);

  async function downloadFile(folder: string, filename: string) {
    const res = await fetch(`/api/portal/documents/${opId}/${folder}/${filename}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadZip() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/portal/operations/${opId}/download`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${opId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="site-light flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan" />
      </div>
    );
  }

  const totalDocs = folders.reduce((sum, f) => sum + f.docxFiles.length, 0);

  return (
    <div className="site-light min-h-screen bg-[#f7f9fc]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/portal")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-navy transition-colors hover:bg-slate-100"
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <img src={brand.logo.main} alt={brand.name} className="hidden h-8 w-auto object-contain sm:block" />
            <div>
              <h1 className="font-heading text-base font-bold text-navy">{opId}</h1>
              <p className="text-xs text-slate-400">
                {totalDocs} documentos en {folders.length} carpetas
              </p>
            </div>
          </div>
          <button
            onClick={downloadZip}
            disabled={downloading || totalDocs === 0}
            className="btn-cyan !px-4 !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Preparando ZIP…" : "Descargar todo (ZIP)"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {folders.length === 0 ? (
          <div className="card-l flex flex-col items-center !p-10 text-center">
            <span className="chip-icon !h-12 !w-12">
              <FolderClosed className="h-5 w-5" />
            </span>
            <p className="mt-4 text-slate-500">Esta operacion no tiene documentos disponibles.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {folders.map((folder) => {
              const isOpen = expandedFolder === folder.name;
              return (
                <div key={folder.name} className="card-l overflow-hidden !p-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-slate-50"
                    onClick={() => setExpandedFolder(isOpen ? null : folder.name)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="chip-icon !h-10 !w-10">
                        <FolderClosed className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-heading text-base font-semibold text-navy">
                          {FOLDER_LABELS[folder.name] || folder.name}
                        </div>
                        <div className="text-xs text-slate-400">{folder.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">
                        {folder.docxFiles.length} {folder.docxFiles.length === 1 ? "archivo" : "archivos"}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {isOpen && folder.docxFiles.length > 0 && (
                    <ul className="divide-y divide-slate-100 border-t border-slate-100">
                      {folder.docxFiles.map((file) => (
                        <li
                          key={file}
                          className="flex items-center justify-between gap-3 px-5 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="chip-icon !h-9 !w-9">
                              <FileText className="h-4 w-4" />
                            </span>
                            <span className="truncate text-sm text-navy">{file}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => downloadFile(folder.name, file)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan/10"
                          >
                            <Download className="h-4 w-4" />
                            Descargar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
