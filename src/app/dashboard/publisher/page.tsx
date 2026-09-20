"use client";

import { KpiCard, Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const BOOKS = [
  { id: "1", title: "The Quantum Garden", author: "Dr. Elara Voss", format: "Hardcover", isbn: "978-0-13-468599-1", price: "$24.99", status: "published", stock: 2340, sales: 1450, revenue: "$36,250" },
  { id: "2", title: "The Quantum Garden", author: "Dr. Elara Voss", format: "Paperback", isbn: "978-0-13-468600-7", price: "$14.99", status: "published", stock: 5670, sales: 3200, revenue: "$47,968" },
  { id: "3", title: "The Last Algorithm", author: "Alex Park", format: "Hardcover", isbn: "978-0-13-468601-4", price: "$22.99", status: "published", stock: 456, sales: 890, revenue: "$20,461" },
  { id: "4", title: "Whispers of the Forgotten", author: "Sarah Chen", format: "Paperback", isbn: "978-0-13-468602-1", price: "$16.99", status: "in_review", stock: 0, sales: 0, revenue: "$0" },
  { id: "5", title: "Midnight in Marrakech", author: "Omar Hassan", format: "Paperback", isbn: "978-0-13-468603-8", price: "$13.99", status: "in_production", stock: 0, sales: 0, revenue: "$0" },
  { id: "6", title: "Code Red: Silicon Valley", author: "Alex Park", format: "Hardcover", isbn: "978-0-13-468604-5", price: "$24.99", status: "published", stock: 1200, sales: 560, revenue: "$13,994" },
];

const ALERTS = [
  { type: "warning", message: "The Quantum Garden (HC) — NYC Main warehouse at 47 days stock", time: "2 hours ago" },
  { type: "success", message: "Code Red: Silicon Valley — Print run delivered to LA West", time: "5 hours ago" },
  { type: "info", message: "New AI analysis completed for Whispers of the Forgotten", time: "1 day ago" },
  { type: "danger", message: "The Last Algorithm (HC) — Reorder point reached (456 units)", time: "1 day ago" },
];

export default function PublisherDashboardPage() {
  const totalRevenue = "$118,673";
  const totalStock = 9666;
  const activeBooks = 4;
  const inProduction = 2;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Publisher Command Center
      </h2>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Active Books" value={activeBooks} change={33} icon="📚" color="indigo" />
        <KpiCard title="In Production" value={inProduction} icon="🏭" color="purple" />
        <KpiCard title="Revenue (MTD)" value={totalRevenue} change={18} icon="💰" color="green" />
        <KpiCard title="Inventory Value" value={`$${(totalStock * 4.5).toLocaleString()}`} change={5} icon="📦" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Book List */}
        <div className="lg:col-span-2">
          <Card title="Portfolio">
            <Table headers={["Title", "Format", "Price", "Stock", "Sales", "Revenue", "Status"]}>
              {BOOKS.map((book) => (
                <tr key={book.id} className="table-row-hover cursor-pointer">
                  <Td>
                    <div>
                      <div className="font-medium text-slate-900">{book.title}</div>
                      <div className="text-xs text-slate-500">{book.author}</div>
                    </div>
                  </Td>
                  <Td>{book.format}</Td>
                  <Td className="font-mono">{book.price}</Td>
                  <Td className="font-mono">{book.stock > 0 ? book.stock.toLocaleString() : "-"}</Td>
                  <Td className="font-mono">{book.sales > 0 ? book.sales.toLocaleString() : "-"}</Td>
                  <Td className="font-mono font-medium text-emerald-600">{book.revenue}</Td>
                  <Td><StatusBadge status={book.status} /></Td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>

        {/* Alerts Panel */}
        <Card title="Alerts & Activity">
          <div className="space-y-3">
            {ALERTS.map((alert, i) => {
              const iconMap: Record<string, string> = {
                warning: "⚠️",
                success: "✅",
                info: "ℹ️",
                danger: "🚨",
              };
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <span className="text-sm flex-shrink-0">{iconMap[alert.type]}</span>
                  <div>
                    <p className="text-sm text-slate-700">{alert.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue Trend (6 months)">
          <div className="h-48 flex items-end gap-2 px-4">
            {[65, 72, 58, 80, 95, 118].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all"
                  style={{ height: `${(val / 118) * 160}px` }}
                />
                <span className="text-xs text-slate-400">
                  {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Sales by Format">
          <div className="flex items-center justify-center h-48 gap-6">
            {[
              { format: "Hardcover", value: 35, color: "bg-indigo-500" },
              { format: "Paperback", value: 40, color: "bg-purple-500" },
              { format: "Ebook", value: 20, color: "bg-pink-500" },
              { format: "Audiobook", value: 5, color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.format} className="text-center">
                <div className="text-2xl font-bold text-slate-900">{item.value}%</div>
                <div className={`w-4 h-4 rounded-full mx-auto mt-1 ${item.color}`} />
                <div className="text-xs text-slate-500 mt-1">{item.format}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}