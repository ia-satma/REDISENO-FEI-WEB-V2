import { eq, and, isNull, lt, desc } from "drizzle-orm";
import { getDb } from "../db";
import { isDatabaseAvailable } from "../db";
import { blogPosts, agentJobs } from "../../shared/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IssueSeverity = "critical" | "warning" | "info";

export interface AuditIssue {
  severity: IssueSeverity;
  category: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AuditReport {
  score: number; // 0-100
  status: "healthy" | "degraded" | "unhealthy";
  totalIssues: number;
  bySeverity: Record<IssueSeverity, number>;
  issues: AuditIssue[];
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Health Check
// ---------------------------------------------------------------------------

const ZOMBIE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

export class SystemHealthCheck {
  private issues: AuditIssue[] = [];

  /**
   * Run all health checks and return consolidated report.
   */
  async run(): Promise<AuditReport> {
    this.issues = [];

    if (!isDatabaseAvailable()) {
      this.issues.push({
        severity: "critical",
        category: "database",
        message: "Base de datos no disponible — verificar DATABASE_URL",
      });
      return this.buildReport();
    }

    await Promise.allSettled([
      this.checkZombieJobs(),
      this.checkMissingSEO(),
      this.checkUnprocessedPosts(),
    ]);

    return this.buildReport();
  }

  /**
   * Find and reset zombie jobs (stuck in "processing" for > 10 min).
   */
  async resetZombieJobs(): Promise<number> {
    if (!isDatabaseAvailable()) return 0;

    const db = getDb();
    const threshold = new Date(Date.now() - ZOMBIE_THRESHOLD_MS);

    const zombies = await db
      .select()
      .from(agentJobs)
      .where(
        and(
          eq(agentJobs.status, "processing"),
          lt(agentJobs.startedAt, threshold),
        ),
      );

    for (const zombie of zombies) {
      await db
        .update(agentJobs)
        .set({
          status: "failed",
          error: `Zombie reset — stuck since ${zombie.startedAt?.toISOString()}`,
          completedAt: new Date(),
        })
        .where(eq(agentJobs.id, zombie.id));
    }

    return zombies.length;
  }

  // ── Private checks ──────────────────────────────────────────────────

  private async checkZombieJobs(): Promise<void> {
    try {
      const db = getDb();
      const threshold = new Date(Date.now() - ZOMBIE_THRESHOLD_MS);

      const zombies = await db
        .select({ id: agentJobs.id, agentId: agentJobs.agentId, startedAt: agentJobs.startedAt })
        .from(agentJobs)
        .where(
          and(
            eq(agentJobs.status, "processing"),
            lt(agentJobs.startedAt, threshold),
          ),
        );

      if (zombies.length > 0) {
        this.issues.push({
          severity: "critical",
          category: "zombie_jobs",
          message: `${zombies.length} trabajo(s) zombie detectado(s) — procesando por más de 10 minutos`,
          details: {
            jobIds: zombies.map((z) => z.id),
            agents: zombies.map((z) => z.agentId),
          },
        });
      }
    } catch (err) {
      this.issues.push({
        severity: "warning",
        category: "zombie_jobs",
        message: `Error verificando zombies: ${err instanceof Error ? err.message : "Unknown"}`,
      });
    }
  }

  private async checkMissingSEO(): Promise<void> {
    try {
      const db = getDb();

      const postsWithoutSEO = await db
        .select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug })
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.status, "published"),
            isNull(blogPosts.seoTitle),
          ),
        )
        .orderBy(desc(blogPosts.publishedAt))
        .limit(50);

      if (postsWithoutSEO.length > 0) {
        this.issues.push({
          severity: "warning",
          category: "missing_seo",
          message: `${postsWithoutSEO.length} post(s) publicado(s) sin SEO title/description`,
          details: {
            posts: postsWithoutSEO.map((p) => ({ id: p.id, title: p.title, slug: p.slug })),
          },
        });
      }
    } catch (err) {
      this.issues.push({
        severity: "warning",
        category: "missing_seo",
        message: `Error verificando SEO: ${err instanceof Error ? err.message : "Unknown"}`,
      });
    }
  }

  private async checkUnprocessedPosts(): Promise<void> {
    try {
      const db = getDb();

      const unprocessed = await db
        .select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug })
        .from(blogPosts)
        .where(eq(blogPosts.agentProcessed, false))
        .orderBy(desc(blogPosts.createdAt))
        .limit(50);

      if (unprocessed.length > 0) {
        this.issues.push({
          severity: "info",
          category: "unprocessed_posts",
          message: `${unprocessed.length} post(s) sin procesar por agentes`,
          details: {
            posts: unprocessed.map((p) => ({ id: p.id, title: p.title, slug: p.slug })),
          },
        });
      }
    } catch (err) {
      this.issues.push({
        severity: "warning",
        category: "unprocessed_posts",
        message: `Error verificando posts: ${err instanceof Error ? err.message : "Unknown"}`,
      });
    }
  }

  // ── Report builder ──────────────────────────────────────────────────

  private buildReport(): AuditReport {
    const bySeverity: Record<IssueSeverity, number> = {
      critical: 0,
      warning: 0,
      info: 0,
    };

    for (const issue of this.issues) {
      bySeverity[issue.severity]++;
    }

    // Score: start at 100, deduct per issue
    let score = 100;
    score -= bySeverity.critical * 25;
    score -= bySeverity.warning * 10;
    score -= bySeverity.info * 2;
    score = Math.max(0, Math.min(100, score));

    let status: AuditReport["status"] = "healthy";
    if (bySeverity.critical > 0) status = "unhealthy";
    else if (bySeverity.warning > 0) status = "degraded";

    return {
      score,
      status,
      totalIssues: this.issues.length,
      bySeverity,
      issues: this.issues,
      timestamp: new Date().toISOString(),
    };
  }
}
