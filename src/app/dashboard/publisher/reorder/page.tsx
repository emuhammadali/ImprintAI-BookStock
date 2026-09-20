"use client";

import { Card, StatusBadge, KpiCard, Table, Td } from "@/components/ui/cards";

const REORDER_SUGGESTIONS = [
  { id: "1", book: "The Last Algorithm", format: "Hardcover", warehouse: "NYC Main", currentStock: 456, reorderPoint: 400, suggestedQty: 2000, predictedDemand: 850, leadTime: 14, confidence: 92, supplier: "PrintMaster Inc." },
  { id: "2", book: "The Quantum Garden", format: "Hardcover", warehouse: "NYC Main", currentStock: 2340, reorderPoint: 800, suggestedQty: 3000, predictedDemand: 1200, leadTime: 14, confidence: 88, supplier: "PrintMaster Inc." },
  { id: "3", book: "The Quantum Garden", format: "Paperback", warehouse: "LA West", currentStock: 1500, reorderPoint: 600, suggestedQty: 4000, predictedDemand: 1800, leadTime: 10, confidence: 85, supplier: "BookPress Co." },
];

const REORDER_HISTORY = [
  { date: "2025-01-10", book: "Code Red: Silicon Valley", qty: 5000, supplier: "PrintMaster Inc.", cost: "$12,500", status: "delivered" },
  { date: "2024-12-15", book: "The Quantum Garden", qty: 3000, supplier: "BookPress Co.", cost: "$7,500", status: "delivered" },
  { date: "2024-12-01", book: "The Last Algorithm", qty: 2000, supplier: "PrintMaster Inc.", cost: "$5,000", status: "delivered" },
];

export default function ReorderPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🔄 AI-Powered Reorder Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Pending Suggestions" value="3" icon="🤖" color="indigo" />
        <KpiCard title="Avg Confidence" value="88%" icon="📊" color="green" />
        <KpiCard title="Est. Total Cost" value="$17,800" icon="💰" color="amber" />
        <KpiCard title="Stockout Risk" value="Low" icon="✅" color="teal" />
      </div>

      {/* AI Suggestions */}
      <Card title="🤖 AI Reorder Recommendations" className="mb-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-indigo-800">
            <strong>AI Analysis:</strong> Based on historical sales velocity, seasonal trends, and lead time data,
            the system has identified 3 reorder opportunities. Confidence scores are calculated using LSTM
            demand forecasting with 90-day lookback.
          </p>
        </div>
        <Table headers={["Book", "Format", "Warehouse", "Current", "Reorder Pt", "Suggested Qty", "Confidence", "Supplier", "Action"]}>
          {REORDER_SUGGESTIONS.map((sug) => (
            <tr key={sug.id} className="table-row-hover">
              <Td className="font-medium text-slate-900">{sug.book}</Td>
              <Td>{sug.format}</Td>
              <Td>{sug.warehouse}</Td>
              <Td className="font-mono">{sug.currentStock.toLocaleString()}</Td>
              <Td className="font-mono">{sug.reorderPoint.toLocaleString()}</Td>
              <Td className="font-mono font-bold text-indigo-600">{sug.suggestedQty.toLocaleString()}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sug.confidence}%` }} />
                  </div>
                  <span className="text-xs font-mono">{sug.confidence}%</span>
                </div>
              </Td>
              <Td className="text-sm text-slate-500">{sug.supplier}</Td>
              <Td>
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">
                  ✓ Approve
                </button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* History */}
      <Card title="Reorder History">
        <Table headers={["Date", "Book", "Quantity", "Supplier", "Cost", "Status"]}>
          {REORDER_HISTORY.map((item, i) => (
            <tr key={i} className="table-row-hover">
              <Td className="text-sm text-slate-500">{item.date}</Td>
              <Td className="font-medium text-slate-900">{item.book}</Td>
              <Td className="font-mono">{item.qty.toLocaleString()}</Td>
              <Td>{item.supplier}</Td>
              <Td className="font-mono">{item.cost}</Td>
              <Td><StatusBadge status={item.status} /></Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}