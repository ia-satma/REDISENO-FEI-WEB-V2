/**
 * Help AI Auth Test — Diagnose session state and test login flow.
 *
 * Usage:
 *   cd ~/Desktop/website-fei
 *   npx tsx scripts/helpai-auth-test.ts diagnose          # Check if session is valid
 *   npx tsx scripts/helpai-auth-test.ts login <email>     # Start login flow (sends code)
 *   npx tsx scripts/helpai-auth-test.ts verify <code>     # Submit verification code
 *   npx tsx scripts/helpai-auth-test.ts test               # E2E test: send question to materialidad
 */

import { chromium, type BrowserContext, type Page } from "playwright";
import path from "path";
import os from "os";
import fs from "fs";

const SESSION_DIR = path.join(os.homedir(), ".fei-helpai-session");
const SCREENSHOTS_DIR = path.join(SESSION_DIR, "screenshots");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function screenshotPath(name: string): string {
  return path.join(SCREENSHOTS_DIR, `${name}-${Date.now()}.png`);
}

// ---------------------------------------------------------------------------
// Diagnose — check if session cookies are still valid
// ---------------------------------------------------------------------------

async function diagnose(): Promise<void> {
  console.log("[diagnose] Launching browser with persistent context...");

  const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1280, height: 800 },
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = ctx.pages()[0] || await ctx.newPage();

  console.log("[diagnose] Navigating to help-ai-app.com...");
  await page.goto("https://www.help-ai-app.com", {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await page.waitForTimeout(3000);

  const url = page.url();
  console.log(`[diagnose] Current URL: ${url}`);

  // Screenshot the main page
  const mainShot = screenshotPath("diagnose-main");
  await page.screenshot({ path: mainShot, fullPage: false });
  console.log(`[diagnose] Screenshot: ${mainShot}`);

  // Check for login-related elements
  const loginIndicators = await page.evaluate(() => {
    const results: Record<string, boolean> = {};

    // Login modal / form
    const loginTexts = ["correo electrónico", "email", "iniciar sesión", "log in", "sign in", "enviar código"];
    for (const text of loginTexts) {
      const found = document.body.innerText.toLowerCase().includes(text);
      results[`text:"${text}"`] = found;
    }

    // Input fields
    results["input[type=email]"] = !!document.querySelector('input[type="email"]');
    results["input[placeholder*=correo]"] = !!document.querySelector('input[placeholder*="correo"]');
    results["input[placeholder*=email]"] = !!document.querySelector('input[placeholder*="email"]');
    results["textarea"] = !!document.querySelector('textarea');
    results["textarea[placeholder*=mensaje]"] = !!document.querySelector('textarea[placeholder*="mensaje"]') ||
                                                 !!document.querySelector('textarea[placeholder*="Introduce"]');

    // Buttons
    const buttons = Array.from(document.querySelectorAll('button'));
    results["button:Enviar"] = buttons.some(b => b.textContent?.includes("Enviar"));
    results["button:Send"] = buttons.some(b => b.textContent?.includes("Send"));

    return results;
  });

  console.log("\n[diagnose] Page indicators:");
  for (const [key, val] of Object.entries(loginIndicators)) {
    console.log(`  ${val ? "✅" : "❌"} ${key}`);
  }

  // Now navigate to a specific agent to check if chat works
  console.log("\n[diagnose] Navigating to Materialidad agent...");
  await page.goto("https://www.help-ai-app.com/?agent=character-7fb54a9f-277d-42c2-887e-2f3a88ad246d", {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await page.waitForTimeout(3000);

  const agentShot = screenshotPath("diagnose-agent");
  await page.screenshot({ path: agentShot, fullPage: false });
  console.log(`[diagnose] Agent screenshot: ${agentShot}`);

  // Check for login modal on agent page
  const agentState = await page.evaluate(() => {
    const body = document.body.innerText.toLowerCase();
    return {
      hasLoginModal: body.includes("correo electrónico") || body.includes("iniciar sesión"),
      hasChatInput: !!document.querySelector('textarea') || !!document.querySelector('input[placeholder*="mensaje"]'),
      hasEnviarBtn: Array.from(document.querySelectorAll('button')).some(b => b.textContent?.includes("Enviar")),
      pageText: document.body.innerText.substring(0, 500),
    };
  });

  console.log("\n[diagnose] Agent page state:");
  console.log(`  Login modal present: ${agentState.hasLoginModal}`);
  console.log(`  Chat input found: ${agentState.hasChatInput}`);
  console.log(`  Enviar button: ${agentState.hasEnviarBtn}`);
  console.log(`  Page text (first 500 chars):\n${agentState.pageText}`);

  // Keep browser open for manual inspection
  console.log("\n[diagnose] Browser left open for manual inspection.");
  console.log("[diagnose] Press Ctrl+C to close.");

  // Wait indefinitely (user closes with Ctrl+C)
  await new Promise(() => {});
}

// ---------------------------------------------------------------------------
// Login Step 1 — Enter email, request code
// ---------------------------------------------------------------------------

async function loginStep1(email: string): Promise<BrowserContext> {
  console.log(`[login] Starting login for: ${email}`);

  const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1280, height: 800 },
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = ctx.pages()[0] || await ctx.newPage();

  // Navigate to main page
  await page.goto("https://www.help-ai-app.com", {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await page.waitForTimeout(3000);

  // Screenshot before login attempt
  await page.screenshot({ path: screenshotPath("login-before") });

  // Try to find the email input — multiple possible selectors
  const emailSelectors = [
    'input[type="email"]',
    'input[placeholder*="correo"]',
    'input[placeholder*="email"]',
    'input[placeholder*="Escribe tu correo"]',
    'input[name="email"]',
    // Generic text input that might be the email field
    'input[type="text"]',
  ];

  let emailInput = null;
  for (const sel of emailSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
        emailInput = el;
        console.log(`[login] Found email input: ${sel}`);
        break;
      }
    } catch {
      // Try next
    }
  }

  if (!emailInput) {
    // Maybe we need to click a "login" or "iniciar sesión" button first
    console.log("[login] No email input found, looking for login trigger button...");

    const triggerSelectors = [
      'button:has-text("Iniciar sesión")',
      'button:has-text("Log in")',
      'button:has-text("Sign in")',
      'a:has-text("Iniciar sesión")',
      'a:has-text("Log in")',
      '[data-testid="login-button"]',
    ];

    for (const sel of triggerSelectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log(`[login] Clicking login trigger: ${sel}`);
          await btn.click();
          await page.waitForTimeout(2000);
          break;
        }
      } catch {
        // Next
      }
    }

    // Try email selectors again after clicking login
    for (const sel of emailSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
          emailInput = el;
          console.log(`[login] Found email input after trigger: ${sel}`);
          break;
        }
      } catch {
        // Next
      }
    }
  }

  if (!emailInput) {
    const shot = screenshotPath("login-no-email-input");
    await page.screenshot({ path: shot });
    console.error(`[login] FAILED: Could not find email input. Screenshot: ${shot}`);
    console.log("[login] Browser left open for manual inspection. Ctrl+C to close.");
    await new Promise(() => {});
    return ctx; // unreachable but TypeScript needs it
  }

  // Fill email
  await emailInput.click();
  await emailInput.fill(email);
  console.log(`[login] Email filled: ${email}`);

  await page.waitForTimeout(500);

  // Click "Enviar código" or equivalent
  const sendCodeSelectors = [
    'button:has-text("Enviar código")',
    'button:has-text("Enviar Código")',
    'button:has-text("Send code")',
    'button:has-text("Enviar")',
    'button:has-text("Continuar")',
    'button:has-text("Continue")',
    'button[type="submit"]',
  ];

  let clicked = false;
  for (const sel of sendCodeSelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        const btnText = await btn.textContent();
        console.log(`[login] Clicking: "${btnText}" (${sel})`);
        await btn.click();
        clicked = true;
        break;
      }
    } catch {
      // Next
    }
  }

  if (!clicked) {
    // Try Enter key as fallback
    await emailInput.press("Enter");
    console.log("[login] Submitted via Enter key");
  }

  await page.waitForTimeout(2000);
  const shotAfter = screenshotPath("login-after-email");
  await page.screenshot({ path: shotAfter });
  console.log(`[login] Screenshot after email submit: ${shotAfter}`);
  console.log("[login] Check your email for the verification code.");
  console.log("[login] Then run: npx tsx scripts/helpai-auth-test.ts verify <code>");
  console.log("[login] Browser left open — DO NOT close it. Ctrl+C only after verify.");

  // Keep browser open — the verify command will re-attach via persistent context
  // Actually, we can't re-attach to an open browser. We need to keep this process alive.
  // So instead, let's wait for user input from stdin.

  const readline = await import("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const code = await new Promise<string>((resolve) => {
    rl.question("\n>>> Ingresa el código de verificación: ", (answer) => {
      resolve(answer.trim());
      rl.close();
    });
  });

  if (code) {
    await verifyCodeOnPage(page, code);
  }

  console.log("[login] Auth flow complete. Browser left open for inspection. Ctrl+C to close.");
  await new Promise(() => {});
  return ctx;
}

