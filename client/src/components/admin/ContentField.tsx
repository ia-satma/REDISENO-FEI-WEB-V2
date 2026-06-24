import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { ICONS } from "@/lib/icons";

/** Spanish labels for common content keys (fallback = humanized key). */
const LABELS: Record<string, string> = {
  eyebrow: "Etiqueta", badge: "Insignia", title: "Título", subtitle: "Subtítulo",
  description: "Descripción", intro: "Introducción", content: "Contenido", note: "Nota",
  label: "Texto", value: "Valor", href: "Enlace", url: "URL", slug: "Slug",
  icon: "Icono", name: "Nombre", question: "Pregunta", answer: "Respuesta",
  quote: "Testimonio", author: "Autor", company: "Empresa", cta: "Botón",
  ctaSecondary: "Botón secundario", items: "Elementos", cards: "Tarjetas",
  stats: "Cifras", metrics: "Cifras", phases: "Fases", steps: "Pasos",
  columns: "Columnas", testimonials: "Testimonios", categories: "Categorías",
  questions: "Preguntas", sections: "Secciones", pillars: "Pilares",
  stages: "Etapas", points: "Puntos", week: "Semana", suffix: "Sufijo",
  prefix: "Prefijo", rotating: "Palabras rotativas", banner: "Frase destacada",
  result: "Resultado", includes: "Incluye", desc: "Descripción", t: "Título",
  d: "Descripción", n: "Número", number: "Número", coverImage: "Imagen de portada",
  certifications: "Certificaciones", newsletter: "Boletín", placeholder: "Texto de ejemplo",
  successMessage: "Mensaje de éxito", errorMessage: "Mensaje de error", body: "Texto",
  copyright: "Aviso de copyright", proof: "Pruebas / métricas", question_: "Pregunta",
  showEyebrows: "Mostrar etiquetas de sección", draft: "Borrador",
  hacemos: "Lo que hacemos", noHacemos: "Lo que no hacemos",
  hacemosLabel: "Título — hacemos", noHacemosLabel: "Título — no hacemos",
  infoSeguridad: "Seguridad de la información", alcance: "Alcance del servicio",
};

function humanize(k: string) {
  return (
    LABELS[k] ||
    k.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

const LONG_KEYS = new Set([
  "description", "subtitle", "intro", "content", "answer", "quote", "body",
  "note", "message", "desc", "d", "banner",
]);
const isImageKey = (k: string) => /image|logo|cover|og|avatar|photo|foto|imagen/i.test(k);
const isLinkKey = (k: string) => /href|url|link|slug/i.test(k);
const HIDDEN = new Set(["sectionId", "id", "variant", "tint"]);
const ICON_NAMES = Object.keys(ICONS);

interface Props {
  value: unknown;
  onChange: (v: unknown) => void;
  fieldKey?: string;
  depth?: number;
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-2">
      {value && <img src={value} alt="" className="h-16 rounded-lg border border-slate-200 object-contain" />}
      <div className="flex gap-2">
        <input className="input-light flex-1 text-sm" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="/ruta.jpg o URL" />
        <label className="btn-ghost-l shrink-0 cursor-pointer px-3 py-2 text-xs">
          <Upload className="h-3.5 w-3.5" />
          {busy ? "Subiendo…" : "Subir"}
          <input type="file" accept="image/*" className="hidden" onChange={pick} />
        </label>
      </div>
    </div>
  );
}

/** Recursive, self-describing form field for any JSON content value. */
export default function ContentField({ value, onChange, fieldKey = "", depth = 0 }: Props) {
  // ── Primitive: string ──
  if (typeof value === "string") {
    if (isImageKey(fieldKey)) return <ImageField value={value} onChange={onChange} />;
    if (fieldKey === "icon") {
      return (
        <select className="input-light text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
          {!ICON_NAMES.includes(value) && <option value={value}>{value}</option>}
          {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      );
    }
    const long = LONG_KEYS.has(fieldKey) || value.length > 80;
    if (long) {
      return <textarea className="input-light resize-y text-sm" rows={Math.min(8, Math.ceil(value.length / 60) + 1)} value={value} onChange={(e) => onChange(e.target.value)} />;
    }
    return <input className="input-light text-sm" value={value} onChange={(e) => onChange(e.target.value)} placeholder={isLinkKey(fieldKey) ? "/ruta o URL" : ""} />;
  }

  // ── Primitive: number / boolean ──
  if (typeof value === "number") {
    return <input type="number" className="input-light text-sm" value={value} onChange={(e) => onChange(Number(e.target.value))} />;
  }
  if (typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-navy">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-cyan" />
        {value ? "Sí" : "No"}
      </label>
    );
  }

  // ── Array ──
  if (Array.isArray(value)) {
    const items = value as unknown[];
    const setItem = (i: number, v: unknown) => onChange(items.map((it, j) => (j === i ? v : it)));
    const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
    const move = (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return;
      const next = [...items];
      [next[i], next[j]] = [next[j], next[i]];
      onChange(next);
    };
    const add = () => {
      const template = items[0];
      let blank: unknown = "";
      if (template && typeof template === "object" && !Array.isArray(template)) {
        blank = Object.fromEntries(Object.entries(template as Record<string, unknown>).map(([k, v]) => [k, typeof v === "string" ? "" : typeof v === "number" ? 0 : Array.isArray(v) ? [] : v]));
      } else if (typeof template === "number") blank = 0;
      onChange([...items, blank]);
    };
    return (
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">#{i + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-slate-400 hover:text-navy disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded p-1 text-slate-400 hover:text-navy disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(i)} className="rounded p-1 text-rose-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <ContentField value={it} onChange={(v) => setItem(i, v)} fieldKey="" depth={depth + 1} />
          </div>
        ))}
        <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-cyan/40 px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan/5">
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </div>
    );
  }

  // ── Object ──
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return (
      <div className={depth > 0 ? "space-y-4" : "space-y-5"}>
        {Object.keys(obj).filter((k) => !HIDDEN.has(k)).map((k) => {
          const v = obj[k];
          const nested = Array.isArray(v) || (typeof v === "object" && v !== null);
          return (
            <div key={k}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{humanize(k)}</label>
              <ContentField value={v} onChange={(nv) => onChange({ ...obj, [k]: nv })} fieldKey={k} depth={depth + 1} />
              {nested && depth === 0 && <div className="mt-2 h-px bg-slate-100" />}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback (null/undefined) — render an editable text input
  return <input className="input-light text-sm" value={value == null ? "" : String(value)} onChange={(e) => onChange(e.target.value)} />;
}
