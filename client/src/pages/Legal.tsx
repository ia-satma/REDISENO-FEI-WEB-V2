import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Lock } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import PageHero from "@/components/ui/PageHero";
import { fadeUp, inViewProps } from "@/lib/motion";
import { legalContent } from "@config/content/legal";
import { useSiteContent } from "@/hooks/useSiteContent";

const BY_PATH: Record<string, keyof typeof legalContent> = {
  "/aviso-privacidad": "avisoPrivacidad",
  "/terminos": "terminos",
  "/politica-seguridad": "seguridad",
  "/cookies": "cookies",
};

export default function Legal() {
  const [loc] = useLocation();
  const key = BY_PATH[loc] ?? "avisoPrivacidad";
  const legal = useSiteContent("legal", legalContent);
  const doc = legal[key];
  const updated = new Date(doc.lastUpdated).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="site-light">
      <SEOHead title={`${doc.title} — FEI Consultores`} description={doc.intro} />

      <PageHero
        eyebrow="Legal"
        eyebrowIcon={Lock}
        title={doc.title}
        subtitle={doc.intro}
        meta={`Última actualización: ${updated}`}
      />

      <section className="section-pad bg-white">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6 lg:px-8">
          {/* Document switcher */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {Object.values(legal).map((d) => (
              <Link key={d.slug} href={d.slug}>
                <span
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    d.slug === loc
                      ? "border-cyan/40 bg-cyan/10 text-cyan-700"
                      : "border-slate-200 text-slate-600 hover:border-cyan/40 hover:text-cyan-700"
                  }`}
                >
                  {d.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="card-l p-8 md:p-12">
            <div className="space-y-10">
              {doc.sections.map((section, i) => (
                <motion.div key={i} {...inViewProps} variants={fadeUp}>
                  <h2 className="mb-4 flex items-center font-heading text-base font-bold text-navy">
                    <span className="mr-2.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-cyan/10 text-xs font-bold text-cyan-700 ring-1 ring-cyan/20">
                      {i + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p className="pl-9 text-sm leading-7 text-slate-600">{section.content}</p>
                  {i < doc.sections.length - 1 && <div className="mt-10 h-px bg-slate-100" />}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
