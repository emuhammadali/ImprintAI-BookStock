"use client";

import { useState } from "react";
import { Card, KpiCard } from "@/components/ui/cards";

const COMPS = [
  { id: "1", title: "Project Hail Mary", author: "Andy Weir", rating: 4.5, sales: "2M+", similarity: 87, genre: "Sci-Fi", year: 2021, description: "A lone astronaut must save Earth from extinction using science and ingenuity." },
  { id: "2", title: "The Martian", author: "Andy Weir", rating: 4.4, sales: "5M+", similarity: 72, genre: "Sci-Fi", year: 2014, description: "An astronaut stranded on Mars must survive using botany and engineering." },
  { id: "3", title: "Children of Time", author: "Adrian Tchaikovsky", rating: 4.3, sales: "500K+", similarity: 81, genre: "Sci-Fi", year: 2015, description: "Evolutionary tale of spiders and humans competing for a new world." },
  { id: "4", title: "Blindsight", author: "Peter Watts", rating: 4.1, sales: "200K+", similarity: 68, genre: "Hard Sci-Fi", year: 2006, description: "First contact story exploring consciousness, intelligence, and humanity." },
];

const SEGMENTS = [
  { name: "Hard Sci-Fi Enthusiasts", percentage: 35, color: "bg-indigo-500" },
  { name: "Space Opera Readers", percentage: 28, color: "bg-purple-500" },
  { name: "Literary Fiction Crossover", percentage: 20, color: "bg-pink-500" },
  { name: "YA/New Adult", percentage: 12, color: "bg-amber-500" },
  { name: "General Fiction", percentage: 5, color: "bg-emerald-500" },
];

const INITIAL_PROTOTYPES = [
  { id: 1, prompt: "Cosmic garden, bioluminescent plants, sci-fi atmosphere", gradient: "from-indigo-900 to-purple-900" },
  { id: 2, prompt: "Silhouette of astronaut, alien flora, purple nebula", gradient: "from-purple-900 to-pink-900" },
  { id: 3, prompt: "Fractal DNA helix made of light, space background", gradient: "from-blue-900 to-indigo-900" },
  { id: 4, prompt: "Close-up alien flower, quantum particles, dark background", gradient: "from-slate-900 to-indigo-900" },
];

const INITIAL_KEYWORDS = ["science fiction", "first contact", "alien life", "quantum physics", "space exploration", "hard sci-fi", "discovery"];

