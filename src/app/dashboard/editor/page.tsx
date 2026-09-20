"use client";

import { Card, KpiCard, StatusBadge, Table, Td } from "@/components/ui/cards";

const MANUSCRIPT_QUEUE = [
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
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Editor Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Manuscripts in Queue" value="4" icon="📄" color="indigo" />
        <KpiCard title="Reviews This Month" value="12" change={25} icon="✅" color="green" />
        <KpiCard title="Avg Review Time" value="3.2 days" change={-15} icon="⏱️" color="amber" />
        <KpiCard title="AI Pre-Score Avg" value="87/100" icon="🤖" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Manuscript Queue */}
        <div className="lg:col-span-2">
          <Card title="Manuscript Queue">
            <Table headers={["Title", "Author", "Word Count", "AI Score", "Status", "Priority", "Submitted"]}>
              {MANUSCRIPT_QUEUE.map((ms) => (
                <tr key={ms.id} className="table-row-hover cursor-pointer">
                  <Td className="font-medium text-slate-900">{ms.title}</Td>
                  <Td>{ms.author}</Td>
                  <Td className="font-mono">{ms.wordCount.toLocaleString()}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${ms.aiScore >= 90 ? "bg-emerald-500" : ms.aiScore >= 80 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${ms.aiScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{ms.aiScore}</span>
                    </div>
                  </Td>
                  <Td><StatusBadge status={ms.status} /></Td>
                  <Td>
                    <span className={`text-xs font-medium ${ms.priority === "high" ? "text-red-600" : ms.priority === "medium" ? "text-amber-600" : "text-slate-500"}`}>
                      {ms.priority}
                    </span>
                  </Td>
                  <Td className="text-xs text-slate-500">{ms.submitted}</Td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium text-left hover:bg-indigo-100 transition-colors">
              📋 View Full Queue
            </button>
            <button className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium text-left hover:bg-emerald-100 transition-colors">
              🤖 Run AI Analysis
            </button>
            <button className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium text-left hover:bg-purple-100 transition-colors">
              📊 View Reports
            </button>
            <button className="w-full px-4 py-3 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium text-left hover:bg-amber-100 transition-colors">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {AI_REPORTS.map((report) => {
                const scores = [report.structural, report.line, report.continuity, report.market, report.authenticity];
                const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                return (
                  <tr key={report.manuscript} className="table-row-hover">
                    <Td className="font-medium text-slate-900">{report.manuscript}</Td>
                    {[report.structural, report.line, report.continuity, report.market, report.authenticity].map((score, i) => (
                      <Td key={i} className="text-center">
                        <span className={`inline-block w-10 py-1 rounded-full text-xs font-bold ${
                          score >= 90 ? "bg-emerald-100 text-emerald-700" :
                          score >= 80 ? "bg-blue-100 text-blue-700" :
                          score >= 70 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {score}
                        </span>
                      </Td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}