import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { fadeUp, inViewProps } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}

export default function SectionHead({ eyebrow, eyebrowIcon: Icon, title, subtitle, align = "center", dark = false }: Props) {
  return (
    <motion.div
      {...inViewProps}
      variants={fadeUp}
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      {eyebrow && (
        <span className="eyebrow">
          {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />}
          {eyebrow}
        </span>
      )}
      <h2 className={dark ? "display-md mt-2 text-white" : "display-md mt-2"}>{title}</h2>
      {subtitle && (
        <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-slate-300" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
