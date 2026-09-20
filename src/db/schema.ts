// ============================================================
// ImprintAI + BookStock — Complete Database Schema
// PostgreSQL with Row-Level Security (RLS) for Multi-Tenancy
// ============================================================

import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ──────────────────────────────────────────────────

export const planEnum = pgEnum("plan", [
  "free",
  "starter",
  "professional",
  "enterprise",
]);
export const roleEnum = pgEnum("role", [
  "author",
  "editor",
  "publisher",
  "admin",
  "beta_reader",
  "warehouse_staff",
]);
export const manuscriptStatusEnum = pgEnum("manuscript_status", [
  "draft",
  "in_review",
  "revision",
  "approved",
  "published",
  "archived",
]);
export const aiAgentEnum = pgEnum("ai_agent", [
  "structural_architect",
  "line_editor",
  "continuity_guardian",
  "market_analyst",
  "authenticity_auditor",
  "synthesis",
]);
export const suggestionStatusEnum = pgEnum("suggestion_status", [
  "pending",
  "accepted",
  "rejected",
  "deferred",
]);
export const blockchainRecordTypeEnum = pgEnum("blockchain_record_type", [
  "copyright",
  "stock_movement",
  "smart_contract",
  "audit",
]);
export const bookFormatEnum = pgEnum("book_format", [
  "hardcover",
  "paperback",
  "ebook",
  "audiobook",
]);
export const movementTypeEnum = pgEnum("movement_type", [
  "received",
  "transferred",
  "sold",
  "returned",
  "damaged",
  "audited",
  "adjusted",
]);
export const purchaseOrderStatusEnum = pgEnum("purchase_order_status", [
  "draft",
  "sent",
  "confirmed",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
]);
export const salesOrderStatusEnum = pgEnum("sales_order_status", [
  "pending",
  "confirmed",
  "fulfilled",
  "shipped",
  "delivered",
  "cancelled",
]);
export const returnStatusEnum = pgEnum("return_status", [
  "pending",
  "inspected",
  "restocked",
  "written_off",
]);
export const returnConditionEnum = pgEnum("return_condition", [
  "mint",
  "good",
  "damaged",
  "defective",
]);
export const supplierTypeEnum = pgEnum("supplier_type", [
  "printer",
  "distributor",
  "paper_supplier",
  "binding_service",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "review",
  "done",
]);
export const chapterStatusEnum = pgEnum("chapter_status", [
  "draft",
  "ai_reviewed",
  "editor_reviewed",
  "approved",
]);

// ─── Publishing Domain Tables ───────────────────────────────

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    plan: planEnum("plan").notNull().default("free"),
    logoUrl: text("logo_url"),
    settings: jsonb("settings").default({}),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("tenants_slug_idx").on(t.slug)]
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    role: roleEnum("role").notNull().default("author"),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_tenant_idx").on(t.email, t.tenantId),
    index("users_tenant_idx").on(t.tenantId),
  ]
);

export const manuscripts = pgTable(
  "manuscripts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    genre: varchar("genre", { length: 100 }),
    wordCount: integer("word_count").notNull().default(0),
    status: manuscriptStatusEnum("status").notNull().default("draft"),
    currentVersion: integer("current_version").notNull().default(1),
    synopsis: text("synopsis"),
    coverUrl: text("cover_url"),
    aiAnalysisComplete: boolean("ai_analysis_complete")
      .notNull()
      .default(false),
    blockchainTimestamp: timestamp("blockchain_timestamp", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("manuscripts_tenant_idx").on(t.tenantId),
    index("manuscripts_author_idx").on(t.authorId),
  ]
);

export const manuscriptVersions = pgTable(
  "manuscript_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    content: text("content"),
    contentHash: varchar("content_hash", { length: 128 }),
    blockchainTxId: text("blockchain_tx_id"),
    changeNotes: text("change_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("mv_manuscript_version_idx").on(
      t.manuscriptId,
      t.versionNumber
    ),
  ]
);

export const chapters = pgTable(
  "chapters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    chapterNumber: integer("chapter_number").notNull(),
    title: varchar("title", { length: 500 }),
    content: text("content"),
    wordCount: integer("word_count").notNull().default(0),
    status: chapterStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("chapters_manuscript_number_idx").on(
      t.manuscriptId,
      t.chapterNumber
    ),
  ]
);

