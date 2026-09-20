"use client";

import { useState, useMemo } from "react";
import { Card, StatusBadge, KpiCard, Table, Td } from "@/components/ui/cards";

const INITIAL_SUGGESTIONS = [
  { id: "1", book: "The Last Algorithm", format: "Hardcover", warehouse: "NYC Main", currentStock: 456, reorderPoint: 400, suggestedQty: 2000, predictedDemand: 850, leadTime: 14, confidence: 92, supplier: "PrintMaster Inc.", costPerUnit: 6.25 },
  { id: "2", book: "The Quantum Garden", format: "Hardcover", warehouse: "NYC Main", currentStock: 2340, reorderPoint: 800, suggestedQty: 3000, predictedDemand: 1200, leadTime: 14, confidence: 88, supplier: "PrintMaster Inc.", costPerUnit: 6.25 },
  { id: "3", book: "The Quantum Garden", format: "Paperback", warehouse: "LA West", currentStock: 1500, reorderPoint: 600, suggestedQty: 4000, predictedDemand: 1800, leadTime: 10, confidence: 85, supplier: "BookPress Co.", costPerUnit: 2.50 },
];

const INITIAL_HISTORY = [
  { date: "2025-01-10", book: "Code Red: Silicon Valley", qty: 5000, supplier: "PrintMaster Inc.", cost: "$12,500", status: "delivered" },
  { date: "2024-12-15", book: "The Quantum Garden", qty: 3000, supplier: "BookPress Co.", cost: "$7,500", status: "delivered" },
  { date: "2024-12-01", book: "The Last Algorithm", qty: 2000, supplier: "PrintMaster Inc.", cost: "$5,000", status: "delivered" },
];

export default function ReorderPage() {
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [selectedSuggestion, setSelectedSuggestion] = useState<typeof INITIAL_SUGGESTIONS[0] | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [customQty, setCustomQty] = useState(0);

  // ✅ Dynamic KPI calculations
  const avgConfidence = suggestions.length > 0
    ? Math.round(suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length)
    : 0;

  const totalCost = suggestions.reduce((sum, s) => sum + s.suggestedQty * s.costPerUnit, 0);

  function handleApproveClick(sug: typeof INITIAL_SUGGESTIONS[0]) {
    setSelectedSuggestion(sug);
    setCustomQty(sug.suggestedQty);
    setShowApproveModal(true);
  }

  function confirmApprove(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSuggestion || customQty <= 0) return;

    const totalCostNum = customQty * selectedSuggestion.costPerUnit;
    const newHistoryItem = {
      date: new Date().toISOString().split("T")[0],
      book: `${selectedSuggestion.book} (${selectedSuggestion.format})`,
      qty: customQty,
      supplier: selectedSuggestion.supplier,
      cost: `$${totalCostNum.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      status: "pending",
    };

    // ✅ Add to history
    setHistory([newHistoryItem, ...history]);

    // ✅ Remove from suggestions (approved)
    setSuggestions(suggestions.filter((s) => s.id !== selectedSuggestion.id));

    // ✅ Close modal
    setShowApproveModal(false);
    setSelectedSuggestion(null);
    setCustomQty(0);
  }

  function handleDismiss(sugId: string) {
    if (!confirm("Are you sure you want to dismiss this suggestion?")) return;
    setSuggestions(suggestions.filter((s) => s.id !== sugId));
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">🔄 AI-Powered Reorder Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Running AI analysis on latest sales data...")}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            🤖 Re-run AI Analysis
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Pending Suggestions" value={suggestions.length} icon="🤖" color="indigo" />
        <KpiCard title="Avg Confidence" value={`${avgConfidence}%`} icon="📊" color="green" />
        <KpiCard
          title="Est. Total Cost"
          value={`$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon="💰"
          color="amber"
        />
        <KpiCard title="Stockout Risk" value={suggestions.length > 3 ? "High" : "Low"} icon="✅" color="teal" />
      </div>

      {/* AI Suggestions */}
      <Card title={`🤖 AI Reorder Recommendations (${suggestions.length})`} className="mb-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-indigo-800">
            <strong>AI Analysis:</strong> Based on historical sales velocity, seasonal trends, and lead time data,
            the system has identified <strong>{suggestions.length} reorder opportunities</strong>. Confidence scores
            are calculated using LSTM demand forecasting with 90-day lookback.
          </p>
        </div>

        {suggestions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-5xl mb-3">✅</div>
            <p className="font-medium text-slate-600">All caught up!</p>
            <p className="text-sm mt-1">No pending reorder suggestions at the moment.</p>
          </div>
        ) : (
          <Table headers={["Book", "Format", "Warehouse", "Current", "Reorder Pt", "Suggested", "Confidence", "Supplier", "Actions"]}>
            {suggestions.map((sug) => (
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
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${sug.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono">{sug.confidence}%</span>
                  </div>
                </Td>
                <Td className="text-sm text-slate-500">{sug.supplier}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveClick(sug)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleDismiss(sug.id)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* History */}
      <Card title={`Reorder History (${history.length})`}>
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No reorder history yet</p>
          </div>
        ) : (
          <Table headers={["Date", "Book", "Quantity", "Supplier", "Cost", "Status"]}>
            {history.map((item, i) => (
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
        )}
      </Card>

      {/* ✅ Approve Modal */}
      {showApproveModal && selectedSuggestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Approve Reorder</h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="font-medium text-slate-900">{selectedSuggestion.book}</div>
              <div className="text-xs text-slate-500">
                {selectedSuggestion.format} • {selectedSuggestion.warehouse}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Supplier: <span className="font-medium text-slate-700">{selectedSuggestion.supplier}</span>
              </div>
            </div>

            <form onSubmit={confirmApprove} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Quantity to Order
                </label>
                <input
                  type="number"
                  value={customQty}
                  onChange={(e) => setCustomQty(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={1}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  AI suggested: <span className="font-bold text-indigo-600">{selectedSuggestion.suggestedQty.toLocaleString()}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-lg p-3 text-sm">
                <div>
                  <div className="text-xs text-slate-500">Cost per unit</div>
                  <div className="font-bold text-slate-900">${selectedSuggestion.costPerUnit.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Lead time</div>
                  <div className="font-bold text-slate-900">{selectedSuggestion.leadTime} days</div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                <div className="text-xs text-indigo-600 mb-1">Total Order Cost</div>
                <div className="text-2xl font-bold text-indigo-700">
                  ${(customQty * selectedSuggestion.costPerUnit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}