"use client";

import { KpiCard, Card } from "@/components/ui/cards";

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">📈 Platform Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Users" value="847" change={12} icon="👥" color="indigo" />
        <KpiCard title="Active Sessions" value="234" change={8} icon="🟢" color="green" />
        <KpiCard title="AI Analyses (24h)" value="4,768" change={23} icon="🤖" color="purple" />
        <KpiCard title="API Calls (24h)" value="125K" change={5} icon="🔌" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Usage by Role">
          <div className="space-y-4">
            {[
              { role: "Authors", count: 412, percentage: 49, color: "bg-indigo-500" },
              { role: "Editors", count: 89, percentage: 11, color: "bg-pink-500" },
              { role: "Publishers", count: 45, percentage: 5, color: "bg-amber-500" },
              { role: "Beta Readers", count: 256, percentage: 30, color: "bg-emerald-500" },
              { role: "Warehouse Staff", count: 45, percentage: 5, color: "bg-purple-500" },
            ].map((item) => (
              <div key={item.role}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">{item.role}</span>
                  <span className="text-sm font-medium text-slate-900">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Geographic Distribution">
          <div className="space-y-3">
            {[
              { region: "North America", users: 340, percentage: 40 },
              { region: "Europe", users: 254, percentage: 30 },
              { region: "Asia Pacific", users: 127, percentage: 15 },
              { region: "South Asia", users: 85, percentage: 10 },
              { region: "Other", users: 41, percentage: 5 },
            ].map((item) => (
              <div key={item.region} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">{item.region}</div>
                  <div className="text-xs text-slate-500">{item.users} users</div>
                </div>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}