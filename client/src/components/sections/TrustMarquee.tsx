import { BadgeCheck } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";

const ITEMS = [
  "LISR Arts. 25 y 27",
  "CFF Arts. 29, 29-A y 30",
  "Criterios de materialidad fiscal",
  "Expedientes preparados para revisión",
  "15/15 elementos críticos cubiertos",
  "+50 documentos por operación",
  "9 carpetas estructuradas",
  "Defensa preventiva documentada",
];

export default function TrustMarquee() {
  return (
    <section className="relative z-0 bg-white py-9">
      <p className="container-site mb-6 px-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
        Construido sobre el marco fiscal mexicano
      </p>
      <Marquee speed={0.5}>
        {ITEMS.map((it) => (
          <span key={it} className="inline-flex items-center gap-2 whitespace-nowrap font-heading text-base font-semibold text-navy/70">
            <BadgeCheck className="h-4 w-4 text-cyan-600" />
            {it}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
