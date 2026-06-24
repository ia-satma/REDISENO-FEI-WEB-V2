import { motion } from "framer-motion";
import { ArrowRight, Scale, CheckCircle2, ShieldCheck, ListChecks } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import PageHero from "@/components/ui/PageHero";
import SectionHead from "@/components/ui/SectionHead";
import ComparativaLight from "@/components/sections/ComparativaLight";
import { scaleIn, staggerContainer, fadeUp, inViewProps } from "@/lib/motion";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";
import { materialidadContent } from "@config/content/materialidad";

export default function Materialidad() {
  const { categorias } = useSiteContent("materialidad", materialidadContent);

  return (
    <div className="site-light">
      <SEOHead
        title="Los 15 elementos de materialidad del SAT"
        description="Qué evalúa el SAT para considerar real una operación, y cómo FEI cubre los 15 elementos de materialidad fiscal."
      />

      <PageHero
        eyebrow="Materialidad Fiscal"
        eyebrowIcon={Scale}
        title="Los 15 elementos que el SAT evalúa"
        subtitle="La materialidad es la capacidad de demostrar, documentalmente, que una operación realmente ocurrió. El promedio de las empresas cubre solo 6 de 15. FEI te lleva a 15/15."
      >
        <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-navy px-6 py-4">
          <span className="font-heading text-3xl font-extrabold text-cyan">15/15</span>
          <span className="text-left text-sm text-slate-200">elementos cubiertos<br />en cada expediente FEI</span>
        </div>
      </PageHero>

      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHead
            eyebrow="Los 15 elementos"
            eyebrowIcon={ListChecks}
            title="Agrupados como los evalúa el SAT"
            subtitle="No es una lista suelta: la materialidad se sostiene en 5 frentes. Si uno falla, toda la deducción queda expuesta. FEI los blinda los 15."
          />

          <div className="mt-16 space-y-16 md:space-y-24">
            {categorias.map((cat) => {
              const CatIcon = getIcon(cat.icon);
              return (
                <div key={cat.title}>
                  {/* Category header */}
                  <motion.div
                    {...inViewProps}
                    variants={fadeUp}
                    className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${cat.tint} ring-1 ring-navy/[0.06]`}>
                        <CatIcon className="h-7 w-7 text-navy" strokeWidth={1.6} />
                      </span>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">Frente {cat.n}</span>
                        <h3 className="font-heading text-2xl font-bold text-navy">{cat.title}</h3>
                        <p className="text-sm text-slate-500">{cat.question}</p>
                      </div>
                    </div>
                    <span className="self-start rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 sm:self-center">
                      {cat.items.length} {cat.items.length === 1 ? "elemento" : "elementos"}
                    </span>
                  </motion.div>

                  {/* Element cards */}
                  <motion.div
                    {...inViewProps}
                    variants={staggerContainer(0.06)}
                    className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {cat.items.map((el) => {
                      const Icon = getIcon(el.icon);
                      return (
                        <motion.div
                          key={el.t}
                          variants={scaleIn}
                          whileHover={{ y: -4 }}
                          className="card-l card-l-hover flex flex-col !p-6"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="chip-icon"><Icon className="h-5 w-5" /></span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-200">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Cubierto
                            </span>
                          </div>
                          <h4 className="mt-4 font-heading text-base font-bold text-navy">{el.t}</h4>
                          <p className="mt-2 text-sm leading-relaxed text-slate-500">{el.d}</p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ComparativaLight />

      <section className="section-pad bg-white">
        <div className="container-site">
          <motion.div {...inViewProps} variants={fadeUp} className="field-soft relative overflow-hidden rounded-[2rem] bg-navy-dark px-6 py-14 text-center sm:px-12">
            <div className="bg-grid-pattern absolute inset-0 opacity-30" />
            <ShieldCheck className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 text-cyan/[0.07]" strokeWidth={1} />
            <ShieldCheck className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 text-cyan/[0.06]" strokeWidth={1} />
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-heading text-2xl font-extrabold text-white md:text-3xl">¿En cuántos de los 15 estás hoy?</h2>
              <p className="mx-auto mt-4 text-gray-300">Agenda una demo gratuita y te mostramos exactamente qué elementos te faltan.</p>
              <Link href="/contacto"><button className="btn-cyan mx-auto mt-8">Agenda tu demo<ArrowRight className="h-5 w-5" /></button></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
