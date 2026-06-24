import { eq, desc, and, gt, sql } from "drizzle-orm";
import { getDb, type DrizzleDB } from "./db";
import {
  adminUsers,
  blogPosts,
  blogCategories,
  contactSubmissions,
  newsletterSubscribers,
  agentJobs,
  agentEvents,
  clientUsers,
  magicTokens,
  portalAuditLog,
  siteContent,
  type SiteContent,
  type InsertContact,
  type InsertBlogPost,
  type InsertClientUser,
  type BlogPost,
  type ContactSubmission,
  type AgentJob,
  type ClientUser,
  type MagicToken,
} from "../shared/schema";

// ---------------------------------------------------------------------------
// Types for insert payloads not exported from schema
// ---------------------------------------------------------------------------
type InsertAdmin = typeof adminUsers.$inferInsert;
type InsertAgentJob = typeof agentJobs.$inferInsert;
type InsertAgentEvent = typeof agentEvents.$inferInsert;
type InsertBlogCategory = typeof blogCategories.$inferInsert;

type BlogPostUpdate = Partial<InsertBlogPost>;
type AgentJobUpdate = Partial<Pick<AgentJob, "status" | "output" | "error" | "startedAt" | "completedAt">>;

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const db = getDb();
  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  return rows[0];
}

export async function createPost(data: InsertBlogPost): Promise<BlogPost> {
  const db = getDb();
  const rows = await db.insert(blogPosts).values(data).returning();
  return rows[0];
}

export async function updatePost(id: number, data: BlogPostUpdate): Promise<BlogPost | undefined> {
  const db = getDb();
  const rows = await db
    .update(blogPosts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning();
  return rows[0];
}

export async function deletePost(id: number): Promise<boolean> {
  const db = getDb();
  const rows = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
  return rows.length > 0;
}

// ---------------------------------------------------------------------------
// Blog Categories
// ---------------------------------------------------------------------------

export async function getCategories() {
  const db = getDb();
  return db.select().from(blogCategories);
}

export async function createCategory(data: InsertBlogCategory) {
  const db = getDb();
  const rows = await db.insert(blogCategories).values(data).returning();
  return rows[0];
}

// ---------------------------------------------------------------------------
// Contact Submissions
// ---------------------------------------------------------------------------

export async function createContact(data: InsertContact): Promise<ContactSubmission> {
  const db = getDb();
  const rows = await db.insert(contactSubmissions).values(data).returning();
  return rows[0];
}

export async function getContacts(): Promise<ContactSubmission[]> {
  const db = getDb();
  return db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt));
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export async function subscribe(email: string) {
  const db = getDb();
  const rows = await db
    .insert(newsletterSubscribers)
    .values({ email })
    .onConflictDoNothing({ target: newsletterSubscribers.email })
    .returning();
  return rows[0] ?? { email, alreadySubscribed: true };
}

export async function getSubscribers() {
  const db = getDb();
  return db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.active, true))
    .orderBy(desc(newsletterSubscribers.createdAt));
}

// ---------------------------------------------------------------------------
// Agent Jobs
// ---------------------------------------------------------------------------

export async function createJob(data: InsertAgentJob): Promise<AgentJob> {
  const db = getDb();
  const rows = await db.insert(agentJobs).values(data).returning();
  return rows[0];
}

export async function updateJob(id: number, data: AgentJobUpdate): Promise<AgentJob | undefined> {
  const db = getDb();
  const rows = await db
    .update(agentJobs)
    .set(data)
    .where(eq(agentJobs.id, id))
    .returning();
  return rows[0];
}

export async function getActiveJobs(): Promise<AgentJob[]> {
  const db = getDb();
  return db
    .select()
    .from(agentJobs)
    .where(
      and(
        eq(agentJobs.status, "pending"),
      ),
    )
    .orderBy(desc(agentJobs.createdAt));
}

// ---------------------------------------------------------------------------
// Agent Events
// ---------------------------------------------------------------------------

export async function createEvent(data: InsertAgentEvent) {
  const db = getDb();
  const rows = await db.insert(agentEvents).values(data).returning();
  return rows[0];
}

export async function getRecentEvents(limit = 50) {
  const db = getDb();
  return db
    .select()
    .from(agentEvents)
    .orderBy(desc(agentEvents.createdAt))
    .limit(limit);
}

// ---------------------------------------------------------------------------
// Admin Users
// ---------------------------------------------------------------------------

export async function getAdminByUsername(username: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);
  return rows[0];
}

export async function createAdmin(data: InsertAdmin) {
  const db = getDb();
  const rows = await db.insert(adminUsers).values(data).returning();
  return rows[0];
}

