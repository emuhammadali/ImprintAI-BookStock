"use client";

import { useState, useMemo, useEffect } from "react";
import { KpiCard, Card, StatusBadge } from "@/components/ui/cards";
import { AI_AGENTS } from "@/lib/constants";

const MOCK_MANUSCRIPTS = [
  { id: "1", title: "The Quantum Garden", genre: "Sci-Fi", wordCount: 78450, status: "in_review", version: 3, aiComplete: true },
  { id: "2", title: "Whispers of the Forgotten", genre: "Fantasy", wordCount: 112000, status: "draft", version: 1, aiComplete: false },
  { id: "3", title: "The Last Algorithm", genre: "Thriller", wordCount: 65200, status: "approved", version: 5, aiComplete: true },
];

const INITIAL_SUGGESTIONS = [
  { id: "s1", agent: "structural_architect", text: "Chapter 7 pacing is too slow relative to surrounding chapters. Consider consolidating the market scene into 2 paragraphs.", severity: "warning", status: "pending" },
  { id: "s2", agent: "line_editor", text: "Sentence 'She walked to the door' appears 3 times in Chapter 4. Consider varying the action beats.", severity: "info", status: "pending" },
  { id: "s3", agent: "continuity_guardian", text: "Detecting contradiction: In Ch.3, Marcus has blue eyes, but in Ch.12 they're described as green.", severity: "critical", status: "pending" },
  { id: "s4", agent: "market_analyst", text: "Comparable title 'Project Hail Mary' by Andy Weir — similar themes. Your manuscript's unique angle: bioluminescent alien ecosystem.", severity: "info", status: "accepted" },
  { id: "s5", agent: "authenticity_auditor", text: "Human authenticity score: 94/100. Minor flag: repeated transitional phrases in chapters 8-10.", severity: "info", status: "pending" },
];

const CHAPTER_TITLES = ["The Beginning", "First Light", "Breach", "Convergence", "The Signal", "Descent", "Crossroads", "Revelation", "Fracture", "Turning Point", "The Long Night", "The Quantum Garden", "Aftermath", "Rising", "Finale"];

// ✅ Deterministic scores (no Math.random on every render)
const AGENT_SCORES: Record<string, number> = {
  structural_architect: 72,
  line_editor: 85,
  continuity_guardian: 68,
  market_analyst: 90,
  authenticity_auditor: 94,
  synthesis: 82,
};

// ✅ Deterministic chapter word counts
const CHAPTER_WORDS = [4200, 3800, 5100, 4600, 3900, 5400, 4200, 4800, 5100, 3700, 4400, 1247, 3800, 4200, 5600];