export const storyBibleCharacters = pgTable(
  "story_bible_characters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    age: varchar("age", { length: 50 }),
    physicalDescription: text("physical_description"),
    personality: text("personality"),
    voice: text("voice"),
    relationships: jsonb("relationships").default([]),
    arc: text("arc"),
    firstAppearance: varchar("first_appearance", { length: 100 }),
    lastAppearance: varchar("last_appearance", { length: 100 }),
    isApproved: boolean("is_approved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("sbc_manuscript_idx").on(t.manuscriptId)]
);

export const storyBibleWorldFacts = pgTable(
  "story_bible_world_facts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    category: varchar("category", { length: 100 }).notNull(),
    fact: text("fact").notNull(),
    sourceChapter: varchar("source_chapter", { length: 100 }),
    isApproved: boolean("is_approved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("sbwf_manuscript_idx").on(t.manuscriptId)]
);

export const storyBibleTimeline = pgTable(
  "story_bible_timeline",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    event: text("event").notNull(),
    chapter: varchar("chapter", { length: 100 }),
    sequence: integer("sequence").notNull(),
    isApproved: boolean("is_approved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("sbt_manuscript_idx").on(t.manuscriptId)]
);

export const aiSuggestions = pgTable(
  "ai_suggestions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    chapterId: uuid("chapter_id"),
    agentType: aiAgentEnum("agent_type").notNull(),
    category: varchar("category", { length: 100 }),
    suggestion: text("suggestion").notNull(),
    context: text("context"),
    severity: varchar("severity", { length: 20 }).default("info"),
    status: suggestionStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("ai_suggestions_manuscript_idx").on(t.manuscriptId),
    index("ai_suggestions_status_idx").on(t.status),
  ]
);

export const blockchainRecords = pgTable(
  "blockchain_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    manuscriptId: uuid("manuscript_id"),
    hash: varchar("hash", { length: 128 }).notNull(),
    txId: text("tx_id").notNull(),
    type: blockchainRecordTypeEnum("type").notNull(),
    metadata: jsonb("metadata").default({}),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("blockchain_records_tenant_idx").on(t.tenantId),
    index("blockchain_records_type_idx").on(t.type),
  ]
);

export const smartContracts = pgTable(
  "smart_contracts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    stakeholder: varchar("stakeholder", { length: 255 }).notNull(),
    percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
    contractAddress: text("contract_address"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("smart_contracts_manuscript_idx").on(t.manuscriptId)]
);

// ─── Inventory Domain Tables ────────────────────────────────

export const books = pgTable(
  "books",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    isbn: varchar("isbn", { length: 20 }),
    title: varchar("title", { length: 500 }).notNull(),
    authorId: uuid("author_id").references(() => users.id),
    manuscriptId: uuid("manuscript_id").references(() => manuscripts.id),
    genre: varchar("genre", { length: 100 }),
    format: bookFormatEnum("format").notNull().default("paperback"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    costPrice: decimal("cost_price", { precision: 10, scale: 2 }).default("0"),
    publicationDate: timestamp("publication_date", { withTimezone: true }),
    coverUrl: text("cover_url"),
    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("books_tenant_idx").on(t.tenantId),
    uniqueIndex("books_isbn_idx").on(t.isbn),
  ]
);

export const warehouses = pgTable(
  "warehouses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }),
    capacity: integer("capacity").notNull().default(10000),
    currentUtilization: integer("current_utilization").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("warehouses_tenant_idx").on(t.tenantId)]
);

export const stockItems = pgTable(
  "stock_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    safetyStock: integer("safety_stock").notNull().default(50),
    reorderPoint: integer("reorder_point").notNull().default(100),
    lastUpdated: timestamp("last_updated", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("stock_items_book_warehouse_idx").on(
      t.bookId,
      t.warehouseId
    ),
    index("stock_items_tenant_idx").on(t.tenantId),
  ]
);

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id),
    movementType: movementTypeEnum("movement_type").notNull(),
    quantity: integer("quantity").notNull(),
    referenceId: uuid("reference_id"),
    blockchainTxId: text("blockchain_tx_id"),
    notes: text("notes"),
    performedBy: uuid("performed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("stock_movements_tenant_idx").on(t.tenantId),
    index("stock_movements_book_idx").on(t.bookId),
    index("stock_movements_created_idx").on(t.createdAt),
  ]
);

export const suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    type: supplierTypeEnum("type").notNull(),
    contactEmail: varchar("contact_email", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 50 }),
    address: text("address"),
    leadTimeDays: integer("lead_time_days").notNull().default(14),
    rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("suppliers_tenant_idx").on(t.tenantId)]
);

export const purchaseOrders = pgTable(
  "purchase_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id),
    status: purchaseOrderStatusEnum("status").notNull().default("draft"),
    totalCost: decimal("total_cost", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    expectedDelivery: timestamp("expected_delivery", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("purchase_orders_tenant_idx").on(t.tenantId),
    index("purchase_orders_status_idx").on(t.status),
  ]
);

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  poId: uuid("po_id")
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: "cascade" }),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id),
  quantity: integer("quantity").notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(),
});

export const salesOrders = pgTable(
  "sales_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }),
    status: salesOrderStatusEnum("status").notNull().default("pending"),
    warehouseId: uuid("warehouse_id").references(() => warehouses.id),
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    shippingAddress: text("shipping_address"),
    trackingNumber: text("tracking_number"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("sales_orders_tenant_idx").on(t.tenantId),
    index("sales_orders_status_idx").on(t.status),
  ]
);

