"use client";

import { useState, useMemo } from "react";
import { Card, KpiCard, StatusBadge, Table, Td } from "@/components/ui/cards";

const INITIAL_STOCK = [
  { id: "1", title: "The Quantum Garden", format: "Hardcover", warehouse: "NYC Main", quantity: 2340, reorder: 500, velocity: 45, daysLeft: 52 },
  { id: "2", title: "The Quantum Garden", format: "Paperback", warehouse: "NYC Main", quantity: 5670, reorder: 1000, velocity: 120, daysLeft: 47 },
  { id: "3", title: "The Quantum Garden", format: "Ebook", warehouse: "Digital", quantity: 0, reorder: 0, velocity: 340, daysLeft: 999, isDigital: true },
  { id: "4", title: "The Last Algorithm", format: "Paperback", warehouse: "LA West", quantity: 890, reorder: 300, velocity: 22, daysLeft: 40 },
  { id: "5", title: "The Last Algorithm", format: "Hardcover", warehouse: "NYC Main", quantity: 456, reorder: 200, velocity: 15, daysLeft: 30 },
  { id: "6", title: "Code Red: Silicon Valley", format: "Hardcover", warehouse: "NYC Main", quantity: 180, reorder: 400, velocity: 28, daysLeft: 6 },
];

const VELOCITY_TREND = [
  { month: "Aug", units: 420 },
  { month: "Sep", units: 485 },
  { month: "Oct", units: 510 },
  { month: "Nov", units: 478 },
  { month: "Dec", units: 620 },
  { month: "Jan", units: 542 },
];

