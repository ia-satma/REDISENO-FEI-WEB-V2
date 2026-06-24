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
        title="Impacto — resultados que blindan operaciones"
        description="Operaciones protegidas, deducciones blindadas y un ROI promedio de 35x. El impacto real de la materialidad bien construida."
      />

      <PageHero
        eyebrow="El Impacto"
        eyebrowIcon={TrendingUp}
        title="Resultados que hablan por sí solos"
        subtitle="Cada peso invertido en materialidad protege en promedio 35 pesos en deducciones. Estos son los números detrás del blindaje."
      />

      <ImpactoBand />
      <TestimoniosLight />

      <section className="section-pad bg-white">
        <div className="container-site">
          <motion.div {...inViewProps} variants={fadeUp} className="field-soft relative overflow-hidden rounded-[2rem] bg-navy-dark px-6 py-14 text-center sm:px-12">
            <div className="bg-grid-pattern absolute inset-0 opacity-30" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-heading text-2xl font-extrabold text-white md:text-3xl">Blinda tu próxima operación</h2>
              <p className="mx-auto mt-4 text-gray-300">Agenda una demo sin compromiso y proyecta tu retorno.</p>
              <Link href="/contacto"><button className="btn-cyan mx-auto mt-8">Agenda tu demo<ArrowRight className="h-5 w-5" /></button></Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
