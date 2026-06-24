import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import PageHero from "@/components/ui/PageHero";
import ImpactoBand from "@/components/sections/ImpactoBand";
import TestimoniosLight from "@/components/sections/TestimoniosLight";
import { fadeUp, inViewProps } from "@/lib/motion";

export default function Impacto() {
  return (
    <div className="site-light">
      <SEOHead
        title="Impacto — resultados de la materialidad documentada"
        description="Operaciones con expediente fiscal estructurado y 35x de valor documental soportado frente a la inversión. El impacto real de la materialidad bien documentada."
      />

      <PageHero
        eyebrow="El Impacto"
        eyebrowIcon={TrendingUp}
        title="Resultados que hablan por sí solos"
        subtitle="Por cada peso invertido en documentación fiscal, se estructuran hasta 35 pesos en deducciones soportadas documentalmente. Estos son los números detrás del expediente."
      />

      <ImpactoBand />
      <TestimoniosLight />

      <section className="section-pad bg-white">
        <div className="container-site">
          <motion.div {...inViewProps} variants={fadeUp} className="field-soft relative overflow-hidden rounded-[2rem] bg-navy-dark px-6 py-14 text-center sm:px-12">
            <div className="bg-grid-pattern absolute inset-0 opacity-30" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-heading text-2xl font-extrabold text-white md:text-3xl">Documenta tu próxima operación</h2>
              <p className="mx-auto mt-4 text-gray-300">Agenda un diagnóstico sin compromiso y proyecta el soporte documental de tus operaciones.</p>
              <Link href="/contacto"><button className="btn-cyan mx-auto mt-8">Agenda un diagnóstico<ArrowRight className="h-5 w-5" /></button></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
