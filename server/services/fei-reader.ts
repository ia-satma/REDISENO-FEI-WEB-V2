/**
 * FEI Filesystem Reader — READ-ONLY access to client expediente data.
 *
 * Reads from two configurable paths:
 *   FEI_CLIENTES_PATH  → clientes/{slug}/FEI-R-MAESTRO/OP-XX/
 *   FEI_ENTREGA_PATH   → ~/Desktop/ENTREGA-{SLUG}-MAESTRO/OP-XX/{carpetas}/
 *
 * NEVER writes to client directories (B.4 compliance).
 */

import fs from "fs";
import path from "path";
import os from "os";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FEI_CLIENTES_PATH =
  process.env.FEI_CLIENTES_PATH ||
  path.join(os.homedir(), "Desktop", "FEI-FISCAL-EVIDENCE-INFRASTRUCTURE-v1.1", "FEI-CLEAN", "clientes");

const FEI_ENTREGA_PATH =
  process.env.FEI_ENTREGA_PATH || path.join(os.homedir(), "Desktop");

// 9 commercial folders — 08-DEFENSA is internal only
const COMMERCIAL_FOLDERS = [
  "00-PORTADA-CONTROL",
  "01-IDENTIDAD",
  "02-CONTRATACION",
  "03-REGULARIZACION",
  "04-EJECUCION",
  "05-ENTREGABLES",
  "06-CIERRE",
  "07-FISCAL-CONTABLE",
  "08-DEFENSA",
] as const;

// Folders visible to clients (08-DEFENSA filtered out)
const CLIENT_VISIBLE_FOLDERS = COMMERCIAL_FOLDERS.filter(
  (f) => f !== "08-DEFENSA",
);

// ---------------------------------------------------------------------------
// Directory listing cache with fs.watch invalidation
// ---------------------------------------------------------------------------

interface CacheEntry {
  data: string[];
  timestamp: number;
}

const dirCache = new Map<string, CacheEntry>();
const watchers = new Map<string, fs.FSWatcher>();
const CACHE_TTL = 60_000; // 1 minute fallback

function invalidateCache(dirPath: string): void {
  dirCache.delete(dirPath);
}

function watchDir(dirPath: string): void {
  if (watchers.has(dirPath)) return;
  try {
    const watcher = fs.watch(dirPath, { persistent: false }, () => {
      invalidateCache(dirPath);
    });
    watcher.on("error", () => {
      watchers.delete(dirPath);
    });
    watchers.set(dirPath, watcher);
  } catch {
    // Directory may not exist yet — that's fine
  }
}

