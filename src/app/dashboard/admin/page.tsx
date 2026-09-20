"use client";

import { KpiCard, Card, StatusBadge } from "@/components/ui/cards";

const SERVICES = [
  { name: "API Gateway", status: "healthy", uptime: "99.98%", responseTime: "45ms", cpu: 12, memory: 34 },
  { name: "Auth Service", status: "healthy", uptime: "99.99%", responseTime: "23ms", cpu: 8, memory: 28 },
  { name: "Manuscript Service", status: "healthy", uptime: "99.95%", responseTime: "120ms", cpu: 45, memory: 62 },
  { name: "AI Orchestrator", status: "warning", uptime: "99.80%", responseTime: "3.2s", cpu: 78, memory: 85 },
  { name: "Stock Service", status: "healthy", uptime: "99.99%", responseTime: "18ms", cpu: 15, memory: 42 },
  { name: "Order Service", status: "healthy", uptime: "99.97%", responseTime: "32ms", cpu: 22, memory: 38 },
  { name: "Blockchain Service", status: "healthy", uptime: "99.90%", responseTime: "150ms", cpu: 30, memory: 55 },
  { name: "Notification Service", status: "healthy", uptime: "99.95%", responseTime: "28ms", cpu: 10, memory: 25 },
  { name: "Analytics Service", status: "healthy", uptime: "99.92%", responseTime: "85ms", cpu: 35, memory: 48 },
  { name: "Export Service", status: "healthy", uptime: "99.88%", responseTime: "1.5s", cpu: 55, memory: 70 },
];

const LLM_MODELS = [
  { name: "Llama 3 (70B)", purpose: "Structural Architect, Synthesis", status: "active", avgLatency: "2.8s", requests24h: 1247, gpu: "A100" },
  { name: "Mistral (7B)", purpose: "Line Editor, Continuity", status: "active", avgLatency: "0.8s", requests24h: 3521, gpu: "RTX 4090" },
  { name: "Stable Diffusion XL", purpose: "Cover Generation", status: "idle", avgLatency: "4.5s", requests24h: 45, gpu: "A100" },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        System Health & Infrastructure
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Services Online" value="10/10" icon="✅" color="green" />
        <KpiCard title="API Response (p95)" value="85ms" change={-5} icon="⚡" color="blue" />
        <KpiCard title="Error Rate" value="0.02%" change={-15} icon="📉" color="green" />
        <KpiCard title="Active Users" value="847" change={12} icon="👥" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Service Status */}
        <Card title="Microservice Status">
          <div className="space-y-2">
            {SERVICES.map((svc) => (
              <div key={svc.name} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-200">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${svc.status === "healthy" ? "bg-emerald-500" : "bg-amber-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{svc.name}</span>
                    <span className="text-xs text-slate-500">{svc.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">CPU</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${svc.cpu > 70 ? "bg-red-500" : svc.cpu > 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${svc.cpu}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{svc.cpu}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">MEM</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${svc.memory > 80 ? "bg-red-500" : svc.memory > 60 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${svc.memory}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{svc.memory}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* LLM Performance */}
        <Card title="LLM Infrastructure">
          <div className="space-y-4">
            {LLM_MODELS.map((model) => (
              <div key={model.name} className="p-4 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-sm text-slate-900">{model.name}</span>
                    <span className="ml-2 text-xs text-slate-500">({model.gpu})</span>
                  </div>
                  <StatusBadge status={model.status} />
                </div>
                <div className="text-xs text-slate-500 mb-2">{model.purpose}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Avg Latency</div>
                    <div className="text-sm font-bold text-slate-900">{model.avgLatency}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Requests (24h)</div>
                    <div className="text-sm font-bold text-slate-900">{model.requests24h.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              🔄 Retrain Models
            </button>
            <button className="py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
              📊 A/B Testing
            </button>
          </div>
        </Card>
      </div>

      {/* Blockchain Status */}
      <Card title="Blockchain Infrastructure (Hyperledger Fabric)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-700">Connected</div>
            <div className="text-sm text-emerald-600">Fabric Network</div>
            <div className="text-xs text-emerald-500 mt-1">4 peers, 1 orderer</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">12,847</div>
            <div className="text-sm text-slate-600">Total Blocks</div>
            <div className="text-xs text-slate-400 mt-1">Last: 2 min ago</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-2xl font-bold text-slate-900">100%</div>
            <div className="text-sm text-slate-600">Verification Rate</div>
            <div className="text-xs text-slate-400 mt-1">Zero failed verifications</div>
          </div>
        </div>
      </Card>
    </div>
  );
}