import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db";
import { registerRoutes } from "./routes";
import { seed } from "./seed";
import { initializeAgents } from "./agents/index";
import { helpaiWorker } from "./services/helpai-worker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Behind Replit's reverse proxy (TLS termination) — needed for secure cookies + rate-limit client IPs.
app.set("trust proxy", 1);
// Security headers (helmet). CSP disabled to avoid breaking Google Fonts / inline JSON-LD / styles.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve CMS-uploaded images. Note: local disk is ephemeral on Replit autoscale —
// use a CDN / object store for durable production uploads.
app.use("/uploads", express.static(path.resolve("uploads")));

// ── Request logging middleware ──────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const originalEnd = res.end.bind(res);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.end = function (...args: any[]) {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return originalEnd(...(args as [any, any, any]));
  };

  next();
});

(async () => {
  // Connect/boot the database first (embedded PGlite by default, or a managed
  // Postgres when DATABASE_URL is set). Creates the schema idempotently.
  await initDb();

  // Register API routes and create HTTP server
  const httpServer = await registerRoutes(app);

  // Run database seed
  await seed();

  // Initialize agent system
  await initializeAgents();

  // Help AI Worker — starts in idle mode, activate via POST /api/admin/helpai/start
  console.log("[helpai-worker] Disponible. Activar via POST /api/admin/helpai/start");

  // ── Vite dev server or static serving ──────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: { server: httpServer },
      },
      appType: "custom",
    });
    app.use(vite.middlewares);

    // SPA fallback — let Vite handle all non-API routes
    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(__dirname, "..", "client", "index.html");
        const { readFileSync } = await import("fs");
        let template = readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (err) {
        if (err instanceof Error) {
          vite.ssrFixStacktrace(err);
        }
        next(err);
      }
    });
  } else {
    // Production — serve built client assets
    const distPath = path.resolve(__dirname, "public");
    app.use(express.static(distPath));

    // SPA fallback
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  // ── Start listening ────────────────────────────────────────────────
  const PORT = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] Running on http://0.0.0.0:${PORT} (${process.env.NODE_ENV || "development"})`);
  });
})();
