"use client";

import { useState } from "react";
import { KpiCard, Card, StatusBadge, Table, Td } from "@/components/ui/cards";
import { AI_AGENTS } from "@/lib/constants";

const MOCK_MANUSCRIPTS = [
  {
    id: "1",
    title: "The Quantum Garden",
    genre: "Sci-Fi",
    wordCount: 78450,
    status: "in_review",
    version: 3,
    aiComplete: true,
  },
  {
    id: "2",
    title: "Whispers of the Forgotten",
    genre: "Fantasy",
    wordCount: 112000,
    status: "draft",
    version: 1,
    aiComplete: false,
  },
  {
    id: "3",
    title: "The Last Algorithm",
    genre: "Thriller",
    wordCount: 65200,
    status: "approved",
    version: 5,
    aiComplete: true,
  },
];

const AI_SUGGESTIONS = [
  {
    agent: "structural_architect",
    text: "Chapter 7 pacing is too slow relative to surrounding chapters. Consider consolidating the market scene into 2 paragraphs.",
    severity: "warning",
    status: "pending",
  },
  {
    agent: "line_editor",
    text: "Sentence 'She walked to the door' appears 3 times in Chapter 4. Consider varying the action beats.",
    severity: "info",
    status: "pending",
  },
  {
    agent: "continuity_guardian",
    text: "Detecting contradiction: In Ch.3, Marcus has blue eyes, but in Ch.12 they're described as green.",
    severity: "critical",
    status: "pending",
  },
  {
    agent: "market_analyst",
    text: "Comparable title 'Project Hail Mary' by Andy Weir — similar themes. Your manuscript's unique angle: bioluminescent alien ecosystem.",
    severity: "info",
    status: "accepted",
  },
  {
    agent: "authenticity_auditor",
    text: "Human authenticity score: 94/100. Minor flag: repeated transitional phrases in chapters 8-10.",
    severity: "info",
    status: "pending",
  },
];

