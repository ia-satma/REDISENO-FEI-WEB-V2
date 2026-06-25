import { motion } from "framer-motion";
import { ArrowRight, Check, Workflow, Search, FileStack, PackageCheck, RefreshCw } from "lucide-react";

const TIMELINE_ICONS = [Search, FileStack, PackageCheck, RefreshCw];
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import PageHero from "@/components/ui/PageHero";
import MetodologiaLight from "@/components/sections/MetodologiaLight";
import { scaleIn, staggerContainer, fadeUp, inViewProps } from "@/lib/motion";
import { homeContent } from "@config/content/home";

const impl = homeContent.implementacion;

export default function Metodologia() {
  return (
    <div className="site-light">
      <SEOHead
        title="Metodología — cómo construimos tu expediente"
        description="4 fases de construcción documental para estructurar evidencia de materialidad fiscal. Implementación desde 3 semanas, sin interrumpir tu operación."
      />

      <PageHero
        eyebrow="La Metodología"
        eyebrowIcon={Workflow}
        title="Metodología documental diseñada para cada operación"
        subtitle="No aplicamos formatos genéricos. Analizamos la naturaleza de cada operación, identificamos la evidencia requerida y construimos un expediente documental consistente, trazable y preparado para revisión."
      />

      <MetodologiaLight />

      {/* Implementation timeline */}
      <section className="section-pad bg-[#f7f9fc]">
        <div className="container-site">
          <motion.div {...inViewProps} variants={fadeUp} className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">{impl.eyebrow}</span>
            <h2 className="display-md mt-2">{impl.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{impl.subtitle}</p>
            <p className="mx-auto mt-3 max-w-xl text-sm italic text-slate-500">{impl.note}</p>
          </motion.div>
          <motion.div {...inViewProps} variants={staggerContainer(0.1)} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {impl.timeline.map((t, i) => {
              const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
              return (
                <motion.div key={t.title} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-hover">
                  <span className="chip-icon mb-4"><Icon className="h-5 w-5" /></span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan-700">{t.week}</span>
                  <h3 className="mt-3 font-heading text-lg font-bold text-navy">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
          <motion.div {...inViewProps} variants={fadeUp} className="mt-12 text-center">
            <Link href="/contacto"><button className="btn-navy mx-auto">Agenda un diagnóstico<ArrowRight className="h-4 w-4" /></button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
