"use client";

import { Card, KpiCard, StatusBadge, Table, Td } from "@/components/ui/cards";

const AUDIT_LOGS = [
  { time: "14:30:05", user: "author@demo.com", action: "manuscript.update", resource: "The Quantum Garden v3", ip: "192.168.1.45", status: "success" },
  { time: "14:25:12", user: "editor@demo.com", action: "ai.analysis.request", resource: "Whispers of the Forgotten", ip: "192.168.1.22", status: "success" },
  { time: "14:20:00", user: "system", action: "blockchain.verify", resource: "TX-2025-001248", ip: "-", status: "success" },
  { time: "14:15:33", user: "unknown", action: "auth.login", resource: "-", ip: "203.45.67.89", status: "failed" },
  { time: "14:10:22", user: "publisher@demo.com", action: "order.approve", resource: "PO-2025-003", ip: "192.168.1.30", status: "success" },
];

export default function SecurityPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🔒 Security & Audit</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Encryption" value="AES-256" icon="🔐" color="green" />
        <KpiCard title="TLS Version" value="1.3" icon="🛡️" color="blue" />
        <KpiCard title="Failed Logins (24h)" value="3" icon="⚠️" color="red" />
        <KpiCard title="Active Sessions" value="12" icon="👥" color="purple" />
      </div>

      <Card title="Audit Log (Recent)" className="mb-6">
        <Table headers={["Time", "User", "Action", "Resource", "IP Address", "Status"]}>
          {AUDIT_LOGS.map((log, i) => (
            <tr key={i} className="table-row-hover">
              <Td className="font-mono text-xs text-slate-500">{log.time}</Td>
              <Td className="text-sm">{log.user}</Td>
              <Td>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-mono">
                  {log.action}
                </span>
              </Td>
              <Td className="text-sm text-slate-500">{log.resource}</Td>
              <Td className="font-mono text-xs">{log.ip}</Td>
              <Td>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  log.status === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}>
                  {log.status}
                </span>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Security Configuration">
          <div className="space-y-3">
            {[
              { label: "Multi-Tenant RLS", status: "Enabled", icon: "✅" },
              { label: "E2E Encryption (Manuscripts)", status: "Enabled", icon: "✅" },
              { label: "CORS Protection", status: "Configured", icon: "✅" },
              { label: "Rate Limiting", status: "100 req/min", icon: "✅" },
              { label: "CSRF Protection", status: "Enabled", icon: "✅" },
              { label: "CSP Headers", status: "Configured", icon: "✅" },
              { label: "Session Timeout", status: "24 hours", icon: "✅" },
              { label: "GDPR Compliance", status: "Ready", icon: "✅" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <span className="text-sm text-slate-700">{item.label}</span>
                <span className="text-sm font-medium text-emerald-600">{item.icon} {item.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Compliance Status">
          <div className="space-y-4">
            {[
              { name: "SOC 2 Type II", progress: 85, status: "In Progress" },
              { name: "GDPR", progress: 100, status: "Compliant" },
              { name: "HIPAA", progress: 70, status: "In Progress" },
              { name: "ISO 27001", progress: 60, status: "Planning" },
            ].map((comp) => (
              <div key={comp.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{comp.name}</span>
                  <span className="text-xs text-slate-500">{comp.progress}% • {comp.status}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${comp.progress === 100 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${comp.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}