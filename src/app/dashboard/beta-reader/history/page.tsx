"use client";

import { useState, useMemo } from "react";
import { Card, Table, Td, KpiCard } from "@/components/ui/cards";

const FEEDBACK_HISTORY = [
  { id: "1", date: "2025-01-15", manuscript: "Whispers of the Forgotten", chapter: "Ch. 13", type: "pacing", content: "The pacing in the middle section feels slow. Consider cutting some of the inner monologue.", rating: 3, status: "reviewed" },
  { id: "2", date: "2025-01-14", manuscript: "Whispers of the Forgotten", chapter: "Ch. 12", type: "character", content: "Kaelith's decision to trust Darien feels rushed. Maybe add a moment of hesitation.", rating: 4, status: "reviewed" },
  { id: "3", date: "2025-01-13", manuscript: "Whispers of the Forgotten", chapter: "Ch. 11", type: "prose", content: "Beautiful descriptions in this chapter. The obsidian gate scene is vivid and immersive.", rating: 5, status: "acknowledged" },
  { id: "4", date: "2025-01-12", manuscript: "Midnight in Marrakech", chapter: "Ch. 4", type: "confusing", content: "The timeline jumps confused me. Could use clearer transitions between the present and flashback.", rating: 3, status: "reviewed" },
  { id: "5", date: "2025-01-11", manuscript: "Midnight in Marrakech", chapter: "Ch. 3", type: "plot", content: "Great twist with the hidden room. Did not see it coming at all!", rating: 5, status: "acknowledged" },
  { id: "6", date: "2025-01-10", manuscript: "Whispers of the Forgotten", chapter: "Ch. 10", type: "character", content: "Darien's backstory reveal was powerful. Would love to see more of his past explored.", rating: 5, status: "acknowledged" },
];

const TYPE_COLORS: Record<string, string> = {
  pacing: "bg-blue-50 text-blue-700",
  character: "bg-purple-50 text-purple-700",
  prose: "bg-pink-50 text-pink-700",
  confusing: "bg-amber-50 text-amber-700",
  plot: "bg-emerald-50 text-emerald-700",
  general: "bg-slate-100 text-slate-700",
};

export default function FeedbackHistoryPage() {
  const [feedback] = useState(FEEDBACK_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [manuscriptFilter, setManuscriptFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<typeof FEEDBACK_HISTORY[0] | null>(null);

  // ✅ Unique values for filters
  const manuscripts = useMemo(() => [...new Set(feedback.map((f) => f.manuscript))], [feedback]);
  const types = useMemo(() => [...new Set(feedback.map((f) => f.type))], [feedback]);

  // ✅ Filtered data
  const filtered = useMemo(() => {
    return feedback.filter((fb) => {
      const matchesSearch = !searchQuery ||
        fb.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.manuscript.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || fb.type === typeFilter;
      const matchesManuscript = manuscriptFilter === "all" || fb.manuscript === manuscriptFilter;
      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "5" && fb.rating === 5) ||
        (ratingFilter === "4+" && fb.rating >= 4) ||
        (ratingFilter === "3+" && fb.rating >= 3) ||
        (ratingFilter === "low" && fb.rating <= 3);
      return matchesSearch && matchesType && matchesManuscript && matchesRating;
    });
  }, [feedback, searchQuery, typeFilter, manuscriptFilter, ratingFilter]);

  // ✅ Dynamic KPIs
  const totalFeedback = feedback.length;
  const avgRating = feedback.length > 0
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : "0.0";
  const manuscriptsCount = manuscripts.length;
  const highRated = feedback.filter((f) => f.rating >= 4).length;

  // ✅ View detail
  function viewDetail(fb: typeof FEEDBACK_HISTORY[0]) {
    setSelectedFeedback(fb);
    setShowDetailModal(true);
  }

  // ✅ Export CSV
  function exportCSV() {
    const headers = ["Date", "Manuscript", "Chapter", "Type", "Feedback", "Rating", "Status"];
    const rows = filtered.map((f) => [
      f.date,
      `"${f.manuscript}"`,
      f.chapter,
      f.type,
      `"${f.content.replace(/"/g, '""')}"`,
      f.rating,
      f.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ✅ Clear all filters
  function clearFilters() {
    setSearchQuery("");
    setTypeFilter("all");
    setManuscriptFilter("all");
    setRatingFilter("all");
  }

  const hasActiveFilters = searchQuery || typeFilter !== "all" || manuscriptFilter !== "all" || ratingFilter !== "all";

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">🕐 Feedback History</h2>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          📥 Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Feedback" value={totalFeedback.toString()} icon="💬" color="indigo" />
        <KpiCard title="Average Rating" value={avgRating} icon="⭐" color="amber" />
        <KpiCard title="Manuscripts" value={manuscriptsCount.toString()} icon="📚" color="blue" />
        <KpiCard title="High Ratings (4-5★)" value={highRated.toString()} icon="✅" color="green" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search feedback, manuscript, or chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Manuscript filter */}
          <select
            value={manuscriptFilter}
            onChange={(e) => setManuscriptFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Manuscripts</option>
            {manuscripts.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          {/* Rating filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4+">4+ Stars</option>
            <option value="3+">3+ Stars</option>
            <option value="low">3 or Below</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-3 text-xs text-slate-500">
            Showing <strong>{filtered.length}</strong> of <strong>{feedback.length}</strong> results
          </div>
        )}
      </div>

      {/* Table */}
      <Card title={`Feedback Records (${filtered.length})`}>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No feedback matches your filters</p>
            <button
              onClick={clearFilters}
              className="mt-3 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <Table headers={["Date", "Manuscript", "Chapter", "Type", "Feedback", "Rating", "Actions"]}>
            {filtered.map((fb) => (
              <tr key={fb.id} className="table-row-hover">
                <Td className="text-sm text-slate-500">{fb.date}</Td>
                <Td className="font-medium text-slate-900 text-sm">{fb.manuscript}</Td>
                <Td className="text-sm text-slate-600">{fb.chapter}</Td>
                <Td>
                  <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${TYPE_COLORS[fb.type] || TYPE_COLORS.general}`}>
                    {fb.type}
                  </span>
                </Td>
                <Td className="text-sm text-slate-600 max-w-md">
                  <div className="line-clamp-2">{fb.content}</div>
                </Td>
                <Td>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${star <= fb.rating ? "text-amber-400" : "text-slate-200"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </Td>
                <Td>
                  <button
                    onClick={() => viewDetail(fb)}
                    className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    View
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Feedback Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <div className="font-bold text-slate-900 text-lg">{selectedFeedback.manuscript}</div>
              <div className="text-sm text-slate-600 mt-1">{selectedFeedback.chapter}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${TYPE_COLORS[selectedFeedback.type] || TYPE_COLORS.general}`}>
                  {selectedFeedback.type}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  selectedFeedback.status === "acknowledged"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {selectedFeedback.status}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-slate-500 mb-2">Feedback Content</div>
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 leading-relaxed">
                {selectedFeedback.content}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Date</span>
                <span className="text-slate-900">{selectedFeedback.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Rating</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${star <= selectedFeedback.rating ? "text-amber-400" : "text-slate-200"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
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
                  navigator.clipboard.writeText(selectedFeedback.content);
                  alert("✅ Feedback copied to clipboard!");
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                📋 Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}