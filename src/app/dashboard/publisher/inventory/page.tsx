"use client";

import { useState } from "react";
import { KpiCard, Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const STOCK_DATA = [
  { book: "The Quantum Garden", format: "Hardcover", warehouse: "NYC Main", qty: 2340, safety: 500, reorder: 800, status: "active" },
  { book: "The Quantum Garden", format: "Paperback", warehouse: "NYC Main", qty: 5670, safety: 1000, reorder: 1500, status: "active" },
  { book: "The Quantum Garden", format: "Hardcover", warehouse: "LA West", qty: 890, safety: 300, reorder: 500, status: "active" },
  { book: "The Last Algorithm", format: "Hardcover", warehouse: "NYC Main", qty: 456, safety: 200, reorder: 400, status: "warning" },
  { book: "The Last Algorithm", format: "Paperback", warehouse: "LA West", qty: 1800, safety: 500, reorder: 800, status: "active" },
  { book: "Code Red: Silicon Valley", format: "Hardcover", warehouse: "NYC Main", qty: 1200, safety: 300, reorder: 600, status: "active" },
  { book: "Code Red: Silicon Valley", format: "Hardcover", warehouse: "LA West", qty: 3800, safety: 500, reorder: 1000, status: "active" },
];

const MOVEMENTS = [
  { time: "10 min ago", book: "The Quantum Garden (HC)", warehouse: "NYC Main", type: "sold", qty: -23 },
  { time: "1 hour ago", book: "Code Red (HC)", warehouse: "LA West", type: "sold", qty: -15 },
  { time: "2 hours ago", book: "The Last Algorithm (HC)", warehouse: "NYC Main", type: "sold", qty: -8 },
  { time: "Yesterday", book: "Code Red (HC)", warehouse: "LA West", type: "received", qty: +5000 },
  { time: "Yesterday", book: "The Quantum Garden (PB)", warehouse: "NYC Main", type: "transferred", qty: -500 },
  { time: "Yesterday", book: "The Quantum Garden (PB)", warehouse: "LA West", type: "received", qty: +500 },
];

export default function InventoryPage() {
  const [filter, setFilter] = useState("all");

  const totalStock = STOCK_DATA.reduce((sum, s) => sum + s.qty, 0);
  const lowStock = STOCK_DATA.filter((s) => s.qty < s.reorder).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">📦 Inventory Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Stock" value={totalStock.toLocaleString()} icon="📦" color="blue" />
        <KpiCard title="Low Stock Alerts" value={lowStock} icon="⚠️" color="amber" />
        <KpiCard title="Warehouses" value="2" icon="🏭" color="indigo" />
        <KpiCard title="Out of Stock" value="0" icon="✅" color="green" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["all", "low_stock", "by_warehouse", "by_format"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Stock by Book / Warehouse">
            <Table headers={["Book", "Format", "Warehouse", "Quantity", "Safety Stock", "Reorder Pt", "Status"]}>
              {STOCK_DATA.filter((s) => filter !== "low_stock" || s.qty < s.reorder).map((item, i) => (
                <tr key={i} className="table-row-hover">
                  <Td className="font-medium text-slate-900">{item.book}</Td>
                  <Td>{item.format}</Td>
                  <Td>{item.warehouse}</Td>
                  <Td className={`font-mono ${item.qty < item.reorder ? "text-amber-600 font-bold" : ""}`}>
                    {item.qty.toLocaleString()}
                  </Td>
                  <Td className="font-mono">{item.safety.toLocaleString()}</Td>
                  <Td className="font-mono">{item.reorder.toLocaleString()}</Td>
                  <Td><StatusBadge status={item.status} /></Td>
                </tr>
              ))}
            </Table>
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
                <span className={`text-lg ${mov.type === "sold" ? "🔴" : mov.type === "received" ? "🟢" : "🔵"}`}>
                  {mov.type === "sold" ? "📤" : mov.type === "received" ? "📥" : "🔄"}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-slate-700">{mov.book}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-mono font-bold ${mov.qty < 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {mov.qty > 0 ? "+" : ""}{mov.qty}
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
    </div>
  );
}