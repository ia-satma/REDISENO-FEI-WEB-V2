import { motion } from "framer-motion";
import { fadeUp, inViewProps } from "@/lib/motion";

/** Payana-style accent pull-quote band between sections. */
export default function BannerQuote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div {...inViewProps} variants={fadeUp} className={className}>
      <div className="relative overflow-hidden rounded-2xl bg-navy px-8 py-9 text-center sm:px-12">
        <div className="absolute inset-0 opacity-60 field-soft" />
        <p className="relative font-heading text-xl font-semibold leading-snug text-white sm:text-2xl">
          <span className="text-cyan">“</span>
          {children}
          <span className="text-cyan">”</span>
        </p>
      </div>
    </motion.div>
  );
}
