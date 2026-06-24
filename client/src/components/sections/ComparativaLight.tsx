import { motion } from "framer-motion";
import { X, Check, Scale } from "lucide-react";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import { fadeUp, inViewProps } from "@/lib/motion";
import SectionHead from "@/components/ui/SectionHead";
import BannerQuote from "@/components/ui/BannerQuote";

export default function ComparativaLight() {
  const c = useSiteContent("home", homeContent).comparativa;
  return (
    <section className="section-curve section-pad bg-[#f7f9fc]">
      <div className="container-site">
        <SectionHead eyebrow={c.eyebrow} eyebrowIcon={Scale} title={c.title} />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Without */}
          <motion.div
            {...inViewProps}
            variants={fadeUp}
            className="rounded-2xl border border-rose-200/70 bg-rose-50/40 p-8"
          >
            <p className="font-heading text-lg font-bold text-rose-600">{c.without.label}</p>
            <ul className="mt-6 space-y-3.5">
              {c.without.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                    <X className="h-3 w-3" />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With */}
          <motion.div
            {...inViewProps}
            variants={fadeUp}
            className="relative overflow-hidden rounded-2xl border-2 border-cyan/40 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(76,201,240,0.4)]"
          >
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-cyan px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-navy-dark">
              Recomendado
            </div>
            <p className="font-heading text-lg font-bold text-cyan-700">{c.with.label}</p>
            <ul className="mt-6 space-y-3.5">
              {c.with.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm font-medium text-navy">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan-700 ring-1 ring-cyan/30">
                    <Check className="h-3 w-3" />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <BannerQuote className="mt-12">{c.banner}</BannerQuote>
      </div>
    </section>
  );
}
