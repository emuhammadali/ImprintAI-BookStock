"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, KpiCard, StatusBadge, Table, Td } from "@/components/ui/cards";

const INITIAL_QUEUE = [
  { id: "1", title: "Whispers of the Forgotten", author: "Sarah Chen", genre: "Fantasy", wordCount: 112000, status: "in_review", submitted: "2025-01-14", aiScore: 82, priority: "high" },
  { id: "2", title: "Midnight in Marrakech", author: "Omar Hassan", genre: "Thriller", wordCount: 78000, status: "in_review", submitted: "2025-01-13", aiScore: 91, priority: "medium" },
  { id: "3", title: "The Quantum Garden", author: "Dr. Elara Voss", genre: "Sci-Fi", wordCount: 78450, status: "revision", submitted: "2025-01-10", aiScore: 88, priority: "medium" },
  { id: "4", title: "Beneath the Willow", author: "Maria Garcia", genre: "Literary", wordCount: 64000, status: "in_review", submitted: "2025-01-12", aiScore: 95, priority: "low" },
  { id: "5", title: "Code Red: Silicon Valley", author: "Alex Park", genre: "Thriller", wordCount: 85000, status: "approved", submitted: "2025-01-05", aiScore: 79, priority: "high" },
];

const AI_REPORTS = [
  { manuscript: "Whispers of the Forgotten", structural: 72, line: 85, continuity: 68, market: 90, authenticity: 94 },
  { manuscript: "Midnight in Marrakech", structural: 88, line: 92, continuity: 95, market: 86, authenticity: 91 },
  { manuscript: "The Quantum Garden", structural: 85, line: 78, continuity: 70, market: 82, authenticity: 94 },
];