// ---------------------------------------------------------------------------
// Verify code — enter the code on the already-open page
// ---------------------------------------------------------------------------

async function verifyCodeOnPage(page: Page, code: string): Promise<void> {
  console.log(`[verify] Entering code: ${code}`);

  // Find the code input
  const codeSelectors = [
    'input[placeholder*="código"]',
    'input[placeholder*="code"]',
    'input[placeholder*="Código"]',
    'input[type="number"]',
    'input[type="text"]',
    'input[inputmode="numeric"]',
    // OTP-style individual digit inputs
    'input[maxlength="1"]',
  ];

  let codeInput = null;
  for (const sel of codeSelectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
        codeInput = el;
        console.log(`[verify] Found code input: ${sel}`);
        break;
      }
    } catch {
      // Next
    }
  }

  if (!codeInput) {
    const shot = screenshotPath("verify-no-code-input");
    await page.screenshot({ path: shot });
    console.error(`[verify] FAILED: Could not find code input. Screenshot: ${shot}`);
    return;
  }

  // Check if it's OTP-style (multiple single-digit inputs)
  const otpInputs = await page.locator('input[maxlength="1"]').all();
  if (otpInputs.length >= 4) {
    // OTP style — fill each digit
    console.log(`[verify] OTP-style input detected (${otpInputs.length} fields)`);
    for (let i = 0; i < Math.min(code.length, otpInputs.length); i++) {
      await otpInputs[i].fill(code[i]);
      await page.waitForTimeout(100);
    }
  } else {
    // Single input
    await codeInput.click();
    await codeInput.fill(code);
  }

  await page.waitForTimeout(500);

  // Click verify/submit button
  const verifySelectors = [
    'button:has-text("Verificar")',
    'button:has-text("Verify")',
    'button:has-text("Confirmar")',
    'button:has-text("Confirm")',
    'button:has-text("Enviar")',
    'button:has-text("Iniciar sesión")',
    'button[type="submit"]',
  ];

  let clicked = false;
  for (const sel of verifySelectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        const btnText = await btn.textContent();
        console.log(`[verify] Clicking: "${btnText}" (${sel})`);
        await btn.click();
        clicked = true;
        break;
      }
    } catch {
      // Next
    }
  }

  if (!clicked) {
    await page.keyboard.press("Enter");
    console.log("[verify] Submitted via Enter key");
  }

  // Wait for auth to complete
  await page.waitForTimeout(5000);

  const shot = screenshotPath("verify-after");
  await page.screenshot({ path: shot });
  console.log(`[verify] Screenshot after verify: ${shot}`);

  // Check if we're now authenticated
  const url = page.url();
  console.log(`[verify] Current URL: ${url}`);

  const hasChat = await page.evaluate(() => {
    return !!document.querySelector('textarea') ||
           !!document.querySelector('input[placeholder*="mensaje"]') ||
           !!document.querySelector('input[placeholder*="Introduce"]');
  });

  if (hasChat) {
    console.log("[verify] ✅ Authentication successful! Chat input found.");
  } else {
    console.log("[verify] ⚠️  Chat input not found — auth may have failed or page needs navigation.");
  }
}

