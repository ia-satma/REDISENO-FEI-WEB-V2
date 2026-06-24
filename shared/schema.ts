import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  varchar,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog posts
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    coverImage: text("cover_image"),
    categoryId: integer("category_id").references(() => blogCategories.id),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    seoScore: integer("seo_score").default(0),
    agentProcessed: boolean("agent_processed").default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("blog_posts_slug_idx").on(table.slug)],
);

// Blog categories
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
});

// Contact submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  position: text("position"),
  message: text("message").notNull(),
  source: varchar("source", { length: 50 }).default("website"),
  status: varchar("status", { length: 20 }).default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Newsletter subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent jobs
export const agentJobs = pgTable(
  "agent_jobs",
  {
    id: serial("id").primaryKey(),
    agentId: varchar("agent_id", { length: 100 }).notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    input: jsonb("input"),
    output: jsonb("output"),
    error: text("error"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("agent_jobs_status_idx").on(table.status)],
);

// Agent events
export const agentEvents = pgTable("agent_events", {
  id: serial("id").primaryKey(),
  agentId: varchar("agent_id", { length: 100 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Portal: Client users (magic link auth)
// ---------------------------------------------------------------------------
export const clientUsers = pgTable(
  "client_users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    fullName: text("full_name").notNull(),
    companyName: text("company_name").notNull(),
    feiSlug: varchar("fei_slug", { length: 100 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("viewer"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("client_users_slug_idx").on(table.feiSlug)],
);

// Portal: Magic link tokens
export const magicTokens = pgTable(
  "magic_tokens",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => clientUsers.id, { onDelete: "cascade" }),
    token: uuid("token").notNull().unique().defaultRandom(),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("magic_tokens_token_idx").on(table.token)],
);

// Portal: Audit log
export const portalAuditLog = pgTable(
  "portal_audit_log",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => clientUsers.id),
    action: varchar("action", { length: 100 }).notNull(),
    resource: text("resource"),
    ip: varchar("ip", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("portal_audit_user_idx").on(table.userId)],
);

// ---------------------------------------------------------------------------
// CMS: editable site content (JSON overrides over the static config/content defaults)
// ---------------------------------------------------------------------------
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;

// ---------------------------------------------------------------------------
// Zod schemas for validation
// ---------------------------------------------------------------------------
export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  active: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientUserSchema = createInsertSchema(clientUsers).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertClientUser = z.infer<typeof insertClientUserSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type AgentJob = typeof agentJobs.$inferSelect;
export type ClientUser = typeof clientUsers.$inferSelect;
export type MagicToken = typeof magicTokens.$inferSelect;
export type PortalAuditEntry = typeof portalAuditLog.$inferSelect;
