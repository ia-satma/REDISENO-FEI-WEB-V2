import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clapperboard } from "lucide-react";
import { fadeUp, inViewProps } from "@/lib/motion";
import SectionHead from "@/components/ui/SectionHead";

const VIDEO_ID = "1175636671";
const THUMB =
  "https://i.vimeocdn.com/video/2136544755-1190eb97da84b59ec1fbeab8043f32cf5c991d1dfe838a20d20201494f22b1f7-d_1280?region=us";

export default function VideoSection() {
  const [play, setPlay] = useState(false);

  return (
    <section className="section-pad bg-[#f7f9fc]">
      <div className="container-site">
        <SectionHead
          eyebrow="FEI en video"
          eyebrowIcon={Clapperboard}
          title="Así blindamos tu evidencia fiscal"
          subtitle="En menos de dos minutos, descubre cómo construimos el expediente que protege tus operaciones ante el SAT."
        />

        <motion.div {...inViewProps} variants={fadeUp} className="mx-auto mt-12 max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-navy-dark shadow-[0_20px_50px_-20px_rgba(16,24,40,0.25)]">
            {play ? (
              <iframe
                src={`https://player.vimeo.com/video/${VIDEO_ID}?app_id=122963&autoplay=1&title=0&byline=0&portrait=0`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                title="FEI - VIDEO"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlay(true)}
                className="group absolute inset-0 h-full w-full"
                aria-label="Reproducir video de FEI"
              >
                <img
                  src={THUMB}
                  alt="Video de FEI Consultores"
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-navy-dark/10 to-transparent transition-colors duration-300 group-hover:from-navy-dark/50" />
                <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cyan text-navy-dark shadow-[0_8px_30px_rgba(76,201,240,0.5)] transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-8 w-8 translate-x-0.5 fill-current" />
                </span>
                <span className="absolute bottom-5 left-6 font-heading text-sm font-semibold text-white/90">
                  FEI · Infraestructura de Evidencia Fiscal
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
