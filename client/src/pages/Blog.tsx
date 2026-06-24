import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, ArrowRight, Tag, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import PageHero from "@/components/ui/PageHero";
import { scaleIn, staggerContainer, inViewProps } from "@/lib/motion";
import { seo } from "@config/seo";
import type { BlogPost } from "@shared/schema";

const DEFAULT_CATEGORY = "Materialidad Fiscal";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({ queryKey: ["/api/blog/posts"] });

  return (
    <div className="site-light">
      <SEOHead title={seo.pages.blog.title} description={seo.pages.blog.description} />

      <PageHero eyebrow="Blog" eyebrowIcon={Newspaper} title={seo.pages.blog.title} subtitle={seo.pages.blog.description} />

      <section className="section-pad bg-white">
        <div className="container-site">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => <div key={n} className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />)}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="mx-auto max-w-md py-20 text-center">
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan/10 text-cyan-700"><Tag className="h-8 w-8" /></span>
              <h2 className="mb-3 font-heading text-xl font-bold text-navy">Artículos próximamente</h2>
              <p className="text-slate-500">Nuestros especialistas están trabajando en contenido sobre materialidad fiscal.</p>
            </div>
          ) : (
            <motion.div {...inViewProps} variants={staggerContainer(0.08)} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <motion.div key={post.id} variants={scaleIn}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="card-l card-l-hover card-lift group flex h-full cursor-pointer flex-col overflow-hidden !p-0">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} loading="lazy" className="h-48 w-full object-cover" />
                      ) : (
                        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-navy to-navy-dark">
                          <div className="bg-grid-fine absolute inset-0 opacity-30" />
                          <span className="absolute bottom-4 right-4 font-heading text-5xl font-extrabold text-cyan/20">FEI</span>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-cyan/10 px-2.5 py-1 text-xs font-semibold text-cyan-700"><Tag className="h-2.5 w-2.5" />{DEFAULT_CATEGORY}</span>
                        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-cyan/60" />
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }) : "Borrador"}
                        </div>
                        <h2 className="mb-2.5 font-heading text-lg font-bold text-navy transition-colors group-hover:text-cyan-700">{post.title}</h2>
                        {post.excerpt && <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">{post.excerpt}</p>}
                        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700">Leer más <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
