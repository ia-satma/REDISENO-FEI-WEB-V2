import { motion } from "framer-motion";
import { ArrowRight, HelpCircle, FileStack, Cpu, Receipt } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import { useSiteContent } from "@/hooks/useSiteContent";
import PageHero from "@/components/ui/PageHero";

const CAT_ICONS = [FileStack, Cpu, Receipt];
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fadeUp, inViewProps } from "@/lib/motion";
import { faqContent } from "@config/content/faq";
import { seo } from "@config/seo";

// FAQPage structured data — eligible for rich snippets + AI answer-engine citation.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqContent.categories.flatMap((c) =>
    c.questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  ),
};

export default function FAQ() {
  const faq = useSiteContent("faq", faqContent);
  return (
    <div className="site-light">
      <SEOHead title={seo.pages.faq.title} description={seo.pages.faq.description} />
      <JsonLd id="faq" data={faqSchema} />

      <PageHero eyebrow={faq.hero.eyebrow} eyebrowIcon={HelpCircle} title={faq.hero.title} />

      <section className="section-pad bg-white">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6 lg:px-8">
          {faq.categories.map((category, ci) => (
            <motion.div key={ci} {...inViewProps} variants={fadeUp} className="mb-12">
              <h2 className="mb-5 flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
                {(() => { const I = CAT_ICONS[ci % CAT_ICONS.length]; return <I className="h-4 w-4" strokeWidth={1.8} />; })()}
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {category.questions.map((q, qi) => (
                  <AccordionItem
                    key={qi}
                    value={`${ci}-${qi}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all data-[state=open]:border-cyan/40 data-[state=open]:shadow-[0_8px_28px_rgba(16,24,40,0.06)]"
                  >
                    <AccordionTrigger className="px-6 py-5 text-left text-[15px] font-semibold text-navy hover:text-cyan-700 hover:no-underline [&[data-state=open]]:text-cyan-700">
                      {q.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 text-sm leading-relaxed text-slate-500">
                      {q.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}

          <motion.div {...inViewProps} variants={fadeUp}>
            <div className="field-soft relative overflow-hidden rounded-2xl bg-navy-dark p-10 text-center md:p-12">
              <div className="bg-grid-pattern absolute inset-0 opacity-30" />
              <div className="relative">
                <h3 className="font-heading text-xl font-extrabold text-white md:text-2xl">¿Tienes más preguntas?</h3>
                <p className="mx-auto mt-3 max-w-md text-gray-300">{seo.pages.contacto.description}</p>
                <Link href="/contacto"><button className="btn-cyan mx-auto mt-8">{seo.pages.contacto.title}<ArrowRight className="h-5 w-5" /></button></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
