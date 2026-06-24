import { useEffect } from "react";
import { useLocation } from "wouter";
import { seo } from "@config/seo";

const SITE = "https://feiconsultores.com";

interface SEOHeadProps {
  title?: string;
  description?: string;
  /** Override the canonical URL (defaults to the current route). */
  canonical?: string;
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

/** Per-route title, description, canonical and Open Graph/Twitter tags. */
export default function SEOHead({ title, description, canonical }: SEOHeadProps) {
  const [location] = useLocation();

  useEffect(() => {
    const t = title || seo.defaults.defaultTitle;
    const d = description || seo.defaults.description;
    const url = canonical || `${SITE}${location}`;

    document.title = t;
    upsert('meta[name="description"]', metaEl("name", "description"), "content", d);
    upsert('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    }, "href", url);
    upsert('meta[property="og:title"]', metaEl("property", "og:title"), "content", t);
    upsert('meta[property="og:description"]', metaEl("property", "og:description"), "content", d);
    upsert('meta[property="og:url"]', metaEl("property", "og:url"), "content", url);
    upsert('meta[name="twitter:title"]', metaEl("name", "twitter:title"), "content", t);
    upsert('meta[name="twitter:description"]', metaEl("name", "twitter:description"), "content", d);
  }, [title, description, canonical, location]);

  return null;
}
