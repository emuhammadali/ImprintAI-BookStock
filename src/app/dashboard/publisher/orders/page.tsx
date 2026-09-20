"use client";

import { useState } from "react";
import { Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const PURCHASE_ORDERS = [
  { id: "PO-2025-001", supplier: "PrintMaster Inc.", warehouse: "NYC Main", items: 3, total: "$12,500.00", status: "delivered", expected: "2025-01-10", created: "2025-01-01" },
  { id: "PO-2025-002", supplier: "BookPress Co.", warehouse: "LA West", items: 1, total: "$7,500.00", status: "shipped", expected: "2025-01-20", created: "2025-01-08" },
  { id: "PO-2025-003", supplier: "PrintMaster Inc.", warehouse: "NYC Main", items: 2, total: "$8,200.00", status: "in_production", expected: "2025-02-01", created: "2025-01-12" },
];

const SALES_ORDERS = [
  { id: "SO-2025-042", customer: "Barnes & Noble", warehouse: "NYC Main", items: 3, total: "$4,500.00", status: "fulfilled", created: "2025-01-15" },
  { id: "SO-2025-041", customer: "Amazon", warehouse: "LA West", items: 5, total: "$12,300.00", status: "shipped", tracking: "TRK-928471", created: "2025-01-14" },
  { id: "SO-2025-040", customer: "Indie Bookstore NYC", warehouse: "NYC Main", items: 2, total: "$1,200.00", status: "confirmed", created: "2025-01-14" },
  { id: "SO-2025-039", customer: "Waterstones", warehouse: "LA West", items: 4, total: "$8,900.00", status: "pending", created: "2025-01-13" },
];

const RETURNS = [
  { id: "RET-001", order: "SO-2025-038", book: "The Quantum Garden (HC)", qty: 5, reason: "Shipping damage", condition: "damaged", status: "pending" },
  { id: "RET-002", order: "SO-2025-035", book: "The Last Algorithm (PB)", qty: 12, reason: "Overstock return", condition: "mint", status: "inspected" },
];

export default function OrdersPage() {
  const [tab, setTab] = useState<"purchase" | "sales" | "returns">("sales");

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🛒 Order Management</h2>

      <div className="flex gap-2 mb-6">
        {([
          { key: "purchase", label: "Purchase Orders", count: PURCHASE_ORDERS.length },
          { key: "sales", label: "Sales Orders", count: SALES_ORDERS.length },
          { key: "returns", label: "Returns", count: RETURNS.length },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              tab === t.key ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${tab === t.key ? "bg-white/20" : "bg-slate-100"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {tab === "purchase" && (
        <Card title="Purchase Orders">
          <Table headers={["PO Number", "Supplier", "Warehouse", "Items", "Total", "Status", "Expected", "Created"]}>
            {PURCHASE_ORDERS.map((po) => (
              <tr key={po.id} className="table-row-hover cursor-pointer">
                <Td className="font-mono font-medium text-indigo-600">{po.id}</Td>
                <Td>{po.supplier}</Td>
                <Td>{po.warehouse}</Td>
                <Td className="font-mono">{po.items}</Td>
                <Td className="font-mono font-medium">{po.total}</Td>
                <Td><StatusBadge status={po.status} /></Td>
                <Td className="text-sm text-slate-500">{po.expected}</Td>
                <Td className="text-sm text-slate-500">{po.created}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === "sales" && (
        <Card title="Sales Orders">
          <Table headers={["SO Number", "Customer", "Warehouse", "Items", "Total", "Status", "Created"]}>
            {SALES_ORDERS.map((so) => (
              <tr key={so.id} className="table-row-hover cursor-pointer">
                <Td className="font-mono font-medium text-indigo-600">{so.id}</Td>
                <Td className="font-medium text-slate-900">{so.customer}</Td>
                <Td>{so.warehouse}</Td>
                <Td className="font-mono">{so.items}</Td>
                <Td className="font-mono font-medium">{so.total}</Td>
                <Td><StatusBadge status={so.status} /></Td>
                <Td className="text-sm text-slate-500">{so.created}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === "returns" && (
        <Card title="Returns Queue">
          <Table headers={["Return ID", "Order", "Book", "Qty", "Reason", "Condition", "Status"]}>
            {RETURNS.map((ret) => (
              <tr key={ret.id} className="table-row-hover">
                <Td className="font-mono font-medium text-indigo-600">{ret.id}</Td>
                <Td className="font-mono">{ret.order}</Td>
                <Td className="font-medium text-slate-900">{ret.book}</Td>
                <Td className="font-mono">{ret.qty}</Td>
                <Td className="text-sm text-slate-500">{ret.reason}</Td>
                <Td>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    ret.condition === "mint" ? "bg-emerald-100 text-emerald-700" :
                    ret.condition === "good" ? "bg-blue-100 text-blue-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {ret.condition}
                  </span>
                </Td>
                <Td><StatusBadge status={ret.status} /></Td>
              </tr>
            ))}
          </Table>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>Action needed:</strong> 5 damaged units from RET-001 require inspection before write-off.
          </div>
        </Card>
      )}
    </div>
  );
}