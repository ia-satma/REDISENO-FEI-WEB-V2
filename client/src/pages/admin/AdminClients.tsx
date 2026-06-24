import { useState, useEffect } from "react";
import { Plus, X, Send, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "../../hooks/use-toast";

interface ClientUser {
  id: number;
  email: string;
  fullName: string;
  companyName: string;
  feiSlug: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function AdminClients() {
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", fullName: "", companyName: "", feiSlug: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await fetch("/api/admin/clients");
      if (res.ok) {
        setClients(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast({ title: "Cliente creado" });
        setShowForm(false);
        setForm({ email: "", fullName: "", companyName: "", feiSlug: "" });
        fetchClients();
      } else {
        const data = await res.json();
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error de conexion", variant: "destructive" });
    }
  }

  async function handleSendLink(id: number) {
    try {
      const res = await fetch(`/api/admin/clients/${id}/send-link`, { method: "POST" });
      const data = await res.json();
      toast({ title: data.success ? "Enlace enviado" : "Error al enviar" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  }

  async function handleToggleActive(client: ClientUser) {
    try {
      await fetch(`/api/admin/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !client.active }),
      });
      fetchClients();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      fetchClients();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  }

  if (loading) {
    return (
      <AdminShell title="Clientes del Portal" subtitle="Accesos y expedientes del portal">
        <p className="text-sm text-slate-500">Cargando...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Clientes del Portal"
      subtitle="Accesos y expedientes del portal"
      actions={
        <button onClick={() => setShowForm(!showForm)} className="btn-cyan inline-flex items-center gap-2 px-4 py-2 text-sm">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Agregar cliente"}
        </button>
      }
    >
      {showForm && (
        <div className="card-l mb-6 !p-6 md:!p-8">
          <h2 className="font-heading text-base font-bold text-navy">Nuevo cliente</h2>
          <form onSubmit={handleCreate} className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="input-light"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">Nombre completo</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                className="input-light"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">Empresa</label>
              <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
                className="input-light"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">FEI Slug</label>
              <input
                value={form.feiSlug}
                onChange={(e) => setForm({ ...form, feiSlug: e.target.value })}
                placeholder="nombre-empresa"
                required
                className="input-light"
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn-cyan px-5 py-2.5 text-sm">Crear</button>
            </div>
          </form>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="card-l !p-8 text-center">
          <p className="text-sm text-slate-500">No hay clientes registrados.</p>
        </div>
      ) : (
        <div className="card-l !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Empresa</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-navy">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-navy">{c.fullName}</td>
                    <td className="px-4 py-3 text-sm text-navy">{c.companyName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-navy">{c.feiSlug}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          c.active
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {c.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-ghost-l inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                          onClick={() => handleSendLink(c.id)}
                        >
                          <Send className="h-3.5 w-3.5" />
                          Enviar enlace
                        </button>
                        <button
                          className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy"
                          onClick={() => handleToggleActive(c)}
                        >
                          {c.active ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
