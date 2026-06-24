import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

interface RotatingWordProps {
  words: string[];
  interval?: number;
  className?: string;
}

/**
 * Payana-style hero word that cycles through a list with a rise/fade swap.
 * Falls back to the first word (static) under prefers-reduced-motion.
 */
export default function RotatingWord({
  words,
  interval = 2200,
  className = "",
}: RotatingWordProps) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || words.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [reduce, words.length, interval]);

  // Reserve width for the longest word so the line doesn't reflow.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      className={`relative inline-grid align-bottom ${className}`}
      style={{ minHeight: "1.05em" }}
    >
      {/* invisible sizer */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {longest}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          className="text-gradient-cyan col-start-1 row-start-1 whitespace-nowrap"
          initial={reduce ? false : { opacity: 0, y: "0.4em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: "-0.4em" }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
