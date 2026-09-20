"use client";

import { KpiCard, Card, Table, Td } from "@/components/ui/cards";

const TRANSACTIONS = [
  { date: "2025-01-15", type: "Sale", description: "The Quantum Garden (HC) × 45", amount: "$1,124.55", status: "completed" },
  { date: "2025-01-15", type: "Royalty", description: "Dr. Elara Voss — 60% of QG sales", amount: "$674.73", status: "paid" },
  { date: "2025-01-14", type: "Sale", description: "The Last Algorithm (PB) × 22", amount: "$331.78", status: "completed" },
  { date: "2025-01-14", type: "Expense", description: "Print run — Code Red (5,000 HC)", amount: "$12,500.00", status: "completed" },
  { date: "2025-01-13", type: "Sale", description: "The Quantum Garden (PB) × 120", amount: "$1,798.80", status: "completed" },
];

export default function FinancialPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">💰 Financial Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Revenue (MTD)" value="$118,673" change={18} icon="📈" color="green" />
        <KpiCard title="Expenses (MTD)" value="$45,200" change={12} icon="📉" color="red" />
        <KpiCard title="Net Profit" value="$73,473" change={22} icon="💰" color="blue" />
        <KpiCard title="Royalties Due" value="$21,399" icon="📜" color="amber" />
      </div>

      <Card title="Recent Transactions">
        <Table headers={["Date", "Type", "Description", "Amount", "Status"]}>
          {TRANSACTIONS.map((tx, i) => (
            <tr key={i} className="table-row-hover">
              <Td className="text-sm text-slate-500">{tx.date}</Td>
              <Td>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  tx.type === "Sale" ? "bg-emerald-100 text-emerald-700" :
                  tx.type === "Royalty" ? "bg-purple-100 text-purple-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {tx.type}
                </span>
              </Td>
              <Td className="text-sm">{tx.description}</Td>
              <Td className={`font-mono font-medium ${tx.type === "Expense" ? "text-red-600" : "text-emerald-600"}`}>
                {tx.type === "Expense" ? "-" : "+"}{tx.amount}
              </Td>
              <Td>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">{tx.status}</span>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}