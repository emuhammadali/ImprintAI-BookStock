"use client";

import { useState, useMemo } from "react";
import { Card, StatusBadge, KpiCard } from "@/components/ui/cards";

const INITIAL_MANUSCRIPTS = [
  { id: "1", title: "Whispers of the Forgotten", author: "Sarah Chen", genre: "Fantasy", words: 112000, status: "in_review", versions: 3, comments: 47, submitted: "2025-01-08", deadline: "2025-02-15" },
  { id: "2", title: "Midnight in Marrakech", author: "Omar Hassan", genre: "Thriller", words: 78000, status: "in_review", versions: 1, comments: 12, submitted: "2025-01-12", deadline: "2025-03-01" },
  { id: "3", title: "The Quantum Garden", author: "Dr. Elara Voss", genre: "Sci-Fi", words: 78450, status: "revision", versions: 3, comments: 89, submitted: "2024-12-20", deadline: "2025-01-30" },
  { id: "4", title: "Beneath the Willow", author: "Maria Garcia", genre: "Literary", words: 64000, status: "in_review", versions: 2, comments: 23, submitted: "2025-01-05", deadline: "2025-02-20" },
];

const AI_FEEDBACK_SAMPLES: Record<string, any> = {
  "1": {
    score: 82,
    strengths: ["Strong character development", "Vivid worldbuilding", "Compelling dialogue"],
    weaknesses: ["Pacing slows in Ch. 10-13", "Some info-dumping in early chapters"],
    suggestions: ["Consider trimming inner monologue", "Add more sensory details in action scenes"],
  },
  "2": {
    score: 74,
    strengths: ["Great sense of place", "Tight prose", "Interesting premise"],
    weaknesses: ["Timeline jumps confusing", "Secondary characters underdeveloped"],
    suggestions: ["Add chapter date markers", "Flesh out the antagonist's motivation"],
  },
  "3": {
    score: 91,
    strengths: ["Excellent scientific accuracy", "Clear prose", "Strong plot structure"],
    weaknesses: ["Minimal emotional stakes", "Rushed ending"],
    suggestions: ["Deepen protagonist's relationships", "Expand final chapters"],
  },
  "4": {
    score: 78,
    strengths: ["Beautiful lyrical prose", "Authentic voice", "Emotional resonance"],
    weaknesses: ["Slow first act", "Ambiguous resolution"],
    suggestions: ["Tighten opening chapters", "Clarify the ending"],
  },
};

