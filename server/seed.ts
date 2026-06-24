import { isDatabaseAvailable } from "./db";
import { hashPassword } from "./routes";
import * as storage from "./storage";

// Initial admin credentials. For production, override via ADMIN_USERNAME /
// ADMIN_PASSWORD env vars so the password doesn't live in source control.
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "feiadministrador1";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "satmapower1";

const DEFAULT_CATEGORIES: Array<{ name: string; slug: string; description: string }> = [
  {
    name: "Materialidad Fiscal",
    slug: "materialidad-fiscal",
    description: "Evidencia documental y soporte de operaciones fiscales",
  },
  {
    name: "Defensa SAT",
    slug: "defensa-sat",
    description: "Estrategias de defensa ante auditorias y requerimientos del SAT",
  },
  {
    name: "Compliance",
    slug: "compliance",
    description: "Cumplimiento normativo y mejores practicas fiscales",
  },
  {
    name: "Actualizaciones Fiscales",
    slug: "actualizaciones-fiscales",
    description: "Novedades en legislacion y regulacion fiscal mexicana",
  },
];

export async function seed(): Promise<void> {
  if (!isDatabaseAvailable()) {
    console.log("[seed] Database not available — skipping seed.");
    return;
  }

  try {
    // Seed admin user if none exist
    const adminCount = await storage.countAdmins();
    if (adminCount === 0) {
      const hashedPassword = await hashPassword(DEFAULT_ADMIN_PASSWORD);
      await storage.createAdmin({
        username: DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`[seed] Created default admin user: "${DEFAULT_ADMIN_USERNAME}"`);
    } else {
      console.log(`[seed] Admin users already exist (${adminCount}) — skipping.`);
    }

    // Seed blog categories if none exist
    const categoryCount = await storage.countCategories();
    if (categoryCount === 0) {
      for (const cat of DEFAULT_CATEGORIES) {
        await storage.createCategory(cat);
      }
      console.log(`[seed] Created ${DEFAULT_CATEGORIES.length} default blog categories.`);
    } else {
      console.log(`[seed] Blog categories already exist (${categoryCount}) — skipping.`);
    }
  } catch (err) {
    console.error("[seed] Error during seeding:", err);
    // Non-fatal — server continues without seed data
  }
}
