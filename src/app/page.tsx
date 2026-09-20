import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen grid-pattern">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              I
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg">
                ImprintAI
              </span>
              <span className="text-indigo-600 font-bold text-lg"> + </span>
              <span className="font-bold text-slate-900 text-lg">BookStock</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-sm text-indigo-700 font-medium mb-6">
              <span className="w-2 h-2 bg-indigo-500 rounded-full pulse-dot" />
              AI-Powered Publishing Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              From Manuscript to
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Market Intelligence
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              The first platform combining AI editorial tools, blockchain rights
              management, audiobook generation, market intelligence, and
              real-time inventory management in one system.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Start Free Trial
              </Link>
              <Link
                href="/login"
                className="bg-white text-slate-700 px-8 py-3.5 rounded-xl font-semibold text-lg border border-slate-200 hover:border-slate-300 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                title: "Multi-Agent AI Editorial",
                desc: "5 specialized AI agents analyze structure, prose, continuity, market fit, and authenticity — then synthesize unified feedback.",
                color: "indigo",
              },
              {
                icon: "🔗",
                title: "Blockchain Copyright",
                desc: "Immutable timestamping on Hyperledger Fabric. Smart contracts for automated royalty distribution.",
                color: "purple",
              },
              {
                icon: "🎧",
                title: "Audiobook Studio",
                desc: "Multi-voice TTS with emotion tags, character voice assignment, chapter-level regeneration, and cross-language cloning.",
                color: "pink",
              },
              {
                icon: "📊",
                title: "Market Intelligence",
                desc: "Comparable titles analysis, sales potential scoring, reader segmentation, and SEO-optimized metadata generation.",
                color: "amber",
              },
              {
                icon: "📦",
                title: "Real-Time Inventory",
                desc: "Stock per book, per warehouse, per format. Low-stock alerts, blockchain-verified movements, and AI-powered reorder automation.",
                color: "teal",
              },
              {
                icon: "🏛️",
                title: "Multi-Warehouse",
                desc: "Multiple warehouse support with transfers, in-transit tracking, capacity monitoring, and blockchain-verified audit trails.",
                color: "rose",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-slate-200 p-6 card-hover transition-all"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "5", label: "AI Editorial Agents" },
                { value: "100%", label: "Blockchain Verified" },
                { value: "4", label: "Export Formats" },
                { value: "∞", label: "Warehouse Capacity" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboards Preview */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Five Purpose-Built Dashboards
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Every stakeholder gets a tailored experience — from authors writing
              their next novel to warehouse staff managing stock.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Author Studio",
                desc: "Writing canvas, AI sidebar, Story Bible, blockchain rights, audiobook studio, market intelligence, stock view.",
                href: "/login?role=author",
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                title: "Editor Dashboard",
                desc: "Manuscript queue, AI pre-analysis reports, communication hub, production stock tracking.",
                href: "/login?role=editor",
                gradient: "from-pink-500 to-rose-600",
              },
              {
                title: "Publisher Command Center",
                desc: "Portfolio overview, financial analytics, inventory management, reorder automation, warehouse operations.",
                href: "/login?role=publisher",
                gradient: "from-amber-500 to-orange-600",
              },
              {
                title: "Admin Console",
                desc: "System health, model management, user RBAC, security audit, content templates, analytics.",
                href: "/login?role=admin",
                gradient: "from-teal-500 to-cyan-600",
              },
              {
                title: "Beta Reader",
                desc: "Assigned manuscripts, distraction-free reading, annotation tools, structured feedback submission.",
                href: "/login?role=beta_reader",
                gradient: "from-emerald-500 to-green-600",
              },
              {
                title: "Mobile App",
                desc: "Writing on the go, notifications, audiobook review, stock alerts. Available on iOS and Android.",
                href: "#",
                gradient: "from-slate-700 to-slate-900",
              },
            ].map((dash) => (
              <Link
                key={dash.title}
                href={dash.href}
                className="group block bg-white rounded-xl border border-slate-200 overflow-hidden card-hover transition-all"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${dash.gradient} flex items-center justify-center`}
                >
                  <span className="text-white/90 text-5xl font-extrabold opacity-30">
                    {dash.title.charAt(0)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {dash.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {dash.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            © 2025 ImprintAI + BookStock. Capstone Project.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>Next.js + Drizzle + PostgreSQL</span>
            <span>•</span>
            <span>AI-Powered</span>
            <span>•</span>
            <span>Blockchain Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}