"use client";

import { Card, KpiCard } from "@/components/ui/cards";

const COMPS = [
  { title: "Project Hail Mary", author: "Andy Weir", rating: 4.5, sales: "2M+", similarity: 87 },
  { title: "The Martian", author: "Andy Weir", rating: 4.4, sales: "5M+", similarity: 72 },
  { title: "Children of Time", author: "Adrian Tchaikovsky", rating: 4.3, sales: "500K+", similarity: 81 },
  { title: "Blindsight", author: "Peter Watts", rating: 4.1, sales: "200K+", similarity: 68 },
];

const SEGMENTS = [
  { name: "Hard Sci-Fi Enthusiasts", percentage: 35, color: "bg-indigo-500" },
  { name: "Space Opera Readers", percentage: 28, color: "bg-purple-500" },
  { name: "Literary Fiction Crossover", percentage: 20, color: "bg-pink-500" },
  { name: "YA/New Adult", percentage: 12, color: "bg-amber-500" },
  { name: "General Fiction", percentage: 5, color: "bg-emerald-500" },
];

export default function MarketPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        📊 Market Intelligence
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Sales Potential" value="78/100" icon="📈" color="green" />
        <KpiCard title="Market Saturation" value="Medium" icon="📊" color="amber" />
        <KpiCard title="Comparable Titles" value="23" icon="📚" color="blue" />
        <KpiCard title="Reader Reach" value="2.4M" icon="👥" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Comparable Titles */}
        <Card title="Comparable Titles Analysis">
          <div className="space-y-3">
            {COMPS.map((comp) => (
              <div key={comp.title} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-200">
                <div className="w-10 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
                  📖
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-900">{comp.title}</div>
                  <div className="text-xs text-slate-500">by {comp.author}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">{comp.similarity}%</div>
                  <div className="text-xs text-slate-400">similar</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">⭐ {comp.rating}</div>
                  <div className="text-xs text-slate-400">{comp.sales} sold</div>
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
                  <div className={`h-full ${seg.color} rounded-full`} style={{ width: `${seg.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cover Prototypes */}
        <Card title="AI Cover Prototypes (Stable Diffusion)">
          <div className="grid grid-cols-2 gap-4">
            {["Cosmic garden, bioluminescent plants, sci-fi atmosphere", "Silhouette of astronaut, alien flora, purple nebula", "Fractal DNA helix made of light, space background", "Close-up alien flower, quantum particles, dark background"].map((prompt, i) => (
              <div key={i} className="aspect-[2/3] rounded-lg bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center text-white/50 text-sm p-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-xs text-white/70">Prototype {i + 1}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600">
            + Generate More Prototypes
          </button>
        </Card>

        {/* SEO Metadata */}
        <Card title="SEO-Optimized Metadata">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Amazon KDP Title</label>
              <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 font-mono">
                The Quantum Garden: A First Contact Novel of Alien Intelligence and Human Discovery
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase">Keywords (7 slots)</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {["science fiction", "first contact", "alien life", "quantum physics", "space exploration", "hard sci-fi", "discovery"].map((kw) => (
                  <span key={kw} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">{kw}</span>
                ))}
              </div>
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
              <label className="text-xs font-medium text-slate-500 uppercase">Description (Amazon)</label>
              <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed">
                When Dr. Elara Voss arrives at a distant world&apos;s quantum garden, she discovers a living alien ecosystem that defies everything science knows. A gripping first contact novel that blends hard science with profound questions about consciousness and discovery.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}