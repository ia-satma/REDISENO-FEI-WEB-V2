import { useEffect } from "react";
import { useLocation } from "wouter";
import { seo, SITE } from "@config/seo";

interface SEOHeadProps {
  title?: string;
  description?: string;
  /** Override the canonical URL (defaults to the current route). */
  canonical?: string;
  /** Absolute or root-relative image for OG/Twitter (defaults to the brand og-image). */
  image?: string;
  /** og:type — "website" (default) or "article" for blog posts. */
  type?: "website" | "article";
  /** Article timestamps (blog posts) → article:published_time / modified_time. */
  publishedTime?: string;
  modifiedTime?: string;
}

function upsert(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const metaEl = (key: "name" | "property", val: string) => () => {
  const m = document.createElement("meta");
  m.setAttribute(key, val);
  return m;
};

const setMeta = (key: "name" | "property", name: string, content: string) =>
  upsert(`meta[${key}="${name}"]`, metaEl(key, name), "content", content);

/** Absolute URL for an image path (root-relative → SITE-prefixed). */
function absImage(image?: string) {
  const path = image || seo.defaults.ogImage;
  return path.startsWith("http") ? path : `${SITE}${path}`;
}

/** Per-route title, description, canonical, Open Graph and Twitter tags. */
export default function SEOHead({ title, description, canonical, image, type = "website", publishedTime, modifiedTime }: SEOHeadProps) {
  const [location] = useLocation();

  useEffect(() => {
    const t = title || seo.defaults.defaultTitle;
    const d = description || seo.defaults.description;
    const url = canonical || `${SITE}${location}`;
    const img = absImage(image);

    document.title = t;
    setMeta("name", "description", d);
    upsert('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    }, "href", url);

    // Open Graph
    setMeta("property", "og:title", t);
    setMeta("property", "og:description", d);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("property", "og:type", type);

    // Twitter
    setMeta("name", "twitter:title", t);
    setMeta("name", "twitter:description", d);
    setMeta("name", "twitter:image", img);

    // Article timestamps (blog) — set when provided, otherwise remove stale ones.
    for (const [prop, val] of [["article:published_time", publishedTime], ["article:modified_time", modifiedTime]] as const) {
      const existing = document.head.querySelector(`meta[property="${prop}"]`);
      if (val) setMeta("property", prop, val);
      else if (existing) existing.remove();
    }
  }, [title, description, canonical, image, type, publishedTime, modifiedTime, location]);

  return null;
}
