import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import type { Options } from "@splidejs/splide";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@splidejs/react-splide/css";

interface SliderProps {
  options?: Options;
  arrows?: boolean;
  className?: string;
  label?: string;
  children: React.ReactNode;
}

/**
 * Payana-style content slider (Splide). Pagination/arrows styled in index.css.
 * Autoplay is disabled under prefers-reduced-motion.
 */
export function Slider({ options, arrows = false, className = "", label, children }: SliderProps) {
  const reduce = useReducedMotion();
  const opts: Options = {
    perMove: 1,
    gap: "1.5rem",
    pagination: true,
    arrows,
    speed: 600,
    ...options,
  };
  if (reduce) opts.autoplay = false;

  return (
    <Splide
      hasTrack={false}
      options={opts}
      aria-label={label}
      className={className}
    >
      <SplideTrack>{children}</SplideTrack>
      {arrows && (
        <div className="splide__arrows mt-8 flex justify-center gap-3">
          <button className="splide__arrow splide__arrow--prev !relative !left-0 !top-0 !translate-y-0 rounded-full" aria-label="Anterior">
            <ChevronLeft />
          </button>
          <button className="splide__arrow splide__arrow--next !relative !right-0 !top-0 !translate-y-0 rounded-full" aria-label="Siguiente">
            <ChevronRight />
          </button>
        </div>
      )}
    </Splide>
  );
}

export { SplideSlide as Slide };