function listDirCached(dirPath: string): string[] {
  const cached = dirCache.get(dirPath);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const entries = fs.readdirSync(dirPath);
    const result = entries.filter((e) => !e.startsWith("."));
    dirCache.set(dirPath, { data: result, timestamp: Date.now() });
    watchDir(dirPath);
    return result;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Slug → path resolution
// ---------------------------------------------------------------------------

/** Map of fei_slug → directory name under clientes/ */
function resolveClientDir(slug: string): string | null {
  const entries = listDirCached(FEI_CLIENTES_PATH);
  // Direct match first
  if (entries.includes(slug)) return slug;
  // Fuzzy: slug is a substring
  const match = entries.find((e) => e.includes(slug) || slug.includes(e));
  return match || null;
}

/** Find the ENTREGA directory on Desktop for a slug */
function resolveEntregaDir(slug: string): string | null {
  const desktopEntries = listDirCached(FEI_ENTREGA_PATH);
  // Pattern: ENTREGA-{SLUG}-MAESTRO or ENTREGA-{SLUG}
  const upper = slug.toUpperCase().replace(/-/g, "-");
  const match = desktopEntries.find((e) => {
    const u = e.toUpperCase();
    return u.startsWith("ENTREGA-") && u.includes(upper);
  });
  return match ? path.join(FEI_ENTREGA_PATH, match) : null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface OperationInfo {
  id: string; // e.g. "OP-01"
  folderCount: number;
  docxCount: number;
  checkpoint: Record<string, unknown> | null;
}

export interface FolderInfo {
  name: string;
  docxFiles: string[];
}

export interface PipelineStatus {
  slug: string;
  clientDir: string;
  operations: string[];
  checkpoint: Record<string, unknown> | null;
  lastModified: string | null;
}

/**
 * List all operations for a client slug from the ENTREGA directory.
 */
export function getOperations(slug: string): OperationInfo[] {
  const entregaDir = resolveEntregaDir(slug);
  if (!entregaDir) return [];

  const entries = listDirCached(entregaDir);
  const ops = entries
    .filter((e) => /^OP-\d+$/i.test(e))
    .sort();

  return ops.map((opId) => {
    const opPath = path.join(entregaDir, opId);
    const folders = listDirCached(opPath).filter((f) =>
      COMMERCIAL_FOLDERS.some((cf) => f === cf),
    );

    let docxCount = 0;
    for (const folder of folders) {
      const fPath = path.join(opPath, folder);
      const files = listDirCached(fPath);
      docxCount += files.filter((f) => f.endsWith(".docx")).length;
    }

    const checkpoint = readJsonSafe(
      path.join(FEI_CLIENTES_PATH, resolveClientDir(slug) || slug, "CHECKPOINT.json"),
    );

    return { id: opId, folderCount: folders.length, docxCount, checkpoint };
  });
}

/**
 * List folders within an operation — filtered for client visibility.
 */
export function getOperationFolders(
  slug: string,
  opId: string,
  includeDefensa = false,
): FolderInfo[] {
  const entregaDir = resolveEntregaDir(slug);
  if (!entregaDir) return [];

  const opPath = path.join(entregaDir, opId);
  const allowedFolders: readonly string[] = includeDefensa
    ? COMMERCIAL_FOLDERS
    : CLIENT_VISIBLE_FOLDERS;

  const entries = listDirCached(opPath);

  return entries
    .filter((e) => allowedFolders.includes(e as typeof COMMERCIAL_FOLDERS[number]))
    .map((folderName) => {
      const fPath = path.join(opPath, folderName);
      const files = listDirCached(fPath).filter((f) => f.endsWith(".docx"));
      return { name: folderName, docxFiles: files };
    });
}

/**
 * Resolve absolute path to a DOCX file — returns null if not found or not DOCX.
 * Validates path traversal.
 */
export function resolveDocxPath(
  slug: string,
  opId: string,
  folder: string,
  filename: string,
): string | null {
  if (!filename.endsWith(".docx")) return null;
  // Prevent path traversal
  if (
    filename.includes("..") ||
    folder.includes("..") ||
    opId.includes("..")
  ) {
    return null;
  }

  const entregaDir = resolveEntregaDir(slug);
  if (!entregaDir) return null;

  const filePath = path.join(entregaDir, opId, folder, filename);
  // Ensure resolved path is within entrega dir
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(entregaDir))) return null;

  try {
    fs.accessSync(resolved, fs.constants.R_OK);
    return resolved;
  } catch {
    return null;
  }
}

/**
 * Get pipeline status for all clients (admin view).
 */
export function getAllPipelineStatus(): PipelineStatus[] {
  const clientDirs = listDirCached(FEI_CLIENTES_PATH);
  const results: PipelineStatus[] = [];

  for (const dir of clientDirs) {
    const fullPath = path.join(FEI_CLIENTES_PATH, dir);
    try {
      const stat = fs.statSync(fullPath);
      if (!stat.isDirectory()) continue;
    } catch {
      continue;
    }

    // Look for FEI-R-MAESTRO or direct OP dirs
    const maestroPath = path.join(fullPath, "FEI-R-MAESTRO");
    let operations: string[] = [];

    if (fs.existsSync(maestroPath)) {
      operations = listDirCached(maestroPath).filter((e) =>
        /^OP-\d+$/i.test(e),
      );
    }

    const checkpoint = readJsonSafe(path.join(fullPath, "CHECKPOINT.json"));

    let lastModified: string | null = null;
    try {
      const stat = fs.statSync(fullPath);
      lastModified = stat.mtime.toISOString();
    } catch {
      // ignore
    }

    results.push({
      slug: dir,
      clientDir: dir,
      operations,
      checkpoint,
      lastModified,
    });
  }

  return results;
}

/**
 * Watch a specific checkpoint file for changes — calls callback on change.
 */
export function watchCheckpoint(
  slug: string,
  callback: () => void,
): (() => void) | null {
  const clientDir = resolveClientDir(slug);
  if (!clientDir) return null;

  const cpPath = path.join(FEI_CLIENTES_PATH, clientDir, "CHECKPOINT.json");
  try {
    const watcher = fs.watch(cpPath, { persistent: false }, () => {
      callback();
    });
    return () => watcher.close();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJsonSafe(filePath: string): Record<string, unknown> | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export { FEI_CLIENTES_PATH, FEI_ENTREGA_PATH, COMMERCIAL_FOLDERS, CLIENT_VISIBLE_FOLDERS };