export default function AuthorStockPage() {
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [searchQuery, setSearchQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "critical" | "warning" | "active">("all");
  const [selectedItem, setSelectedItem] = useState<typeof INITIAL_STOCK[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockQty, setRestockQty] = useState(0);
  const [restockNotes, setRestockNotes] = useState("");

  // ✅ Get status
  function getStatus(item: typeof INITIAL_STOCK[0]) {
    if (item.isDigital) return "active";
    if (item.daysLeft < 15) return "critical";
    if (item.daysLeft < 30) return "warning";
    return "active";
  }

  // ✅ Filtered
  const filtered = useMemo(() => {
    return stock.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFormat = formatFilter === "all" || item.format === formatFilter;
      const itemStatus = getStatus(item);
      const matchesStatus = statusFilter === "all" || itemStatus === statusFilter;
      return matchesSearch && matchesFormat && matchesStatus;
    });
  }, [stock, searchQuery, formatFilter, statusFilter]);

  // ✅ Dynamic KPIs
  const physicalStock = stock.filter((s) => !s.isDigital);
  const totalUnits = physicalStock.reduce((sum, s) => sum + s.quantity, 0);
  const totalVelocity = physicalStock.reduce((sum, s) => sum + s.velocity, 0);
  const avgDaysLeft = physicalStock.length > 0
    ? Math.round(physicalStock.reduce((s, i) => s + i.daysLeft, 0) / physicalStock.length)
    : 0;
  const criticalCount = stock.filter((s) => getStatus(s) === "critical").length;
  const warningCount = stock.filter((s) => getStatus(s) === "warning").length;

  // ✅ View detail
  function viewDetail(item: typeof INITIAL_STOCK[0]) {
    setSelectedItem(item);
    setShowDetailModal(true);
  }

  // ✅ Restock
  function openRestock(item: typeof INITIAL_STOCK[0]) {
    setSelectedItem(item);
    setRestockQty(item.reorder || 500);
    setRestockNotes("");
    setShowRestockModal(true);
  }

  function submitRestock(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem || restockQty <= 0) return;

    // Update stock
    setStock((prev) =>
      prev.map((s) =>
        s.id === selectedItem.id
          ? {
              ...s,
              quantity: s.quantity + restockQty,
              daysLeft: Math.round(((s.quantity + restockQty) / s.velocity) * 30),
            }
          : s
      )
    );

    setShowRestockModal(false);
    alert(`✅ Restock request submitted!\n\nBook: ${selectedItem.title}\nQty: ${restockQty}\n\nYour publisher will be notified.`);
  }

  // ✅ Export CSV
  function exportCSV() {
    const headers = ["Title", "Format", "Warehouse", "Quantity", "Reorder Pt", "Velocity/mo", "Days Left", "Status"];
    const rows = filtered.map((item) => [
      `"${item.title}"`,
      item.format,
      item.warehouse,
      item.isDigital ? "∞" : item.quantity,
      item.isDigital ? "-" : item.reorder,
      item.velocity,
      item.isDigital ? "∞" : item.daysLeft,
      getStatus(item),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-stock-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasActiveFilters = searchQuery || formatFilter !== "all" || statusFilter !== "all";
  const formats = [...new Set(stock.map((s) => s.format))];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">📦 My Books&apos; Stock</h2>
        <button
          onClick={exportCSV}
          className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Alert Banner */}
      {criticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <span className="text-xl">🚨</span>
          <div className="flex-1">
            <div className="font-medium text-red-800">
              {criticalCount} item{criticalCount > 1 ? "s" : ""} critically low on stock
            </div>
            <div className="text-sm text-red-700 mt-1">
              Contact your publisher immediately to avoid stockouts.
            </div>
          </div>
          <button
            onClick={() => setStatusFilter("critical")}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700"
          >
            View Now
          </button>
        </div>
      )}

      {warningCount > 0 && criticalCount === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <div className="font-medium text-amber-800">
              {warningCount} item{warningCount > 1 ? "s" : ""} approaching low stock threshold
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Units" value={totalUnits.toLocaleString()} icon="📦" color="blue" />
        <KpiCard title="Sales Velocity" value={`${totalVelocity}/mo`} change={8} icon="📈" color="green" />
        <KpiCard title="Days of Stock" value={`${avgDaysLeft} avg`} icon="📅" color="amber" />
        <KpiCard title="Low Stock Alerts" value={(criticalCount + warningCount).toString()} icon="⚠️" color="teal" />
      </div>

      {/* Velocity Trend Chart */}
      <Card title="Sales Velocity (Last 6 Months)" className="mb-6">
        <div className="flex items-end justify-around gap-2 h-40 p-4">
          {VELOCITY_TREND.map((v) => {
            const max = Math.max(...VELOCITY_TREND.map((x) => x.units));
            const height = (v.units / max) * 100;
            return (
              <div key={v.month} className="flex flex-col items-center flex-1 gap-2">
                <div className="text-xs font-mono text-slate-500">{v.units}</div>
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-700 hover:to-indigo-500"
                  style={{ height: `${height}%`, minHeight: "12px" }}
                />
                <div className="text-xs text-slate-500 font-medium">{v.month}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="🔍 Search by title or warehouse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Formats</option>
            {formats.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="active">Active</option>
          </select>
          {hasActiveFilters && (
            <button
              onClick={() => { setSearchQuery(""); setFormatFilter("all"); setStatusFilter("all"); }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card title={`Stock Overview (${filtered.length})`}>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No stock items match your filters</p>
          </div>
        ) : (
          <Table headers={["Title", "Format", "Warehouse", "Quantity", "Reorder Pt", "Velocity/mo", "Days Left", "Status", "Actions"]}>
            {filtered.map((item) => {
              const status = getStatus(item);
              return (
                <tr key={item.id} className="table-row-hover">
                  <Td className="font-medium text-slate-900">{item.title}</Td>
                  <Td>{item.format}</Td>
                  <Td>{item.warehouse}</Td>
                  <Td className="font-mono">
                    {item.isDigital ? "∞" : item.quantity.toLocaleString()}
                  </Td>
                  <Td className="font-mono">
                    {item.isDigital ? "-" : item.reorder.toLocaleString()}
                  </Td>
                  <Td className="font-mono">{item.velocity}</Td>
                  <Td className={`font-mono ${
                    status === "critical" ? "text-red-600 font-bold" :
                    status === "warning" ? "text-amber-600 font-medium" : ""
                  }`}>
                    {item.isDigital ? "∞" : `${item.daysLeft} days`}
                  </Td>
                  <Td><StatusBadge status={status} /></Td>
                  <Td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => viewDetail(item)}
                        className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"
                      >
                        View
                      </button>
                      {!item.isDigital && (
                        <button
                          onClick={() => openRestock(item)}
                          className="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100"
                        >
                          Restock
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Stock Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white mb-4">
              <div className="text-xs opacity-80 mb-1">{selectedItem.format}</div>
              <div className="font-bold text-lg">{selectedItem.title}</div>
              <div className="text-sm opacity-90 mt-1">{selectedItem.warehouse}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {selectedItem.isDigital ? "∞" : selectedItem.quantity.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">In Stock</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-600">{selectedItem.velocity}</div>
                <div className="text-xs text-slate-500">Sold/mo</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Reorder Point</span>
                <span className="font-mono text-slate-900">
                  {selectedItem.isDigital ? "-" : selectedItem.reorder.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Days Until Stockout</span>
                <span className={`font-medium ${
                  getStatus(selectedItem) === "critical" ? "text-red-600" :
                  getStatus(selectedItem) === "warning" ? "text-amber-600" :
                  "text-slate-900"
                }`}>
                  {selectedItem.isDigital ? "∞" : `${selectedItem.daysLeft} days`}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={getStatus(selectedItem)} />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
              >
                Close
              </button>
              {!selectedItem.isDigital && (
                <button
                  onClick={() => { setShowDetailModal(false); openRestock(selectedItem); }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Restock
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Request Restock</h3>
              <button onClick={() => setShowRestockModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <div className="font-medium text-slate-900">{selectedItem.title}</div>
              <div className="text-xs text-slate-500">{selectedItem.format} • {selectedItem.warehouse}</div>
            </div>

            <form onSubmit={submitRestock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Quantity to Restock
                </label>
                <input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={1}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Current stock: <strong>{selectedItem.quantity.toLocaleString()}</strong> •
                  After restock: <strong>{(selectedItem.quantity + restockQty).toLocaleString()}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Notes for Publisher (optional)
                </label>
                <textarea
                  value={restockNotes}
                  onChange={(e) => setRestockNotes(e.target.value)}
                  placeholder="Any specific requirements..."
                  className="w-full h-20 px-4 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                <div className="text-xs text-indigo-600 mb-1">Estimated Delivery</div>
                <div className="text-lg font-bold text-indigo-700">14-21 days</div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}