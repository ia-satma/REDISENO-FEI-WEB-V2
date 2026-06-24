/**
 * Help AI Worker — Playwright-based browser automation for Help AI consultations.
 *
 * Architecture:
 *   - Polls `agent_jobs` table for jobs with agentId='helpai'
 *   - Uses persistent browser context at ~/.fei-helpai-session/ (cookies survive restarts)
 *   - First login is MANUAL (user opens browser, logs in). After that, cookies persist.
 *   - Extracts DOCX text via mammoth, pastes questions in Help AI chat, captures responses
 *   - Saves responses to QA-HELP-AI/ directory structure
 *   - Supports iterative audit cycles (max 3: question → response → followup)
 *
 * Communication with Express:
 *   - Reads pending jobs from agent_jobs table
 *   - Updates job status (running/completed/failed)
 *   - Sends WebSocket events via broadcastAgentEvent
 *
 * Lifecycle:
 *   - start() — begin polling
 *   - stop() — stop polling, close browser
 *   - openAuthBrowser() — launch visible browser for manual login
 */

import type { BrowserContext, Page } from "playwright";

async function getChromium() {
  const pw = await import("playwright");
  return pw.chromium;
}
import fs from "fs";
import path from "path";
import os from "os";
import mammoth from "mammoth";
import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { agentJobs } from "../../shared/schema";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SESSION_DIR = path.join(os.homedir(), ".fei-helpai-session");
const POLL_INTERVAL = 5_000; // 5s between polls
const RESPONSE_TIMEOUT = 180_000; // 3 min max wait for AI response
const MAX_AUDIT_CYCLES = 3;

// ---------------------------------------------------------------------------
// Help AI Agent URLs — from HELP-AI-CATALOGO-AGENTES-OFICIAL.md
// ---------------------------------------------------------------------------

