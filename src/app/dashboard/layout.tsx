"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface SessionData {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

const SessionContext = createContext<SessionData | null>(null);
export function useSession() {
  return useContext(SessionContext);
}

const NAV_ITEMS: Record<string, { label: string; href: string; icon: string }[]> = {
  author: [
    { label: "Studio", href: "/dashboard/author", icon: "✏️" },
    { label: "Story Bible", href: "/dashboard/author/story-bible", icon: "📖" },
    { label: "Blockchain", href: "/dashboard/author/blockchain", icon: "🔗" },
    { label: "Audiobooks", href: "/dashboard/author/audiobooks", icon: "🎧" },
    { label: "Market Intel", href: "/dashboard/author/market", icon: "📊" },
    { label: "My Books' Stock", href: "/dashboard/author/stock", icon: "📦" },
  ],
  editor: [
    { label: "Dashboard", href: "/dashboard/editor", icon: "📋" },
    { label: "Manuscripts", href: "/dashboard/editor/manuscripts", icon: "📄" },
    { label: "Messages", href: "/dashboard/editor/messages", icon: "💬" },
    { label: "Production", href: "/dashboard/editor/production", icon: "🖨️" },
  ],
  publisher: [
    { label: "Overview", href: "/dashboard/publisher", icon: "📊" },
    { label: "Books", href: "/dashboard/publisher/books", icon: "📚" },
    { label: "Authors", href: "/dashboard/publisher/authors", icon: "👥" },
    { label: "Financial", href: "/dashboard/publisher/financial", icon: "💰" },
    { label: "Inventory", href: "/dashboard/publisher/inventory", icon: "📦" },
    { label: "Reorder", href: "/dashboard/publisher/reorder", icon: "🔄" },
    { label: "Orders", href: "/dashboard/publisher/orders", icon: "🛒" },
    { label: "Warehouses", href: "/dashboard/publisher/warehouses", icon: "🏭" },
    { label: "Audit", href: "/dashboard/publisher/audit", icon: "🛡️" },
  ],
  admin: [
    { label: "System Health", href: "/dashboard/admin", icon: "💓" },
    { label: "AI Models", href: "/dashboard/admin/models", icon: "🤖" },
    { label: "Users", href: "/dashboard/admin/users", icon: "👤" },
    { label: "Security", href: "/dashboard/admin/security", icon: "🔒" },
    { label: "Content", href: "/dashboard/admin/content", icon: "📝" },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: "📈" },
    { label: "Inv. Health", href: "/dashboard/admin/inventory", icon: "🖥️" },
  ],
  beta_reader: [
    { label: "Dashboard", href: "/dashboard/beta-reader", icon: "📋" },
    { label: "Feedback History", href: "/dashboard/beta-reader/history", icon: "🕐" },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  author: "from-indigo-600 to-purple-600",
  editor: "from-pink-600 to-rose-600",
  publisher: "from-amber-600 to-orange-600",
  admin: "from-teal-600 to-cyan-600",
  beta_reader: "from-emerald-600 to-green-600",
};

const ROLE_LABELS: Record<string, string> = {
  author: "Author",
  editor: "Editor",
  publisher: "Publisher",
  admin: "Admin",
  beta_reader: "Beta Reader",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<SessionData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSession(data.data);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold animate-pulse">
            I
          </div>
          <div className="text-sm text-slate-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const navItems = NAV_ITEMS[session.role] || NAV_ITEMS.author;
  const gradient = ROLE_COLORS[session.role] || ROLE_COLORS.author;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <SessionContext.Provider value={session}>
      <div className="h-screen flex overflow-hidden bg-slate-50">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white border-r border-slate-200 flex flex-col transition-all duration-200 flex-shrink-0`}
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold flex-shrink-0`}
              >
                I
              </div>
              {sidebarOpen && (
                <div className="whitespace-nowrap">
                  <div className="font-bold text-sm text-slate-900">
                    ImprintAI
                  </div>
                  <div className="text-xs text-slate-400 -mt-0.5">
                    {ROLE_LABELS[session.role]}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/dashboard/${session.role}` &&
                    pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    title={item.label}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Collapse button */}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {sidebarOpen ? "←" : "→"}
              {sidebarOpen && <span>Collapse</span>}
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-slate-900">
                {navItems.find(
                  (n) =>
                    pathname === n.href ||
                    (n.href !== `/dashboard/${session.role}` &&
                      pathname?.startsWith(n.href))
                )?.label || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="text-lg">🔔</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {session.firstName?.charAt(0) || session.email.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-slate-900">
                    {session.firstName
                      ? `${session.firstName} ${session.lastName || ""}`
                      : session.email}
                  </div>
                  <div className="text-xs text-slate-500">{session.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-sm text-slate-400 hover:text-red-600 transition-colors"
                  title="Sign out"
                >
                  ⎋
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SessionContext.Provider>
  );
}