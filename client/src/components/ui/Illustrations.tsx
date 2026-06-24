/**
 * Line-art illustrations in Payana's outline style (thin mono stroke + cyan accents),
 * branded for FEI. Used in feature cards. viewBox ~ 200x150.
 */
const NAVY = "#1A2332";
const CYAN = "#4CC9F0";

const base = {
  fill: "none",
  stroke: NAVY,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IlloMateria({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} role="img" aria-label="Diagnóstico de materialidad">
      {/* document */}
      <path {...base} d="M58 26h54l20 20v78H58z" />
      <path {...base} d="M112 26v20h20" />
      {/* text lines */}
      <path {...base} d="M70 64h40M70 76h50M70 88h32" />
      {/* checklist ticks */}
      <circle cx="70" cy="104" r="4" fill={CYAN} stroke="none" />
      <path d="M67.6 104l1.8 1.8 3-3.2" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path {...base} d="M82 104h28" />
      {/* magnifier */}
      <circle {...base} cx="128" cy="100" r="20" />
      <path {...base} d="M143 115l14 14" />
      <path {...base} stroke={CYAN} d="M120 100a8 8 0 0 1 8-8" />
    </svg>
  );
}

export function IlloMotor({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} role="img" aria-label="Motor documental automatizado">
      {/* central engine */}
      <rect {...base} x="78" y="55" width="44" height="40" rx="8" />
      <circle {...base} stroke={CYAN} cx="100" cy="75" r="9" />
      <path {...base} stroke={CYAN} d="M100 70v10M95 75h10" />
      {/* source nodes */}
      <rect {...base} x="22" y="34" width="34" height="24" rx="5" />
      <rect {...base} x="22" y="92" width="34" height="24" rx="5" />
      {/* output node */}
      <rect {...base} x="144" y="63" width="34" height="24" rx="5" />
      {/* connectors */}
      <path {...base} strokeDasharray="3 4" d="M56 46h12a8 8 0 0 1 8 8v8M56 104h12a8 8 0 0 0 8-8v-8M122 75h22" />
      <circle cx="144" cy="75" r="2.5" fill={CYAN} stroke="none" />
      <circle cx="76" cy="62" r="2.5" fill={CYAN} stroke="none" />
    </svg>
  );
}

export function IlloBlindaje({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} role="img" aria-label="Expediente blindado">
      {/* stacked folder */}
      <path {...base} d="M50 50h28l8 10h64v62H50z" />
      <path {...base} d="M58 60v54M150 78H58" />
      <path {...base} stroke={CYAN} d="M70 92h44M70 102h30" />
      {/* shield badge */}
      <path {...base} d="M132 30l20 7v15c0 13-9 21-20 25-11-4-20-12-20-25V37z" />
      <path stroke={CYAN} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M124 54l6 6 12-13" />
    </svg>
  );
}

/* ── Phase illustrations (Metodología — 4 fases) ─────────────────────────── */
const ph = { ...base, strokeWidth: 1.5 };

export function IlloContrato({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 90" className={className} role="img" aria-label="Contratación">
      <path {...ph} d="M30 14h34l14 14v48H30z" />
      <path {...ph} d="M64 14v14h14" />
      <path {...ph} d="M40 40h28M40 50h28" />
      {/* signature */}
      <path {...ph} stroke={CYAN} d="M40 62c4-6 7 4 11-1s6-5 9 0 7 1 10-2" />
    </svg>
  );
}

export function IlloEjecucion({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 90" className={className} role="img" aria-label="Ejecución">
      <rect {...ph} x="26" y="16" width="58" height="58" rx="6" />
      <path {...ph} d="M36 60V44M50 60V34M64 60V40M78 60V30" />
      <path {...ph} stroke={CYAN} d="M34 30l14-6 14 8 14-12" />
      <circle cx="76" cy="20" r="2.5" fill={CYAN} stroke="none" />
    </svg>
  );
}

export function IlloEntrega({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 90" className={className} role="img" aria-label="Entrega">
      <path {...ph} d="M24 34l31-14 31 14-31 14z" />
      <path {...ph} d="M24 34v26l31 14 31-14V34M55 48v26" />
      <circle {...ph} stroke={CYAN} cx="55" cy="40" r="9" />
      <path stroke={CYAN} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M51 40l3 3 5-6" />
    </svg>
  );
}

export function IlloCierre({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 90" className={className} role="img" aria-label="Cierre / blindaje">
      <path {...ph} d="M55 14l24 8v16c0 16-10 26-24 32-14-6-24-16-24-32V22z" />
      <rect {...ph} stroke={CYAN} x="45" y="42" width="20" height="16" rx="3" />
      <path {...ph} stroke={CYAN} d="M49 42v-5a6 6 0 0 1 12 0v5" />
    </svg>
  );
}

/* Chain-of-custody node icon (security section) */
export function IlloCustodia({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 90" className={className} role="img" aria-label="Cadena de custodia">
      <rect {...ph} x="34" y="20" width="42" height="50" rx="5" />
      <path {...ph} d="M44 34h22M44 44h22M44 54h14" />
      <circle {...ph} stroke={CYAN} cx="76" cy="60" r="11" />
      <path stroke={CYAN} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M71 60l3.5 3.5 6.5-7" />
    </svg>
  );
}