const AGENT_URLS: Record<string, string> = {
  materialidad:
    "https://www.help-ai-app.com/?agent=character-7fb54a9f-277d-42c2-887e-2f3a88ad246d",
  fiscal:
    "https://www.help-ai-app.com/?agent=a-10aa4377-2480-4bbf-b77a-b27640f04678",
  agravios:
    "https://www.help-ai-app.com/?agent=character-4c2dc309-2a4a-4643-aa7f-7e3d2737995c",
  tesis:
    "https://www.help-ai-app.com/?agent=character-d9858970-604b-4382-9e36-06e0d43b37e4",
  dof:
    "https://www.help-ai-app.com/?agent=character-836c33cb-3057-4b85-a40b-d2d09ce8a72c",
  contratos:
    "https://www.help-ai-app.com/?agent=character-contratos",
  entregables:
    "https://www.help-ai-app.com/?agent=character-entregables",
  contador:
    "https://www.help-ai-app.com/?agent=character-contador",
  mercantil:
    "https://www.help-ai-app.com/?agent=character-mercantil",
  financiero:
    "https://www.help-ai-app.com/?agent=character-financiero",
  "analisis-financiero":
    "https://www.help-ai-app.com/?agent=character-analisis-financiero",
  cotizaciones:
    "https://www.help-ai-app.com/?agent=character-cotizaciones",
  procesos:
    "https://www.help-ai-app.com/?agent=character-procesos",
  administrativo:
    "https://www.help-ai-app.com/?agent=character-administrativo",
  amparos:
    "https://www.help-ai-app.com/?agent=character-amparos",
  marketing:
    "https://www.help-ai-app.com/?agent=character-marketing",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HelpAIJobInput {
  /** Key in AGENT_URLS or a full URL */
  agentKey: string;
  /** FEI client slug for file organization */
  clientSlug: string;
  /** Operation ID, e.g. "OP-01" */
  opId: string;
  /** DOCX file paths to extract text from and include as context */
  docxPaths?: string[];
  /** Pre-generated questions text (from templates) */
  questions: string;
  /** Directory where responses are saved */
  outputDir: string;
  /** Template identifier, e.g. "M01-MATERIALIDAD" */
  templateId?: string;
  /** Current audit cycle (1-based, max MAX_AUDIT_CYCLES) */
  cycle?: number;
  /** Optional: override agent URL directly */
  agentUrl?: string;
}

export interface HelpAIJobOutput {
  responsePath: string;
  responseLength: number;
  wordCount: number;
  cycle: number;
  timestamp: string;
  agentKey: string;
  errors?: string[];
}

export type HelpAIWorkerStatus =
  | "idle"
  | "running"
  | "processing"
  | "needs_auth"
  | "error";

// Reference to broadcastAgentEvent — set externally to avoid circular import
let _broadcast: ((msg: {
  type: string;
  agentId?: string;
  data: unknown;
  timestamp: string;
}) => void) | null = null;

export function setBroadcast(fn: typeof _broadcast): void {
  _broadcast = fn;
}

function broadcast(
  type: string,
  data: unknown,
  agentId = "helpai",
): void {
  _broadcast?.({
    type,
    agentId,
    data,
    timestamp: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// HelpAIWorker class
// ---------------------------------------------------------------------------

export class HelpAIWorker {
  private context: BrowserContext | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private processing = false;
  private _status: HelpAIWorkerStatus = "idle";
  private _lastError: string | null = null;
  private _jobsCompleted = 0;
  private _jobsFailed = 0;

  // ── Public getters ──────────────────────────────────────────────────

  get status(): HelpAIWorkerStatus {
    return this._status;
  }

  get stats() {
    return {
      status: this._status,
      lastError: this._lastError,
      jobsCompleted: this._jobsCompleted,
      jobsFailed: this._jobsFailed,
      sessionDir: SESSION_DIR,
      hasSession: fs.existsSync(SESSION_DIR),
    };
  }

  // ── Lifecycle ───────────────────────────────────────────────────────

  async start(): Promise<void> {
    if (this.pollTimer) return;

    console.log("[helpai-worker] Starting poll loop...");

    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    this._status = "running";
    this.pollTimer = setInterval(() => this.poll(), POLL_INTERVAL);
    console.log("[helpai-worker] Polling active (every 5s)");
  }

  async stop(): Promise<void> {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    await this.closeBrowser();
    this._status = "idle";
    console.log("[helpai-worker] Stopped");
  }

  /**
   * Opens a visible browser window so the user can log into Help AI manually.
   * Cookies are saved to SESSION_DIR for future automated sessions.
   */
  async openAuthBrowser(): Promise<void> {
    console.log("[helpai-worker] Opening browser for manual authentication...");

    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    const chromium = await getChromium();
    const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
      headless: false,
      viewport: { width: 1280, height: 800 },
      args: ["--disable-blink-features=AutomationControlled"],
    });

    const page = ctx.pages()[0] || (await ctx.newPage());
    await page.goto("https://www.help-ai-app.com", {
      waitUntil: "domcontentloaded",
    });

    console.log(
      "[helpai-worker] Navegador abierto. Inicia sesión en Help AI manualmente.",
    );
    console.log(
      "[helpai-worker] Las cookies se guardarán automáticamente al cerrar.",
    );

    // Keep reference so close works
    this.context = ctx;
    this._authPage = page;
    this._status = "needs_auth";
  }

  // ── Auth: two-step email+code login ──────────────────────────────────

  /** Page kept alive between login step 1 (email) and step 2 (code) */
  private _authPage: Page | null = null;

  /**
   * Login Step 1: Open browser, fill email, click "Enviar código".
   * After calling this, the user checks their email for the code,
   * then calls submitAuthCode(code).
   */
  async loginSendEmail(email: string): Promise<{ success: boolean; message: string; screenshot?: string }> {
    console.log(`[helpai-worker] Login step 1: sending code to ${email}...`);

    await this.closeBrowser();

    if (!fs.existsSync(SESSION_DIR)) {
      fs.mkdirSync(SESSION_DIR, { recursive: true });
    }

    const chromium = await getChromium();
    const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
      headless: false,
      viewport: { width: 1280, height: 800 },
      args: ["--disable-blink-features=AutomationControlled"],
    });

    this.context = ctx;
    const page = ctx.pages()[0] || (await ctx.newPage());
    this._authPage = page;

    await page.goto("https://www.help-ai-app.com", {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.waitForTimeout(3000);

    // Find email input
    const emailSelectors = [
      'input[type="email"]',
      'input[placeholder*="correo"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="Escribe tu correo"]',
      'input[name="email"]',
    ];

    let emailInput: ReturnType<Page["locator"]> | null = null;
    for (const sel of emailSelectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
        emailInput = el;
        console.log(`[helpai-worker] Found email input: ${sel}`);
        break;
      }
    }

    // If no email input visible, look for a login trigger button
    // Confirmed DOM: bottom-left user/profile icon is the login trigger
    if (!emailInput) {
      const triggers = [
        // Bottom-left profile/user icon (confirmed in Help AI UI)
        'button[aria-label*="erfil"]',
        'button[aria-label*="rofile"]',
        'button[aria-label*="uenta"]',
        'a[href*="login"]',
        'a[href*="auth"]',
        'button:has-text("Iniciar sesión")',
        'button:has-text("Log in")',
        'a:has-text("Iniciar sesión")',
        'a:has-text("Log in")',
      ];

      // Also try clicking the last icon/button in the sidebar (bottom-left area)
      let triggered = false;
      for (const sel of triggers) {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log(`[helpai-worker] Clicking login trigger: ${sel}`);
          await btn.click();
          triggered = true;
          await page.waitForTimeout(2000);
          break;
        }
      }

      // Fallback: find bottom-left sidebar buttons and click the last one (profile icon)
      if (!triggered) {
        const sidebarButtons = await page.locator('nav button, aside button, [class*="sidebar"] button').all();
        if (sidebarButtons.length > 0) {
          const lastBtn = sidebarButtons[sidebarButtons.length - 1];
          console.log("[helpai-worker] Clicking last sidebar button (profile icon)");
          await lastBtn.click();
          await page.waitForTimeout(2000);
        }
      }

      // Retry email selectors
      for (const sel of emailSelectors) {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
          emailInput = el;
          console.log(`[helpai-worker] Found email input after trigger: ${sel}`);
          break;
        }
      }
    }

    if (!emailInput) {
      const shot = path.join(SESSION_DIR, `debug-no-email-${Date.now()}.png`);
      await page.screenshot({ path: shot });
      this._status = "needs_auth";
      return { success: false, message: "Email input not found on page", screenshot: shot };
    }

    // Fill email and submit
    await emailInput.click();
    await emailInput.fill(email);
    await page.waitForTimeout(500);

    const sendSelectors = [
      'button:has-text("Enviar código")',
      'button:has-text("Enviar Código")',
      'button:has-text("Send code")',
      'button:has-text("Enviar")',
      'button:has-text("Continuar")',
      'button[type="submit"]',
    ];

    let clicked = false;
    for (const sel of sendSelectors) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        const text = await btn.textContent();
        console.log(`[helpai-worker] Clicking: "${text}" (${sel})`);
        await btn.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      await emailInput.press("Enter");
      console.log("[helpai-worker] Submitted email via Enter");
    }

    await page.waitForTimeout(2000);
    const shot = path.join(SESSION_DIR, `login-email-sent-${Date.now()}.png`);
    await page.screenshot({ path: shot });

    this._status = "needs_auth";
    return {
      success: true,
      message: `Código enviado a ${email}. Revisa tu correo y llama POST /api/admin/helpai/auth/verify con { code: "XXXXXX" }`,
      screenshot: shot,
    };
  }

  /**
   * Login Step 2: Submit the verification code received by email.
   * Must be called after loginSendEmail() while the browser is still open.
   */
  async submitAuthCode(code: string): Promise<{ success: boolean; message: string; screenshot?: string }> {
    console.log(`[helpai-worker] Login step 2: submitting code ${code}...`);

    if (!this._authPage || !this.context) {
      return { success: false, message: "No auth browser open. Call loginSendEmail first." };
    }

    const page = this._authPage;

    // Find code input
    const codeSelectors = [
      'input[placeholder*="código" i]',
      'input[placeholder*="code" i]',
      'input[type="number"]',
      'input[inputmode="numeric"]',
      'input[maxlength="6"]',
      'input[maxlength="1"]', // OTP-style
    ];

    let codeInput: ReturnType<Page["locator"]> | null = null;
    for (const sel of codeSelectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
        codeInput = el;
        console.log(`[helpai-worker] Found code input: ${sel}`);
        break;
      }
    }

    // If no code input, try generic text input (new one that appeared after email step)
    if (!codeInput) {
      const el = page.locator('input[type="text"]').first();
      if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
        codeInput = el;
        console.log("[helpai-worker] Found code input: generic text input");
      }
    }

    if (!codeInput) {
      const shot = path.join(SESSION_DIR, `debug-no-code-input-${Date.now()}.png`);
      await page.screenshot({ path: shot });
      return { success: false, message: "Code input not found", screenshot: shot };
    }

    // Handle OTP-style (individual digit inputs)
    const otpInputs = await page.locator('input[maxlength="1"]').all();
    if (otpInputs.length >= 4) {
      console.log(`[helpai-worker] OTP-style: ${otpInputs.length} fields`);
      for (let i = 0; i < Math.min(code.length, otpInputs.length); i++) {
        await otpInputs[i].fill(code[i]);
        await page.waitForTimeout(100);
      }
    } else {
      await codeInput.click();
      await codeInput.fill(code);
    }

    await page.waitForTimeout(500);

    // Click verify/submit
    const verifySelectors = [
      'button:has-text("Verificar")',
      'button:has-text("Verify")',
      'button:has-text("Confirmar")',
      'button:has-text("Iniciar sesión")',
      'button:has-text("Enviar")',
      'button[type="submit"]',
    ];

    let clicked = false;
    for (const sel of verifySelectors) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        const text = await btn.textContent();
        console.log(`[helpai-worker] Clicking: "${text}" (${sel})`);
        await btn.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      await page.keyboard.press("Enter");
    }

    // Wait for auth to complete
    await page.waitForTimeout(5000);

    const shot = path.join(SESSION_DIR, `login-verified-${Date.now()}.png`);
    await page.screenshot({ path: shot });

    // Check if auth succeeded — look for chat elements
    const hasChat = await page.evaluate(() => {
      return !!document.querySelector('textarea') ||
             !!document.querySelector('input[placeholder*="mensaje" i]') ||
             !!document.querySelector('input[placeholder*="Introduce"]');
    });

    // Also check URL — if still on login page, auth may have failed
    const url = page.url();
    const onLoginPage = url.includes("/login") || url.includes("/auth") || url.includes("/signin");

    if (hasChat && !onLoginPage) {
      console.log("[helpai-worker] ✅ Auth successful");
      this._status = "running";
      this._authPage = null;

      // Close the visible browser, cookies are saved. Worker will use headless.
      await this.closeBrowser();

      return { success: true, message: "Autenticación exitosa. Cookies guardadas. Worker listo.", screenshot: shot };
    }

    // Auth might need a redirect — try navigating to main page
    await page.goto("https://www.help-ai-app.com", { waitUntil: "domcontentloaded", timeout: 15_000 });
    await page.waitForTimeout(3000);

    const hasChatRetry = await page.evaluate(() => {
      return !!document.querySelector('textarea') ||
             !!document.querySelector('input[placeholder*="mensaje" i]');
    });

    if (hasChatRetry) {
      console.log("[helpai-worker] ✅ Auth successful (after redirect)");
      this._status = "running";
      this._authPage = null;
      await this.closeBrowser();
      return { success: true, message: "Autenticación exitosa. Cookies guardadas. Worker listo.", screenshot: shot };
    }

    const retryShot = path.join(SESSION_DIR, `login-uncertain-${Date.now()}.png`);
    await page.screenshot({ path: retryShot });
    return {
      success: false,
      message: "Código enviado pero no se detectó chat activo. Revisa el navegador abierto.",
      screenshot: retryShot,
    };
  }

  // ── Internal: Browser management ────────────────────────────────────

  private async ensureBrowser(): Promise<BrowserContext> {
    if (this.context) return this.context;

    const chromium = await getChromium();
    this.context = await chromium.launchPersistentContext(SESSION_DIR, {
      headless: true,
      viewport: { width: 1280, height: 800 },
      args: ["--disable-blink-features=AutomationControlled"],
    });

    return this.context;
  }

  private async closeBrowser(): Promise<void> {
    if (this.context) {
      try {
        await this.context.close();
      } catch {
        // Already closed
      }
      this.context = null;
    }
  }

  // ── Internal: Poll loop ─────────────────────────────────────────────

  private async poll(): Promise<void> {
    if (this.processing) return;
    if (this._status === "needs_auth") return;

    this.processing = true;

    try {
      const db = getDb();

      // Find next pending helpai job
      const pending = await db
        .select()
        .from(agentJobs)
        .where(and(eq(agentJobs.agentId, "helpai"), eq(agentJobs.status, "pending")))
        .limit(1);

      if (pending.length === 0) {
        this.processing = false;
        return;
      }

      this._status = "processing";
      await this.processJob(pending[0]);
      this._status = "running";
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[helpai-worker] Poll error:", msg);
      this._lastError = msg;
    } finally {
      this.processing = false;
    }
  }

  // ── Internal: Job processing ────────────────────────────────────────

  private async processJob(
    job: typeof agentJobs.$inferSelect,
  ): Promise<void> {
    const db = getDb();
    const input = job.input as unknown as HelpAIJobInput;

    if (!input || !input.agentKey || !input.questions) {
      await db
        .update(agentJobs)
        .set({
          status: "failed",
          error: "Invalid job input: agentKey and questions are required",
          completedAt: new Date(),
        })
        .where(eq(agentJobs.id, job.id));
      this._jobsFailed++;
      return;
    }

    // Mark as running
    await db
      .update(agentJobs)
      .set({ status: "running", startedAt: new Date() })
      .where(eq(agentJobs.id, job.id));

    broadcast("agent_progress", {
      jobId: job.id,
      status: "running",
      agent: input.agentKey,
      cycle: input.cycle || 1,
    });

    let page: Page | null = null;

    try {
      const ctx = await this.ensureBrowser();
      page = await ctx.newPage();

      // ── Step 1: Check auth ──────────────────────────────────────────
      const isAuthed = await this.checkAuth(page);
      if (!isAuthed) {
        this._status = "needs_auth";
        await db
          .update(agentJobs)
          .set({ status: "pending", error: "needs_auth — login manually first" })
          .where(eq(agentJobs.id, job.id));

        broadcast("notification", {
          message:
            "Help AI requiere autenticación manual. Ejecuta POST /api/admin/helpai/auth",
          level: "warning",
        });

        await page.close();
        return;
      }

      // ── Step 2: Extract DOCX text context ───────────────────────────
      let contextText = "";
      if (input.docxPaths?.length) {
        const extracted: string[] = [];
        for (const docxPath of input.docxPaths) {
          try {
            if (fs.existsSync(docxPath)) {
              const result = await mammoth.extractRawText({ path: docxPath });
              if (result.value.trim()) {
                extracted.push(
                  `--- ${path.basename(docxPath)} ---\n${result.value.trim()}`,
                );
              }
            }
          } catch (err) {
            console.warn(
              `[helpai-worker] Failed to extract ${docxPath}:`,
              err,
            );
          }
        }
        if (extracted.length) {
          contextText =
            "CONTEXTO DOCUMENTAL (extracto de documentos del expediente):\n\n" +
            extracted.join("\n\n") +
            "\n\n---\n\n";
        }
      }

      // ── Step 3: Resolve agent URL ───────────────────────────────────
      const agentUrl =
        input.agentUrl ||
        AGENT_URLS[input.agentKey] ||
        (input.agentKey.startsWith("http") ? input.agentKey : null);

      if (!agentUrl) {
        throw new Error(
          `Unknown agent key: ${input.agentKey}. Provide agentUrl or use a known key.`,
        );
      }

      // ── Step 4: Send questions, capture response ────────────────────
      const fullPrompt = contextText + input.questions;

      console.log(
        `[helpai-worker] Job ${job.id}: sending ${fullPrompt.length} chars to ${input.agentKey}`,
      );

      const response = await this.sendAndCapture(page, agentUrl, fullPrompt);

      // ── Step 5: Save response ───────────────────────────────────────
      const outputDir = input.outputDir;
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const cycle = input.cycle || 1;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `R${String(cycle).padStart(2, "0")}-${input.templateId || input.agentKey}-${timestamp}.md`;
      const outputPath = path.join(outputDir, filename);

      const header = [
        `# Respuesta Help AI — ${input.agentKey}`,
        `- **Agente:** ${input.agentKey}`,
        `- **Template:** ${input.templateId || "N/A"}`,
        `- **Cliente:** ${input.clientSlug}`,
        `- **Operación:** ${input.opId}`,
        `- **Ciclo:** ${cycle}/${MAX_AUDIT_CYCLES}`,
        `- **Fecha:** ${new Date().toISOString()}`,
        `- **Longitud:** ${response.length} caracteres`,
        "",
        "---",
        "",
      ].join("\n");

      fs.writeFileSync(outputPath, header + response, "utf-8");

      const wordCount = response.split(/\s+/).filter(Boolean).length;

      const output: HelpAIJobOutput = {
        responsePath: outputPath,
        responseLength: response.length,
        wordCount,
        cycle,
        timestamp: new Date().toISOString(),
        agentKey: input.agentKey,
      };

      await db
        .update(agentJobs)
        .set({
          status: "completed",
          output: output as unknown as Record<string, unknown>,
          completedAt: new Date(),
        })
        .where(eq(agentJobs.id, job.id));

      this._jobsCompleted++;

      broadcast("agent_complete", {
        jobId: job.id,
        ...output,
      });

      console.log(
        `[helpai-worker] Job ${job.id} completed: ${wordCount} words saved to ${filename}`,
      );

      await page.close();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[helpai-worker] Job ${job.id} failed:`, errorMsg);
      this._lastError = errorMsg;
      this._jobsFailed++;

      await db
        .update(agentJobs)
        .set({
          status: "failed",
          error: errorMsg,
          completedAt: new Date(),
        })
        .where(eq(agentJobs.id, job.id));

      broadcast("agent_progress", {
        jobId: job.id,
        status: "failed",
        error: errorMsg,
      });

      if (page) {
        try {
          await page.close();
        } catch {
          // Ignore
        }
      }
    }
  }

  // ── Internal: Auth check ────────────────────────────────────────────

  private async checkAuth(page: Page): Promise<boolean> {
    try {
      await page.goto("https://www.help-ai-app.com", {
        waitUntil: "domcontentloaded",
        timeout: 15_000,
      });

      // Wait for page to settle
      await page.waitForTimeout(2000);

      const url = page.url();

      // If redirected to login/auth page, not authenticated
      if (
        url.includes("/login") ||
        url.includes("/auth") ||
        url.includes("/signin") ||
        url.includes("/register")
      ) {
        console.log("[helpai-worker] Auth check: redirected to login page");
        return false;
      }

      // Try to find chat-related elements (indicates logged-in state)
      const chatSelectors = [
        "textarea",
        '[contenteditable="true"]',
        'input[placeholder*="escrib"]',
        'input[placeholder*="Write"]',
        'input[placeholder*="Mensaje"]',
        ".chat-input",
        '[data-testid="chat-input"]',
      ];

      for (const sel of chatSelectors) {
        try {
          const el = await page.waitForSelector(sel, { timeout: 3000 });
          if (el) {
            console.log(`[helpai-worker] Auth check: found ${sel} — authenticated`);
            return true;
          }
        } catch {
          // Try next selector
        }
      }

      // Check for user avatar/menu as auth indicator
      const userSelectors = [
        ".user-avatar",
        ".user-menu",
        '[data-testid="user-menu"]',
        'img[alt*="avatar"]',
        'button[aria-label*="profile"]',
        'button[aria-label*="perfil"]',
      ];

      for (const sel of userSelectors) {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log(`[helpai-worker] Auth check: found ${sel} — authenticated`);
          return true;
        }
      }

      console.log("[helpai-worker] Auth check: no auth indicators found");
      return false;
    } catch (err) {
      console.error("[helpai-worker] Auth check error:", err);
      return false;
    }
  }

  // ── Internal: Send questions and capture response ───────────────────

  private async sendAndCapture(
    page: Page,
    agentUrl: string,
    prompt: string,
  ): Promise<string> {
    // Navigate to the agent
    await page.goto(agentUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.waitForTimeout(3000);

    // ── Find chat input ─────────────────────────────────────────────
    // Confirmed DOM (2026-04-04): textarea with placeholder "Introduce tu mensaje..."
    const inputSelectors = [
      'textarea[placeholder*="Introduce tu mensaje"]',
      "textarea",
      '[contenteditable="true"]',
      'input[type="text"]',
    ];

    let inputEl: ReturnType<Page["locator"]> | null = null;

    for (const sel of inputSelectors) {
      const loc = page.locator(sel).first();
      const visible = await loc
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      if (visible) {
        inputEl = loc;
        console.log(`[helpai-worker] Found input: ${sel}`);
        break;
      }
    }

    if (!inputEl) {
      const debugPath = path.join(
        SESSION_DIR,
        `debug-no-input-${Date.now()}.png`,
      );
      await page.screenshot({ path: debugPath });
      throw new Error(
        `Chat input not found on ${agentUrl}. Debug screenshot: ${debugPath}`,
      );
    }

    // ── Fill text ───────────────────────────────────────────────────
    // Use fill() directly — most reliable for textarea elements
    await inputEl.click();
    await inputEl.fill(prompt);
    await page.waitForTimeout(500);

    // Verify text was filled
    const filled = await inputEl.inputValue().catch(() => "");
    if (!filled || filled.length < 10) {
      // Fallback: type character by character (slower but works with reactive UIs)
      console.warn("[helpai-worker] fill() didn't stick, using type()");
      await inputEl.click();
      await inputEl.press("Meta+a");
      await page.keyboard.type(prompt.substring(0, 2000), { delay: 5 });
    }

    console.log(`[helpai-worker] Text filled (${prompt.length} chars)`);

    // ── Submit ──────────────────────────────────────────────────────
    // Confirmed DOM: send button appears dynamically after text entry.
    // Wait a beat for the button to render, then try multiple selectors.
    await page.waitForTimeout(1000);

    const sendSelectors = [
      'button[type="submit"]',
      'button:has-text("Enviar")',
      'button[aria-label*="end"]',
      'button[aria-label*="nviar"]',
      'button svg[data-testid="send-icon"]',
      // Icon-only send button (common in chat UIs — look for any button near textarea)
      'form button:last-of-type',
    ];

    let sent = false;
    for (const sel of sendSelectors) {
      const btn = page.locator(sel).first();
      const visible = await btn
        .isVisible({ timeout: 1500 })
        .catch(() => false);
      if (visible) {
        await btn.click();
        sent = true;
        console.log(`[helpai-worker] Clicked send: ${sel}`);
        break;
      }
    }

    if (!sent) {
      // Fall back to Enter key (many chat UIs submit on Enter)
      await inputEl.press("Enter");
      console.log("[helpai-worker] Sent via Enter key");
    }

    // Wait for response to start appearing
    await page.waitForTimeout(3000);

    // Wait for streaming to complete
    // Strategy: poll for response stability (text stops changing)
    const response = await this.waitForStableResponse(page);

    if (!response || response.length < 20) {
      const debugPath = path.join(
        SESSION_DIR,
        `debug-no-response-${Date.now()}.png`,
      );
      await page.screenshot({ path: debugPath });
      throw new Error(
        `No meaningful response captured. Debug screenshot: ${debugPath}`,
      );
    }

    return response;
  }

  /**
   * Waits for the AI response to stop streaming by checking text stability.
   * Returns the text of the last assistant message.
   */
  private async waitForStableResponse(page: Page): Promise<string> {
    // Selectors for assistant/AI messages
    const messageSelectors = [
      '[data-role="assistant"]',
      ".assistant-message",
      ".ai-message",
      ".chat-message:last-child",
      ".message:last-child",
      '[class*="response"]',
      '[class*="answer"]',
    ];

    let lastText = "";
    let stableCount = 0;
    const startTime = Date.now();

    while (Date.now() - startTime < RESPONSE_TIMEOUT) {
      await page.waitForTimeout(2000); // Check every 2s

      // Check for loading indicators
      const isLoading = await page.evaluate(() => {
        const indicators = document.querySelectorAll(
          '.loading, .typing, .streaming, [data-loading="true"], .animate-pulse, .animate-spin',
        );
        return indicators.length > 0;
      });

      // Try to get the last message text
      let currentText = "";
      for (const sel of messageSelectors) {
        try {
          const elements = await page.locator(sel).all();
          if (elements.length > 0) {
            const last = elements[elements.length - 1];
            const text = await last.innerText();
            if (text && text.length > currentText.length) {
              currentText = text;
            }
          }
        } catch {
          // Selector not found, try next
        }
      }

      // Fallback: get all text from the main content area
      if (!currentText) {
        currentText = await page.evaluate(() => {
          const main =
            document.querySelector("main") ||
            document.querySelector('[role="main"]') ||
            document.querySelector(".chat-container") ||
            document.querySelector('[class*="chat"]');
          return main?.textContent || "";
        });
      }

      if (currentText === lastText && !isLoading && currentText.length > 20) {
        stableCount++;
        if (stableCount >= 3) {
          // Text stable for 6 seconds (3 × 2s) and no loading indicator
          return currentText;
        }
      } else {
        stableCount = 0;
        lastText = currentText;
      }
    }

    // Timeout — return whatever we have
    console.warn(
      `[helpai-worker] Response timeout after ${RESPONSE_TIMEOUT / 1000}s, returning partial (${lastText.length} chars)`,
    );
    return lastText;
  }
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

export const helpaiWorker = new HelpAIWorker();
