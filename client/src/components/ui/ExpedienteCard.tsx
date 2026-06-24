import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Check, FolderClosed, FileCheck2 } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

const ELEMENTS = [
  "Contrato de servicios",
  "Minutas y reportes de avance",
  "Entregables técnicos",
  "Pólizas y conciliación fiscal",
  "Teoría del caso y defensa",
];

/**
 * Hero visual — an animated "Expediente de Materialidad" being assembled and
 * shielded. FEI's signature equivalent to Payana's hero integration diagram:
 * communicates "documental evidence, organized and audit-proof".
 */
export default function ExpedienteCard() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* ambient glow behind the card */}
      <div className="gradient-orb absolute -inset-6 -z-10 opacity-60" />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
        className="glass-surface animated-border-glow relative overflow-hidden rounded-2xl p-6 shadow-card-dark-lg"
      >
        {/* floating wrapper */}
        <motion.div
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="icon-box-lg shrink-0">
                <FolderClosed className="h-6 w-6 text-cyan" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-white">
                  Expediente de Materialidad
                </p>
                <p className="text-xs text-gray-500">Operación · 9 carpetas</p>
              </div>
            </div>
            <span className="badge-cyan shrink-0">
              <ShieldCheck className="h-3.5 w-3.5" />
              Blindado
            </span>
          </div>

          <div className="my-5 section-divider-fade" />

          {/* checklist */}
          <ul className="space-y-2.5">
            {ELEMENTS.map((el, i) => (
              <motion.li
                key={el}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.5 + i * 0.12 }}
                className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/15 ring-1 ring-cyan/30">
                  <Check className="h-3 w-3 text-cyan" />
                </span>
                <span className="text-sm text-gray-300">{el}</span>
                <FileCheck2 className="ml-auto h-4 w-4 text-gray-600" />
              </motion.li>
            ))}
          </ul>

          {/* footer stats */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-cyan/15 bg-cyan/[0.04] px-4 py-3 text-center">
              <p className="font-heading text-2xl font-extrabold text-cyan text-glow">
                15/15
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">Elementos SAT</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-center">
              <p className="font-heading text-2xl font-extrabold text-white">+50</p>
              <p className="mt-0.5 text-[11px] text-gray-500">Documentos</p>
            </div>
          </div>
        </motion.div>

        {/* scanning line */}
        {!reduce && (
          <motion.div
            aria-hidden
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "1200%", opacity: [0, 0.6, 0] }}
            transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.5, delay: 1.4 }}
            className="pointer-events-none absolute inset-x-6 top-24 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent"
          />
        )}
      </motion.div>
    </div>
  );
}
