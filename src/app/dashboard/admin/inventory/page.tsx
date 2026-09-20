"use client";

import { KpiCard, Card, StatusBadge } from "@/components/ui/cards";

export default function AdminInventoryHealthPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🖥️ Inventory System Health</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Stock Service" value="Healthy" icon="✅" color="green" />
        <KpiCard title="Data Integrity" value="100%" icon="🔒" color="blue" />
        <KpiCard title="Blockchain Sync" value="Current" icon="🔗" color="purple" />
        <KpiCard title="Cache Hit Rate" value="98.5%" icon="⚡" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Service Performance">
          <div className="space-y-3">
            {[
              { name: "Stock Query Service (Go)", status: "healthy", latency: "8ms", throughput: "15K req/s" },
              { name: "Stock Movement Service (NestJS)", status: "healthy", latency: "18ms", throughput: "5K req/s" },
              { name: "Order Service (NestJS)", status: "healthy", latency: "32ms", throughput: "3K req/s" },
              { name: "Reorder Engine (Python/ML)", status: "healthy", latency: "150ms", throughput: "500 req/s" },
              { name: "Redis Cache", status: "healthy", latency: "0.5ms", throughput: "100K ops/s" },
              { name: "TimescaleDB", status: "healthy", latency: "12ms", throughput: "10K ops/s" },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100">
                <div className={`w-2.5 h-2.5 rounded-full ${svc.status === "healthy" ? "bg-emerald-500" : "bg-amber-500"}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">{svc.name}</div>
                  <div className="text-xs text-slate-500">Latency: {svc.latency} • Throughput: {svc.throughput}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Data Integrity Checks">
          <div className="space-y-3">
            {[
              { check: "Stock quantity consistency", status: "passed", lastRun: "5 min ago" },
              { check: "Movement log completeness", status: "passed", lastRun: "5 min ago" },
              { check: "Blockchain hash verification", status: "passed", lastRun: "1 hour ago" },
              { check: "Order-inventory sync", status: "passed", lastRun: "5 min ago" },
              { check: "Warehouse capacity accuracy", status: "passed", lastRun: "15 min ago" },
              { check: "Atomic constraint validation", status: "passed", lastRun: "5 min ago" },
            ].map((check) => (
              <div key={check.check} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div>
                  <div className="text-sm text-slate-700">{check.check}</div>
                  <div className="text-xs text-slate-400">Last run: {check.lastRun}</div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">✓ Passed</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}