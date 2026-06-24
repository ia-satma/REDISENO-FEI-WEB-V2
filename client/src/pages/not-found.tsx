import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, MessageCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  return (
    <div className="site-light relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-[#f7f9fc] px-5 text-center">
      <SEOHead title="Página no encontrada" description="La página que buscas no existe o fue movida." />
      <div className="field-soft pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <span className="select-none font-heading text-[120px] font-extrabold leading-none text-navy/[0.06] md:text-[200px]">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-6xl font-extrabold text-cyan-700 md:text-7xl">404</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="relative mt-2"
      >
        <h1 className="display-md">Página no encontrada</h1>
        <p className="mx-auto mt-4 max-w-md text-slate-500">
          La página que buscas no existe o fue movida. Verifica la URL o regresa al inicio.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <button className="btn-cyan px-6 py-3"><Home className="h-4 w-4" />Ir al inicio</button>
          </Link>
          <Link href="/contacto">
            <button className="btn-ghost-l px-6 py-3"><MessageCircle className="h-4 w-4" />Contacto</button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
