"use client";

import { Card, KpiCard } from "@/components/ui/cards";

const WAREHOUSES = [
  { id: "1", name: "NYC Main Distribution", address: "450 Industrial Blvd, Newark, NJ", capacity: 50000, utilization: 23400, lat: 40.7357, lng: -74.1724, active: true },
  { id: "2", name: "LA West Fulfillment", address: "1200 Commerce Dr, Los Angeles, CA", capacity: 35000, utilization: 15600, lat: 33.9425, lng: -118.408, active: true },
];

const TRANSFERS = [
  { from: "NYC Main", to: "LA West", book: "The Quantum Garden (PB)", qty: 500, status: "completed", date: "2025-01-14" },
  { from: "LA West", to: "NYC Main", book: "Code Red (HC)", qty: 200, status: "in_transit", date: "2025-01-15" },
];

export default function WarehousesPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🏭 Warehouse Management</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard title="Total Warehouses" value="2" icon="🏭" color="indigo" />
        <KpiCard title="Total Capacity" value="85,000" icon="📦" color="blue" />
        <KpiCard title="Total Utilized" value="39,000" icon="📊" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {WAREHOUSES.map((wh) => {
          const pct = Math.round((wh.utilization / wh.capacity) * 100);
          return (
            <Card key={wh.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{wh.name}</h3>
                  <p className="text-sm text-slate-500">{wh.address}</p>
                </div>
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Capacity Utilization</span>
                  <span className="text-sm font-bold text-slate-900">{pct}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                  <span>{wh.utilization.toLocaleString()} units</span>
                  <span>{wh.capacity.toLocaleString()} max</span>
                </div>
              </div>
              {/* Mini map placeholder */}
              <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                📍 {wh.lat.toFixed(2)}, {wh.lng.toFixed(2)}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Transfers */}
      <Card title="Recent Transfers">
        <div className="space-y-3">
          {TRANSFERS.map((tr, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100">
              <span className="text-lg">🔄</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">
                  {tr.book} × {tr.qty.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  {tr.from} → {tr.to} • {tr.date}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                tr.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                {tr.status === "in_transit" ? "🚚 In Transit" : "✓ Completed"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}