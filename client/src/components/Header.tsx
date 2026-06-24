import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight, ChevronDown, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "@config/brand";
import { navigation } from "@config/navigation";
import { getIcon } from "@/lib/icons";
import { scrollToTop } from "@/hooks/useSmoothScroll";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

export default function Header() {
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 24);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-slate-200/80 bg-white/85 shadow-[0_1px_24px_rgba(16,24,40,0.06)] backdrop-blur-xl"
          : "border-b border-transparent bg-white/0",
      )}
    >
      <div className="container-site flex h-[74px] items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => {
            setOpen(false);
            // Already home → smoothly scroll back up to the hero. From another
            // route the Link navigates to "/" and App resets scroll to the top.
            if (location === "/") scrollToTop(false);
          }}
          className="group flex items-center gap-3"
        >
          <img src={asset(brand.logo.main)} alt={brand.name} className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
        </Link>

        {/* Desktop nav with dropdowns (full row only ≥xl; below that → hamburger) */}
        <nav className="hidden items-center gap-1 xl:flex">
          {/* "Inicio" appears only when you're not already on the home page. */}
          {location !== "/" && (
            <Link href="/">
              <span className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-200 hover:text-navy">
                <Home className="h-4 w-4" />
                Inicio
              </span>
            </Link>
          )}
          {navigation.mainNav.map((item) =>
            "items" in item ? (
              <div key={item.label} className="group relative">
                <button className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-[14px] font-medium text-slate-600 transition-colors duration-200 hover:text-navy">
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(16,24,40,0.12)]">
                    {item.items.map((sub) => {
                      const Icon = getIcon(sub.icon);
                      return (
                        <Link key={sub.href} href={sub.href}>
                          <span className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-slate-50">
                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan-700 ring-1 ring-cyan/15 transition-colors group-hover/item:bg-cyan/20">
                              <Icon className="h-5 w-5" strokeWidth={1.7} />
                            </span>
                            <span>
                              <span className="block font-heading text-sm font-semibold text-navy">{sub.label}</span>
                              <span className="mt-0.5 block text-xs text-slate-400">{sub.desc}</span>
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-[14px] font-medium transition-colors duration-200",
                    location === item.href ? "text-navy" : "text-slate-600 hover:text-navy",
                  )}
                >
                  {item.label}
                  {location === item.href && <span className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-cyan" />}
                </span>
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <Link href={navigation.access.href}>
            <span className="text-[14px] font-medium text-slate-600 transition-colors hover:text-navy">{navigation.access.label}</span>
          </Link>
          <span aria-hidden="true" className="h-5 w-px bg-slate-200" />
          <Link href={navigation.cta.href}>
            <button className="btn-cyan whitespace-nowrap px-5 py-2.5 text-[14px]">
              {navigation.cta.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-navy transition-all duration-200 hover:bg-slate-100 xl:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[74px] z-40 overflow-y-auto bg-white xl:hidden"
          >
            <div className="px-6 py-8">
              <nav className="flex flex-col gap-6">
                {location !== "/" && (
                  <Link href="/" onClick={() => setOpen(false)}>
                    <span className="flex items-center gap-2 px-1 text-base font-semibold text-navy">
                      <Home className="h-4 w-4 text-cyan-700" />
                      Inicio
                    </span>
                  </Link>
                )}
                {navigation.mainNav.map((item) =>
                  "items" in item ? (
                    <div key={item.label}>
                      <p className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">{item.label}</p>
                      <div className="flex flex-col">
                        {item.items.map((sub) => {
                          const Icon = getIcon(sub.icon);
                          return (
                            <Link key={sub.href} href={sub.href} onClick={() => setOpen(false)}>
                              <span className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium text-navy hover:bg-slate-50">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 text-cyan-700"><Icon className="h-4 w-4" /></span>
                                {sub.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                      <span className="block px-1 text-base font-semibold text-navy">{item.label}</span>
                    </Link>
                  ),
                )}
              </nav>
              <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6">
                <Link href={navigation.access.href} onClick={() => setOpen(false)}>
                  <span className="block text-center text-base font-medium text-slate-600">{navigation.access.label}</span>
                </Link>
                <Link href={navigation.cta.href} onClick={() => setOpen(false)}>
                  <button className="btn-cyan w-full">{navigation.cta.label}<ArrowRight className="h-4 w-4" /></button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
