import { CalendarCheck } from "lucide-react";
import { brand } from "@config/brand";

const SUBJECT = encodeURIComponent("Quiero agendar una demo con FEI");
const BODY = encodeURIComponent(
  "Hola equipo FEI,\n\n" +
    "Me gustaría agendar una demo para conocer cómo blindan la evidencia fiscal de mis operaciones.\n\n" +
    "Nombre:\nEmpresa:\nTeléfono:\nMejor horario para contactarme:\n\n" +
    "Gracias.",
);

/** Floating chat-bot-style FAB that opens an email to FEI to schedule a demo. */
export default function FloatingDemoButton() {
  const href = `mailto:${brand.contact.email}?subject=${SUBJECT}&body=${BODY}`;

  return (
    <a
      href={href}
      aria-label="Agenda tu demo por correo"
      className="group fixed bottom-6 right-6 z-50 flex items-center rounded-full bg-navy p-1.5 shadow-[0_12px_34px_rgba(16,24,40,0.30)] transition-all duration-300 hover:pr-5"
    >
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-cyan text-navy-dark">
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan/30 [animation-duration:2.6s] motion-reduce:hidden" />
        <CalendarCheck className="relative h-6 w-6" />
      </span>
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap font-heading text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[170px] group-hover:opacity-100">
        Agenda tu demo
      </span>
    </a>
  );
}
