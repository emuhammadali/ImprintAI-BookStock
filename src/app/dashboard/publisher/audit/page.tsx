"use client";

import { useState, useMemo } from "react";
import { Card, Table, Td, KpiCard } from "@/components/ui/cards";

const INITIAL_MOVEMENTS = [
  { id: "1", time: "2025-01-15 14:30", book: "The Quantum Garden (HC)", warehouse: "NYC Main", type: "sold", qty: 23, txId: "TX-2025-001248", verified: true, block: 14823 },
  { id: "2", time: "2025-01-15 13:15", book: "Code Red (HC)", warehouse: "LA West", type: "sold", qty: 15, txId: "TX-2025-001247", verified: true, block: 14822 },
  { id: "3", time: "2025-01-15 10:00", book: "The Last Algorithm (HC)", warehouse: "NYC Main", type: "sold", qty: 8, txId: "TX-2025-001246", verified: true, block: 14821 },
  { id: "4", time: "2025-01-14 16:00", book: "Code Red (HC)", warehouse: "LA West", type: "received", qty: 5000, txId: "TX-2025-001245", verified: true, block: 14820 },
  { id: "5", time: "2025-01-14 15:30", book: "The Quantum Garden (PB)", warehouse: "NYC Main", type: "transferred", qty: 500, txId: "TX-2025-001244", verified: true, block: 14819 },
  { id: "6", time: "2025-01-14 15:30", book: "The Quantum Garden (PB)", warehouse: "LA West", type: "received", qty: 500, txId: "TX-2025-001243", verified: true, block: 14819 },
];

const SMART_CONTRACTS = [
  { id: "SC-001", name: "Auto-Payment: PrintMaster Inc.", desc: "PO-2025-001 delivery confirmed → $12,500 payment released", txId: "TX-SC-2025-001240", status: "executed", amount: "$12,500.00" },
  { id: "SC-002", name: "Royalty: Dr. Elara Voss", desc: "Q1 2025 royalty calculation in progress — 60% of net sales", txId: "TX-SC-2025-001241", status: "pending", amount: "TBD" },
];

const AUDIT_SCHEDULE = [
  { id: "AUD-001", name: "NYC Main — Physical Count", date: "2025-02-01", status: "scheduled", warehouse: "NYC Main" },
  { id: "AUD-002", name: "LA West — Physical Count", date: "2025-02-08", status: "scheduled", warehouse: "LA West" },
  { id: "AUD-003", name: "Quarterly Reconciliation", date: "2025-03-31", status: "scheduled", warehouse: "All" },
];

