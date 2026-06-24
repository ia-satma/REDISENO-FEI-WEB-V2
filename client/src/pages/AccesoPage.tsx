import { useState } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft, Mail, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { brand } from "@config/brand";
import { useToast } from "../hooks/use-toast";

export default function AccesoPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Check if this is a token verification
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    return <VerifyToken token={token} />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/portal/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        toast({
          title: "Demasiadas solicitudes",
          description: "Intenta de nuevo en una hora.",
          variant: "destructive",
        });
        return;
      }

      setSent(true);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo enviar el enlace. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthShell>
        <div className="card-l p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="chip-icon !h-14 !w-14 bg-emerald-500/10 text-emerald-600 ring-emerald-500/20">
              <Mail className="h-6 w-6" />
            </span>
            <h1 className="mt-5 font-heading text-2xl font-bold text-navy">Revisa tu correo</h1>
            <p className="mt-3 text-sm text-slate-500">
              Si tu correo esta registrado, recibiras un enlace de acceso en los proximos minutos.
            </p>
            <p className="mt-4 text-xs text-slate-400">El enlace expira en 15 minutos.</p>
          </div>

          <button
            type="button"
            className="btn-ghost-l mt-7 w-full"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
          >
            Enviar otro enlace
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="card-l p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          <img src={brand.logo.main} alt={brand.name} className="h-10 w-auto object-contain" />
          <span className="chip-icon !h-14 !w-14 mt-6">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold text-navy">Portal de Clientes</h1>
          <p className="mt-2 text-sm text-slate-500">{brand.name} — acceso a tu expediente</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-navy">
              Correo electronico
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="input-light"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyan w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Enviando…" : "Solicitar enlace de acceso"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          Recibiras un enlace seguro de un solo uso en tu correo.
        </p>
      </div>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-light relative flex min-h-screen items-center justify-center bg-[#f7f9fc] px-5 py-10">
      <div className="field-soft pointer-events-none fixed inset-0" />
      <div className="relative w-full max-w-md">
        <Link href="/">
          <span className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-navy">
            <ArrowLeft className="h-4 w-4" /> Volver al sitio
          </span>
        </Link>
        {children}
      </div>
    </div>
  );
}

function VerifyToken({ token }: { token: string }) {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useState(() => {
    (async () => {
      try {
        const res = await fetch(`/api/portal/auth/verify?token=${encodeURIComponent(token)}`);
        if (res.ok) {
          setStatus("success");
          setTimeout(() => navigate("/portal"), 1000);
        } else {
          const data = await res.json();
          setErrorMsg(data.error || "Enlace invalido");
          setStatus("error");
        }
      } catch {
        setErrorMsg("Error de conexion");
        setStatus("error");
      }
    })();
  });

  return (
    <AuthShell>
      <div className="card-l p-8 md:p-10">
        <div className="flex flex-col items-center py-6 text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan" />
              <p className="text-slate-500">Verificando acceso…</p>
            </>
          )}
          {status === "success" && (
            <>
              <span className="chip-icon !h-14 !w-14 bg-emerald-500/10 text-emerald-600 ring-emerald-500/20">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <p className="mt-5 text-slate-500">Acceso verificado. Redirigiendo…</p>
            </>
          )}
          {status === "error" && (
            <>
              <span className="chip-icon !h-14 !w-14 bg-rose-500/10 text-rose-500 ring-rose-500/20">
                <XCircle className="h-6 w-6" />
              </span>
              <p className="mt-5 font-medium text-rose-600">{errorMsg}</p>
              <button type="button" className="btn-ghost-l mt-6" onClick={() => navigate("/acceso")}>
                Solicitar nuevo enlace
              </button>
            </>
          )}
        </div>
      </div>
    </AuthShell>
  );
}
