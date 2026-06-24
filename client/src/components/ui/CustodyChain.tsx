import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Inbox, Layers, CheckCircle2, ShieldCheck, FileCheck2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAIN = [
  { icon: Inbox, label: "Recepción", sub: "Documentos capturados" },
  { icon: Layers, label: "Versionado", sub: "Fechado y trazable" },
  { icon: CheckCircle2, label: "Validación", sub: "Consistencia cruzada" },
  { icon: ShieldCheck, label: "Integración", sub: "15 elementos críticos" },
  { icon: FileCheck2, label: "Preparación", sub: "Preparado para revisión" },
];

/**
 * Animated chain-of-custody: nodes light up in sequence, hold fully lit ~10s,
 * then repeat. `light` renders it for light backgrounds (default = dark band).
 */
export default function CustodyChain({ light = false }: { light?: boolean }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? CHAIN.length : 0);

  useEffect(() => {
    if (reduce) return;
    let id: ReturnType<typeof setTimeout>;
    const STEP_MS = 900;
    const HOLD_MS = 10000;
    const schedule = (cur: number) => {
      const delay = cur >= CHAIN.length ? HOLD_MS : STEP_MS;
      id = setTimeout(() => {
        const next = cur >= CHAIN.length ? 0 : cur + 1;
        setActive(next);
        schedule(next);
      }, delay);
    };
    schedule(0);
    return () => clearTimeout(id);
  }, [reduce]);

  const trackBase = light ? "bg-slate-200" : "bg-white/10";
  return (
    <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      {CHAIN.map((step, i) => {
        const on = i < active;
        const Icon = step.icon;
        return (
          <div key={step.label} className="relative flex flex-1 flex-col items-center text-center">
            {i < CHAIN.length - 1 && (
              <div className={cn("absolute left-[calc(50%+28px)] top-7 hidden h-0.5 w-[calc(100%-56px)] -translate-y-1/2 overflow-hidden rounded-full md:block", trackBase)}>
                <div
                  className="h-full rounded-full bg-cyan transition-all duration-700 ease-out"
                  style={{ width: active > i + 1 ? "100%" : "0%" }}
                />
              </div>
            )}
            <span
              className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500",
                on
                  ? light
                    ? "border-cyan/50 bg-cyan/10 text-cyan-700 shadow-[0_0_22px_rgba(76,201,240,0.30)]"
                    : "border-cyan/60 bg-cyan/15 text-cyan shadow-[0_0_26px_rgba(76,201,240,0.35)]"
                  : light
                    ? "border-slate-200 bg-slate-50 text-slate-400"
                    : "border-white/10 bg-white/[0.03] text-gray-500",
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={1.6} />
              <span
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan text-white transition-all duration-300",
                  on ? "scale-100 opacity-100" : "scale-0 opacity-0",
                )}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            </span>
            <p
              className={cn(
                "mt-4 font-heading text-sm font-bold transition-colors duration-500",
                on ? (light ? "text-navy" : "text-white") : light ? "text-slate-400" : "text-gray-400",
              )}
            >
              {step.label}
            </p>
            <p className={cn("mt-0.5 text-xs", light ? "text-slate-500" : "text-gray-500")}>{step.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
