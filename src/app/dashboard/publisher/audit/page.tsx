"use client";

import { Card, StatusBadge, Table, Td, KpiCard } from "@/components/ui/cards";

const AUDIT_MOVEMENTS = [
  { id: "1", time: "2025-01-15 14:30", book: "The Quantum Garden (HC)", warehouse: "NYC Main", type: "sold", qty: 23, txId: "TX-2025-001248", verified: true },
  { id: "2", time: "2025-01-15 13:15", book: "Code Red (HC)", warehouse: "LA West", type: "sold", qty: 15, txId: "TX-2025-001247", verified: true },
  { id: "3", time: "2025-01-15 10:00", book: "The Last Algorithm (HC)", warehouse: "NYC Main", type: "sold", qty: 8, txId: "TX-2025-001246", verified: true },
  { id: "4", time: "2025-01-14 16:00", book: "Code Red (HC)", warehouse: "LA West", type: "received", qty: 5000, txId: "TX-2025-001245", verified: true },
  { id: "5", time: "2025-01-14 15:30", book: "The Quantum Garden (PB)", warehouse: "NYC Main", type: "transferred", qty: 500, txId: "TX-2025-001244", verified: true },
  { id: "6", time: "2025-01-14 15:30", book: "The Quantum Garden (PB)", warehouse: "LA West", type: "received", qty: 500, txId: "TX-2025-001243", verified: true },
];

export default function AuditPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🛡️ Blockchain-Verified Stock Audit</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Verified Movements" value="1,248" icon="✅" color="green" />
        <KpiCard title="Pending Verification" value="0" icon="⏳" color="amber" />
        <KpiCard title="Discrepancies" value="0" icon="🔍" color="blue" />
        <KpiCard title="Last Audit" value="2 days ago" icon="📅" color="purple" />
      </div>

      <Card title="Blockchain-Verified Stock Movements" className="mb-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-indigo-800">
            🔗 All stock movements are immutably recorded on Hyperledger Fabric.
            Each transaction is cryptographically signed and cannot be altered or deleted.
          </p>
        </div>
        <Table headers={["Time", "Book", "Warehouse", "Type", "Qty", "Blockchain TX", "Verified"]}>
          {AUDIT_MOVEMENTS.map((mov) => (
            <tr key={mov.id} className="table-row-hover">
              <Td className="text-xs text-slate-500 font-mono">{mov.time}</Td>
              <Td className="font-medium text-slate-900 text-sm">{mov.book}</Td>
              <Td>{mov.warehouse}</Td>
              <Td>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  mov.type === "sold" ? "bg-red-100 text-red-700" :
                  mov.type === "received" ? "bg-emerald-100 text-emerald-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {mov.type}
                </span>
              </Td>
              <Td className={`font-mono font-bold ${mov.type === "sold" || mov.type === "transferred" ? "text-red-600" : "text-emerald-600"}`}>
                {mov.type === "sold" || mov.type === "transferred" ? "-" : "+"}{mov.qty.toLocaleString()}
              </Td>
              <Td className="font-mono text-xs text-indigo-600">{mov.txId}</Td>
              <Td>
                {mov.verified ? (
                  <span className="text-emerald-600 text-sm">✓</span>
                ) : (
                  <span className="text-amber-600 text-sm">⏳</span>
                )}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Smart Contract Executions">
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-900">Auto-Payment: PrintMaster Inc.</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Executed</span>
              </div>
              <p className="text-xs text-slate-500">PO-2025-001 delivery confirmed → $12,500 payment released</p>
              <p className="text-xs font-mono text-indigo-600 mt-1">TX: TX-SC-2025-001240</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-900">Royalty: Dr. Elara Voss</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Pending</span>
              </div>
              <p className="text-xs text-slate-500">Q1 2025 royalty calculation in progress — 60% of net sales</p>
              <p className="text-xs font-mono text-indigo-600 mt-1">TX: TX-SC-2025-001241</p>
            </div>
          </div>
        </Card>

        <Card title="Audit Schedule">
          <div className="space-y-3">
            {[
              { name: "NYC Main — Physical Count", date: "2025-02-01", status: "scheduled" },
              { name: "LA West — Physical Count", date: "2025-02-08", status: "scheduled" },
              { name: "Quarterly Reconciliation", date: "2025-03-31", status: "scheduled" },
            ].map((audit, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div>
                  <div className="text-sm font-medium text-slate-900">{audit.name}</div>
                  <div className="text-xs text-slate-500">{audit.date}</div>
                </div>
                <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">
                  Generate Sheet
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}