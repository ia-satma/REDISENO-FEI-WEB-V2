import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import type { Options } from "@splidejs/splide";
import { useReducedMotion } from "framer-motion";
import "@splidejs/react-splide/css";

interface MarqueeProps {
  speed?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Continuous logo/trust marquee — Splide loop + AutoScroll (same as Payana).
 * Renders a static, wrapped row under prefers-reduced-motion.
 */
export function Marquee({ speed = 0.6, className = "", children }: MarqueeProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-4 ${className}`}>{children}</div>;
  }

  const options: Options = {
    type: "loop",
    drag: "free",
    arrows: false,
    pagination: false,
    perPage: 5,
    gap: "3rem",
    autoWidth: true,
    focus: "center",
    autoScroll: { speed, pauseOnHover: true, pauseOnFocus: false },
    breakpoints: {
      768: { perPage: 3 },
      480: { perPage: 2 },
    },
  };

  return (
    <Splide options={options} extensions={{ AutoScroll }} aria-hidden className={className}>
      {Array.isArray(children)
        ? children.map((c, i) => <SplideSlide key={i}>{c}</SplideSlide>)
        : <SplideSlide>{children}</SplideSlide>}
    </Splide>
  );
}
