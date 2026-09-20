export const APP_NAME = "ImprintAI + BookStock";
export const APP_DESCRIPTION =
  "AI-powered publishing and inventory management platform";

export const ROLES = {
  AUTHOR: "author",
  EDITOR: "editor",
  PUBLISHER: "publisher",
  ADMIN: "admin",
  BETA_READER: "beta_reader",
  WAREHOUSE_STAFF: "warehouse_staff",
} as const;

export const MANUSCRIPT_STATUSES = [
  "draft",
  "in_review",
  "revision",
  "approved",
  "published",
  "archived",
] as const;

export const BOOK_FORMATS = [
  "hardcover",
  "paperback",
  "ebook",
  "audiobook",
] as const;

export const AI_AGENTS = [
  {
    key: "structural_architect",
    name: "Structural Architect",
    color: "#6366f1",
    icon: "🏗️",
    description: "Analyzes plot arcs, pacing, and chapter balance",
  },
  {
    key: "line_editor",
    name: "Line Editor",
    color: "#ec4899",
    icon: "✏️",
    description: "Prose clarity, sentence rhythm, repetition detection",
  },
  {
    key: "continuity_guardian",
    name: "Continuity Guardian",
    color: "#14b8a6",
    icon: "🛡️",
    description: "Character details, timeline, world facts consistency",
  },
  {
    key: "market_analyst",
    name: "Market Analyst",
    color: "#f59e0b",
    icon: "📊",
    description: "Comparable titles, sales potential, reader segmentation",
  },
  {
    key: "authenticity_auditor",
    name: "Authenticity Auditor",
    color: "#ef4444",
    icon: "🔍",
    description: "AI slop detection, human authenticity scoring",
  },
  {
    key: "synthesis",
    name: "Synthesis Agent",
    color: "#8b5cf6",
    icon: "🧠",
    description: "Consolidates all agent feedback into unified report",
  },
] as const;

export const MOVEMENT_TYPES = [
  "received",
  "transferred",
  "sold",
  "returned",
  "damaged",
  "audited",
  "adjusted",
] as const;

export const DASHBOARD_NAV = {
  author: [
    { label: "Studio", href: "/dashboard/author", icon: "pen-tool" },
    { label: "Story Bible", href: "/dashboard/author/story-bible", icon: "book-open" },
    { label: "Blockchain", href: "/dashboard/author/blockchain", icon: "link" },
    { label: "Audiobooks", href: "/dashboard/author/audiobooks", icon: "headphones" },
    { label: "Market Intel", href: "/dashboard/author/market", icon: "trending-up" },
    { label: "My Books' Stock", href: "/dashboard/author/stock", icon: "package" },
  ],
  editor: [
    { label: "Dashboard", href: "/dashboard/editor", icon: "layout" },
    { label: "Manuscripts", href: "/dashboard/editor/manuscripts", icon: "file-text" },
    { label: "Messages", href: "/dashboard/editor/messages", icon: "message-square" },
    { label: "Production", href: "/dashboard/editor/production", icon: "printer" },
  ],
  publisher: [
    { label: "Overview", href: "/dashboard/publisher", icon: "bar-chart-2" },
    { label: "Books", href: "/dashboard/publisher/books", icon: "book" },
    { label: "Authors", href: "/dashboard/publisher/authors", icon: "users" },
    { label: "Financial", href: "/dashboard/publisher/financial", icon: "dollar-sign" },
    { label: "Marketing", href: "/dashboard/publisher/marketing", icon: "megaphone" },
    { label: "Inventory", href: "/dashboard/publisher/inventory", icon: "package" },
    { label: "Reorder", href: "/dashboard/publisher/reorder", icon: "refresh-cw" },
    { label: "Orders", href: "/dashboard/publisher/orders", icon: "shopping-cart" },
    { label: "Warehouses", href: "/dashboard/publisher/warehouses", icon: "home" },
    { label: "Audit", href: "/dashboard/publisher/audit", icon: "shield" },
  ],
  admin: [
    { label: "System Health", href: "/dashboard/admin", icon: "activity" },
    { label: "Models", href: "/dashboard/admin/models", icon: "cpu" },
    { label: "Users", href: "/dashboard/admin/users", icon: "users" },
    { label: "Security", href: "/dashboard/admin/security", icon: "lock" },
    { label: "Content", href: "/dashboard/admin/content", icon: "layers" },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: "pie-chart" },
    { label: "Inventory Health", href: "/dashboard/admin/inventory", icon: "server" },
  ],
  beta_reader: [
    { label: "Dashboard", href: "/dashboard/beta-reader", icon: "layout" },
    { label: "Feedback History", href: "/dashboard/beta-reader/history", icon: "clock" },
  ],
} as const;