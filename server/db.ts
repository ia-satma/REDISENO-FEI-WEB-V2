import pg from "pg";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import * as schema from "../shared/schema";
import { INIT_SQL } from "./init-sql";

export type DrizzleDB = NodePgDatabase<typeof schema>;

let db: DrizzleDB | null = null;
let pool: pg.Pool | null = null;

/**
 * Initialize the database. Zero-config by design:
 *  - If DATABASE_URL is set → connect to that managed Postgres (production).
 *  - Otherwise → spin up an embedded Postgres (PGlite) on disk, so the backend
 *    ALWAYS connects and works out of the box with nothing to configure.
 * In both cases the schema is created idempotently (CREATE TABLE IF NOT EXISTS).
 * Must be awaited once at startup before routes/seed run.
 */
export async function initDb(): Promise<void> {
  if (db) return;
  const url = process.env.DATABASE_URL;

  if (url) {
    pool = new pg.Pool({ connectionString: url });
    db = drizzlePg(pool, { schema });
    await pool.query(INIT_SQL);
    console.log("[db] Connected to managed Postgres (DATABASE_URL).");
  } else {
    const dir = process.env.PGLITE_DIR || "./.localdb";
    const client = new PGlite(dir);
    await client.waitReady;
    await client.exec(INIT_SQL);
    // The pglite drizzle instance exposes the same query builder as node-postgres.
    db = drizzlePglite(client, { schema }) as unknown as DrizzleDB;
    console.log(
      `[db] Embedded Postgres (PGlite) ready at "${dir}" — zero-config. ` +
        "Set DATABASE_URL to use a managed Postgres in production.",
    );
  }
}

/** Returns the drizzle instance, or throws if initDb() has not run yet. */
export function getDb(): DrizzleDB {
  if (!db) {
    throw new Error("Database not initialized — call initDb() at startup first.");
  }
  return db;
}

export function isDatabaseAvailable(): boolean {
  return db !== null;
}

export { pool };
