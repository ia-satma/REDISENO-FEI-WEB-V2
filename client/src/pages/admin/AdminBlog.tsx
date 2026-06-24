import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, Sparkles, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "../../../../shared/schema";

export default function AdminBlog() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const posts = useQuery<BlogPost[]>({ queryKey: ["/api/blog/posts"] });

  const createPost = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/blog", {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        content,
        status: "draft",
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Artículo creado" });
      setTitle("");
      setSlug("");
      setContent("");
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
    onError: () => {
      toast({ title: "Error al crear artículo", variant: "destructive" });
    },
  });

  const runPipeline = useMutation({
    mutationFn: async (postId: number) => {
      const res = await apiRequest("POST", `/api/agents/pipeline/${postId}`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Pipeline ejecutado correctamente" });
      qc.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
    onError: () => {
      toast({ title: "Error ejecutando pipeline", variant: "destructive" });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("DELETE", `/api/admin/blog/${postId}`);
    },
    onSuccess: () => {
      toast({ title: "Artículo eliminado" });
      qc.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
  });

  return (
    <AdminShell
      title="Gestión de Blog"
      subtitle="Crea, procesa y administra los artículos del blog"
      actions={
        <button onClick={() => setShowForm(!showForm)} className="btn-cyan inline-flex items-center gap-2 px-4 py-2 text-sm">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Nuevo artículo"}
        </button>
      }
    >
      <SEOHead title="Blog Admin — FEI Consultores" />

      {/* Create Form */}
      {showForm && (
        <div className="card-l mb-8 !p-6 md:!p-8">
          <h2 className="font-heading text-base font-bold text-navy">Nuevo artículo</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createPost.mutate();
            }}
            className="mt-5 space-y-4"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del artículo"
                required
                className="input-light"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">Slug (opcional)</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Se genera automáticamente del título"
                className="input-light"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-navy">Contenido</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Contenido del artículo (Markdown)"
                rows={12}
                required
                className="input-light"
              />
            </div>
            <button
              type="submit"
              disabled={createPost.isPending}
              className="btn-cyan px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createPost.isPending ? "Creando..." : "Crear artículo"}
            </button>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.isLoading && <p className="text-sm text-slate-500">Cargando artículos...</p>}
        {posts.data?.length === 0 && (
          <p className="text-sm text-slate-500">No hay artículos. Crea el primero.</p>
        )}
        {posts.data?.map((post) => (
          <div key={post.id} className="card-l flex items-center justify-between !p-5">
            <div className="min-w-0 flex-1">
              <h3 className="font-heading font-bold text-navy">{post.title}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className={`rounded-full px-2.5 py-0.5 font-semibold ${
                  post.status === "published"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}>
                  {post.status}
                </span>
                <span>SEO: {post.seoScore ?? "—"}</span>
                <span>{post.agentProcessed ? "Procesado" : "Sin procesar"}</span>
                <span>/{post.slug}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!post.agentProcessed && (
                <button
                  className="btn-ghost-l inline-flex items-center gap-1.5 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => runPipeline.mutate(post.id)}
                  disabled={runPipeline.isPending}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Pipeline
                </button>
              )}
              <button
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                onClick={() => deletePost.mutate(post.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
