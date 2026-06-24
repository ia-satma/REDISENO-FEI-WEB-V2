import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { WebSocketServer, WebSocket } from "ws";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import multer from "multer";
import {
  insertContactSchema,
  insertNewsletterSchema,
  insertBlogPostSchema,
  insertClientUserSchema,
} from "../shared/schema";
import type { WebSocketMessage } from "../shared/types";
import { isDatabaseAvailable, pool } from "./db";
import * as storage from "./storage";
import * as feiReader from "./services/fei-reader";
import { helpaiWorker, setBroadcast } from "./services/helpai-worker";
import agentRoutes from "./agents/api/agentRoutes";
import rateLimit from "express-rate-limit";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.status(401).json({ error: "Authentication required" });
}

/**
 * Portal auth — checks for portal session (client user).
 */
function requirePortalAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && (req.session as any).portalUserId) {
    next();
    return;
  }
  res.status(401).json({ error: "Portal authentication required" });
}

// ---------------------------------------------------------------------------
// Password hashing — Node.js built-in scrypt (no external deps)
// ---------------------------------------------------------------------------

async function hashPassword(plain: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(plain, salt, 64, (err, derived) => {
      if (err) reject(err);
      else resolve(`scrypt:${salt}:${derived.toString("hex")}`);
    });
  });
}

async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  const [, salt, key] = hashed.split(":");
  return new Promise((resolve, reject) => {
    crypto.scrypt(plain, salt, 64, (err, derived) => {
      if (err) reject(err);
      else resolve(derived.toString("hex") === key);
    });
  });
}

// Expose for seed.ts
export { hashPassword };

// ---------------------------------------------------------------------------
// SendGrid helper
// ---------------------------------------------------------------------------