export const salesOrderItems = pgTable("sales_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  salesOrderId: uuid("sales_order_id")
    .notNull()
    .references(() => salesOrders.id, { onDelete: "cascade" }),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const returns = pgTable(
  "returns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    salesOrderId: uuid("sales_order_id")
      .notNull()
      .references(() => salesOrders.id),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id),
    quantity: integer("quantity").notNull(),
    reason: text("reason"),
    condition: returnConditionEnum("condition").notNull().default("good"),
    status: returnStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("returns_tenant_idx").on(t.tenantId),
    index("returns_status_idx").on(t.status),
  ]
);

// ─── Collaboration & Tasks ──────────────────────────────────

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    manuscriptId: uuid("manuscript_id").references(() => manuscripts.id),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("todo"),
    priority: varchar("priority", { length: 20 }).default("medium"),
    assigneeId: uuid("assignee_id").references(() => users.id),
    dueDate: timestamp("due_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("tasks_tenant_idx").on(t.tenantId)]
);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  manuscriptId: uuid("manuscript_id")
    .notNull()
    .references(() => manuscripts.id, { onDelete: "cascade" }),
  chapterId: uuid("chapter_id"),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    message: text("message"),
    type: varchar("type", { length: 50 }).default("info"),
    isRead: boolean("is_read").notNull().default(false),
    link: text("link"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("notifications_user_idx").on(t.userId),
    index("notifications_unread_idx").on(t.userId, t.isRead),
  ]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    resourceType: varchar("resource_type", { length: 100 }),
    resourceId: uuid("resource_id"),
    details: jsonb("details").default({}),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("audit_logs_tenant_idx").on(t.tenantId),
    index("audit_logs_created_idx").on(t.createdAt),
  ]
);

// ─── Audiobook Tables ───────────────────────────────────────

export const audiobooks = pgTable(
  "audiobooks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("draft"),
    voiceConfig: jsonb("voice_config").default({}),
    totalDuration: integer("total_duration_seconds").default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("audiobooks_tenant_idx").on(t.tenantId)]
);

export const audiobookChapters = pgTable("audiobook_chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  audiobookId: uuid("audiobook_id")
    .notNull()
    .references(() => audiobooks.id, { onDelete: "cascade" }),
  chapterId: uuid("chapter_id")
    .notNull()
    .references(() => chapters.id),
  audioUrl: text("audio_url"),
  duration: integer("duration_seconds").default(0),
  status: varchar("status", { length: 50 }).default("pending"),
  voiceId: varchar("voice_id", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Beta Reader Tables ─────────────────────────────────────

export const betaReaderAssignments = pgTable(
  "beta_reader_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    manuscriptId: uuid("manuscript_id")
      .notNull()
      .references(() => manuscripts.id, { onDelete: "cascade" }),
    readerId: uuid("reader_id")
      .notNull()
      .references(() => users.id),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deadlineAt: timestamp("deadline_at", { withTimezone: true }),
    progress: integer("progress").notNull().default(0),
    status: varchar("status", { length: 50 }).default("assigned"),
  },
  (t) => [index("bra_tenant_idx").on(t.tenantId)]
);

export const betaReaderFeedback = pgTable("beta_reader_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => betaReaderAssignments.id, { onDelete: "cascade" }),
  chapterId: uuid("chapter_id").references(() => chapters.id),
  feedbackType: varchar("feedback_type", { length: 50 }).default("general"),
  content: text("content").notNull(),
  rating: integer("rating"),
  pageReference: varchar("page_reference", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Relations ──────────────────────────────────────────────

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  manuscripts: many(manuscripts),
  books: many(books),
  warehouses: many(warehouses),
  suppliers: many(suppliers),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, { fields: [users.tenantId], references: [tenants.id] }),
  manuscripts: many(manuscripts),
}));

export const manuscriptsRelations = relations(
  manuscripts,
  ({ one, many }) => ({
    author: one(users, {
      fields: [manuscripts.authorId],
      references: [users.id],
    }),
    chapters: many(chapters),
    versions: many(manuscriptVersions),
    storyBibleCharacters: many(storyBibleCharacters),
    storyBibleWorldFacts: many(storyBibleWorldFacts),
    storyBibleTimeline: many(storyBibleTimeline),
    aiSuggestions: many(aiSuggestions),
  })
);

export const chaptersRelations = relations(chapters, ({ one }) => ({
  manuscript: one(manuscripts, {
    fields: [chapters.manuscriptId],
    references: [manuscripts.id],
  }),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  author: one(users, { fields: [books.authorId], references: [users.id] }),
  stockItems: many(stockItems),
}));

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  stockItems: many(stockItems),
}));

export const stockItemsRelations = relations(stockItems, ({ one }) => ({
  book: one(books, { fields: [stockItems.bookId], references: [books.id] }),
  warehouse: one(warehouses, {
    fields: [stockItems.warehouseId],
    references: [warehouses.id],
  }),
}));

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ one, many }) => ({
    supplier: one(suppliers, {
      fields: [purchaseOrders.supplierId],
      references: [suppliers.id],
    }),
    items: many(purchaseOrderItems),
  })
);

export const salesOrdersRelations = relations(
  salesOrders,
  ({ many }) => ({
    items: many(salesOrderItems),
    returns: many(returns),
  })
);