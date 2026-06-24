/**
 * Static pre-render (SSG) for the SPA. After `vite build`, serves dist/public and
 * visits each route with headless Chrome, capturing the fully-rendered HTML (with
 * SEOHead meta + canonical + JSON-LD baked in) into dist/public/<route>/index.html.
 * Crawlers / social / AI that don't run JS get real per-page HTML.
 *
 * Browser: uses Playwright (already a dependency). In CI run `npx playwright install
 * chromium` first; locally set PLAYWRIGHT_EXECUTABLE_PATH to a chrome-headless-shell.
 * Subpath: set PRERENDER_BASE (e.g. /REDISENO-FEI-WEB-V2/) to match `vite build --base`.
 */
import pw from "playwright";
import http from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const { chromium } = pw;
const OUT_DIR = path.resolve("dist/public");
const BASE = (process.env.PRERENDER_BASE || "/").replace(/\/*$/, "/"); // ensure trailing "/"
const BASE_NOSLASH = BASE.replace(/\/$/, "");
const PORT = 4321;

const ROUTES = [
  "/", "/servicios", "/metodologia", "/materialidad", "/impacto",
  "/seguridad", "/contacto", "/blog", "/faq",
  "/aviso-privacidad", "/terminos", "/politica-seguridad", "/cookies",
];

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml",
  ".woff2": "font/woff2", ".woff": "font/woff", ".otf": "font/otf", ".map": "application/json",
};

function send(res, filePath, code = 200) {
  readFile(filePath)
    .then((buf) => { res.writeHead(code, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" }); res.end(buf); })
    .catch(() => { res.writeHead(404); res.end("not found"); });
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (BASE_NOSLASH && urlPath.startsWith(BASE_NOSLASH)) urlPath = urlPath.slice(BASE_NOSLASH.length) || "/";
  // No backend during prerender → /api fails fast, app falls back to defaults.
  if (urlPath.startsWith("/api")) { res.writeHead(404, { "Content-Type": "application/json" }); res.end("{}"); return; }
  const asset = path.join(OUT_DIR, urlPath);
  if (path.extname(urlPath) && existsSync(asset)) return send(res, asset);
  // SPA fallback for routes
  return send(res, path.join(OUT_DIR, "index.html"));
});

await new Promise((r) => server.listen(PORT, r));
console.log(`[prerender] serving ${OUT_DIR} (base ${BASE}) on :${PORT}`);

const launchOpts = {};
if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) launchOpts.executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
const browser = await chromium.launch(launchOpts);
const page = await browser.newPage();

let ok = 0;
for (const route of ROUTES) {
  const url = `http://127.0.0.1:${PORT}${BASE_NOSLASH}${route}`;
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(1500); // let React render + SEOHead/JsonLd effects run
    const html = await page.content();
    const outPath = route === "/" ? path.join(OUT_DIR, "index.html") : path.join(OUT_DIR, route, "index.html");
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(`[prerender] ✓ ${route} -> ${path.relative(OUT_DIR, outPath)}`);
    ok++;
  } catch (e) {
    console.error(`[prerender] ✗ ${route}: ${e.message}`);
  }
}

await browser.close();
server.close();
console.log(`[prerender] done — ${ok}/${ROUTES.length} routes`);
if (ok < ROUTES.length) process.exit(1);