// ---------------------------------------------------------------------------
// E2E Test — send a real question to materialidad agent
// ---------------------------------------------------------------------------

async function e2eTest(): Promise<void> {
  console.log("[e2e] Launching E2E test against Materialidad agent...");

  const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1280, height: 800 },
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = ctx.pages()[0] || await ctx.newPage();

  const agentUrl = "https://www.help-ai-app.com/?agent=character-7fb54a9f-277d-42c2-887e-2f3a88ad246d";
  console.log(`[e2e] Navigating to: ${agentUrl}`);

  await page.goto(agentUrl, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: screenshotPath("e2e-agent-loaded") });

  // Check for login modal
  const needsLogin = await page.evaluate(() => {
    const body = document.body.innerText.toLowerCase();
    return body.includes("correo electrónico") || body.includes("iniciar sesión") || body.includes("log in");
  });

  if (needsLogin) {
    console.log("[e2e] ❌ Login required. Run login first:");
    console.log("  npx tsx scripts/helpai-auth-test.ts login <your-email>");
    await ctx.close();
    return;
  }

  // Find chat input
  const textarea = page.locator('textarea').first();
  const isVisible = await textarea.isVisible({ timeout: 5000 }).catch(() => false);

  if (!isVisible) {
    console.log("[e2e] ❌ Chat textarea not found");
    await page.screenshot({ path: screenshotPath("e2e-no-textarea") });
    await ctx.close();
    return;
  }

  // Check for login modal BEFORE sending (might appear on agent page)
  const loginModalCheck = await page.evaluate(() => {
    const body = document.body.innerText.toLowerCase();
    return {
      hasLoginModal: body.includes("correo electrónico") || body.includes("iniciar sesión"),
      hasLoginInput: !!document.querySelector('input[type="email"]') || !!document.querySelector('input[placeholder*="correo"]'),
    };
  });

  if (loginModalCheck.hasLoginModal || loginModalCheck.hasLoginInput) {
    console.log("[e2e] ⚠️ Login modal detected on agent page. Session may have expired.");
    console.log("[e2e] Run login first: npx tsx scripts/helpai-auth-test.ts login santiago@satma.mx");
    await page.screenshot({ path: screenshotPath("e2e-needs-login") });
    await ctx.close();
    return;
  }

  // Send test question
  const testQuestion = "¿Cuáles son los 5 elementos fundamentales que el SAT evalúa para determinar la materialidad de una operación de servicios profesionales? Responde de forma breve y enumerada.";

  console.log(`[e2e] Sending test question (${testQuestion.length} chars)...`);
  await textarea.click();
  await textarea.fill(testQuestion);
  await page.waitForTimeout(500);

  // Wait for send button to appear (renders dynamically after text input)
  await page.waitForTimeout(1000);

  // Try multiple send button selectors
  const sendSelectors = [
    'button[type="submit"]',
    'button:has-text("Enviar")',
    'button[aria-label*="end"]',
    'button[aria-label*="nviar"]',
    'form button:last-of-type',
  ];

  let sent = false;
  for (const sel of sendSelectors) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
      console.log(`[e2e] Found send button: ${sel}`);
      await btn.click();
      sent = true;
      break;
    }
  }

  if (!sent) {
    // Fallback: Enter key
    await textarea.press("Enter");
    console.log("[e2e] Sent via Enter key");
  }

  // Wait for response
  console.log("[e2e] Waiting for response (max 3 min)...");

  let lastText = "";
  let stableCount = 0;
  const startTime = Date.now();
  const TIMEOUT = 180_000;

  while (Date.now() - startTime < TIMEOUT) {
    await page.waitForTimeout(2000);

    // Get all message-like elements' text
    const currentText = await page.evaluate(() => {
      // Try to get the last message container
      const allMessages = document.querySelectorAll('[class*="message"], [class*="Message"], [data-role]');
      if (allMessages.length > 0) {
        const last = allMessages[allMessages.length - 1];
        return last.textContent || "";
      }
      // Fallback: get main content
      const main = document.querySelector("main") || document.querySelector('[class*="chat"]');
      return main?.textContent || "";
    });

    if (currentText.length > lastText.length + 10) {
      // Still growing
      console.log(`[e2e] Response growing: ${currentText.length} chars...`);
      lastText = currentText;
      stableCount = 0;
    } else if (currentText === lastText && currentText.length > 50) {
      stableCount++;
      if (stableCount >= 3) {
        console.log(`[e2e] Response stable after ${((Date.now() - startTime) / 1000).toFixed(0)}s`);
        break;
      }
    } else {
      lastText = currentText;
      stableCount = 0;
    }
  }

  await page.screenshot({ path: screenshotPath("e2e-response") });

  if (lastText.length > 50) {
    console.log(`\n[e2e] ✅ Response captured (${lastText.length} chars):`);
    console.log("─".repeat(60));
    console.log(lastText.substring(0, 1000));
    if (lastText.length > 1000) console.log(`\n... (${lastText.length - 1000} more chars)`);
    console.log("─".repeat(60));

    // Save response
    const outPath = path.join(SCREENSHOTS_DIR, `e2e-response-${Date.now()}.md`);
    fs.writeFileSync(outPath, `# E2E Test Response — Materialidad\n\n${lastText}`, "utf-8");
    console.log(`[e2e] Response saved: ${outPath}`);
  } else {
    console.log(`[e2e] ❌ No meaningful response captured (${lastText.length} chars)`);
  }

  console.log("\n[e2e] Browser left open. Ctrl+C to close.");
  await new Promise(() => {});
}

// ---------------------------------------------------------------------------
// Main router
// ---------------------------------------------------------------------------

const [, , command, arg] = process.argv;

switch (command) {
  case "diagnose":
    diagnose().catch(console.error);
    break;
  case "login":
    if (!arg) {
      console.error("Usage: npx tsx scripts/helpai-auth-test.ts login <email>");
      process.exit(1);
    }
    loginStep1(arg).catch(console.error);
    break;
  case "verify":
    console.log("Note: verify is handled interactively during login flow.");
    console.log("Run: npx tsx scripts/helpai-auth-test.ts login <email>");
    break;
  case "test":
    e2eTest().catch(console.error);
    break;
  default:
    console.log(`
Help AI Auth Test

Commands:
  diagnose          Check if session is valid (opens browser)
  login <email>     Start login flow (email + code verification)
  test              E2E test: send question to Materialidad agent

Examples:
  npx tsx scripts/helpai-auth-test.ts diagnose
  npx tsx scripts/helpai-auth-test.ts login user@example.com
  npx tsx scripts/helpai-auth-test.ts test
`);
}
