/**
 * Shared motion config — the "Payana feel" applied to FEI.
 * Centralizes durations, easings and reveal variants so every section
 * animates with the same rhythm. Respect prefers-reduced-motion at call sites
 * (Framer Motion also honors it globally via MotionConfig if desired).
 */
import type { Variants } from "framer-motion";

// Premium ease-out (expo-ish) — matches the smooth, decisive reveals of Payana.
// Typed as a cubic-bezier tuple (framer-motion v11 accepts this for `ease`).
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DUR = {
  fast: 0.3,
  base: 0.55,
  slow: 0.8,
} as const;

export const STAGGER = 0.1;

/** Standard "rise + fade" reveal — Payana-grade pronounced offset. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/** Larger rise for hero/section-lead elements. */
export const fadeUpLg: Variants = {
  hidden: { opacity: 0, y: 64 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};

/** Scale-in for cards / visuals. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 28 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/** Container that staggers its children's reveals. */
export const staggerContainer = (stagger: number = STAGGER, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Convenience props for a one-shot, in-view reveal. */
export const inViewProps = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-80px" },
};
