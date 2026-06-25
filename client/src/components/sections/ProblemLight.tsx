import { motion } from "framer-motion";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getIcon } from "@/lib/icons";
import { AlertTriangle } from "lucide-react";
import { scaleIn, staggerContainer, inViewProps } from "@/lib/motion";
import SectionHead from "@/components/ui/SectionHead";
import BannerQuote from "@/components/ui/BannerQuote";

export default function ProblemLight() {
  const c = useSiteContent("home", homeContent).contexto;
  return (
    <section className="section-curve section-pad bg-white">
      <div className="container-site">
        <SectionHead eyebrow={c.eyebrow} eyebrowIcon={AlertTriangle} title={c.title} subtitle={c.description} />

        <motion.div
          {...inViewProps}
          variants={staggerContainer(0.1)}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {c.cards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <motion.div key={card.title} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-hover">
                <span className="chip-icon mb-5"><Icon className="h-6 w-6" /></span>
                <h3 className="font-heading text-base font-bold text-navy">{card.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{card.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <BannerQuote className="mt-14">{c.banner}</BannerQuote>
      </div>
    </section>
  );
}