export default function AuthorStudioPage() {
  const [selectedManuscript, setSelectedManuscript] = useState(
    MOCK_MANUSCRIPTS[0]
  );
  const [activeTab, setActiveTab] = useState("editor");
  const [activeAgent, setActiveAgent] = useState("structural_architect");
  const [wordCount, setWordCount] = useState(selectedManuscript.wordCount);

  const severityColor: Record<string, string> = {
    critical: "border-l-red-500 bg-red-50",
    warning: "border-l-amber-500 bg-amber-50",
    info: "border-l-blue-500 bg-blue-50",
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Words"
          value={wordCount.toLocaleString()}
          change={12}
          changeLabel="this week"
          icon="📝"
          color="indigo"
        />
        <KpiCard
          title="Manuscripts"
          value={MOCK_MANUSCRIPTS.length}
          icon="📄"
          color="purple"
        />
        <KpiCard
          title="AI Suggestions"
          value={AI_SUGGESTIONS.filter((s) => s.status === "pending").length}
          changeLabel="pending review"
          icon="🤖"
          color="amber"
        />
        <KpiCard
          title="Writing Streak"
          value="14 days"
          icon="🔥"
          color="green"
        />
      </div>

      {/* Manuscript Selector + Tabs */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <select
          className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium"
          value={selectedManuscript.id}
          onChange={(e) => {
            const ms = MOCK_MANUSCRIPTS.find((m) => m.id === e.target.value);
            if (ms) {
              setSelectedManuscript(ms);
              setWordCount(ms.wordCount);
            }
          }}
        >
          {MOCK_MANUSCRIPTS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
        <StatusBadge status={selectedManuscript.status} />
        <span className="text-sm text-slate-500">
          v{selectedManuscript.version} • {selectedManuscript.genre}
        </span>
        <div className="flex-1" />
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {["editor", "ai-sidebar"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "editor" ? "Writing Canvas" : "AI Sidebar"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {activeTab === "editor" ? (
            <Card className="min-h-[500px]">
              <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">
                    Chapter 12: The Quantum Garden
                  </span>
                  <span className="text-xs text-slate-400">
                    • Last edited 2 min ago
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
                  Auto-saved
                </div>
              </div>
              <div
                className="prose prose-slate max-w-none min-h-[400px] text-slate-700 leading-relaxed focus:outline-none"
                contentEditable
                suppressContentEditableWarning
              >
                <p>
                  The quantum garden stretched before them, its fractal
                  blossoms pulsing with an otherworldly light that seemed
                  to breathe in rhythm with the planet&apos;s twin moons.
                  Dr. Elara Voss stepped forward carefully, her boots
                  leaving no imprint on the crystalline soil.
                </p>
                <p>
                  &quot;The readings are off the charts,&quot; she whispered into
                  her communicator, though she knew the words would take
                  seventeen minutes to reach Earth. By then, everything
                  might have changed. That was the nature of quantum
                  gardens — they existed in a perpetual state of flux,
                  every observation altering their fundamental structure.
                </p>
                <p>
                  Marcus appeared beside her, his face illuminated by the
                  bioluminescent canopy overhead. His blue eyes — no,
                  she corrected herself, she&apos;d have to fix that
                  inconsistency — reflected the alien light like twin
                  prisms.
                </p>
                <p>
                  &quot;Look at this,&quot; he said, pointing to a formation that
                  resembled nothing so much as a DNA helix made of pure
                  light. &quot;It&apos;s beautiful. It&apos;s... impossible.&quot;
                </p>
                <p className="text-slate-400 italic">
                  [Continue writing your story...]
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Chapter 12 • ~1,247 words • {selectedManuscript.wordCount.toLocaleString()}{" "}
                  total
                </span>
                <div className="flex gap-4">
                  <button className="hover:text-slate-700">
                    Version History
                  </button>
                  <button className="hover:text-slate-700">
                    Export Chapter
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="AI Editorial Agents">
              {/* Agent Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {AI_AGENTS.map((agent) => (
                  <button
                    key={agent.key}
                    onClick={() => setActiveAgent(agent.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeAgent === agent.key
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "text-slate-500 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <span>{agent.icon}</span>
                    {agent.name}
                  </button>
                ))}
              </div>

              {/* Agent Description */}
              <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm text-slate-600">
                {
                  AI_AGENTS.find((a) => a.key === activeAgent)?.description
                }
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                {AI_SUGGESTIONS.filter(
                  (s) => s.agent === activeAgent
                ).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <div className="text-2xl mb-2">✨</div>
                    <p className="text-sm">
                      No suggestions from this agent yet
                    </p>
                  </div>
                ) : (
                  AI_SUGGESTIONS.filter((s) => s.agent === activeAgent).map(
                    (suggestion, idx) => (
                      <div
                        key={idx}
                        className={`border-l-4 rounded-r-lg p-4 ${
                          severityColor[suggestion.severity] || severityColor.info
                        }`}
                      >
                        <p className="text-sm text-slate-700 mb-3">
                          {suggestion.text}
                        </p>
                        <div className="flex gap-2">
                          {suggestion.status === "pending" ? (
                            <>
                              <button className="px-3 py-1 text-xs font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
                                Accept
                              </button>
                              <button className="px-3 py-1 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50">
                                Defer
                              </button>
                              <button className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 bg-white rounded-md hover:bg-red-50">
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-emerald-600 font-medium">
                              ✓ Accepted
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>

              {/* Run All Agents Button */}
              <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                <span>🤖</span>
                Run All AI Agents
              </button>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Word Count Progress */}
          <Card title="Daily Goal">
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold text-slate-900">
                {wordCount.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500">/ 100,000</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                style={{
                  width: `${Math.min((wordCount / 100000) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {Math.round((wordCount / 100000) * 100)}% complete
            </p>
          </Card>

          {/* AI Summary */}
          <Card title="AI Analysis Summary">
            <div className="space-y-3">
              {AI_AGENTS.slice(0, 5).map((agent) => {
                const score = Math.floor(Math.random() * 30) + 70;
                return (
                  <div key={agent.key} className="flex items-center gap-3">
                    <span className="text-sm">{agent.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700">
                          {agent.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {score}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${score}%`,
                            backgroundColor: agent.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Chapter List */}
          <Card title="Chapters">
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {Array.from({ length: 15 }, (_, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    i === 11
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>
                    Ch. {i + 1}:{" "}
                    {
                      [
                        "The Beginning",
                        "First Light",
                        "Breach",
                        "Convergence",
                        "The Signal",
                        "Descent",
                        "Crossroads",
                        "Revelation",
                        "Fracture",
                        "Turning Point",
                        "The Long Night",
                        "The Quantum Garden",
                        "Aftermath",
                        "Rising",
                        "Finale",
                      ][i]
                    }
                  </span>
                  <span className="text-xs text-slate-400">
                    {Math.floor(Math.random() * 5000) + 2000}w
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Manuscripts */}
          <Card title="My Manuscripts">
            <div className="space-y-3">
              {MOCK_MANUSCRIPTS.map((ms) => (
                <div
                  key={ms.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    ms.id === selectedManuscript.id
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    setSelectedManuscript(ms);
                    setWordCount(ms.wordCount);
                  }}
                >
                  <div className="font-medium text-sm text-slate-900">
                    {ms.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={ms.status} />
                    <span className="text-xs text-slate-400">
                      {ms.wordCount.toLocaleString()}w
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}