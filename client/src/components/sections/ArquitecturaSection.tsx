import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import { scaleIn, staggerContainer, fadeUp, inViewProps } from "@/lib/motion";
import { IlloMateria, IlloBlindaje } from "@/components/ui/Illustrations";

const FLUJOS = ["Recepción", "Causación", "Pago a proveedores", "Conciliación", "Defensa SAT"];

/** Pastel illustration panels — the distinctive Payana "arquitectura" card pattern. */
function PanelEspecialistas() {
  return (
    <div className="flex h-44 items-center justify-center rounded-xl bg-mint-soft p-4">
      <IlloMateria className="h-full w-auto" />
    </div>
  );
}

function PanelAutomatizacion() {
  return (
    <div className="flex h-44 items-center justify-center rounded-xl bg-sky p-5">
      <div className="w-full rounded-lg bg-white p-3 shadow-md">
        <div className="mb-2.5 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-cyan/50" />
          <span className="ml-2 text-[10px] font-bold text-navy">FEI · Motor documental</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FLUJOS.map((f) => (
            <span key={f} className="rounded-full bg-navy/5 px-2.5 py-1 text-[10px] font-semibold text-navy ring-1 ring-navy/10">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PanelExpedientes() {
  return (
    <div className="relative flex h-44 items-center justify-center rounded-xl bg-lavender p-4">
      <IlloBlindaje className="h-full w-auto" />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-navy px-2.5 py-0.5 text-[10px] font-bold text-mint">
        9 carpetas
      </span>
    </div>
  );
}

const PANELS = [PanelEspecialistas, PanelAutomatizacion, PanelExpedientes];

export default function ArquitecturaSection() {
  const s = useSiteContent("home", homeContent).solucion;
  return (
    <section className="section-curve section-pad bg-white">
      <div className="container-site">
        <motion.div {...inViewProps} variants={fadeUp} className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{s.eyebrow}</span>
          <h2 className="display-md mt-2">La arquitectura de tu blindaje fiscal</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-500">{s.subtitle}</p>
        </motion.div>

        <motion.div
          {...inViewProps}
          variants={staggerContainer(0.12)}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {s.columns.map((col, i) => {
            const Panel = PANELS[i] ?? PanelEspecialistas;
            return (
              <motion.div key={col.title} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-lg card-l-hover card-bw group flex flex-col">
                <Panel />
                <h3 className="mt-6 font-heading text-xl font-bold text-navy">{col.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{col.description}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700">
                  Conoce más
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