export default function AuditPage() {
  const [movements] = useState(INITIAL_MOVEMENTS);
  const [contracts, setContracts] = useState(SMART_CONTRACTS);
  const [schedule, setSchedule] = useState(AUDIT_SCHEDULE);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [warehouseFilter, setWarehouseFilter] = useState("all");

  const [showTxModal, setShowTxModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<typeof INITIAL_MOVEMENTS[0] | null>(null);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<typeof AUDIT_SCHEDULE[0] | null>(null);

  // ✅ Filtered movements
  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.warehouse.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || m.type === typeFilter;
      const matchesWarehouse = warehouseFilter === "all" || m.warehouse === warehouseFilter;
      return matchesSearch && matchesType && matchesWarehouse;
    });
  }, [movements, searchQuery, typeFilter, warehouseFilter]);

  // ✅ Dynamic KPIs
  const totalVerified = movements.filter((m) => m.verified).length;
  const totalPending = movements.filter((m) => !m.verified).length;

  // ✅ View TX Details
  function viewTx(mov: typeof INITIAL_MOVEMENTS[0]) {
    setSelectedMovement(mov);
    setShowTxModal(true);
  }

  // ✅ Generate Sheet
  function handleGenerateSheet(audit: typeof AUDIT_SCHEDULE[0]) {
    setSelectedAudit(audit);
    setShowGenerateModal(true);
  }

  function confirmGenerateSheet(e: React.FormEvent) {
    e.preventDefault();
    // Simulate sheet generation
    setTimeout(() => {
      setShowGenerateModal(false);
      alert(`✅ Audit sheet generated for: ${selectedAudit?.name}\n\nDownload link sent to your email.`);
    }, 500);
  }

  // ✅ Execute contract (for pending)
  function executeContract(id: string) {
    if (!confirm("Execute this smart contract now?")) return;
    setContracts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "executed" } : c))
    );
  }

  // ✅ Schedule new audit
  function handleScheduleAudit() {
    const newAudit = {
      id: `AUD-${String(schedule.length + 1).padStart(3, "0")}`,
      name: "Custom Physical Count",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "scheduled",
      warehouse: "All",
    };
    setSchedule([...schedule, newAudit]);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">🛡️ Blockchain-Verified Stock Audit</h2>
        <div className="flex gap-2">
          <button
            onClick={() => alert("🔍 Running integrity verification across all blocks...")}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            🔍 Verify Chain
          </button>
          <button
            onClick={() => alert("📥 Exporting full audit log (CSV)...")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            📥 Export Audit Log
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Verified Movements" value={totalVerified.toLocaleString()} icon="✅" color="green" />
        <KpiCard title="Pending Verification" value={totalPending} icon="⏳" color="amber" />
        <KpiCard title="Discrepancies" value="0" icon="🔍" color="blue" />
        <KpiCard title="Last Audit" value="2 days ago" icon="📅" color="purple" />
      </div>

      {/* Movements Table */}
      <Card title={`Blockchain-Verified Stock Movements (${filteredMovements.length})`} className="mb-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-indigo-800">
            🔗 All stock movements are immutably recorded on Hyperledger Fabric.
            Each transaction is cryptographically signed and cannot be altered or deleted.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="🔍 Search by TX ID, book, or warehouse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="sold">Sold</option>
            <option value="received">Received</option>
            <option value="transferred">Transferred</option>
          </select>
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Warehouses</option>
            <option value="NYC Main">NYC Main</option>
            <option value="LA West">LA West</option>
          </select>
        </div>

        {filteredMovements.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No movements match your filters</p>
          </div>
        ) : (
          <Table headers={["Time", "Book", "Warehouse", "Type", "Qty", "Blockchain TX", "Verified", "Action"]}>
            {filteredMovements.map((mov) => (
              <tr key={mov.id} className="table-row-hover">
                <Td className="text-xs text-slate-500 font-mono">{mov.time}</Td>
                <Td className="font-medium text-slate-900 text-sm">{mov.book}</Td>
                <Td>{mov.warehouse}</Td>
                <Td>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      mov.type === "sold"
                        ? "bg-red-100 text-red-700"
                        : mov.type === "received"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {mov.type}
                  </span>
                </Td>
                <Td
                  className={`font-mono font-bold ${
                    mov.type === "sold" || mov.type === "transferred"
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  {mov.type === "sold" || mov.type === "transferred" ? "-" : "+"}
                  {mov.qty.toLocaleString()}
                </Td>
                <Td className="font-mono text-xs text-indigo-600">{mov.txId}</Td>
                <Td>
                  {mov.verified ? (
                    <span className="text-emerald-600 text-sm">✓</span>
                  ) : (
                    <span className="text-amber-600 text-sm">⏳</span>
                  )}
                </Td>
                <Td>
                  <button
                    onClick={() => viewTx(mov)}
                    className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    View TX
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Contracts */}
        <Card title="Smart Contract Executions">
          <div className="space-y-3">
            {contracts.map((sc) => (
              <div key={sc.id} className="p-3 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900">{sc.name}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      sc.status === "executed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {sc.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{sc.desc}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs font-mono text-indigo-600">{sc.txId}</p>
                  {sc.status === "pending" && (
                    <button
                      onClick={() => executeContract(sc.id)}
                      className="px-2 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Execute Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Schedule */}
        <Card title="Audit Schedule">
          <div className="space-y-3">
            {schedule.map((audit) => (
              <div
                key={audit.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">{audit.name}</div>
                  <div className="text-xs text-slate-500">{audit.date}</div>
                </div>
                <button
                  onClick={() => handleGenerateSheet(audit)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100"
                >
                  Generate Sheet
                </button>
              </div>
            ))}
            <button
              onClick={handleScheduleAudit}
              className="w-full px-4 py-2 border-2 border-dashed border-slate-200 text-slate-500 rounded-lg text-sm font-medium hover:border-indigo-300 hover:text-indigo-600"
            >
              + Schedule New Audit
            </button>
          </div>
        </Card>
      </div>

      {/* ✅ TX Detail Modal */}
      {showTxModal && selectedMovement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Transaction Details</h3>
              <button
                onClick={() => setShowTxModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <div className="text-xs text-indigo-600 mb-1">Blockchain Transaction ID</div>
              <div className="font-mono font-bold text-indigo-700 text-sm break-all">
                {selectedMovement.txId}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Block Number</span>
                <span className="font-mono text-slate-900 font-medium">#{selectedMovement.block}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Timestamp</span>
                <span className="font-mono text-slate-900">{selectedMovement.time}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Book</span>
                <span className="text-slate-900 font-medium">{selectedMovement.book}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Warehouse</span>
                <span className="text-slate-900">{selectedMovement.warehouse}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Movement Type</span>
                <span className="capitalize text-slate-900">{selectedMovement.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Quantity</span>
                <span className="font-mono text-slate-900 font-bold">{selectedMovement.qty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Verification</span>
                <span className="text-emerald-600 font-bold">
                  {selectedMovement.verified ? "✓ Verified" : "⏳ Pending"}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mt-4">
              <div className="text-xs text-slate-500 mb-1">Cryptographic Hash</div>
              <div className="font-mono text-xs text-slate-700 break-all">
                0x7a3f...b28e4c1d9a5f8b6e2c4d0a1f9e3b7c8d5a2e6f4b9c1d3e8a7f5b2c6d9e4a1f8b
              </div>
            </div>

            <button
              onClick={() => setShowTxModal(false)}
              className="w-full mt-5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Generate Sheet Modal */}
      {showGenerateModal && selectedAudit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Generate Audit Sheet</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="font-medium text-slate-900">{selectedAudit.name}</div>
              <div className="text-xs text-slate-500 mt-1">Scheduled: {selectedAudit.date}</div>
              <div className="text-xs text-slate-500">Warehouse: {selectedAudit.warehouse}</div>
            </div>

            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Include current stock levels</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Include historical movements (last 30 days)</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>Include blockchain verification hashes</span>
              </label>
            </div>

            <form onSubmit={confirmGenerateSheet}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Generate PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}