export async function countAdmins(): Promise<number> {
  const db = getDb();
  const rows = await db.select().from(adminUsers);
  return rows.length;
}

export async function countCategories(): Promise<number> {
  const db = getDb();
  const rows = await db.select().from(blogCategories);
  return rows.length;
}

// ---------------------------------------------------------------------------
// Portal: Client Users
// ---------------------------------------------------------------------------

export async function getClientUserByEmail(email: string): Promise<ClientUser | undefined> {
  const db = getDb();
  const rows = await db
    .select()
    .from(clientUsers)
    .where(eq(clientUsers.email, email.toLowerCase()))
    .limit(1);
  return rows[0];
}

export async function getClientUserById(id: number): Promise<ClientUser | undefined> {
  const db = getDb();
  const rows = await db
    .select()
    .from(clientUsers)
    .where(eq(clientUsers.id, id))
    .limit(1);
  return rows[0];
}

export async function getAllClientUsers(): Promise<ClientUser[]> {
  const db = getDb();
  return db
    .select()
    .from(clientUsers)
    .orderBy(desc(clientUsers.createdAt));
}

export async function createClientUser(data: InsertClientUser): Promise<ClientUser> {
  const db = getDb();
  const rows = await db
    .insert(clientUsers)
    .values({ ...data, email: data.email.toLowerCase() })
    .returning();
  return rows[0];
}

export async function updateClientUser(
  id: number,
  data: Partial<Pick<ClientUser, "fullName" | "companyName" | "feiSlug" | "role" | "active">>,
): Promise<ClientUser | undefined> {
  const db = getDb();
  const rows = await db
    .update(clientUsers)
    .set(data)
    .where(eq(clientUsers.id, id))
    .returning();
  return rows[0];
}

export async function deleteClientUser(id: number): Promise<boolean> {
  const db = getDb();
  const rows = await db.delete(clientUsers).where(eq(clientUsers.id, id)).returning();
  return rows.length > 0;
}

// ---------------------------------------------------------------------------
// Portal: Magic Tokens
// ---------------------------------------------------------------------------

export async function createMagicToken(userId: number): Promise<MagicToken> {
  const db = getDb();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const rows = await db
    .insert(magicTokens)
    .values({ userId, expiresAt })
    .returning();
  return rows[0];
}

export async function consumeMagicToken(token: string): Promise<MagicToken | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(magicTokens)
    .where(eq(magicTokens.token, token))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  // Already used
  if (row.usedAt) return null;

  // Expired
  if (new Date() > row.expiresAt) return null;

  // Mark as used
  await db
    .update(magicTokens)
    .set({ usedAt: new Date() })
    .where(eq(magicTokens.id, row.id));

  return row;
}

/**
 * Count tokens created for this user in the last hour (rate limiting).
 */
export async function countRecentTokens(userId: number): Promise<number> {
  const db = getDb();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const rows = await db
    .select()
    .from(magicTokens)
    .where(
      and(
        eq(magicTokens.userId, userId),
        gt(magicTokens.createdAt, oneHourAgo),
      ),
    );
  return rows.length;
}

// ---------------------------------------------------------------------------
// Portal: Audit Log
// ---------------------------------------------------------------------------

export async function logPortalAction(data: {
  userId: number | null;
  action: string;
  resource?: string;
  ip?: string;
  userAgent?: string;
}) {
  const db = getDb();
  await db.insert(portalAuditLog).values({
    userId: data.userId,
    action: data.action,
    resource: data.resource ?? null,
    ip: data.ip ?? null,
    userAgent: data.userAgent ?? null,
  });
}

export async function getAuditLog(limit = 100) {
  const db = getDb();
  return db
    .select()
    .from(portalAuditLog)
    .orderBy(desc(portalAuditLog.createdAt))
    .limit(limit);
}

// ---------------------------------------------------------------------------
// CMS: editable site content (JSON overrides keyed by content group)
// ---------------------------------------------------------------------------
export async function getAllSiteContent(): Promise<SiteContent[]> {
  const db = getDb();
  return db.select().from(siteContent).orderBy(desc(siteContent.updatedAt));
}

/** Returns all overrides as a plain `{ key: value }` map (for the public API). */
export async function getSiteContentMap(): Promise<Record<string, unknown>> {
  const rows = await getAllSiteContent();
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function upsertSiteContent(key: string, value: unknown): Promise<SiteContent> {
  const db = getDb();
  const rows = await db
    .insert(siteContent)
    .values({ key, value })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: { value, updatedAt: new Date() },
    })
    .returning();
  return rows[0];
}

export async function deleteSiteContent(key: string): Promise<boolean> {
  const db = getDb();
  const rows = await db.delete(siteContent).where(eq(siteContent.key, key)).returning();
  return rows.length > 0;
}
