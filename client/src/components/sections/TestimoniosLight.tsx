import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { homeContent } from "@config/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import SectionHead from "@/components/ui/SectionHead";
import { scaleIn, staggerContainer, inViewProps } from "@/lib/motion";

const TINTS = ["bg-lavender", "bg-mint-soft", "bg-sky"];

/**
 * Testimonials as a responsive grid (1 col → 3 cols). With only 3 items a Splide
 * loop+autoplay over-clones and visibly re-flows ("cards reloading"); a static
 * grid with a one-shot reveal is cleaner and flicker-free.
 */
export default function TestimoniosLight() {
  const t = useSiteContent("home", homeContent).confianza;
  return (
    <section className="section-curve section-pad bg-[#f7f9fc]">
      <div className="container-site">
        <SectionHead eyebrow={t.eyebrow} eyebrowIcon={Quote} title={t.title} />

        <motion.div
          {...inViewProps}
          variants={staggerContainer(0.12)}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {t.testimonials.map((item, i) => (
            <motion.div
              key={item.author}
              variants={scaleIn}
              className={`card-pastel flex h-full flex-col ${TINTS[i % TINTS.length]}`}
            >
              <Quote className="h-9 w-9 text-navy/20" />
              <p className="mt-5 flex-1 font-heading text-lg font-medium leading-relaxed text-navy">
                “{item.quote}”
              </p>
              <div className="mt-6 border-t border-navy/10 pt-5">
                <p className="font-heading text-sm font-bold text-navy">{item.author}</p>
                <p className="mt-0.5 text-xs text-navy">{item.company}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
