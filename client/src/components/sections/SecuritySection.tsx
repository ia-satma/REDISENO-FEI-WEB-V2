import { motion } from "framer-motion";
import { Link } from "wouter";
import { Lock, FileSearch, ShieldCheck, Cpu, ArrowRight, Download } from "lucide-react";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import { fadeUp, scaleIn, staggerContainer, inViewProps } from "@/lib/motion";
import CustodyChain from "@/components/ui/CustodyChain";

const PILLAR_ICONS: Record<string, typeof ShieldCheck> = { FileSearch, ShieldCheck, Cpu };

export default function SecuritySection() {
  const seg = useSiteContent("home", homeContent).seguridad;
  return (
    <section className="section-curve relative overflow-hidden bg-navy-dark py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(76,201,240,0.12),transparent_60%),radial-gradient(45%_50%_at_100%_100%,rgba(45,98,255,0.10),transparent_55%)]" />
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.10]" />

      <div className="container-site relative px-5 sm:px-6 lg:px-8">
        <motion.div {...inViewProps} variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan">
            <Lock className="h-3.5 w-3.5" />
            {seg.eyebrow}
          </span>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
            {seg.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">{seg.subtitle}</p>
        </motion.div>

        <motion.div {...inViewProps} variants={fadeUp} className="mt-16 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.18em] text-cyan/70">
            Cadena de custodia del expediente
          </p>
          <CustodyChain />
        </motion.div>

        <motion.div {...inViewProps} variants={staggerContainer(0.12)} className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {seg.pillars.map((p) => {
            const Icon = PILLAR_ICONS[p.icon] ?? ShieldCheck;
            return (
              <motion.div key={p.title} variants={scaleIn} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-cyan/30">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/[0.08] text-cyan">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{p.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div {...inViewProps} variants={fadeUp} className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.08] md:grid-cols-4">
          {seg.proof.map((s, i) => (
            <div key={i} className={`bg-white/[0.02] px-6 py-7 text-center ${i > 0 ? "border-l border-white/[0.06]" : ""} ${i === 2 ? "border-l-0 md:border-l" : ""}`}>
              <p className="font-heading text-3xl font-extrabold text-mint">{s.value}</p>
              <p className="mt-2 text-xs leading-snug text-gray-500">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...inViewProps} variants={fadeUp} className="mt-12 flex flex-col items-center gap-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/seguridad">
              <button className="btn-cyan px-7 py-3.5">Conoce nuestra seguridad<ArrowRight className="h-4 w-4" /></button>
            </Link>
            <Link href="/materialidad">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-7 py-3.5 font-heading text-[15px] font-semibold text-white transition-colors hover:border-cyan/40 hover:text-cyan">
                <Download className="h-4 w-4" /> Guía de materialidad
              </button>
            </Link>
          </div>
          <p className="flex max-w-2xl items-start justify-center gap-2 text-center text-xs leading-relaxed text-gray-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan/50" strokeWidth={1.6} />
            {seg.note}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
