import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import { EASE_OUT } from "@/lib/motion";
import { SITE } from "@config/seo";
import { brand } from "@config/brand";
import type { BlogPost as BlogPostType } from "@shared/schema";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog/posts/${params.slug}`],
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f9fc]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="site-light flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-heading text-3xl font-bold text-navy">Artículo no encontrado</h1>
        <p className="mt-4 text-slate-600">El artículo que buscas no existe o fue removido.</p>
        <Link href="/blog"><button className="btn-ghost-l mt-6"><ArrowLeft className="h-4 w-4" />Volver al Blog</button></Link>
      </div>
    );
  }

  const articleImg = post.coverImage
    ? (post.coverImage.startsWith("http") ? post.coverImage : SITE + post.coverImage)
    : `${SITE}/og-image.jpg`;
  const publishedIso = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: articleImg,
    datePublished: publishedIso,
    dateModified: publishedIso,
    mainEntityOfPage: `${SITE}/blog/${params.slug}`,
    inLanguage: "es-MX",
    author: { "@type": "Organization", name: brand.name, url: `${SITE}/` },
    publisher: {
      "@type": "Organization",
      name: brand.name,
      logo: { "@type": "ImageObject", url: `${SITE}${brand.logo.main}` },
    },
  };

  return (
    <div className="site-light">
      <SEOHead
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt || undefined}
        image={post.coverImage || undefined}
        type="article"
        publishedTime={publishedIso}
        modifiedTime={publishedIso}
      />
      <JsonLd id="article" data={articleSchema} />

      <section className="field-soft relative overflow-hidden bg-[#f7f9fc]">
        <div className="bg-grid-fine absolute inset-0 opacity-[0.4]" />
        <div className="relative mx-auto w-full max-w-3xl px-5 pb-12 pt-16 sm:px-6 md:pt-20 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE_OUT }}>
            <Link href="/blog"><span className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-700 transition-colors hover:text-navy"><ArrowLeft className="h-4 w-4" />Volver al Blog</span></Link>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/10 px-2.5 py-1 text-xs font-semibold text-cyan-700"><Tag className="h-2.5 w-2.5" />Materialidad Fiscal</span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5 text-cyan/60" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }) : "Borrador"}
              </div>
            </div>
            <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-navy md:text-4xl lg:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>}
          </motion.div>
        </div>
      </section>

      <article className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6 lg:px-8">
          {post.coverImage && <img src={post.coverImage} alt={post.title} loading="lazy" className="mb-12 w-full rounded-2xl border border-slate-200 object-cover" />}
          <div
            className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-cyan-700 prose-strong:text-navy prose-blockquote:border-l-cyan/40"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-12 flex justify-center">
            <Link href="/blog"><button className="btn-ghost-l"><ArrowLeft className="h-4 w-4" />Volver al Blog</button></Link>
          </div>
        </div>
      </article>
    </div>
  );
}
