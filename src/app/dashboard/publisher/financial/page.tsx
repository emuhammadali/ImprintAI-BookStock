"use client";

import { useState, useMemo } from "react";
import { KpiCard, Card, Table, Td } from "@/components/ui/cards";

const INITIAL_TRANSACTIONS = [
  { id: "1", date: "2025-01-15", type: "Sale", description: "The Quantum Garden (HC) × 45", amount: 1124.55, status: "completed", category: "Book Sales" },
  { id: "2", date: "2025-01-15", type: "Royalty", description: "Dr. Elara Voss — 60% of QG sales", amount: 674.73, status: "paid", category: "Author Royalty" },
  { id: "3", date: "2025-01-14", type: "Sale", description: "The Last Algorithm (PB) × 22", amount: 331.78, status: "completed", category: "Book Sales" },
  { id: "4", date: "2025-01-14", type: "Expense", description: "Print run — Code Red (5,000 HC)", amount: 12500.00, status: "completed", category: "Printing" },
  { id: "5", date: "2025-01-13", type: "Sale", description: "The Quantum Garden (PB) × 120", amount: 1798.80, status: "completed", category: "Book Sales" },
  { id: "6", date: "2025-01-12", type: "Royalty", description: "Alex Park — Q4 2024 royalties", amount: 3450.00, status: "pending", category: "Author Royalty" },
  { id: "7", date: "2025-01-10", type: "Expense", description: "Marketing — BookTok campaign", amount: 2500.00, status: "completed", category: "Marketing" },
];

