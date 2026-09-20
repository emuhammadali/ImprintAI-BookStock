"use client";

import { useState, useMemo } from "react";
import { Card, KpiCard, Table, Td, StatusBadge } from "@/components/ui/cards";

const INITIAL_WAREHOUSES = [
  { id: "1", name: "NYC Main Distribution", address: "450 Industrial Blvd, Newark, NJ", capacity: 50000, utilization: 23400, lat: 40.7357, lng: -74.1724, active: true, manager: "John Smith", phone: "+1 (555) 100-2000" },
  { id: "2", name: "LA West Fulfillment", address: "1200 Commerce Dr, Los Angeles, CA", capacity: 35000, utilization: 15600, lat: 33.9425, lng: -118.408, active: true, manager: "Jane Doe", phone: "+1 (555) 300-4000" },
];

const INITIAL_TRANSFERS = [
  { id: "TRF-001", from: "NYC Main", to: "LA West", book: "The Quantum Garden (PB)", qty: 500, status: "completed", date: "2025-01-14" },
  { id: "TRF-002", from: "LA West", to: "NYC Main", book: "Code Red (HC)", qty: 200, status: "in_transit", date: "2025-01-15" },
];

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);

  // Modals
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<typeof INITIAL_WAREHOUSES[0] | null>(null);

  // Forms
  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    address: "",
    capacity: 25000,
    manager: "",
    phone: "",
  });

  const [transferForm, setTransferForm] = useState({
    from: "NYC Main",
    to: "LA West",
    book: "",
    qty: 100,
  });

  // ✅ Dynamic KPIs
  const totalWarehouses = warehouses.length;
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalUtilized = warehouses.reduce((sum, w) => sum + w.utilization, 0);
  const avgUtilization = totalCapacity > 0 ? Math.round((totalUtilized / totalCapacity) * 100) : 0;

  const warehouseNames = useMemo(() => warehouses.map((w) => w.name.split(" ")[0] + " " + (w.name.split(" ")[1] || "")), [warehouses]);

  // ✅ Add Warehouse
  function handleAddWarehouse(e: React.FormEvent) {
    e.preventDefault();
    const newWh = {
      id: String(warehouses.length + 1),
      name: warehouseForm.name,
      address: warehouseForm.address,
      capacity: warehouseForm.capacity,
      utilization: 0,
      lat: 0,
      lng: 0,
      active: true,
      manager: warehouseForm.manager,
      phone: warehouseForm.phone,
    };
    setWarehouses([...warehouses, newWh]);
    setShowWarehouseModal(false);
    setWarehouseForm({ name: "", address: "", capacity: 25000, manager: "", phone: "" });
  }

  // ✅ Create Transfer
  function handleCreateTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (transferForm.from === transferForm.to) {
      alert("Source and destination warehouses must be different!");
      return;
    }
    const newTransfer = {
      id: `TRF-${String(transfers.length + 1).padStart(3, "0")}`,
      from: transferForm.from,
      to: transferForm.to,
      book: transferForm.book,
      qty: transferForm.qty,
      status: "in_transit",
      date: new Date().toISOString().split("T")[0],
    };
    setTransfers([newTransfer, ...transfers]);
    setShowTransferModal(false);
    setTransferForm({ from: "NYC Main", to: "LA West", book: "", qty: 100 });
  }

  // ✅ Mark Transfer Complete
  function completeTransfer(id: string) {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );
  }

  // ✅ View warehouse details
  function viewWarehouse(wh: typeof INITIAL_WAREHOUSES[0]) {
    setSelectedWarehouse(wh);
    setShowDetailModal(true);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">🏭 Warehouse Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            🔄 New Transfer
          </button>
          <button
            onClick={() => setShowWarehouseModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            + Add Warehouse
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard title="Total Warehouses" value={totalWarehouses.toString()} icon="🏭" color="indigo" />
        <KpiCard title="Total Capacity" value={totalCapacity.toLocaleString()} icon="📦" color="blue" />
        <KpiCard title="Avg Utilization" value={`${avgUtilization}%`} icon="📊" color="green" />
      </div>

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {warehouses.map((wh) => {
          const pct = Math.round((wh.utilization / wh.capacity) * 100);
          return (
            <Card key={wh.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <div onClick={() => viewWarehouse(wh)}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{wh.name}</h3>
                    <p className="text-sm text-slate-500">{wh.address}</p>
                  </div>
                  <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Capacity Utilization</span>
                    <span className="text-sm font-bold text-slate-900">{pct}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-400">
                    <span>{wh.utilization.toLocaleString()} units</span>
                    <span>{wh.capacity.toLocaleString()} max</span>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                  📍 {wh.lat.toFixed(2)}, {wh.lng.toFixed(2)}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Transfers Table */}
      <Card title={`Recent Transfers (${transfers.length})`}>
        {transfers.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No transfers yet</p>
          </div>
        ) : (
          <Table headers={["Transfer ID", "From", "To", "Book", "Qty", "Date", "Status", "Actions"]}>
            {transfers.map((tr) => (
              <tr key={tr.id} className="table-row-hover">
                <Td className="font-mono font-medium text-indigo-600">{tr.id}</Td>
                <Td>{tr.from}</Td>
                <Td>{tr.to}</Td>
                <Td className="font-medium text-slate-900">{tr.book}</Td>
                <Td className="font-mono">{tr.qty.toLocaleString()}</Td>
                <Td className="text-sm text-slate-500">{tr.date}</Td>
                <Td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tr.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {tr.status === "in_transit" ? "🚚 In Transit" : "✓ Completed"}
                  </span>
                </Td>
                <Td>
                  {tr.status === "in_transit" && (
                    <button
                      onClick={() => completeTransfer(tr.id)}
                      className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100"
                    >
                      Mark Complete
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* ✅ Add Warehouse Modal */}
      {showWarehouseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Warehouse</h3>
              <button onClick={() => setShowWarehouseModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleAddWarehouse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Warehouse Name</label>
                <input
                  type="text"
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  placeholder="e.g., Chicago Central Hub"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                <input
                  type="text"
                  value={warehouseForm.address}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                  placeholder="Street, City, State"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity (units)</label>
                <input
                  type="number"
                  value={warehouseForm.capacity}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={1000}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Manager</label>
                  <input
                    type="text"
                    value={warehouseForm.manager}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, manager: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={warehouseForm.phone}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWarehouseModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Add Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ New Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Create Stock Transfer</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">
                ×
              </button>
            </div>
            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">From Warehouse</label>
                  <select
                    value={transferForm.from}
                    onChange={(e) => setTransferForm({ ...transferForm, from: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">To Warehouse</label>
                  <select
                    value={transferForm.to}
                    onChange={(e) => setTransferForm({ ...transferForm, to: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Book / Format</label>
                <input
                  type="text"
                  value={transferForm.book}
                  onChange={(e) => setTransferForm({ ...transferForm, book: e.target.value })}
                  placeholder="e.g., The Quantum Garden (PB)"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
                <input
                  type="number"
                  value={transferForm.qty}
                  onChange={(e) => setTransferForm({ ...transferForm, qty: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={1}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Create Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Warehouse Detail Modal */}
      {showDetailModal && selectedWarehouse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Warehouse Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">
                ×
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="font-bold text-slate-900 text-lg">{selectedWarehouse.name}</div>
              <div className="text-sm text-slate-500">{selectedWarehouse.address}</div>
              <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Manager</span>
                <span className="text-slate-900 font-medium">{selectedWarehouse.manager || "-"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="text-slate-900 font-medium">{selectedWarehouse.phone || "-"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Capacity</span>
                <span className="text-slate-900 font-medium">{selectedWarehouse.capacity.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Utilized</span>
                <span className="text-slate-900 font-medium">{selectedWarehouse.utilization.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Utilization Rate</span>
                <span className="text-emerald-600 font-bold">
                  {Math.round((selectedWarehouse.utilization / selectedWarehouse.capacity) * 100)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}