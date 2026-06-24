/**
 * Generates client/public/sitemap.xml from the static route list with fresh
 * <lastmod> on every build. The production origin is read from config/brand.ts
 * (single source of truth) so changing the domain there updates the sitemap too.
 * Run before `vite build` (which copies client/public → dist/public).
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const brandSrc = await readFile(path.resolve("config/brand.ts"), "utf8");
const domain = (brandSrc.match(/domain:\s*"([^"]+)"/) || [])[1] || "feiconsultores.com";
const SITE = `https://${domain}`;
const today = new Date().toISOString().slice(0, 10);

/** [path, changefreq, priority] */
const ROUTES = [
  ["/", "weekly", "1.0"],
  ["/servicios", "monthly", "0.9"],
  ["/materialidad", "monthly", "0.9"],
  ["/metodologia", "monthly", "0.8"],
  ["/seguridad", "monthly", "0.8"],
  ["/contacto", "monthly", "0.8"],
  ["/impacto", "monthly", "0.7"],
  ["/blog", "weekly", "0.7"],
  ["/faq", "monthly", "0.6"],
  ["/aviso-privacidad", "yearly", "0.3"],
  ["/terminos", "yearly", "0.3"],
  ["/politica-seguridad", "yearly", "0.3"],
  ["/cookies", "yearly", "0.3"],
];

const urls = ROUTES.map(([p, freq, pri]) =>
  `  <url>\n    <loc>${SITE}${p === "/" ? "/" : p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`
).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(path.resolve("client/public/sitemap.xml"), xml, "utf8");
console.log(`[sitemap] wrote ${ROUTES.length} urls for ${SITE} (lastmod ${today})`);
