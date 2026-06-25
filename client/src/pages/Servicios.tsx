import { motion } from "framer-motion";
import { Search, FileStack, Shield, ArrowRight, Check, Target, CalendarCheck, PackageCheck } from "lucide-react";

const STEP_ICONS = [CalendarCheck, Search, FileStack, PackageCheck];
import type { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/ui/PageHero";
import { fadeUp, scaleIn, staggerContainer, inViewProps } from "@/lib/motion";
import { serviciosContent } from "@config/content/servicios";
import { useSiteContent } from "@/hooks/useSiteContent";
import { seo, SITE } from "@config/seo";

const iconMap: Record<string, LucideIcon> = { Search, FileStack, Shield };
const panelTints = ["bg-mint-soft", "bg-sky", "bg-lavender"];

export default function Servicios() {
  const sv = useSiteContent("servicios", serviciosContent);
  return (
    <div className="site-light">
      <SEOHead title={seo.pages.servicios.title} description={seo.pages.servicios.description} />
      <JsonLd
        id="services"
        data={{
          "@context": "https://schema.org",
          "@graph": sv.services.map((s) => ({
            "@type": "Service",
            name: s.title,
            serviceType: s.subtitle,
            description: s.description,
            provider: { "@id": `${SITE}/#organization` },
            areaServed: { "@type": "Country", name: "México" },
            url: `${SITE}/servicios#${s.id}`,
          })),
        }}
      />

      <PageHero
        eyebrow={sv.hero.eyebrow}
        eyebrowIcon={Target}
        title={sv.hero.title}
        subtitle={sv.hero.subtitle}
      />

      {/* Services */}
      <section className="section-pad bg-white">
        <div className="container-site space-y-8">
          {sv.services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Search;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={service.id}
                id={service.id}
                {...inViewProps}
                variants={fadeUp}
                className="card-l scroll-mt-24 overflow-hidden p-8 md:p-10"
              >
                <div className={`flex flex-col gap-8 lg:flex-row lg:items-center ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                  <div className="lg:w-1/2">
                    <span className="chip-icon mb-5 !h-14 !w-14"><Icon className="h-7 w-7" /></span>
                    <h2 className="font-heading text-2xl font-extrabold text-navy md:text-3xl">{service.title}</h2>
                    <p className="mt-1.5 text-sm font-semibold text-cyan-700">{service.subtitle}</p>
                    <p className="mt-5 leading-relaxed text-slate-600">{service.description}</p>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Link href="/contacto"><button className="btn-navy">Solicitar diagnóstico<ArrowRight className="h-4 w-4" /></button></Link>
                      <div className="rounded-xl border border-cyan/20 bg-cyan/[0.06] px-4 py-2.5 text-sm font-medium text-cyan-700">{service.result}</div>
                    </div>
                  </div>
                  <div className="lg:w-1/2">
                    <div className={`rounded-2xl ${panelTints[i % panelTints.length]} p-6 md:p-8`}>
                      <h4 className="mb-5 font-heading text-xs font-bold uppercase tracking-[0.16em] text-navy/70">Incluye</h4>
                      <ul className="grid grid-cols-1 gap-3">
                        {service.includes.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-navy">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/80 text-cyan-700 shadow-sm"><Check className="h-3 w-3" /></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="section-pad bg-[#f7f9fc]">
        <div className="container-site">
          <motion.h2 {...inViewProps} variants={fadeUp} className="display-md text-center">{sv.process.title}</motion.h2>
          <motion.div {...inViewProps} variants={staggerContainer(0.1)} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {sv.process.steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <motion.div key={step.number} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-hover text-center">
                  <div className="relative mx-auto mb-4 w-fit">
                    <span className="chip-icon !h-14 !w-14"><Icon className="h-6 w-6" /></span>
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-navy font-heading text-xs font-bold text-cyan">{step.number}</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div {...inViewProps} variants={fadeUp} className="mt-14">
            <div className="field-soft relative overflow-hidden rounded-[2rem] bg-navy-dark px-6 py-14 text-center sm:px-12">
              <div className="bg-grid-pattern absolute inset-0 opacity-30" />
              <div className="relative mx-auto max-w-xl">
                <h3 className="font-heading text-2xl font-extrabold text-white md:text-3xl">{seo.pages.contacto.title}</h3>
                <p className="mx-auto mt-4 text-gray-300">{seo.pages.contacto.description}</p>
                <Link href="/contacto"><button className="btn-cyan mx-auto mt-8">{seo.pages.contacto.title}<ArrowRight className="h-5 w-5" /></button></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
