"use client";

import { Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const PRODUCTION = [
  { title: "Code Red: Silicon Valley", author: "Alex Park", format: "Hardcover", printRun: 5000, warehouse: "NYC Main", status: "in_production", eta: "2025-02-15" },
  { title: "Midnight in Marrakech", author: "Omar Hassan", format: "Paperback", printRun: 3000, warehouse: "LA West", status: "confirmed", eta: "2025-03-01" },
  { title: "Beneath the Willow", author: "Maria Garcia", format: "Ebook", printRun: "-", warehouse: "Digital", status: "approved", eta: "2025-02-20" },
];

export default function ProductionPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🖨️ Production Stock</h2>
      <Card title="Upcoming Releases">
        <Table headers={["Title", "Author", "Format", "Print Run", "Warehouse", "Status", "ETA"]}>
          {PRODUCTION.map((item, i) => (
            <tr key={i} className="table-row-hover">
              <Td className="font-medium text-slate-900">{item.title}</Td>
              <Td>{item.author}</Td>
              <Td>{item.format}</Td>
              <Td className="font-mono">{typeof item.printRun === "number" ? item.printRun.toLocaleString() : item.printRun}</Td>
              <Td>{item.warehouse}</Td>
              <Td><StatusBadge status={item.status} /></Td>
              <Td className="text-sm text-slate-500">{item.eta}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}