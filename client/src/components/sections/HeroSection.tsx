import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, ShieldCheck, Check, FolderClosed, FileCheck2, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import RotatingWord from "@/components/ui/RotatingWord";
import { EASE_OUT } from "@/lib/motion";

const EXPEDIENTE = [
  "Contrato de servicios",
  "Minutas y reportes de avance",
  "Entregables técnicos",
  "Pólizas y conciliación fiscal",
  "Teoría del caso y defensa",
];

function ExpedientePanel() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-cyan/[0.05] blur-2xl" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
        className="card-l overflow-hidden p-6"
      >
        <motion.div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="chip-icon"><FolderClosed className="h-5 w-5" /></span>
              <div>
                <p className="font-heading text-sm font-bold text-navy">Expediente de Materialidad</p>
                <p className="text-xs text-slate-600">Operación · 9 carpetas</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" /> Validado
            </span>
          </div>
          <div className="my-4 h-px bg-slate-100" />
          <ul className="space-y-2">
            {EXPEDIENTE.map((el, i) => (
              <motion.li
                key={el}
                initial={reduce ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.45 + i * 0.1 }}
                className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan/15 ring-1 ring-cyan/30">
                  <Check className="h-3 w-3 text-cyan-700" />
                </span>
                <span className="text-sm text-slate-600">{el}</span>
                <FileCheck2 className="ml-auto h-4 w-4 text-slate-300" />
              </motion.li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-navy px-4 py-3 text-center">
              <p className="font-heading text-2xl font-extrabold text-cyan">15/15</p>
              <p className="mt-0.5 text-[11px] text-slate-300">Elementos SAT</p>
            </div>
            <div className="rounded-xl bg-cyan/10 px-4 py-3 text-center ring-1 ring-cyan/20">
              <p className="font-heading text-2xl font-extrabold text-navy">+50</p>
              <p className="mt-0.5 text-[11px] text-slate-600">Documentos</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const hero = useSiteContent("home", homeContent).hero;
  return (
    <section className="field-soft relative z-10 overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-sky via-[#f7f9fc] to-white shadow-[0_30px_50px_-34px_rgba(16,24,40,0.25)] md:rounded-b-[3rem]">
      <div className="bg-grid-fine absolute inset-0 opacity-[0.35]" />
      <div className="container-site relative px-5 pb-20 pt-16 sm:px-6 md:pt-20 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Left */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="flex justify-center lg:justify-start"
            >
              <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" />{hero.badge}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.08 }}
              className="display-xl mt-5"
            >
              {hero.titleParts.prefix}{" "}
              <RotatingWord words={[...hero.titleParts.rotating]} />{" "}
              {hero.titleParts.suffix}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.16 }}
              className="lead mx-auto mt-6 max-w-xl lg:mx-0"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.24 }}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link href={hero.cta.href}>
                <button className="btn-navy px-7 py-4">{hero.cta.label}<ArrowRight className="h-4 w-4" /></button>
              </Link>
              <Link href={hero.ctaSecondary.href}>
                <button className="group btn-ghost-l px-7 py-4">
                  {hero.ctaSecondary.label}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 lg:justify-start"
            >
              {hero.stats.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-heading text-2xl font-extrabold text-navy">{s.value}</span>
                  <span className="max-w-[9rem] text-left text-xs leading-tight text-slate-600">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <div className="lg:pl-4"><ExpedientePanel /></div>
        </div>
      </div>
    </section>
  );
}