export default function FinancialPage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [filter, setFilter] = useState<"all" | "Sale" | "Royalty" | "Expense">("all");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<typeof INITIAL_TRANSACTIONS[0] | null>(null);

  const [newTx, setNewTx] = useState({
    type: "Sale",
    description: "",
    amount: 0,
    category: "Book Sales",
  });

  // ✅ Date range filter
  const dateFiltered = useMemo(() => {
    if (dateRange === "all") return transactions;
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return transactions.filter((t) => new Date(t.date) >= cutoff);
  }, [transactions, dateRange]);

  // ✅ Search & type filter
  const filtered = useMemo(() => {
    return dateFiltered.filter((tx) => {
      const matchesType = filter === "all" || tx.type === filter;
      const matchesSearch = !searchQuery ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [dateFiltered, filter, searchQuery]);

  // ✅ Dynamic KPIs
  const revenue = dateFiltered.filter((t) => t.type === "Sale").reduce((s, t) => s + t.amount, 0);
  const expenses = dateFiltered.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const royalties = dateFiltered.filter((t) => t.type === "Royalty").reduce((s, t) => s + t.amount, 0);
  const netProfit = revenue - expenses - royalties;
  const royaltiesDue = transactions.filter((t) => t.type === "Royalty" && t.status === "pending").reduce((s, t) => s + t.amount, 0);

  // ✅ Add Transaction
  function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    const newTransaction = {
      id: String(transactions.length + 1),
      date: new Date().toISOString().split("T")[0],
      type: newTx.type,
      description: newTx.description,
      amount: newTx.amount,
      status: "completed",
      category: newTx.category,
    };
    setTransactions([newTransaction, ...transactions]);
    setShowAddModal(false);
    setNewTx({ type: "Sale", description: "", amount: 0, category: "Book Sales" });
  }

  // ✅ Pay Royalty
  function payRoyalty(id: string) {
    if (!confirm("Mark this royalty as paid?")) return;
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "paid" } : t))
    );
    setShowDetailModal(false);
  }

  // ✅ View Detail
  function viewDetail(tx: typeof INITIAL_TRANSACTIONS[0]) {
    setSelectedTx(tx);
    setShowDetailModal(true);
  }

  // ✅ Export CSV
  function exportCSV() {
    const headers = ["Date", "Type", "Description", "Amount", "Status", "Category"];
    const rows = filtered.map((t) => [t.date, t.type, t.description, t.amount, t.status, t.category]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">💰 Financial Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2 mb-4">
        {([
          { key: "7d", label: "Last 7 days" },
          { key: "30d", label: "Last 30 days" },
          { key: "90d", label: "Last 90 days" },
          { key: "all", label: "All Time" },
        ] as const).map((r) => (
          <button
            key={r.key}
            onClick={() => setDateRange(r.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateRange === r.key
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Revenue" value={`$${revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon="📈" color="green" />
        <KpiCard title="Expenses" value={`$${expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon="📉" color="red" />
        <KpiCard title="Net Profit" value={`$${netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon="💰" color="blue" />
        <KpiCard title="Royalties Due" value={`$${royaltiesDue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon="📜" color="amber" />
      </div>

      {/* Simple Bar Chart */}
      <Card title="Revenue vs Expenses (Last 7 Transactions)" className="mb-6">
        <div className="flex items-end justify-around gap-2 h-48 p-4 bg-slate-50 rounded-lg">
          {transactions.slice(0, 7).reverse().map((tx, i) => {
            const maxAmount = Math.max(...transactions.slice(0, 7).map((t) => t.amount));
            const height = (tx.amount / maxAmount) * 100;
            return (
              <div key={i} className="flex flex-col items-center flex-1 gap-2">
                <div className="text-xs font-mono text-slate-500">
                  ${(tx.amount / 1000).toFixed(1)}k
                </div>
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    tx.type === "Sale" ? "bg-emerald-500" :
                    tx.type === "Expense" ? "bg-red-500" :
                    "bg-purple-500"
                  }`}
                  style={{ height: `${height}%`, minHeight: "8px" }}
                />
                <div className="text-xs text-slate-500 truncate w-full text-center">
                  {tx.date.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 justify-center mt-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded" /> Sale</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> Expense</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded" /> Royalty</span>
        </div>
      </Card>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {(["all", "Sale", "Royalty", "Expense"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f === "all" ? "All Types" : f}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <Card title={`Recent Transactions (${filtered.length})`}>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No transactions match your filters</p>
          </div>
        ) : (
          <Table headers={["Date", "Type", "Description", "Amount", "Status", "Actions"]}>
            {filtered.map((tx) => (
              <tr key={tx.id} className="table-row-hover">
                <Td className="text-sm text-slate-500">{tx.date}</Td>
                <Td>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tx.type === "Sale"
                        ? "bg-emerald-100 text-emerald-700"
                        : tx.type === "Royalty"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tx.type}
                  </span>
                </Td>
                <Td className="text-sm">{tx.description}</Td>
                <Td
                  className={`font-mono font-medium ${
                    tx.type === "Expense" ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {tx.type === "Expense" ? "-" : "+"}${tx.amount.toLocaleString()}
                </Td>
                <Td>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === "paid" || tx.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </Td>
                <Td>
                  {tx.type === "Royalty" && tx.status === "pending" ? (
                    <button
                      onClick={() => payRoyalty(tx.id)}
                      className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <button
                      onClick={() => viewDetail(tx)}
                      className="px-3 py-1 text-xs font-medium bg-slate-50 text-slate-600 rounded-md hover:bg-slate-100"
                    >
                      View
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* ✅ Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add Transaction</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                <select
                  value={newTx.type}
                  onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Sale">Sale</option>
                  <option value="Expense">Expense</option>
                  <option value="Royalty">Royalty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input
                  type="text"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  placeholder="e.g., The Quantum Garden (HC) × 20"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={0}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                  <select
                    value={newTx.category}
                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Book Sales</option>
                    <option>Author Royalty</option>
                    <option>Printing</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Transaction Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div
              className={`rounded-lg p-4 mb-4 ${
                selectedTx.type === "Sale"
                  ? "bg-emerald-50 border border-emerald-200"
                  : selectedTx.type === "Expense"
                  ? "bg-red-50 border border-red-200"
                  : "bg-purple-50 border border-purple-200"
              }`}
            >
              <div className="text-xs text-slate-500 mb-1">{selectedTx.type}</div>
              <div className="font-bold text-slate-900 text-lg">{selectedTx.description}</div>
              <div className="text-2xl font-bold mt-2 text-slate-900">
                ${selectedTx.amount.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Date</span>
                <span className="text-slate-900">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Category</span>
                <span className="text-slate-900">{selectedTx.category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Status</span>
                <span className="capitalize text-slate-900 font-medium">{selectedTx.status}</span>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
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