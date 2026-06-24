import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import { Cookie } from "lucide-react";

const KEY = "fei_cookie_consent";

/** Cookie consent banner — accept / reject, links to the cookie policy.
 *  Remembers the choice in localStorage so it shows only once. */
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* localStorage unavailable — skip banner */
    }
  }, []);

  function choose(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Consentimiento de cookies"
          className="fixed bottom-6 left-6 z-50 w-[min(23rem,calc(100vw-7rem))] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(16,24,40,0.16)]"
        >
          <div className="flex items-start gap-3">
            <span className="chip-icon shrink-0"><Cookie className="h-5 w-5" /></span>
            <div>
              <p className="font-heading text-sm font-bold text-navy">Usamos cookies</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Utilizamos cookies para que el sitio funcione y para entender cómo se usa. Consulta nuestra{" "}
                <Link href="/cookies">
                  <span className="cursor-pointer font-medium text-cyan-700 underline underline-offset-2">Política de Cookies</span>
                </Link>
                .
              </p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => choose("accepted")} className="btn-navy px-4 py-2 text-xs">Aceptar</button>
                <button onClick={() => choose("rejected")} className="btn-ghost-l px-4 py-2 text-xs">Rechazar</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