export default function EditorManuscriptsPage() {
  const [manuscripts, setManuscripts] = useState(INITIAL_MANUSCRIPTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"deadline" | "words" | "comments" | "submitted">("deadline");

  // Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAIReportModal, setShowAIReportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMs, setSelectedMs] = useState<typeof INITIAL_MANUSCRIPTS[0] | null>(null);

  // Review form
  const [reviewComment, setReviewComment] = useState("");
  const [reviewDecision, setReviewDecision] = useState<"approve" | "request_revision" | "reject">("approve");

  // ✅ Filtered + Sorted
  const filtered = useMemo(() => {
    let result = manuscripts.filter((ms) => {
      const matchesSearch =
        !searchQuery ||
        ms.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ms.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || ms.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === "words") return b.words - a.words;
      if (sortBy === "comments") return b.comments - a.comments;
      if (sortBy === "submitted") return new Date(b.submitted).getTime() - new Date(a.submitted).getTime();
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    return result;
  }, [manuscripts, searchQuery, statusFilter, sortBy]);

  // ✅ Dynamic KPIs
  const totalMs = manuscripts.length;
  const inReview = manuscripts.filter((m) => m.status === "in_review").length;
  const inRevision = manuscripts.filter((m) => m.status === "revision").length;
  const totalWords = manuscripts.reduce((s, m) => s + m.words, 0);

  // ✅ Review
  function handleReview(ms: typeof INITIAL_MANUSCRIPTS[0]) {
    setSelectedMs(ms);
    setReviewComment("");
    setReviewDecision("approve");
    setShowReviewModal(true);
  }

  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMs) return;

    const newStatus =
      reviewDecision === "approve" ? "approved" :
      reviewDecision === "request_revision" ? "revision" :
      "rejected";

    setManuscripts((prev) =>
      prev.map((m) => (m.id === selectedMs.id ? { ...m, status: newStatus } : m))
    );
    setShowReviewModal(false);
  }

  // ✅ AI Report
  function handleAIReport(ms: typeof INITIAL_MANUSCRIPTS[0]) {
    setSelectedMs(ms);
    setShowAIReportModal(true);
  }

  // ✅ View Detail
  function viewDetail(ms: typeof INITIAL_MANUSCRIPTS[0]) {
    setSelectedMs(ms);
    setShowDetailModal(true);
  }

  const hasActiveFilters = searchQuery || statusFilter !== "all";

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">📝 Manuscripts</h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Manuscripts" value={totalMs.toString()} icon="📚" color="indigo" />
        <KpiCard title="In Review" value={inReview.toString()} icon="🔍" color="amber" />
        <KpiCard title="In Revision" value={inRevision.toString()} icon="✏️" color="purple" />
        <KpiCard title="Total Words" value={`${(totalWords / 1000).toFixed(0)}k`} icon="📄" color="blue" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="🔍 Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="in_review">In Review</option>
            <option value="revision">Revision</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="submitted">Sort by Recently Submitted</option>
            <option value="words">Sort by Word Count</option>
            <option value="comments">Sort by Comments</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Manuscripts Grid */}
      {filtered.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No manuscripts match your filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ms) => (
            <Card key={ms.id} className="card-hover">
              <div
                className="flex items-start justify-between mb-3 cursor-pointer"
                onClick={() => viewDetail(ms)}
              >
                <div>
                  <h3 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                    {ms.title}
                  </h3>
                  <p className="text-sm text-slate-500">by {ms.author} • {ms.genre}</p>
                </div>
                <StatusBadge status={ms.status} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-900">{(ms.words / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-slate-500">words</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-900">{ms.versions}</div>
                  <div className="text-xs text-slate-500">versions</div>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-900">{ms.comments}</div>
                  <div className="text-xs text-slate-500">comments</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>📅 Deadline: {ms.deadline}</span>
                <span>📤 Submitted: {ms.submitted}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleReview(ms)}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  📝 Review
                </button>
                <button
                  onClick={() => handleAIReport(ms)}
                  className="flex-1 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  🤖 AI Report
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedMs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Manuscript Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <div className="font-bold text-slate-900 text-lg">{selectedMs.title}</div>
              <div className="text-sm text-slate-600 mt-1">by {selectedMs.author} • {selectedMs.genre}</div>
              <div className="mt-2"><StatusBadge status={selectedMs.status} /></div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-slate-900">{(selectedMs.words / 1000).toFixed(0)}k</div>
                <div className="text-xs text-slate-500">words</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-slate-900">{selectedMs.versions}</div>
                <div className="text-xs text-slate-500">versions</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-slate-900">{selectedMs.comments}</div>
                <div className="text-xs text-slate-500">comments</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Submitted</span>
                <span className="text-slate-900">{selectedMs.submitted}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Deadline</span>
                <span className="text-slate-900 font-medium">{selectedMs.deadline}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleReview(selectedMs);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Start Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Review Modal */}
      {showReviewModal && selectedMs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Review Manuscript</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <div className="font-medium text-slate-900">{selectedMs.title}</div>
              <div className="text-xs text-slate-500">by {selectedMs.author}</div>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Decision</label>
                <div className="space-y-2">
                  {[
                    { value: "approve", label: "✅ Approve for Production", color: "emerald" },
                    { value: "request_revision", label: "✏️ Request Revision", color: "amber" },
                    { value: "reject", label: "❌ Reject", color: "red" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        reviewDecision === opt.value
                          ? `bg-${opt.color}-50 border-${opt.color}-200`
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="decision"
                        value={opt.value}
                        checked={reviewDecision === opt.value}
                        onChange={() => setReviewDecision(opt.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Comments for Author
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Provide detailed feedback for the author..."
                  className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ AI Report Modal */}
      {showAIReportModal && selectedMs && AI_FEEDBACK_SAMPLES[selectedMs.id] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">🤖 AI Analysis Report</h3>
              <button onClick={() => setShowAIReportModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <div className="font-medium text-slate-900">{selectedMs.title}</div>
              <div className="text-xs text-slate-500">by {selectedMs.author}</div>
            </div>

            {/* Score */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
              <div className="text-sm opacity-90 mb-1">Overall Quality Score</div>
              <div className="text-5xl font-bold">{AI_FEEDBACK_SAMPLES[selectedMs.id].score}<span className="text-2xl opacity-70">/100</span></div>
            </div>

            {/* Strengths */}
            <div className="mb-4">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Strengths
              </h4>
              <ul className="space-y-1">
                {AI_FEEDBACK_SAMPLES[selectedMs.id].strengths.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-slate-700 pl-6">• {s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="mb-4">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-amber-600">⚠</span> Areas for Improvement
              </h4>
              <ul className="space-y-1">
                {AI_FEEDBACK_SAMPLES[selectedMs.id].weaknesses.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-slate-700 pl-6">• {s}</li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="mb-6">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-indigo-600">💡</span> AI Suggestions
              </h4>
              <ul className="space-y-1">
                {AI_FEEDBACK_SAMPLES[selectedMs.id].suggestions.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-slate-700 pl-6">• {s}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAIReportModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("📥 AI report downloaded as PDF");
                  setShowAIReportModal(false);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                📥 Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}