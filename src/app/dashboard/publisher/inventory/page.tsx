"use client";

import { useState, useMemo } from "react";
import { KpiCard, Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const INITIAL_STOCK = [
  { id: "1", book: "The Quantum Garden", format: "Hardcover", warehouse: "NYC Main", qty: 2340, safety: 500, reorder: 800, status: "active" },
  { id: "2", book: "The Quantum Garden", format: "Paperback", warehouse: "NYC Main", qty: 5670, safety: 1000, reorder: 1500, status: "active" },
  { id: "3", book: "The Quantum Garden", format: "Hardcover", warehouse: "LA West", qty: 890, safety: 300, reorder: 500, status: "active" },
  { id: "4", book: "The Last Algorithm", format: "Hardcover", warehouse: "NYC Main", qty: 456, safety: 200, reorder: 400, status: "warning" },
  { id: "5", book: "The Last Algorithm", format: "Paperback", warehouse: "LA West", qty: 1800, safety: 500, reorder: 800, status: "active" },
  { id: "6", book: "Code Red: Silicon Valley", format: "Hardcover", warehouse: "NYC Main", qty: 1200, safety: 300, reorder: 600, status: "active" },
  { id: "7", book: "Code Red: Silicon Valley", format: "Hardcover", warehouse: "LA West", qty: 3800, safety: 500, reorder: 1000, status: "active" },
];

const MOVEMENTS = [
  { time: "10 min ago", book: "The Quantum Garden (HC)", warehouse: "NYC Main", type: "sold", qty: -23 },
  { time: "1 hour ago", book: "Code Red (HC)", warehouse: "LA West", type: "sold", qty: -15 },
  { time: "2 hours ago", book: "The Last Algorithm (HC)", warehouse: "NYC Main", type: "sold", qty: -8 },
  { time: "Yesterday", book: "Code Red (HC)", warehouse: "LA West", type: "received", qty: +5000 },
  { time: "Yesterday", book: "The Quantum Garden (PB)", warehouse: "NYC Main", type: "transferred", qty: -500 },
  { time: "Yesterday", book: "The Quantum Garden (PB)", warehouse: "LA West", type: "received", qty: +500 },
];

const WAREHOUSES = ["NYC Main", "LA West"];
const FORMATS = ["Hardcover", "Paperback", "Ebook"];

export default function InventoryPage() {
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof INITIAL_STOCK[0] | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState("audited");

  // ✅ Filtered stock based on filter, search, warehouse, format
  const filteredStock = useMemo(() => {
    let result = [...stock];

    if (filter === "low_stock") {
      result = result.filter((s) => s.qty < s.reorder);
    }

    if (searchQuery) {
      result = result.filter(
        (s) =>
          s.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.warehouse.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedWarehouse !== "all") {
      result = result.filter((s) => s.warehouse === selectedWarehouse);
    }

    if (selectedFormat !== "all") {
      result = result.filter((s) => s.format === selectedFormat);
    }

    return result;
  }, [stock, filter, searchQuery, selectedWarehouse, selectedFormat]);

  const totalStock = stock.reduce((sum, s) => sum + s.qty, 0);
  const lowStock = stock.filter((s) => s.qty < s.reorder).length;
  const outOfStock = stock.filter((s) => s.qty === 0).length;

  function handleAdjustStock(item: typeof INITIAL_STOCK[0]) {
    setSelectedItem(item);
    setAdjustQty(0);
    setAdjustReason("audited");
    setShowAdjustModal(true);
  }

  function submitAdjustment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem || adjustQty === 0) return;

    setStock((prev) =>
      prev.map((s) =>
        s.id === selectedItem.id
          ? {
              ...s,
              qty: Math.max(0, s.qty + adjustQty),
              status:
                Math.max(0, s.qty + adjustQty) < s.reorder ? "warning" : "active",
            }
          : s
      )
    );

    setShowAdjustModal(false);
    setSelectedItem(null);
    setAdjustQty(0);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">📦 Inventory Overview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Export feature coming soon!")}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            📥 Export
          </button>
          <button
            onClick={() => setFilter("low_stock")}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
          >
            ⚠️ View Low Stock
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Stock" value={totalStock.toLocaleString()} icon="📦" color="blue" />
        <KpiCard title="Low Stock Alerts" value={lowStock} icon="⚠️" color="amber" />
        <KpiCard title="Warehouses" value={WAREHOUSES.length} icon="🏭" color="indigo" />
        <KpiCard title="Out of Stock" value={outOfStock} icon="✅" color="green" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search books or warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Warehouse filter */}
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Warehouses</option>
            {WAREHOUSES.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>

          {/* Format filter */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Formats</option>
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Quick filter buttons */}
        <div className="flex gap-2 mt-3">
          {[
            { key: "all", label: "All Stock" },
            { key: "low_stock", label: "Low Stock" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}

          {(searchQuery || selectedWarehouse !== "all" || selectedFormat !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedWarehouse("all");
                setSelectedFormat("all");
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title={`Stock by Book / Warehouse (${filteredStock.length})`}>
            {filteredStock.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-2">📭</div>
                <p>No stock items match your filters</p>
              </div>
            ) : (
              <Table headers={["Book", "Format", "Warehouse", "Quantity", "Safety", "Reorder", "Status", "Actions"]}>
                {filteredStock.map((item) => (
                  <tr key={item.id} className="table-row-hover">
                    <Td className="font-medium text-slate-900">{item.book}</Td>
                    <Td>{item.format}</Td>
                    <Td>{item.warehouse}</Td>
                    <Td
                      className={`font-mono ${
                        item.qty < item.reorder ? "text-amber-600 font-bold" : ""
                      }`}
                    >
                      {item.qty.toLocaleString()}
                    </Td>
                    <Td className="font-mono">{item.safety.toLocaleString()}</Td>
                    <Td className="font-mono">{item.reorder.toLocaleString()}</Td>
                    <Td><StatusBadge status={item.status} /></Td>
                    <Td>
                      <button
                        onClick={() => handleAdjustStock(item)}
                        className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                      >
                        Adjust
                      </button>
                    </Td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </div>

        {/* Real-time movements */}
        <Card title="Live Stock Movements">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
            <span className="text-xs text-emerald-600 font-medium">Real-time</span>
          </div>
          <div className="space-y-3">
            {MOVEMENTS.map((mov, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <span className="text-lg">
                  {mov.type === "sold" ? "📤" : mov.type === "received" ? "📥" : "🔄"}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-slate-700">{mov.book}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-xs font-mono font-bold ${
                        mov.qty < 0 ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {mov.qty > 0 ? "+" : ""}
                      {mov.qty}
                    </span>
                    <span className="text-xs text-slate-400">• {mov.warehouse}</span>
                    <span className="text-xs text-slate-400">• {mov.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Adjust Stock</h3>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="font-medium text-slate-900">{selectedItem.book}</div>
              <div className="text-xs text-slate-500">
                {selectedItem.format} • {selectedItem.warehouse}
              </div>
              <div className="text-sm text-slate-700 mt-2">
                Current: <span className="font-mono font-bold">{selectedItem.qty.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={submitAdjustment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Adjustment Quantity (use negative for decrease)
                </label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 100 or -50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Reason
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="audited">Audited</option>
                  <option value="damaged">Damaged</option>
                  <option value="received">New Stock Received</option>
                  <option value="returned">Returned</option>
                  <option value="adjusted">Manual Adjustment</option>
                </select>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                <div className="text-xs text-indigo-600 mb-1">New Quantity</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {Math.max(0, selectedItem.qty + adjustQty).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustQty === 0}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}