export default function EditorDashboardPage() {
  const router = useRouter();
  const [queue] = useState(INITIAL_QUEUE);
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [selectedMs, setSelectedMs] = useState<typeof INITIAL_QUEUE[0] | null>(null);
  const [selectedReport, setSelectedReport] = useState<typeof AI_REPORTS[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({ to: "", subject: "", body: "" });

  // ✅ Filtered queue
  const filteredQueue = useMemo(() => {
    return queue.filter((ms) => priorityFilter === "all" || ms.priority === priorityFilter);
  }, [queue, priorityFilter]);

  // ✅ Dynamic KPIs
  const inQueue = queue.filter((m) => m.status === "in_review" || m.status === "revision").length;
  const reviewed = queue.filter((m) => m.status === "approved").length + 12;
  const avgAiScore = queue.length > 0
    ? Math.round(queue.reduce((s, m) => s + m.aiScore, 0) / queue.length)
    : 0;

  // ✅ View manuscript detail
  function viewManuscript(ms: typeof INITIAL_QUEUE[0]) {
    setSelectedMs(ms);
    setShowDetailModal(true);
  }

  // ✅ View AI report
  function viewReport(report: typeof AI_REPORTS[0]) {
    setSelectedReport(report);
    setShowReportModal(true);
  }

  // ✅ Quick Actions
  function goToFullQueue() {
    router.push("/dashboard/editor/manuscripts");
  }

  function runAiAnalysis() {
    alert("🤖 Running AI analysis on all pending manuscripts...\n\nThis may take a few minutes. You'll be notified when complete.");
  }

  function goToReports() {
    if (AI_REPORTS.length > 0) {
      setSelectedReport(AI_REPORTS[0]);
      setShowReportModal(true);
    }
  }

  function openMessageModal(recipient = "") {
    setMessageForm({ to: recipient, subject: "", body: "" });
    setShowMessageModal(true);
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    alert(`✅ Message sent to ${messageForm.to}`);
    setShowMessageModal(false);
    setMessageForm({ to: "", subject: "", body: "" });
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-100 text-emerald-700";
    if (score >= 80) return "bg-blue-100 text-blue-700";
    if (score >= 70) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Editor Dashboard</h2>
        <button
          onClick={() => openMessageModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          💬 New Message
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Manuscripts in Queue" value={inQueue.toString()} icon="📄" color="indigo" />
        <KpiCard title="Reviews This Month" value={reviewed.toString()} change={25} icon="✅" color="green" />
        <KpiCard title="Avg Review Time" value="3.2 days" change={-15} icon="⏱️" color="amber" />
        <KpiCard title="AI Pre-Score Avg" value={`${avgAiScore}/100`} icon="🤖" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Manuscript Queue */}
        <div className="lg:col-span-2">
          <Card title={`Manuscript Queue (${filteredQueue.length})`}>
            {/* Filter */}
            <div className="flex gap-2 mb-3">
              {(["all", "high", "medium", "low"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    priorityFilter === p
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p === "all" ? "All" : `${p} Priority`}
                </button>
              ))}
            </div>

            <Table headers={["Title", "Author", "Words", "AI Score", "Status", "Priority", "Actions"]}>
              {filteredQueue.map((ms) => (
                <tr key={ms.id} className="table-row-hover">
                  <Td className="font-medium text-slate-900">{ms.title}</Td>
                  <Td>{ms.author}</Td>
                  <Td className="font-mono text-xs">{(ms.wordCount / 1000).toFixed(0)}k</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            ms.aiScore >= 90 ? "bg-emerald-500" : ms.aiScore >= 80 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${ms.aiScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{ms.aiScore}</span>
                    </div>
                  </Td>
                  <Td><StatusBadge status={ms.status} /></Td>
                  <Td>
                    <span className={`text-xs font-medium capitalize ${
                      ms.priority === "high" ? "text-red-600" :
                      ms.priority === "medium" ? "text-amber-600" :
                      "text-slate-500"
                    }`}>
                      {ms.priority}
                    </span>
                  </Td>
                  <Td>
                    <button
                      onClick={() => viewManuscript(ms)}
                      className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"
                    >
                      View
                    </button>
                  </Td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            <button
              onClick={goToFullQueue}
              className="w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium text-left hover:bg-indigo-100 transition-colors"
            >
              📋 View Full Queue
            </button>
            <button
              onClick={runAiAnalysis}
              className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium text-left hover:bg-emerald-100 transition-colors"
            >
              🤖 Run AI Analysis
            </button>
            <button
              onClick={goToReports}
              className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium text-left hover:bg-purple-100 transition-colors"
            >
              📊 View Reports
            </button>
            <button
              onClick={() => openMessageModal()}
              className="w-full px-4 py-3 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium text-left hover:bg-amber-100 transition-colors"
            >
              💬 Send Message
            </button>
          </div>
        </Card>
      </div>

      {/* AI Pre-Analysis Reports */}
      <Card title="AI Pre-Analysis Reports">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Manuscript</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">Structural</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">Line Edit</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">Continuity</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">Market</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">Authenticity</th>
                <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">Avg</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {AI_REPORTS.map((report) => {
                const scores = [report.structural, report.line, report.continuity, report.market, report.authenticity];
                const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                return (
                  <tr key={report.manuscript} className="table-row-hover">
                    <Td className="font-medium text-slate-900">{report.manuscript}</Td>
                    {scores.map((score, i) => (
                      <Td key={i} className="text-center">
                        <span className={`inline-block w-10 py-1 rounded-full text-xs font-bold ${getScoreColor(score)}`}>
                          {score}
                        </span>
                      </Td>
                    ))}
                    <Td className="text-center">
                      <span className={`inline-block w-12 py-1 rounded-full text-xs font-bold ${getScoreColor(avg)}`}>
                        {avg}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <button
                        onClick={() => viewReport(report)}
                        className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"
                      >
                        Details
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ✅ Manuscript Detail Modal */}
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
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={selectedMs.status} />
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  selectedMs.priority === "high" ? "bg-red-100 text-red-700" :
                  selectedMs.priority === "medium" ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {selectedMs.priority} priority
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Word Count</span>
                <span className="font-mono text-slate-900">{selectedMs.wordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">AI Pre-Score</span>
                <span className="font-bold text-slate-900">{selectedMs.aiScore}/100</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Submitted</span>
                <span className="text-slate-900">{selectedMs.submitted}</span>
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
                  openMessageModal(`${selectedMs.author.toLowerCase().replace(" ", ".")}@quantumpress.com`);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                💬 Message Author
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ AI Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">🤖 AI Analysis Report</h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <div className="font-medium text-slate-900">{selectedReport.manuscript}</div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Structural Architect", score: selectedReport.structural, desc: "Plot arcs, pacing, chapter balance" },
                { label: "Line Editor", score: selectedReport.line, desc: "Prose clarity, sentence rhythm" },
                { label: "Continuity Guardian", score: selectedReport.continuity, desc: "Character, timeline, world consistency" },
                { label: "Market Analyst", score: selectedReport.market, desc: "Comparable titles, sales potential" },
                { label: "Authenticity Auditor", score: selectedReport.authenticity, desc: "AI slop detection, human authenticity" },
              ].map((agent) => (
                <div key={agent.label} className="p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{agent.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreColor(agent.score)}`}>
                      {agent.score}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{agent.desc}</div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${
                        agent.score >= 90 ? "bg-emerald-500" :
                        agent.score >= 80 ? "bg-blue-500" :
                        agent.score >= 70 ? "bg-amber-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${agent.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowReportModal(false)}
              className="w-full mt-5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">💬 Send Message</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <form onSubmit={sendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">To</label>
                <input
                  type="email"
                  value={messageForm.to}
                  onChange={(e) => setMessageForm({ ...messageForm, to: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  value={messageForm.body}
                  onChange={(e) => setMessageForm({ ...messageForm, body: e.target.value })}
                  className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}