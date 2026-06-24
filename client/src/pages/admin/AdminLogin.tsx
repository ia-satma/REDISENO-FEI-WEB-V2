import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Lock, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { brand } from "@config/brand";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/login", { username, password });
      return res.json();
    },
    onSuccess: () => navigate("/admin"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="site-light relative flex min-h-screen items-center justify-center bg-[#f7f9fc] px-5 py-10">
      <div className="field-soft pointer-events-none fixed inset-0" />
      <div className="relative w-full max-w-md">
        <Link href="/">
          <span className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-navy">
            <ArrowLeft className="h-4 w-4" /> Volver al sitio
          </span>
        </Link>

        <div className="card-l p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="chip-icon !h-14 !w-14"><Lock className="h-6 w-6" /></span>
            <h1 className="mt-5 font-heading text-2xl font-bold text-navy">Panel de administración</h1>
            <p className="mt-2 text-sm text-slate-500">{brand.name} — acceso restringido</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-navy">Usuario</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu usuario"
                required
                autoComplete="username"
                className="input-light"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-navy">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="input-light"
              />
            </div>

            {loginMutation.isError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                Credenciales inválidas o servidor sin base de datos. Intenta de nuevo.
              </div>
            )}

            <button type="submit" disabled={loginMutation.isPending} className="btn-cyan w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-60">
              {loginMutation.isPending ? "Verificando…" : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
