import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, ShieldCheck, FolderCheck } from "lucide-react";
import { Link } from "wouter";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import { fadeUp, inViewProps } from "@/lib/motion";

export default function CtaLight() {
  const cta = useSiteContent("home", homeContent).cta;
  return (
    <section className="section-curve section-pad bg-white">
      <div className="container-site">
        <motion.div
          {...inViewProps}
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2rem] bg-navy-dark px-6 py-16 text-center sm:px-12 md:py-20"
        >
          <div className="bg-grid-pattern absolute inset-0 opacity-[0.12]" />
          <ShieldCheck className="pointer-events-none absolute -right-8 -top-10 h-52 w-52 text-cyan/[0.06]" strokeWidth={1} />
          <FolderCheck className="pointer-events-none absolute -bottom-12 -left-10 h-52 w-52 text-cyan/[0.05]" strokeWidth={1} />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-300">
              {cta.subtitle}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={cta.cta.href}>
                <button className="btn-cyan px-7 py-4">{cta.cta.label}<ArrowRight className="h-4 w-4" /></button>
              </Link>
              <Link href={cta.ctaSecondary.href}>
                <button className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-heading text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-cyan/40 hover:text-cyan">
                  {cta.ctaSecondary.label}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
