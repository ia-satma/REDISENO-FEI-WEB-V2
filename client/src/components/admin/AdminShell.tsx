import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, Newspaper, Bot, GitBranch, Users, ArrowUpRight } from "lucide-react";
import { brand } from "@config/brand";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Contenido", href: "/admin/content", icon: FileText },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Agentes", href: "/admin/agents", icon: Bot },
  { label: "Pipeline", href: "/admin/pipeline", icon: GitBranch },
  { label: "Clientes", href: "/admin/clients", icon: Users },
];

interface Props {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** Shared light (Payana-style) chrome for every admin page: top bar + section nav. */
export default function AdminShell({ title, subtitle, actions, children }: Props) {
  const [loc] = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-navy">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <img src={brand.logo.main} alt={brand.name} className="h-8 w-auto object-contain" />
              <span className="hidden rounded-md bg-navy/[0.06] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-navy/55 sm:inline">
                Admin
              </span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map(({ label, href, icon: Icon }) => {
                const active = href === "/admin" ? loc === "/admin" : loc.startsWith(href);
                return (
                  <Link key={href} href={href}>
                    <span
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                        active ? "bg-cyan/10 text-cyan-700" : "text-slate-500 hover:text-navy",
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <Link href="/">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-navy">
              Volver al sitio
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
        {/* Mobile section nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = href === "/admin" ? loc === "/admin" : loc.startsWith(href);
            return (
              <Link key={href} href={href}>
                <span
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                    active ? "bg-cyan/10 text-cyan-700" : "text-slate-500",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {(title || actions) && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {title && <h1 className="font-heading text-2xl font-bold text-navy md:text-[1.7rem]">{title}</h1>}
              {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
