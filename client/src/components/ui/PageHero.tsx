import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  meta?: string;
  children?: React.ReactNode;
}

/** Light, Payana-style page hero used across all inner pages. */
export default function PageHero({ eyebrow, eyebrowIcon: Icon, title, subtitle, meta, children }: Props) {
  return (
    <section className="field-soft relative overflow-hidden bg-[#f7f9fc]">
      <div className="bg-grid-fine absolute inset-0 opacity-[0.4]" />
      <div className="container-site relative px-5 pb-16 pt-16 text-center sm:px-6 md:pb-20 md:pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mx-auto max-w-3xl"
        >
          {eyebrow && (
            <span className="eyebrow">
              {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />}
              {eyebrow}
            </span>
          )}
          <h1 className="display-lg mt-3">{title}</h1>
          {subtitle && <p className="lead mx-auto mt-6 max-w-2xl">{subtitle}</p>}
          {meta && <p className="mt-4 text-sm text-slate-600">{meta}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
