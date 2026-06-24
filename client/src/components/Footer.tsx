import { useState } from "react";
import { Link } from "wouter";
import { Linkedin, Mail, Phone, MapPin, ArrowRight, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { brand } from "@config/brand";
import { navigation } from "@config/navigation";
import { footerContent } from "@config/content/footer";
import { useSiteContent } from "@/hooks/useSiteContent";
import { apiRequest } from "@/lib/queryClient";

export default function Footer() {
  const footer = useSiteContent("footer", footerContent);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await apiRequest("POST", "/api/newsletter", { email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <footer className="border-t border-slate-200 bg-[#f7f9fc]">
      <div className="container-site px-5 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <img src={brand.logo.main} alt={brand.name} className="h-8 w-auto object-contain" />
            </Link>
            <p className="font-heading text-sm font-semibold text-navy/70">{brand.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">{footer.description}</p>

            <div className="mt-6 space-y-3">
              <a href={`mailto:${brand.contact.email}`} className="group flex items-center gap-2.5 text-sm text-slate-500 transition-colors hover:text-cyan-700">
                <span className="chip-icon !h-8 !w-8 !rounded-lg"><Mail className="h-3.5 w-3.5" /></span>
                {brand.contact.email}
              </a>
              <a href={`tel:${brand.contact.phone.replace(/\s|\(|\)|-/g, "")}`} className="group flex items-center gap-2.5 text-sm text-slate-500 transition-colors hover:text-cyan-700">
                <span className="chip-icon !h-8 !w-8 !rounded-lg"><Phone className="h-3.5 w-3.5" /></span>
                {brand.contact.phone}
              </a>
              <span className="flex items-center gap-2.5 text-sm text-slate-500">
                <span className="chip-icon !h-8 !w-8 !rounded-lg"><MapPin className="h-3.5 w-3.5" /></span>
                {brand.contact.location}
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
              {navigation.footerNav.serviciosLabel}
            </h3>
            <ul className="space-y-3.5">
              {navigation.footerNav.servicios.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}><span className="text-sm text-slate-500 transition-colors hover:text-navy">{item.label}</span></Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
              {navigation.footerNav.empresaLabel}
            </h3>
            <ul className="space-y-3.5">
              {navigation.footerNav.empresa.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}><span className="text-sm text-slate-500 transition-colors hover:text-navy">{item.label}</span></Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
              {footer.newsletter.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-500">{footer.newsletter.description}</p>
            {status === "success" ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                {footer.newsletter.successMessage}
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-2.5">
                {status === "error" && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-500">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {footer.newsletter.errorMessage}
                  </div>
                )}
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={footer.newsletter.placeholder} required
                  className="input-light text-sm"
                />
                <button type="submit" disabled={status === "loading"} className="btn-navy justify-center text-sm disabled:opacity-60">
                  {status === "loading" ? footer.newsletter.loadingLabel : footer.newsletter.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="my-10 h-px bg-slate-200" />

        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <p className="text-xs text-slate-400">{footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {footer.certifications.map((cert) => (
              <span key={cert} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-400">{cert}</span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {navigation.footerNav.legal.map((item) => (
              <Link key={item.href} href={item.href}><span className="text-xs text-slate-400 transition-colors hover:text-cyan-700">{item.label}</span></Link>
            ))}
            {brand.social.linkedin && (
              <a href={brand.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-colors hover:text-cyan-700" aria-label="LinkedIn">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {/* Discreet backend / admin access */}
            <Link href="/admin/login">
              <span className="cursor-pointer text-slate-300 transition-colors hover:text-cyan-700" aria-label="Acceso administrador" title="Acceso administrador">
                <Lock className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
