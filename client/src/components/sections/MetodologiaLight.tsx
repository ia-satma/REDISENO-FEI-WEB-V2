import { motion } from "framer-motion";
import { Check, Workflow } from "lucide-react";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import { scaleIn, staggerContainer, inViewProps } from "@/lib/motion";
import SectionHead from "@/components/ui/SectionHead";
import { IlloContrato, IlloEjecucion, IlloEntrega, IlloCierre } from "@/components/ui/Illustrations";

const PANELS = [IlloContrato, IlloEjecucion, IlloEntrega, IlloCierre];
const TINTS = ["bg-mint-soft", "bg-sky", "bg-lavender", "bg-mint-soft"];

export default function MetodologiaLight() {
  const m = useSiteContent("home", homeContent).metodologia;
  return (
    <section className="section-curve section-pad bg-white">
      <div className="container-site">
        <SectionHead eyebrow={m.eyebrow} eyebrowIcon={Workflow} title={m.title} subtitle={m.subtitle} />

        <motion.div
          {...inViewProps}
          variants={staggerContainer(0.1)}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {m.phases.map((p, i) => {
            const Illo = PANELS[i] ?? IlloContrato;
            return (
              <motion.div key={p.number} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-hover group relative flex flex-col">
                <div className={`mb-5 flex h-28 items-center justify-center overflow-hidden rounded-xl ${TINTS[i % TINTS.length]}`}>
                  <Illo className="h-20 w-auto transition-transform duration-500 group-hover:scale-[1.06]" />
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span aria-hidden="true" className="font-heading text-3xl font-extrabold text-cyan/30">{p.number}</span>
                  <h3 className="font-heading text-lg font-bold text-navy">{p.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.description}</p>
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
