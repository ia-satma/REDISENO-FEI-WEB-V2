import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, FileStack, Layers } from "lucide-react";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import { scaleIn, staggerContainer, fadeUp, inViewProps } from "@/lib/motion";

// Curated proof numbers (from FEI content) — Payana-style big mint stats on navy.
const STATS = [
  { value: "MXN $1,200", suffix: "M", label: "en operaciones con expediente fiscal estructurado", icon: ShieldCheck },
  { value: "180", suffix: "", label: "operaciones documentadas durante un ejercicio fiscal", icon: FileStack },
  { value: "15/15", suffix: "", label: "elementos críticos de materialidad fiscal cubiertos", icon: Layers },
  { value: "35", suffix: "x", label: "valor documental soportado frente a la inversión", icon: TrendingUp },
];

export default function ImpactoBand() {
  const im = useSiteContent("home", homeContent).impacto;
  return (
    <section className="section-curve relative overflow-hidden bg-[#050b1e] py-24 md:py-28">
      <div className="bg-grid-pattern absolute inset-0 opacity-[0.12]" />

      <div className="container-site relative px-5 sm:px-6 lg:px-8">
        <motion.h2
          {...inViewProps}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          {im.title}
        </motion.h2>

        <motion.div
          {...inViewProps}
          variants={staggerContainer(0.1)}
          className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
        >
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                variants={scaleIn}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:border-mint/30"
              >
                <Icon className="mx-auto mb-4 h-6 w-6 text-mint/70" />
                <p className="font-heading text-4xl font-extrabold tracking-tight text-mint md:text-5xl">
                  {s.value}
                  {s.suffix && <span className="ml-1 text-2xl">{s.suffix}</span>}
                </p>
                <p className="mx-auto mt-3 max-w-[12rem] text-sm leading-snug text-slate-300">
                  {s.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p {...inViewProps} variants={fadeUp} className="mt-10 text-center text-sm text-slate-400">
          {im.banner}
        </motion.p>
      </div>
    </section>
  );
}
