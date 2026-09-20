"use client";

import { Card, KpiCard, StatusBadge, Table, Td } from "@/components/ui/cards";

const STOCK_DATA = [
  { title: "The Quantum Garden", format: "Hardcover", warehouse: "NYC Main", quantity: 2340, reorder: 500, velocity: 45, daysLeft: 52 },
  { title: "The Quantum Garden", format: "Paperback", warehouse: "NYC Main", quantity: 5670, reorder: 1000, velocity: 120, daysLeft: 47 },
  { title: "The Quantum Garden", format: "Ebook", warehouse: "Digital", quantity: "∞", reorder: "-", velocity: 340, daysLeft: "∞" },
  { title: "The Last Algorithm", format: "Paperback", warehouse: "LA West", quantity: 890, reorder: 300, velocity: 22, daysLeft: 40 },
  { title: "The Last Algorithm", format: "Hardcover", warehouse: "NYC Main", quantity: 456, reorder: 200, velocity: 15, daysLeft: 30 },
];

export default function AuthorStockPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        📦 My Books&apos; Stock
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Units" value="9,356" icon="📦" color="blue" />
        <KpiCard title="Sales Velocity" value="542/mo" change={8} icon="📈" color="green" />
        <KpiCard title="Days of Stock" value="47 avg" icon="📅" color="amber" />
        <KpiCard title="Low Stock Alerts" value="0" icon="✅" color="teal" />
      </div>

      <Card title="Stock Overview">
        <Table headers={["Title", "Format", "Warehouse", "Quantity", "Reorder Pt", "Velocity/mo", "Days Left", "Status"]}>
          {STOCK_DATA.map((item, idx) => {
            const daysLeft = typeof item.daysLeft === "number" ? item.daysLeft : 999;
            const status = daysLeft < 30 ? "critical" : daysLeft < 50 ? "warning" : "active";
            return (
              <tr key={idx} className="table-row-hover">
                <Td className="font-medium text-slate-900">{item.title}</Td>
                <Td>{item.format}</Td>
                <Td>{item.warehouse}</Td>
                <Td className="font-mono">{typeof item.quantity === "number" ? item.quantity.toLocaleString() : item.quantity}</Td>
                <Td className="font-mono">{typeof item.reorder === "number" ? item.reorder.toLocaleString() : item.reorder}</Td>
                <Td className="font-mono">{item.velocity}</Td>
                <Td className={`font-mono ${daysLeft < 30 ? "text-red-600 font-bold" : daysLeft < 50 ? "text-amber-600" : ""}`}>
                  {typeof item.daysLeft === "number" ? `${item.daysLeft} days` : item.daysLeft}
                </Td>
                <Td><StatusBadge status={status} /></Td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}