async function sendMagicLinkEmail(email: string, token: string, name: string): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn("[sendgrid] SENDGRID_API_KEY not set — printing link to console");
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    console.log(`[magic-link] ${baseUrl}/acceso/verificar?token=${token}`);
    return true;
  }

  try {
    const sgMail = await import("@sendgrid/mail");
    sgMail.default.setApiKey(apiKey);

    const baseUrl = process.env.BASE_URL || "https://portal.feiconsultores.com";
    const link = `${baseUrl}/acceso/verificar?token=${token}`;

    await sgMail.default.send({
      to: email,
      from: process.env.SENDGRID_FROM || "portal@feiconsultores.com",
      subject: "Acceso a tu expediente — FEI Consultores",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Hola ${name},</h2>
          <p>Haz clic en el siguiente enlace para acceder a tu expediente de materialidad fiscal:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background: #1a1a2e; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Acceder al Portal
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">Este enlace expira en 15 minutos. Si no solicitaste este acceso, ignora este correo.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">FEI Consultores — Infraestructura de Evidencia Fiscal</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("[sendgrid] Error sending email:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// WebSocket broadcast helper
// ---------------------------------------------------------------------------

let wss: WebSocketServer | null = null;

export function broadcastAgentEvent(message: WebSocketMessage): void {
  if (!wss) return;
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// ---------------------------------------------------------------------------
// Register routes
// ---------------------------------------------------------------------------

// ── Rate limiters ────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Espera unos minutos e intenta de nuevo." },
});

const publicWriteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intenta más tarde." },
});

// ── Image uploads (CMS) ──────────────────────────────────────────────────────
const UPLOAD_DIR = path.resolve("uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${Date.now()}-${safe}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ── Session ──────────────────────────────────────────────────────────
  // Use PgSession when DATABASE_URL is available, otherwise fall back to
  // MemoryStore so the server can boot in degraded mode without Postgres.
  let sessionStore: session.Store;

  if (isDatabaseAvailable() && pool) {
    const PgSession = connectPgSimple(session);
    sessionStore = new PgSession({
      pool,
      createTableIfMissing: true,
    });
    console.log("[session] Using PostgreSQL session store.");
  } else {
    const MemoryStoreFactory = MemoryStore(session);
    sessionStore = new MemoryStoreFactory({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    console.log("[session] DATABASE_URL not set — using in-memory session store (non-persistent).");
  }

  const sessionSecret =
    process.env.SESSION_SECRET ||
    (() => {
      console.warn(
        process.env.NODE_ENV === "production"
          ? "[session] SESSION_SECRET not set in production — using an ephemeral random secret (secure, but sessions reset on restart; set SESSION_SECRET for stable logins)."
          : "[session] SESSION_SECRET not set — using an ephemeral dev secret (sessions reset on restart).",
      );
      return crypto.randomBytes(32).toString("hex");
    })();

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (portal sessions)
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      },
    }),
  );

  // ── Passport (admin auth) ─────────────────────────────────────────────
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        if (!isDatabaseAvailable()) {
          return done(null, false, { message: "Database not available" });
        }
        const user = await storage.getAdminByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const valid = await verifyPassword(password, user.password);
        if (!valid) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, { id: user.id, username: user.username, role: user.role });
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, (user as { id: number }).id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      if (!isDatabaseAvailable()) {
        return done(null, false);
      }
      done(null, { id });
    } catch (err) {
      done(err);
    }
  });

  // ── Agent API routes ─────────────────────────────────────────────────
  app.use("/api/agents", agentRoutes);

  // ── Public routes ────────────────────────────────────────────────────

  // Health check
  app.get("/api/health", (_req, res) => {
    const dbAvailable = isDatabaseAvailable();
    res.json({
      status: dbAvailable ? "healthy" : "degraded",
      database: dbAvailable,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Contact form
  app.post("/api/contact", publicWriteLimiter, async (req: Request, res: Response) => {
    try {
      const parsed = insertContactSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
        return;
      }
      const contact = await storage.createContact(parsed.data);
      res.status(201).json({ success: true, id: contact.id });
    } catch (err) {
      console.error("[contact] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Newsletter
  app.post("/api/newsletter", publicWriteLimiter, async (req: Request, res: Response) => {
    try {
      const parsed = insertNewsletterSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid email", details: parsed.error.flatten() });
        return;
      }
      const result = await storage.subscribe(parsed.data.email);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      console.error("[newsletter] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Blog — public
  app.get("/api/blog/posts", async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getPublishedPosts();
      res.json(posts);
    } catch (err) {
      console.error("[blog] Error fetching posts:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req: Request, res: Response) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json(post);
    } catch (err) {
      console.error("[blog] Error fetching post:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Agent status — public (read-only)
  app.get("/api/agents/status", async (_req: Request, res: Response) => {
    try {
      const jobs = await storage.getActiveJobs();
      const events = await storage.getRecentEvents(20);
      res.json({ jobs, events });
    } catch (err) {
      console.error("[agents] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // =====================================================================
  // PORTAL: Magic Link Auth
  // =====================================================================

  // Request magic link
  app.post("/api/portal/auth/request", publicWriteLimiter, async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        res.status(400).json({ error: "Email requerido" });
        return;
      }

      const user = await storage.getClientUserByEmail(email);
      if (!user || !user.active) {
        // Don't reveal whether email exists
        res.json({ success: true, message: "Si tu correo esta registrado, recibiras un enlace de acceso." });
        return;
      }

      // Rate limit: 3 tokens per hour
      const recentCount = await storage.countRecentTokens(user.id);
      if (recentCount >= 3) {
        res.status(429).json({ error: "Demasiadas solicitudes. Intenta en una hora." });
        return;
      }

      const token = await storage.createMagicToken(user.id);
      await sendMagicLinkEmail(user.email, token.token, user.fullName);

      await storage.logPortalAction({
        userId: user.id,
        action: "magic_link_requested",
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.json({ success: true, message: "Si tu correo esta registrado, recibiras un enlace de acceso." });
    } catch (err) {
      console.error("[portal/auth] Error:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // Verify magic link token
  app.get("/api/portal/auth/verify", async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        res.status(400).json({ error: "Token requerido" });
        return;
      }

      const magicToken = await storage.consumeMagicToken(token);
      if (!magicToken) {
        res.status(401).json({ error: "Enlace invalido o expirado" });
        return;
      }

      const user = await storage.getClientUserById(magicToken.userId);
      if (!user || !user.active) {
        res.status(401).json({ error: "Usuario no encontrado" });
        return;
      }

      // Create portal session
      (req.session as any).portalUserId = user.id;
      (req.session as any).portalSlug = user.feiSlug;

      await storage.logPortalAction({
        userId: user.id,
        action: "login",
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.json({ success: true, user: { id: user.id, fullName: user.fullName, companyName: user.companyName } });
    } catch (err) {
      console.error("[portal/auth] Verify error:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // Portal logout
  app.post("/api/portal/auth/logout", (req: Request, res: Response) => {
    delete (req.session as any).portalUserId;
    delete (req.session as any).portalSlug;
    res.json({ success: true });
  });

  // =====================================================================
  // PORTAL: Protected routes (client access)
  // =====================================================================

  // Current user info
  app.get("/api/portal/me", requirePortalAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).portalUserId;
      const user = await storage.getClientUserById(userId);
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      res.json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        feiSlug: user.feiSlug,
        role: user.role,
      });
    } catch (err) {
      console.error("[portal/me] Error:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // List operations
  app.get("/api/portal/operations", requirePortalAuth, async (req: Request, res: Response) => {
    try {
      const slug = (req.session as any).portalSlug;
      const operations = feiReader.getOperations(slug);
      res.json(operations);
    } catch (err) {
      console.error("[portal/operations] Error:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // List folders within an operation (08-DEFENSA filtered for clients)
  app.get("/api/portal/operations/:opId/folders", requirePortalAuth, async (req: Request, res: Response) => {
    try {
      const slug = (req.session as any).portalSlug;
      const { opId } = req.params;
      const folders = feiReader.getOperationFolders(slug, opId, false);
      res.json(folders);
    } catch (err) {
      console.error("[portal/folders] Error:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // List DOCX files in a folder
  app.get("/api/portal/operations/:opId/folders/:folder", requirePortalAuth, async (req: Request, res: Response) => {
    try {
      const slug = (req.session as any).portalSlug;
      const { opId, folder } = req.params;

      // Block 08-DEFENSA for clients
      if (folder === "08-DEFENSA") {
        res.status(403).json({ error: "Acceso denegado" });
        return;
      }

      const folders = feiReader.getOperationFolders(slug, opId, false);
      const target = folders.find((f) => f.name === folder);
      if (!target) {
        res.status(404).json({ error: "Carpeta no encontrada" });
        return;
      }
      res.json(target);
    } catch (err) {
      console.error("[portal/folder] Error:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // Download individual DOCX
  app.get("/api/portal/documents/:opId/:folder/:filename", requirePortalAuth, async (req: Request, res: Response) => {
    try {
      const slug = (req.session as any).portalSlug;
      const { opId, folder, filename } = req.params;
      const userId = (req.session as any).portalUserId;

      // Block 08-DEFENSA
      if (folder === "08-DEFENSA") {
        res.status(403).json({ error: "Acceso denegado" });
        return;
      }

      const filePath = feiReader.resolveDocxPath(slug, opId, folder, filename);
      if (!filePath) {
        res.status(404).json({ error: "Documento no encontrado" });
        return;
      }

      await storage.logPortalAction({
        userId,
        action: "download",
        resource: `${opId}/${folder}/${filename}`,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.download(filePath, filename);
    } catch (err) {
      console.error("[portal/download] Error:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // Download ZIP of entire operation
  app.get("/api/portal/operations/:opId/download", requirePortalAuth, async (req: Request, res: Response) => {
    try {
      const slug = (req.session as any).portalSlug;
      const { opId } = req.params;
      const userId = (req.session as any).portalUserId;

      const folders = feiReader.getOperationFolders(slug, opId, false);
      if (folders.length === 0) {
        res.status(404).json({ error: "Operacion sin documentos" });
        return;
      }

      const zip = new AdmZip();

      for (const folder of folders) {
        for (const file of folder.docxFiles) {
          const filePath = feiReader.resolveDocxPath(slug, opId, folder.name, file);
          if (filePath) {
            zip.addLocalFile(filePath, folder.name);
          }
        }
      }

      await storage.logPortalAction({
        userId,
        action: "download_zip",
        resource: opId,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });

      const zipBuffer = zip.toBuffer();
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}-${opId}.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      });
      res.send(zipBuffer);
    } catch (err) {
      console.error("[portal/zip] Error:", err);
      res.status(500).json({ error: "Error interno" });
    }
  });

  // =====================================================================
  // ADMIN: Auth routes
  // =====================================================================

  app.post("/api/admin/login", loginLimiter, (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string } | undefined) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json({ error: info?.message || "Invalid credentials" });
        return;
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        res.json({ success: true, user });
      });
    })(req, res, next);
  });

  app.get("/api/admin/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json({ user: req.user });
  });

  // =====================================================================
  // ADMIN: Protected routes
  // =====================================================================

  // Blog CRUD
  app.post("/api/admin/blog", requireAuth, async (req: Request, res: Response) => {
    try {
      const parsed = insertBlogPostSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
        return;
      }
      const post = await storage.createPost(parsed.data);
      res.status(201).json(post);
    } catch (err) {
      console.error("[admin/blog] Create error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/blog/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid post ID" });
        return;
      }
      const post = await storage.updatePost(id, req.body);
      if (!post) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json(post);
    } catch (err) {
      console.error("[admin/blog] Update error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid post ID" });
        return;
      }
      const deleted = await storage.deletePost(id);
      if (!deleted) {
        res.status(404).json({ error: "Post not found" });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      console.error("[admin/blog] Delete error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Contacts list
  // ── CMS: editable site content (overrides over static config defaults) ─
  app.get("/api/content", async (_req: Request, res: Response) => {
    try {
      res.json(await storage.getSiteContentMap());
    } catch (err) {
      console.error("[content] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/content", requireAuth, async (_req: Request, res: Response) => {
    try {
      res.json(await storage.getAllSiteContent());
    } catch (err) {
      console.error("[admin/content] List error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/content/:key", requireAuth, async (req: Request, res: Response) => {
    try {
      const { value } = req.body;
      if (value === undefined || value === null || typeof value !== "object") {
        res.status(400).json({ error: "value (object) is required" });
        return;
      }
      const saved = await storage.upsertSiteContent(req.params.key, value);
      res.json(saved);
    } catch (err) {
      console.error("[admin/content] Update error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/content/:key", requireAuth, async (req: Request, res: Response) => {
    try {
      const ok = await storage.deleteSiteContent(req.params.key);
      if (!ok) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      console.error("[admin/content] Delete error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/upload", requireAuth, upload.single("file"), (req: Request, res: Response) => {
    const file = (req as Request & { file?: { filename: string } }).file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    res.json({ url: `/uploads/${file.filename}` });
  });

  app.get("/api/admin/contacts", requireAuth, async (_req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (err) {
      console.error("[admin/contacts] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Agent jobs — admin
  app.post("/api/agents/jobs", requireAuth, async (req: Request, res: Response) => {
    try {
      const { agentId, type, input } = req.body;
      if (!agentId || !type) {
        res.status(400).json({ error: "agentId and type are required" });
        return;
      }
      const job = await storage.createJob({
        agentId,
        type,
        input: input ?? null,
        status: "pending",
      });

      broadcastAgentEvent({
        type: "agent_progress",
        agentId,
        data: { jobId: job.id, status: "pending" },
        timestamp: new Date().toISOString(),
      });

      res.status(201).json(job);
    } catch (err) {
      console.error("[agents/jobs] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // =====================================================================
  // ADMIN: Pipeline Dashboard (Fase 2)
  // =====================================================================

  // All clients pipeline status
  app.get("/api/admin/pipeline/status", requireAuth, async (_req: Request, res: Response) => {
    try {
      const statuses = feiReader.getAllPipelineStatus();
      res.json(statuses);
    } catch (err) {
      console.error("[admin/pipeline] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Single client pipeline detail
  app.get("/api/admin/pipeline/:slug/detail", requireAuth, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const allStatuses = feiReader.getAllPipelineStatus();
      const detail = allStatuses.find(
        (s) => s.slug === slug || s.clientDir === slug,
      );
      if (!detail) {
        res.status(404).json({ error: "Client not found" });
        return;
      }

      // Also get ENTREGA info
      const operations = feiReader.getOperations(slug);

      res.json({ ...detail, entrega: operations });
    } catch (err) {
      console.error("[admin/pipeline/detail] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ── Admin: Client Users CRUD ──────────────────────────────────────────

  app.get("/api/admin/clients", requireAuth, async (_req: Request, res: Response) => {
    try {
      const clients = await storage.getAllClientUsers();
      res.json(clients);
    } catch (err) {
      console.error("[admin/clients] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/clients", requireAuth, async (req: Request, res: Response) => {
    try {
      const parsed = insertClientUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
        return;
      }
      const client = await storage.createClientUser(parsed.data);
      res.status(201).json(client);
    } catch (err) {
      console.error("[admin/clients] Create error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/clients/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid client ID" });
        return;
      }
      const parsed = z
        .object({
          fullName: z.string().min(1).optional(),
          companyName: z.string().optional(),
          feiSlug: z.string().optional(),
          role: z.string().optional(),
          active: z.boolean().optional(),
        })
        .safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
        return;
      }
      const client = await storage.updateClientUser(id, parsed.data);
      if (!client) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      res.json(client);
    } catch (err) {
      console.error("[admin/clients] Update error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/clients/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid client ID" });
        return;
      }
      const deleted = await storage.deleteClientUser(id);
      if (!deleted) {
        res.status(404).json({ error: "Client not found" });
        return;
      }
      res.json({ success: true });
    } catch (err) {
      console.error("[admin/clients] Delete error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Send magic link manually (admin trigger)
  app.post("/api/admin/clients/:id/send-link", requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid client ID" });
        return;
      }

      const client = await storage.getClientUserById(id);
      if (!client) {
        res.status(404).json({ error: "Client not found" });
        return;
      }

      const token = await storage.createMagicToken(client.id);
      const sent = await sendMagicLinkEmail(client.email, token.token, client.fullName);

      res.json({ success: sent, message: sent ? "Enlace enviado" : "Error al enviar" });
    } catch (err) {
      console.error("[admin/send-link] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Audit log
  app.get("/api/admin/audit-log", requireAuth, async (_req: Request, res: Response) => {
    try {
      const log = await storage.getAuditLog(200);
      res.json(log);
    } catch (err) {
      console.error("[admin/audit] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // =====================================================================
  // ADMIN: Help AI Worker (Fase 3)
  // =====================================================================

  // Wire broadcast function to worker (avoids circular import)
  setBroadcast(broadcastAgentEvent as Parameters<typeof setBroadcast>[0]);

  // Worker status
  app.get("/api/admin/helpai/status", requireAuth, (_req: Request, res: Response) => {
    res.json(helpaiWorker.stats);
  });

  // Start worker polling
  app.post("/api/admin/helpai/start", requireAuth, async (_req: Request, res: Response) => {
    try {
      await helpaiWorker.start();
      res.json({ success: true, status: helpaiWorker.status });
    } catch (err) {
      console.error("[admin/helpai] Start error:", err);
      res.status(500).json({ error: "Failed to start worker" });
    }
  });

  // Stop worker
  app.post("/api/admin/helpai/stop", requireAuth, async (_req: Request, res: Response) => {
    try {
      await helpaiWorker.stop();
      res.json({ success: true, status: helpaiWorker.status });
    } catch (err) {
      console.error("[admin/helpai] Stop error:", err);
      res.status(500).json({ error: "Failed to stop worker" });
    }
  });

  // Open browser for manual auth (first-time login — legacy)
  app.post("/api/admin/helpai/auth", requireAuth, async (_req: Request, res: Response) => {
    try {
      await helpaiWorker.openAuthBrowser();
      res.json({
        success: true,
        message: "Navegador abierto. Inicia sesión en Help AI manualmente. Las cookies se guardarán al cerrar.",
      });
    } catch (err) {
      console.error("[admin/helpai] Auth error:", err);
      res.status(500).json({ error: "Failed to open auth browser" });
    }
  });

  // Auth Step 1: Send verification code to email
  app.post("/api/admin/helpai/auth/start", requireAuth, async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: "email is required" });
        return;
      }
      const result = await helpaiWorker.loginSendEmail(email);
      res.json(result);
    } catch (err) {
      console.error("[admin/helpai] Auth start error:", err);
      res.status(500).json({ error: "Failed to start login flow" });
    }
  });

  // Auth Step 2: Submit verification code
  app.post("/api/admin/helpai/auth/verify", requireAuth, async (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      if (!code) {
        res.status(400).json({ error: "code is required" });
        return;
      }
      const result = await helpaiWorker.submitAuthCode(String(code));
      res.json(result);
    } catch (err) {
      console.error("[admin/helpai] Auth verify error:", err);
      res.status(500).json({ error: "Failed to verify code" });
    }
  });

  // Create Help AI job (admin enqueues an interrogation)
  app.post("/api/admin/helpai/jobs", requireAuth, async (req: Request, res: Response) => {
    try {
      const { agentKey, clientSlug, opId, questions, outputDir, docxPaths, templateId, cycle, agentUrl } = req.body;

      if (!agentKey || !questions) {
        res.status(400).json({ error: "agentKey and questions are required" });
        return;
      }

      const job = await storage.createJob({
        agentId: "helpai",
        type: "interrogation",
        input: {
          agentKey,
          clientSlug: clientSlug || "unknown",
          opId: opId || "OP-01",
          questions,
          outputDir: outputDir || `/tmp/fei-helpai-responses/${clientSlug || "unknown"}`,
          docxPaths: docxPaths || [],
          templateId: templateId || null,
          cycle: cycle || 1,
          agentUrl: agentUrl || null,
        },
        status: "pending",
      });

      broadcastAgentEvent({
        type: "agent_progress",
        agentId: "helpai",
        data: { jobId: job.id, status: "pending", agent: agentKey },
        timestamp: new Date().toISOString(),
      });

      res.status(201).json(job);
    } catch (err) {
      console.error("[admin/helpai/jobs] Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // List Help AI jobs
  app.get("/api/admin/helpai/jobs", requireAuth, async (req: Request, res: Response) => {
    try {
      const db = (await import("./db")).getDb();
      const { eq, desc } = await import("drizzle-orm");
      const { agentJobs: jobsTable } = await import("../shared/schema");

      const jobs = await db
        .select()
        .from(jobsTable)
        .where(eq(jobsTable.agentId, "helpai"))
        .orderBy(desc(jobsTable.createdAt))
        .limit(50);

      res.json(jobs);
    } catch (err) {
      console.error("[admin/helpai/jobs] List error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ── HTTP server + WebSocket ──────────────────────────────────────────

  const httpServer = createServer(app);

  wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    const welcome: WebSocketMessage = {
      type: "notification",
      data: { message: "Connected to FEI WebSocket" },
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(welcome));

    ws.on("error", (err) => {
      console.error("[ws] Client error:", err.message);
    });
  });

  // ── Filesystem watchers → WebSocket push ─────────────────────────────
  const allStatuses = feiReader.getAllPipelineStatus();
  for (const status of allStatuses) {
    feiReader.watchCheckpoint(status.slug, () => {
      broadcastAgentEvent({
        type: "health_update",
        data: {
          event: "checkpoint_changed",
          slug: status.slug,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    });
  }

  return httpServer;
}
