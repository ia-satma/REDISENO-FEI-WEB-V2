import { motion } from "framer-motion";
import { Link } from "wouter";
import { Lock, GitBranch, ShieldCheck, ArrowRight, Check, X, FolderTree, BadgeCheck, ScrollText, KeyRound } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import PageHero from "@/components/ui/PageHero";
import SectionHead from "@/components/ui/SectionHead";
import CustodyChain from "@/components/ui/CustodyChain";
import { getIcon } from "@/lib/icons";
import { fadeUp, scaleIn, staggerContainer, inViewProps } from "@/lib/motion";
import { seguridadContent as seguridadDefault } from "@config/content/seguridad";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function Seguridad() {
  const s = useSiteContent("seguridad", seguridadDefault);
  return (
    <div className="site-light">
      <SEOHead
        title="Seguridad y Custodia — FEI Consultores"
        description="Cómo FEI resguarda tu evidencia fiscal: cadena de custodia documental, estructura de 9 carpetas, trazabilidad, seguridad de la información y alcance claro del servicio."
      />

      <PageHero eyebrow={s.hero.eyebrow} eyebrowIcon={Lock} title={s.hero.title} subtitle={s.hero.subtitle} />

      {/* ── Cadena de custodia (animada, clara) + etapas ───────────── */}
      <section className="section-pad bg-white pt-14">
        <div className="container-site">
          <SectionHead eyebrow={s.cadena.eyebrow} eyebrowIcon={GitBranch} title={s.cadena.title} subtitle={s.cadena.subtitle} />

          <motion.div {...inViewProps} variants={fadeUp} className="mx-auto mt-12 max-w-5xl card-l card-l-lg">
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Cadena de custodia del expediente
            </p>
            <CustodyChain light />
          </motion.div>

          <motion.div {...inViewProps} variants={staggerContainer(0.1)} className="mt-8 space-y-4">
            {s.cadena.stages.map((st) => {
              const Icon = getIcon(st.icon);
              return (
                <motion.div
                  key={st.n}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="card-l card-l-hover flex flex-col gap-6 md:flex-row md:items-center md:gap-10"
                >
                  <div className="md:flex-1">
                    <div className="flex items-center gap-3">
                      <span className="chip-icon !h-11 !w-11"><Icon className="h-5 w-5" /></span>
                      <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-cyan/60">
                        Etapa {st.n}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-xl font-bold text-navy">{st.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">{st.description}</p>
                  </div>
                  <ul className="grid gap-2.5 md:w-80 md:shrink-0">
                    {st.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-navy"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-cyan-600" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Pilares ────────────────────────────────────────────────── */}
      <section className="section-pad bg-[#f7f9fc]">
        <div className="container-site">
          <SectionHead eyebrow={s.pillars.eyebrow} eyebrowIcon={ShieldCheck} title={s.pillars.title} />
          <motion.div {...inViewProps} variants={staggerContainer(0.12)} className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {s.pillars.items.map((p) => {
              const Icon = getIcon(p.icon);
              return (
                <motion.div key={p.title} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-lg card-l-hover">
                  <span className="chip-icon !h-14 !w-14"><Icon className="h-7 w-7" /></span>
                  <h3 className="mt-5 font-heading text-xl font-bold text-navy">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{p.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── 9 carpetas ─────────────────────────────────────────────── */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHead eyebrow={s.carpetas.eyebrow} eyebrowIcon={FolderTree} title={s.carpetas.title} subtitle={s.carpetas.subtitle} />
          <motion.div {...inViewProps} variants={staggerContainer(0.06)} className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.carpetas.items.map((c) => {
              const Icon = getIcon(c.icon);
              return (
                <motion.div key={c.n} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-hover flex items-start gap-4 !p-5">
                  <span className="chip-icon shrink-0"><Icon className="h-5 w-5" /></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-xs font-bold text-cyan/50">{c.n}</span>
                      <h3 className="font-heading text-sm font-bold text-navy">{c.name}</h3>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Garantías (claro) ──────────────────────────────────────── */}
      <section className="section-pad bg-[#f7f9fc]">
        <div className="container-site">
          <SectionHead eyebrow={s.garantias.eyebrow} eyebrowIcon={BadgeCheck} title={s.garantias.title} />
          <motion.div {...inViewProps} variants={staggerContainer(0.1)} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {s.garantias.items.map((g) => {
              const Icon = getIcon(g.icon);
              return (
                <motion.div key={g.title} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-hover">
                  <span className="chip-icon"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-heading text-base font-bold text-navy">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{g.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Seguridad de la información ─────────────────────────────── */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <SectionHead eyebrow={s.infoSeguridad.eyebrow} eyebrowIcon={KeyRound} title={s.infoSeguridad.title} subtitle={s.infoSeguridad.intro} />
          <motion.div {...inViewProps} variants={staggerContainer(0.08)} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {s.infoSeguridad.items.map((it) => {
              const Icon = getIcon(it.icon);
              return (
                <motion.div key={it.title} variants={scaleIn} whileHover={{ y: -4 }} className="card-l card-l-hover">
                  <span className="chip-icon"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-heading text-base font-bold text-navy">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{it.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Alcance claro del servicio (lo que hacemos / no hacemos) ── */}
      <section className="section-pad bg-[#f7f9fc]">
        <div className="container-site">
          <SectionHead eyebrow={s.alcance.eyebrow} eyebrowIcon={ScrollText} title={s.alcance.title} subtitle={s.alcance.intro} />
          <motion.div {...inViewProps} variants={staggerContainer(0.1)} className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div variants={scaleIn} className="card-l card-l-lg">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"><Check className="h-5 w-5" /></span>
                <h3 className="font-heading text-lg font-bold text-navy">{s.alcance.hacemosLabel}</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {s.alcance.hacemos.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={scaleIn} className="card-l card-l-lg">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 ring-1 ring-rose-200"><X className="h-5 w-5" /></span>
                <h3 className="font-heading text-lg font-bold text-navy">{s.alcance.noHacemosLabel}</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {s.alcance.noHacemos.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Banda navy con proof (estilo stat-band de Payana) ──────── */}
      <section className="relative overflow-hidden bg-[#050b1e] py-20">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.12]" />
        <div className="container-site relative px-5 sm:px-6 lg:px-8">
          <motion.div {...inViewProps} variants={staggerContainer(0.1)} className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {s.proof.map((pr, i) => (
              <motion.div key={i} variants={scaleIn} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
                <p className="font-heading text-4xl font-extrabold text-mint md:text-5xl">{pr.value}</p>
                <p className="mx-auto mt-3 max-w-[12rem] text-sm leading-snug text-slate-300">{pr.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Transparencia + CTA ────────────────────────────────────── */}
      <section className="section-pad bg-white">
        <div className="container-site">
          <motion.div {...inViewProps} variants={fadeUp} className="mx-auto max-w-3xl">
            <div className="card-l card-l-lg text-center">
              <span className="chip-icon mx-auto !h-14 !w-14"><ShieldCheck className="h-7 w-7" /></span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-navy">{s.transparencia.title}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-500">{s.transparencia.body}</p>
            </div>
          </motion.div>

          <motion.div {...inViewProps} variants={fadeUp} className="mt-12">
            <div className="relative overflow-hidden rounded-[2rem] bg-navy-dark px-6 py-14 text-center sm:px-12">
              <div className="bg-grid-pattern absolute inset-0 opacity-[0.12]" />
              <ShieldCheck className="pointer-events-none absolute -right-8 -top-10 h-52 w-52 text-cyan/[0.06]" strokeWidth={1} />
              <div className="relative mx-auto max-w-xl">
                <h2 className="font-heading text-2xl font-extrabold text-white md:text-3xl">{s.cta.title}</h2>
                <p className="mx-auto mt-4 text-gray-300">{s.cta.subtitle}</p>
                <Link href="/contacto"><button className="btn-cyan mx-auto mt-8">Agenda un diagnóstico<ArrowRight className="h-5 w-5" /></button></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
