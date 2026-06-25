import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, CheckCircle2, AlertCircle, MessageSquareText } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import PageHero from "@/components/ui/PageHero";
import { fadeUp, inViewProps } from "@/lib/motion";
import { brand } from "@config/brand";
import { seo } from "@config/seo";
import { apiRequest } from "@/lib/queryClient";

export default function Contacto() {
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<"idle" | "success" | "error">("idle");
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      await apiRequest("POST", "/api/contact", data);
      setFormState("success");
      setConsent(false);
      form.reset();
    } catch {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 5000);
    } finally {
      setSubmitting(false);
    }
  }

  const contactInfo = [
    { icon: Mail, label: "Correo electrónico", value: brand.contact.email, href: `mailto:${brand.contact.email}` },
    { icon: Phone, label: "Teléfono", value: brand.contact.phone, href: `tel:${brand.contact.phone.replace(/\s|\(|\)|-/g, "")}` },
    { icon: MapPin, label: "Ubicación", value: brand.contact.location, href: undefined },
  ];

  return (
    <div className="site-light">
      <SEOHead title={seo.pages.contacto.title} description={seo.pages.contacto.description} />

      <PageHero eyebrow="Contacto" eyebrowIcon={Mail} title={seo.pages.contacto.title} subtitle={seo.pages.contacto.description} />

      <section className="section-pad relative overflow-hidden bg-[#f7f9fc]">
        <div className="field-soft pointer-events-none absolute inset-0" />
        <MessageSquareText className="pointer-events-none absolute -left-12 top-12 h-56 w-56 text-cyan/[0.05]" strokeWidth={1} />
        <Mail className="pointer-events-none absolute -right-14 bottom-16 h-56 w-56 text-cyan/[0.05]" strokeWidth={1} />
        <div className="container-site relative">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
            <motion.div {...inViewProps} variants={fadeUp} className="space-y-4 lg:col-span-2">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="card-l flex items-start gap-4 p-5">
                  <span className="chip-icon"><Icon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{label}</p>
                    {href ? (
                      <a href={href} className="mt-1.5 block text-sm font-medium text-navy transition-colors hover:text-cyan-700">{value}</a>
                    ) : (
                      <p className="mt-1.5 text-sm font-medium text-navy">{value}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <iframe
                  title="Ubicación de FEI — Monterrey, N.L., México"
                  src="https://maps.google.com/maps?q=Monterrey%2C%20Nuevo%20Le%C3%B3n%2C%20M%C3%A9xico&z=11&output=embed"
                  className="h-52 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-navy/70">
                  <MapPin className="h-3.5 w-3.5 text-cyan-700" />
                  {brand.contact.location}
                </div>
              </div>
            </motion.div>

            <motion.div {...inViewProps} variants={fadeUp} className="lg:col-span-3">
              {formState === "success" ? (
                <div className="card-l flex h-full min-h-[400px] flex-col items-center justify-center p-12 text-center">
                  <CheckCircle2 className="mb-5 h-16 w-16 text-emerald-500" />
                  <h3 className="font-heading text-2xl font-bold text-navy">¡Mensaje enviado!</h3>
                  <p className="mt-3 text-slate-600">Nos pondremos en contacto contigo pronto.</p>
                  <button onClick={() => setFormState("idle")} className="btn-ghost-l mt-8">← Enviar otro mensaje</button>
                </div>
              ) : (
                <div className="card-l p-8 md:p-10">
                  {formState === "error" && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />No se pudo enviar el mensaje. Intenta de nuevo.
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-navy">Nombre completo <span className="text-cyan-700">*</span></label>
                        <input id="name" name="name" required placeholder="Tu nombre" className="input-light" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-navy">Correo electrónico <span className="text-cyan-700">*</span></label>
                        <input id="email" name="email" type="email" required placeholder="tu@empresa.com" className="input-light" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-navy">Teléfono</label>
                        <input id="phone" name="phone" placeholder="(55) 1234-5678" className="input-light" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="company" className="block text-sm font-medium text-navy">Empresa</label>
                        <input id="company" name="company" placeholder="Nombre de tu empresa" className="input-light" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-navy">Mensaje <span className="text-cyan-700">*</span></label>
                      <textarea id="message" name="message" required rows={5} placeholder="Cuéntanos sobre tu situación fiscal..." className="input-light resize-none" />
                    </div>
                    <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                      <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-cyan focus:ring-cyan/40"
                      />
                      <span>
                        Doy mi consentimiento con la política de procesamiento de datos personales tal como se describe en el{" "}
                        <Link href="/aviso-privacidad">
                          <span className="cursor-pointer font-medium text-cyan-700 underline underline-offset-2">Aviso de Privacidad</span>
                        </Link>.
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={submitting || !consent}
                      className="btn-navy w-full py-4 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      {submitting ? "Enviando..." : "Enviar mensaje"}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