export default function MarketPage() {
  const [comps] = useState(COMPS);
  const [prototypes, setPrototypes] = useState(INITIAL_PROTOTYPES);
  const [keywords, setKeywords] = useState(INITIAL_KEYWORDS);
  const [newKeyword, setNewKeyword] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedComp, setSelectedComp] = useState<typeof COMPS[0] | null>(null);
  const [showCompModal, setShowCompModal] = useState(false);
  const [showAnalysisRunning, setShowAnalysisRunning] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "The Quantum Garden: A First Contact Novel of Alien Intelligence and Human Discovery",
    description: "When Dr. Elara Voss arrives at a distant world's quantum garden, she discovers a living alien ecosystem that defies everything science knows. A gripping first contact novel that blends hard science with profound questions about consciousness and discovery.",
  });

  // ✅ Dynamic KPIs
  const avgSimilarity = Math.round(comps.reduce((s, c) => s + c.similarity, 0) / comps.length);
  const salesPotential = Math.min(100, avgSimilarity + 5);
  const saturation = avgSimilarity > 85 ? "High" : avgSimilarity > 70 ? "Medium" : "Low";
  const totalReach = "2.4M";

  // ✅ View comp detail
  function viewComp(comp: typeof COMPS[0]) {
    setSelectedComp(comp);
    setShowCompModal(true);
  }

  // ✅ Run analysis
  function runAnalysis() {
    setShowAnalysisRunning(true);
    setTimeout(() => {
      setShowAnalysisRunning(false);
      alert("✅ New market analysis complete!\n\nSales potential updated: " + (salesPotential + Math.floor(Math.random() * 5)) + "/100");
    }, 2500);
  }

  // ✅ Generate prototype
  function generatePrototype() {
    const prompts = [
      "Alien landscape with twin suns, crystal formations",
      "Quantum entanglement visualization, cosmic scale",
      "Ancient alien ruins overgrown with bioluminescent moss",
      "Space station orbiting a ringed planet, crew silhouette",
      "Abstract depiction of first contact, human and alien hand",
    ];
    const gradients = [
      "from-emerald-900 to-teal-900",
      "from-orange-900 to-red-900",
      "from-cyan-900 to-blue-900",
      "from-fuchsia-900 to-purple-900",
      "from-yellow-900 to-amber-900",
    ];
    const idx = prototypes.length % prompts.length;
    const newProto = {
      id: prototypes.length + 1,
      prompt: prompts[idx],
      gradient: gradients[idx],
    };
    setPrototypes([...prototypes, newProto]);
  }

  // ✅ Add keyword
  function addKeyword() {
    if (!newKeyword.trim()) return;
    if (keywords.length >= 7) {
      alert("Maximum 7 keyword slots. Remove one first.");
      return;
    }
    if (keywords.includes(newKeyword.trim().toLowerCase())) {
      alert("Keyword already exists");
      return;
    }
    setKeywords([...keywords, newKeyword.trim().toLowerCase()]);
    setNewKeyword("");
  }

  // ✅ Remove keyword
  function removeKeyword(kw: string) {
    setKeywords(keywords.filter((k) => k !== kw));
  }

  // ✅ Copy field
  function copyField(text: string, fieldName: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  }

  // ✅ Export report
  function exportReport() {
    const report = `
═══════════════════════════════════════════
        MARKET INTELLIGENCE REPORT
═══════════════════════════════════════════

SALES POTENTIAL: ${salesPotential}/100
MARKET SATURATION: ${saturation}
COMPARABLE TITLES: ${comps.length}
READER REACH: ${totalReach}

─── COMPARABLE TITLES ─────────────────────
${comps.map((c) => `• ${c.title} by ${c.author}
  Similarity: ${c.similarity}% | Rating: ${c.rating} | Sales: ${c.sales}`).join("\n\n")}

─── READER SEGMENTS ───────────────────────
${SEGMENTS.map((s) => `• ${s.name}: ${s.percentage}%`).join("\n")}

─── SEO METADATA ──────────────────────────
Title: ${metadata.title}

Keywords: ${keywords.join(", ")}

Description:
${metadata.description}

═══════════════════════════════════════════
Generated: ${new Date().toLocaleString()}
═══════════════════════════════════════════
`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `market-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">📊 Market Intelligence</h2>
        <div className="flex gap-2">
          <button
            onClick={exportReport}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            📥 Export Report
          </button>
          <button
            onClick={runAnalysis}
            disabled={showAnalysisRunning}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {showAnalysisRunning ? "⏳ Analyzing..." : "🔍 Run New Analysis"}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Sales Potential" value={`${salesPotential}/100`} icon="📈" color="green" />
        <KpiCard title="Market Saturation" value={saturation} icon="📊" color="amber" />
        <KpiCard title="Comparable Titles" value={comps.length.toString()} icon="📚" color="blue" />
        <KpiCard title="Reader Reach" value={totalReach} icon="👥" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Comparable Titles */}
        <Card title={`Comparable Titles Analysis (${comps.length})`}>
          <div className="space-y-3">
            {comps.map((comp) => (
              <div
                key={comp.id}
                onClick={() => viewComp(comp)}
                className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-colors"
              >
                <div className="w-10 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
                  📖
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-900">{comp.title}</div>
                  <div className="text-xs text-slate-500">by {comp.author} • {comp.year}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">{comp.similarity}%</div>
                  <div className="text-xs text-slate-400">similar</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">⭐ {comp.rating}</div>
                  <div className="text-xs text-slate-400">{comp.sales}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Reader Segmentation */}
        <Card title="Reader Segmentation">
          <div className="space-y-4">
            {SEGMENTS.map((seg) => (
              <div key={seg.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">{seg.name}</span>
                  <span className="text-sm font-bold text-slate-900">{seg.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${seg.color} rounded-full transition-all`} style={{ width: `${seg.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-700">
            💡 <strong>AI Insight:</strong> Your target audience is dominated by hard sci-fi readers (35%).
            Consider emphasizing the scientific accuracy in marketing materials.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cover Prototypes */}
        <Card title={`AI Cover Prototypes (${prototypes.length})`}>
          <div className="grid grid-cols-2 gap-4">
            {prototypes.map((proto) => (
              <div
                key={proto.id}
                className={`aspect-[2/3] rounded-lg bg-gradient-to-br ${proto.gradient} flex items-center justify-center text-white/50 p-4 text-center cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => alert(`Prompt: ${proto.prompt}\n\nClick "Generate More" for new variations.`)}
              >
                <div>
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-xs text-white/70 font-medium">Prototype {proto.id}</div>
                  <div className="text-[10px] text-white/50 mt-2 line-clamp-3">{proto.prompt}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={generatePrototype}
            className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            + Generate More Prototypes
          </button>
        </Card>

        {/* SEO Metadata */}
        <Card title="SEO-Optimized Metadata">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Amazon KDP Title</label>
                <button
                  onClick={() => copyField(metadata.title, "title")}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {copiedField === "title" ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <textarea
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                className="w-full p-3 bg-slate-50 rounded-lg text-sm text-slate-700 font-mono border border-transparent focus:border-indigo-300 focus:bg-white focus:outline-none resize-none"
                rows={2}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-500 uppercase">
                  Keywords ({keywords.length}/7)
                </label>
                <button
                  onClick={() => copyField(keywords.join(", "), "keywords")}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {copiedField === "keywords" ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full flex items-center gap-1"
                  >
                    {kw}
                    <button
                      onClick={() => removeKeyword(kw)}
                      className="text-indigo-400 hover:text-red-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {keywords.length < 7 && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Categories</label>
              <div className="mt-1 space-y-1 text-sm text-slate-700">
                <div>📚 Science Fiction → First Contact</div>
                <div>📚 Science Fiction → Hard Science Fiction</div>
                <div>📚 Literature & Fiction → Action & Adventure</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-500 uppercase">Description (Amazon)</label>
                <button
                  onClick={() => copyField(metadata.description, "description")}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {copiedField === "description" ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <textarea
                value={metadata.description}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                className="w-full p-3 bg-slate-50 rounded-lg text-sm text-slate-700 border border-transparent focus:border-indigo-300 focus:bg-white focus:outline-none resize-none"
                rows={4}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* ✅ Comparable Title Detail Modal */}
      {showCompModal && selectedComp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Comparable Title</h3>
              <button onClick={() => setShowCompModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white mb-4">
              <div className="text-xs opacity-80 mb-1">{selectedComp.year} • {selectedComp.genre}</div>
              <div className="font-bold text-lg">{selectedComp.title}</div>
              <div className="text-sm opacity-90">by {selectedComp.author}</div>
            </div>

            <p className="text-sm text-slate-600 mb-4">{selectedComp.description}</p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-600">{selectedComp.similarity}%</div>
                <div className="text-xs text-slate-500">Similarity</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-amber-500">⭐ {selectedComp.rating}</div>
                <div className="text-xs text-slate-500">Rating</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-emerald-600">{selectedComp.sales}</div>
                <div className="text-xs text-slate-500">Sales</div>
              </div>
            </div>

            <button
              onClick={() => setShowCompModal(false)}
              className="w-full mt-5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}