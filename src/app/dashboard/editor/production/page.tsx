"use client";

import { useState, useMemo } from "react";
import { Card, StatusBadge, Table, Td, KpiCard } from "@/components/ui/cards";

const INITIAL_PRODUCTION = [
  { id: "1", title: "Code Red: Silicon Valley", author: "Alex Park", format: "Hardcover", printRun: 5000, warehouse: "NYC Main", status: "in_production", eta: "2025-02-15", cost: 12500, supplier: "PrintMaster Inc." },
  { id: "2", title: "Midnight in Marrakech", author: "Omar Hassan", format: "Paperback", printRun: 3000, warehouse: "LA West", status: "confirmed", eta: "2025-03-01", cost: 7500, supplier: "BookPress Co." },
  { id: "3", title: "Beneath the Willow", author: "Maria Garcia", format: "Ebook", printRun: 0, warehouse: "Digital", status: "approved", eta: "2025-02-20", cost: 0, supplier: "N/A" },
];

const STATUS_WORKFLOW: Record<string, string> = {
  approved: "confirmed",
  confirmed: "in_production",
  in_production: "printed",
  printed: "delivered",
};

export default function ProductionPage() {
  const [production, setProduction] = useState(INITIAL_PRODUCTION);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof INITIAL_PRODUCTION[0] | null>(null);

  const [editForm, setEditForm] = useState({
    printRun: 0,
    eta: "",
    cost: 0,
  });

  const [newItem, setNewItem] = useState({
    title: "",
    author: "",
    format: "Hardcover",
    printRun: 3000,
    warehouse: "NYC Main",
    eta: "",
    cost: 7500,
    supplier: "PrintMaster Inc.",
  });

  // ✅ Filtered
  const filtered = useMemo(() => {
    return production.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [production, searchQuery, statusFilter]);

  // ✅ Dynamic KPIs
  const totalItems = production.length;
  const inProduction = production.filter((p) => p.status === "in_production").length;
  const totalPrintRun = production.reduce((s, p) => s + p.printRun, 0);
  const totalCost = production.reduce((s, p) => s + p.cost, 0);

  // ✅ View Detail
  function viewDetail(item: typeof INITIAL_PRODUCTION[0]) {
    setSelectedItem(item);
    setShowDetailModal(true);
  }

  // ✅ Advance Status
  function advanceStatus(id: string) {
    const item = production.find((p) => p.id === id);
    if (!item) return;
    const nextStatus = STATUS_WORKFLOW[item.status];
    if (!nextStatus) {
      alert("✅ Already at final status (Delivered)");
      return;
    }
    setProduction((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );
    if (selectedItem?.id === id) {
      setSelectedItem({ ...selectedItem, status: nextStatus });
    }
  }

  // ✅ Edit Print Run
  function openEdit(item: typeof INITIAL_PRODUCTION[0]) {
    setSelectedItem(item);
    setEditForm({
      printRun: item.printRun,
      eta: item.eta,
      cost: item.cost,
    });
    setShowEditModal(true);
  }

  function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem) return;

    setProduction((prev) =>
      prev.map((p) =>
        p.id === selectedItem.id
          ? { ...p, printRun: editForm.printRun, eta: editForm.eta, cost: editForm.cost }
          : p
      )
    );
    setShowEditModal(false);
  }

  // ✅ Add to Production
  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const newProd = {
      id: String(production.length + 1),
      ...newItem,
      status: "approved",
    };
    setProduction([newProd, ...production]);
    setShowAddModal(false);
    setNewItem({
      title: "",
      author: "",
      format: "Hardcover",
      printRun: 3000,
      warehouse: "NYC Main",
      eta: "",
      cost: 7500,
      supplier: "PrintMaster Inc.",
    });
  }

  const hasActiveFilters = searchQuery || statusFilter !== "all";

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">🖨️ Production Stock</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Add to Production
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Items" value={totalItems.toString()} icon="📚" color="indigo" />
        <KpiCard title="In Production" value={inProduction.toString()} icon="🖨️" color="amber" />
        <KpiCard title="Total Print Run" value={totalPrintRun.toLocaleString()} icon="📄" color="blue" />
        <KpiCard title="Total Cost" value={`$${totalCost.toLocaleString()}`} icon="💰" color="green" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_production">In Production</option>
          <option value="printed">Printed</option>
          <option value="delivered">Delivered</option>
        </select>
        {hasActiveFilters && (
          <button
            onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <Card title={`Upcoming Releases (${filtered.length})`}>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No items match your filters</p>
          </div>
        ) : (
          <Table headers={["Title", "Author", "Format", "Print Run", "Warehouse", "Status", "ETA", "Actions"]}>
            {filtered.map((item) => (
              <tr key={item.id} className="table-row-hover">
                <Td className="font-medium text-slate-900">{item.title}</Td>
                <Td>{item.author}</Td>
                <Td>{item.format}</Td>
                <Td className="font-mono">
                  {item.printRun > 0 ? item.printRun.toLocaleString() : "-"}
                </Td>
                <Td>{item.warehouse}</Td>
                <Td><StatusBadge status={item.status} /></Td>
                <Td className="text-sm text-slate-500">{item.eta}</Td>
                <Td>
                  <div className="flex gap-1">
                    <button
                      onClick={() => viewDetail(item)}
                      className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="px-2 py-1 text-xs font-medium bg-slate-50 text-slate-600 rounded hover:bg-slate-100"
                    >
                      Edit
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Production Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <div className="font-bold text-slate-900 text-lg">{selectedItem.title}</div>
              <div className="text-sm text-slate-600">by {selectedItem.author}</div>
              <div className="mt-2"><StatusBadge status={selectedItem.status} /></div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Format</span>
                <span className="text-slate-900 font-medium">{selectedItem.format}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Print Run</span>
                <span className="font-mono text-slate-900">{selectedItem.printRun.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Warehouse</span>
                <span className="text-slate-900">{selectedItem.warehouse}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Supplier</span>
                <span className="text-slate-900">{selectedItem.supplier}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Cost</span>
                <span className="font-mono text-slate-900">${selectedItem.cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">ETA</span>
                <span className="text-slate-900 font-medium">{selectedItem.eta}</span>
              </div>
            </div>

            {STATUS_WORKFLOW[selectedItem.status] && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <div className="text-xs text-amber-700 mb-2">
                  Next step: <strong className="capitalize">{STATUS_WORKFLOW[selectedItem.status].replace("_", " ")}</strong>
                </div>
                <button
                  onClick={() => advanceStatus(selectedItem.id)}
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                >
                  Advance to {STATUS_WORKFLOW[selectedItem.status].replace("_", " ")}
                </button>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => { setShowDetailModal(false); openEdit(selectedItem); }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Production</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <div className="font-medium text-slate-900">{selectedItem.title}</div>
              <div className="text-xs text-slate-500">{selectedItem.format}</div>
            </div>

            <form onSubmit={submitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Print Run</label>
                <input
                  type="number"
                  value={editForm.printRun}
                  onChange={(e) => setEditForm({ ...editForm, printRun: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">ETA</label>
                <input
                  type="date"
                  value={editForm.eta}
                  onChange={(e) => setEditForm({ ...editForm, eta: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Cost ($)</label>
                <input
                  type="number"
                  value={editForm.cost}
                  onChange={(e) => setEditForm({ ...editForm, cost: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={0}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add to Production</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Author</label>
                <input
                  type="text"
                  value={newItem.author}
                  onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Format</label>
                  <select
                    value={newItem.format}
                    onChange={(e) => setNewItem({ ...newItem, format: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Hardcover</option>
                    <option>Paperback</option>
                    <option>Ebook</option>
                    <option>Audiobook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Print Run</label>
                  <input
                    type="number"
                    value={newItem.printRun}
                    onChange={(e) => setNewItem({ ...newItem, printRun: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Warehouse</label>
                  <select
                    value={newItem.warehouse}
                    onChange={(e) => setNewItem({ ...newItem, warehouse: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>NYC Main</option>
                    <option>LA West</option>
                    <option>Digital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">ETA</label>
                  <input
                    type="date"
                    value={newItem.eta}
                    onChange={(e) => setNewItem({ ...newItem, eta: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cost ($)</label>
                  <input
                    type="number"
                    value={newItem.cost}
                    onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Supplier</label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Add to Production
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}