export default function AuthorStudioPage() {
  const [manuscripts, setManuscripts] = useState(MOCK_MANUSCRIPTS);
  const [selectedManuscript, setSelectedManuscript] = useState(MOCK_MANUSCRIPTS[0]);
  const [activeTab, setActiveTab] = useState("editor");
  const [activeAgent, setActiveAgent] = useState("structural_architect");
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [wordCount, setWordCount] = useState(selectedManuscript.wordCount);
  const [chapterContent, setChapterContent] = useState(
    `The quantum garden stretched before them, its fractal blossoms pulsing with an otherworldly light that seemed to breathe in rhythm with the planet's twin moons. Dr. Elara Voss stepped forward carefully, her boots leaving no imprint on the crystalline soil.

"The readings are off the charts," she whispered into her communicator, though she knew the words would take seventeen minutes to reach Earth. By then, everything might have changed. That was the nature of quantum gardens — they existed in a perpetual state of flux, every observation altering their fundamental structure.

Marcus appeared beside her, his face illuminated by the bioluminescent canopy overhead. His blue eyes — no, she corrected herself, she'd have to fix that inconsistency — reflected the alien light like twin prisms.

"Look at this," he said, pointing to a formation that resembled nothing so much as a DNA helix made of pure light. "It's beautiful. It's... impossible."

[Continue writing your story...]`
  );
  const [currentChapter, setCurrentChapter] = useState(12);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showNewManuscriptModal, setShowNewManuscriptModal] = useState(false);
  const [newManuscript, setNewManuscript] = useState({ title: "", genre: "Sci-Fi" });
  const [isRunningAgents, setIsRunningAgents] = useState(false);

  // ✅ Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [chapterContent]);

  // ✅ Dynamic KPIs
  const totalWords = manuscripts.reduce((sum, m) => sum + m.wordCount, 0);
  const pendingSuggestions = suggestions.filter((s) => s.status === "pending").length;
  const writingStreak = 14;

  // ✅ Accept suggestion
  function acceptSuggestion(id: string) {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "accepted" } : s)));
  }

  function deferSuggestion(id: string) {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "deferred" } : s)));
  }

  function rejectSuggestion(id: string) {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s)));
  }

  // ✅ Run all agents
  function runAllAgents() {
    setIsRunningAgents(true);
    setTimeout(() => {
      setIsRunningAgents(false);
      alert("✅ All AI agents have completed analysis.\n\n5 new suggestions generated.");
    }, 2500);
  }

  // ✅ Select manuscript
  function selectManuscript(ms: typeof MOCK_MANUSCRIPTS[0]) {
    setSelectedManuscript(ms);
    setWordCount(ms.wordCount);
    setCurrentChapter(Math.min(12, ms.version === 1 ? 5 : 12));
  }

  // ✅ Export chapter
  function exportChapter() {
    const blob = new Blob([chapterContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chapter-${currentChapter}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ✅ Create new manuscript
  function createManuscript(e: React.FormEvent) {
    e.preventDefault();
    const newMs = {
      id: String(manuscripts.length + 1),
      title: newManuscript.title,
      genre: newManuscript.genre,
      wordCount: 0,
      status: "draft",
      version: 1,
      aiComplete: false,
    };
    setManuscripts([...manuscripts, newMs]);
    setShowNewManuscriptModal(false);
    setNewManuscript({ title: "", genre: "Sci-Fi" });
    setSelectedManuscript(newMs);
  }

  // ✅ Save version
  function saveVersion() {
    alert(`✅ Version v${selectedManuscript.version + 1} saved!\n\nWord count: ${wordCount.toLocaleString()}`);
    setShowVersionModal(false);
  }

  const severityColor: Record<string, string> = {
    critical: "border-l-red-500 bg-red-50",
    warning: "border-l-amber-500 bg-amber-50",
    info: "border-l-blue-500 bg-blue-50",
  };

  const statusLabel: Record<string, string> = {
    pending: "",
    accepted: "✓ Accepted",
    rejected: "✗ Rejected",
    deferred: "⏸ Deferred",
  };

  const statusColor: Record<string, string> = {
    accepted: "text-emerald-600",
    rejected: "text-red-600",
    deferred: "text-amber-600",
    pending: "",
  };

  const activeSuggestions = useMemo(
    () => suggestions.filter((s) => s.agent === activeAgent),
    [suggestions, activeAgent]
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Words" value={totalWords.toLocaleString()} change={12} changeLabel="this week" icon="📝" color="indigo" />
        <KpiCard title="Manuscripts" value={manuscripts.length.toString()} icon="📄" color="purple" />
        <KpiCard title="AI Suggestions" value={pendingSuggestions.toString()} changeLabel="pending review" icon="🤖" color="amber" />
        <KpiCard title="Writing Streak" value={`${writingStreak} days`} icon="🔥" color="green" />
      </div>

      {/* Manuscript Selector + Tabs */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <select
          className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium"
          value={selectedManuscript.id}
          onChange={(e) => {
            const ms = manuscripts.find((m) => m.id === e.target.value);
            if (ms) selectManuscript(ms);
          }}
        >
          {manuscripts.map((m) => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
        <StatusBadge status={selectedManuscript.status} />
        <span className="text-sm text-slate-500">
          v{selectedManuscript.version} • {selectedManuscript.genre}
        </span>
        <button
          onClick={() => setShowNewManuscriptModal(true)}
          className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + New
        </button>
        <div className="flex-1" />
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {["editor", "ai-sidebar"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "editor" ? "Writing Canvas" : "AI Sidebar"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === "editor" ? (
            <Card className="min-h-[500px]">
              <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-900">
                    Chapter {currentChapter}: {CHAPTER_TITLES[currentChapter - 1]}
                  </span>
                  {lastSaved && (
                    <span className="text-xs text-slate-400">
                      • Last saved {Math.floor((Date.now() - lastSaved.getTime()) / 1000)}s ago
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {isSaving ? (
                    <>
                      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
                      Auto-saved
                    </>
                  )}
                </div>
              </div>

              <textarea
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
                className="w-full min-h-[400px] text-slate-700 leading-relaxed focus:outline-none resize-none text-base font-[system-ui]"
                placeholder="Start writing your story..."
              />

              <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Chapter {currentChapter} • ~{chapterContent.split(/\s+/).filter(Boolean).length} words • {selectedManuscript.wordCount.toLocaleString()} total
                </span>
                <div className="flex gap-4">
                  <button onClick={() => setShowVersionModal(true)} className="hover:text-indigo-600 font-medium">
                    📌 Save Version
                  </button>
                  <button onClick={exportChapter} className="hover:text-indigo-600 font-medium">
                    📥 Export Chapter
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="AI Editorial Agents">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {AI_AGENTS.map((agent) => {
                  const agentPending = suggestions.filter((s) => s.agent === agent.key && s.status === "pending").length;
                  return (
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
                      {agentPending > 0 && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                          {agentPending}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm text-slate-600">
                {AI_AGENTS.find((a) => a.key === activeAgent)?.description}
              </div>

              <div className="space-y-3">
                {activeSuggestions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <div className="text-2xl mb-2">✨</div>
                    <p className="text-sm">No suggestions from this agent yet</p>
                  </div>
                ) : (
                  activeSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className={`border-l-4 rounded-r-lg p-4 ${severityColor[suggestion.severity] || severityColor.info}`}>
                      <p className="text-sm text-slate-700 mb-3">{suggestion.text}</p>
                      <div className="flex gap-2">
                        {suggestion.status === "pending" ? (
                          <>
                            <button onClick={() => acceptSuggestion(suggestion.id)} className="px-3 py-1 text-xs font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
                              Accept
                            </button>
                            <button onClick={() => deferSuggestion(suggestion.id)} className="px-3 py-1 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50">
                              Defer
                            </button>
                            <button onClick={() => rejectSuggestion(suggestion.id)} className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 bg-white rounded-md hover:bg-red-50">
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`text-xs font-medium ${statusColor[suggestion.status]}`}>
                            {statusLabel[suggestion.status]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={runAllAgents}
                disabled={isRunningAgents}
                className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>🤖</span>
                {isRunningAgents ? "Running agents..." : "Run All AI Agents"}
              </button>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <Card title="Daily Goal">
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold text-slate-900">{selectedManuscript.wordCount.toLocaleString()}</span>
              <span className="text-sm text-slate-500">/ 100,000</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${Math.min((selectedManuscript.wordCount / 100000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {Math.round((selectedManuscript.wordCount / 100000) * 100)}% complete
            </p>
          </Card>

          <Card title="AI Analysis Summary">
            <div className="space-y-3">
              {AI_AGENTS.slice(0, 5).map((agent) => {
                const score = AGENT_SCORES[agent.key] || 75;
                return (
                  <div key={agent.key} className="flex items-center gap-3">
                    <span className="text-sm">{agent.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700">{agent.name}</span>
                        <span className="text-xs text-slate-500">{score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: agent.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Chapters">
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {CHAPTER_TITLES.map((title, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentChapter(i + 1)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    i + 1 === currentChapter ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Ch. {i + 1}: {title}</span>
                  <span className="text-xs text-slate-400">{CHAPTER_WORDS[i]}w</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title={`My Manuscripts (${manuscripts.length})`}>
            <div className="space-y-3">
              {manuscripts.map((ms) => (
                <div
                  key={ms.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    ms.id === selectedManuscript.id ? "border-indigo-200 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => selectManuscript(ms)}
                >
                  <div className="font-medium text-sm text-slate-900">{ms.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={ms.status} />
                    <span className="text-xs text-slate-400">{ms.wordCount.toLocaleString()}w</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ✅ Version Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Save New Version</h3>
              <button onClick={() => setShowVersionModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <div className="text-xs text-indigo-600 mb-1">Current Version</div>
              <div className="font-bold text-indigo-700 text-2xl">v{selectedManuscript.version}</div>
              <div className="text-xs text-indigo-600 mt-2">
                New version will be <strong>v{selectedManuscript.version + 1}</strong>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              This will create an immutable snapshot of the current chapter. You can always restore older versions.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setShowVersionModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={saveVersion} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                Save v{selectedManuscript.version + 1}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ New Manuscript Modal */}
      {showNewManuscriptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">New Manuscript</h3>
              <button onClick={() => setShowNewManuscriptModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <form onSubmit={createManuscript} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input type="text" value={newManuscript.title} onChange={(e) => setNewManuscript({ ...newManuscript, title: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Genre</label>
                <select value={newManuscript.genre} onChange={(e) => setNewManuscript({ ...newManuscript, genre: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Sci-Fi</option>
                  <option>Fantasy</option>
                  <option>Thriller</option>
                  <option>Literary</option>
                  <option>Romance</option>
                  <option>Non-Fiction</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewManuscriptModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}