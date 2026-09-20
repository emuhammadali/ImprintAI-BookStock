"use client";

import { useState, useMemo } from "react";
import { Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const INITIAL_PURCHASE_ORDERS = [
  { id: "PO-2025-001", supplier: "PrintMaster Inc.", warehouse: "NYC Main", items: 3, total: 12500, status: "delivered", expected: "2025-01-10", created: "2025-01-01", notes: "Rush order for Q1 release" },
  { id: "PO-2025-002", supplier: "BookPress Co.", warehouse: "LA West", items: 1, total: 7500, status: "shipped", expected: "2025-01-20", created: "2025-01-08", notes: "Standard delivery" },
  { id: "PO-2025-003", supplier: "PrintMaster Inc.", warehouse: "NYC Main", items: 2, total: 8200, status: "in_production", expected: "2025-02-01", created: "2025-01-12", notes: "Awaiting paper stock" },
];

const INITIAL_SALES_ORDERS = [
  { id: "SO-2025-042", customer: "Barnes & Noble", warehouse: "NYC Main", items: 3, total: 4500, status: "fulfilled", created: "2025-01-15", tracking: "TRK-928470" },
  { id: "SO-2025-041", customer: "Amazon", warehouse: "LA West", items: 5, total: 12300, status: "shipped", tracking: "TRK-928471", created: "2025-01-14" },
  { id: "SO-2025-040", customer: "Indie Bookstore NYC", warehouse: "NYC Main", items: 2, total: 1200, status: "confirmed", created: "2025-01-14" },
  { id: "SO-2025-039", customer: "Waterstones", warehouse: "LA West", items: 4, total: 8900, status: "pending", created: "2025-01-13" },
];

const INITIAL_RETURNS = [
  { id: "RET-001", order: "SO-2025-038", book: "The Quantum Garden (HC)", qty: 5, reason: "Shipping damage", condition: "damaged", status: "pending" },
  { id: "RET-002", order: "SO-2025-035", book: "The Last Algorithm (PB)", qty: 12, reason: "Overstock return", condition: "mint", status: "inspected" },
];

export default function OrdersPage() {
  const [tab, setTab] = useState<"purchase" | "sales" | "returns">("sales");
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);
  const [salesOrders, setSalesOrders] = useState(INITIAL_SALES_ORDERS);
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnAction, setReturnAction] = useState<"approve" | "reject" | "restock">("approve");
  const [selectedReturn, setSelectedReturn] = useState<any>(null);

  // ✅ Filtered data
  const filteredPurchase = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const matchesSearch = !searchQuery ||
        po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || po.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, searchQuery, statusFilter]);

  const filteredSales = useMemo(() => {
    return salesOrders.filter((so) => {
      const matchesSearch = !searchQuery ||
        so.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        so.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || so.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [salesOrders, searchQuery, statusFilter]);

  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      const matchesSearch = !searchQuery ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.book.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [returns, searchQuery, statusFilter]);

  // ✅ Detail modal
  function handleViewDetails(order: any) {
    setSelectedOrder(order);
    setShowDetailModal(true);
  }

  // ✅ Sales Order Actions
  function updateSalesStatus(id: string, newStatus: string) {
    setSalesOrders((prev) =>
      prev.map((so) => (so.id === id ? { ...so, status: newStatus } : so))
    );
    setShowDetailModal(false);
  }

  // ✅ Return Actions
  function handleReturnAction(ret: any, action: "approve" | "reject" | "restock") {
    setSelectedReturn(ret);
    setReturnAction(action);
    setShowReturnModal(true);
  }

  function confirmReturnAction(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReturn) return;

    const newStatus = returnAction === "reject" ? "rejected" : "inspected";
    setReturns((prev) =>
      prev.map((r) => (r.id === selectedReturn.id ? { ...r, status: newStatus } : r))
    );
    setShowReturnModal(false);
    setSelectedReturn(null);
  }

  // ✅ New Sales Order
  function handleNewSalesOrder() {
    const newId = `SO-2025-${String(salesOrders.length + 43).padStart(3, "0")}`;
    const newOrder = {
      id: newId,
      customer: "New Customer",
      warehouse: "NYC Main",
      items: 1,
      total: 500,
      status: "pending",
      created: new Date().toISOString().split("T")[0],
    };
    setSalesOrders([newOrder, ...salesOrders]);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">🛒 Order Management</h2>
        <button
          onClick={handleNewSalesOrder}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + New Sales Order
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {([
          { key: "purchase", label: "Purchase Orders", count: purchaseOrders.length },
          { key: "sales", label: "Sales Orders", count: salesOrders.length },
          { key: "returns", label: "Returns", count: returns.length },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              tab === t.key
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                tab === t.key ? "bg-white/20" : "bg-slate-100"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Search by ID or name..."
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
          {tab === "purchase" && (
            <>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="in_production">In Production</option>
            </>
          )}
          {tab === "sales" && (
            <>
              <option value="fulfilled">Fulfilled</option>
              <option value="shipped">Shipped</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
            </>
          )}
          {tab === "returns" && (
            <>
              <option value="pending">Pending</option>
              <option value="inspected">Inspected</option>
              <option value="rejected">Rejected</option>
            </>
          )}
        </select>
      </div>

      {/* PURCHASE ORDERS */}
      {tab === "purchase" && (
        <Card title="Purchase Orders">
          <Table headers={["PO Number", "Supplier", "Warehouse", "Items", "Total", "Status", "Expected", "Actions"]}>
            {filteredPurchase.map((po) => (
              <tr key={po.id} className="table-row-hover">
                <Td className="font-mono font-medium text-indigo-600">{po.id}</Td>
                <Td>{po.supplier}</Td>
                <Td>{po.warehouse}</Td>
                <Td className="font-mono">{po.items}</Td>
                <Td className="font-mono font-medium">${po.total.toLocaleString()}</Td>
                <Td><StatusBadge status={po.status} /></Td>
                <Td className="text-sm text-slate-500">{po.expected}</Td>
                <Td>
                  <button
                    onClick={() => handleViewDetails(po)}
                    className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    View
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* SALES ORDERS */}
      {tab === "sales" && (
        <Card title="Sales Orders">
          <Table headers={["SO Number", "Customer", "Warehouse", "Items", "Total", "Status", "Created", "Actions"]}>
            {filteredSales.map((so) => (
              <tr key={so.id} className="table-row-hover">
                <Td className="font-mono font-medium text-indigo-600">{so.id}</Td>
                <Td className="font-medium text-slate-900">{so.customer}</Td>
                <Td>{so.warehouse}</Td>
                <Td className="font-mono">{so.items}</Td>
                <Td className="font-mono font-medium">${so.total.toLocaleString()}</Td>
                <Td><StatusBadge status={so.status} /></Td>
                <Td className="text-sm text-slate-500">{so.created}</Td>
                <Td>
                  <button
                    onClick={() => handleViewDetails(so)}
                    className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    View
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* RETURNS */}
      {tab === "returns" && (
        <Card title="Returns Queue">
          <Table headers={["Return ID", "Order", "Book", "Qty", "Reason", "Condition", "Status", "Actions"]}>
            {filteredReturns.map((ret) => (
              <tr key={ret.id} className="table-row-hover">
                <Td className="font-mono font-medium text-indigo-600">{ret.id}</Td>
                <Td className="font-mono">{ret.order}</Td>
                <Td className="font-medium text-slate-900">{ret.book}</Td>
                <Td className="font-mono">{ret.qty}</Td>
                <Td className="text-sm text-slate-500">{ret.reason}</Td>
                <Td>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ret.condition === "mint"
                        ? "bg-emerald-100 text-emerald-700"
                        : ret.condition === "good"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ret.condition}
                  </span>
                </Td>
                <Td><StatusBadge status={ret.status} /></Td>
                <Td>
                  <div className="flex gap-1">
                    {ret.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleReturnAction(ret, "restock")}
                          className="px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100"
                        >
                          Restock
                        </button>
                        <button
                          onClick={() => handleReturnAction(ret, "reject")}
                          className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleViewDetails(ret)}
                      className="px-2 py-1 text-xs font-medium bg-slate-50 text-slate-600 rounded-md hover:bg-slate-100"
                    >
                      View
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
          {returns.some((r) => r.status === "pending") && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Action needed:</strong> {returns.filter((r) => r.status === "pending").length} return(s)
              require inspection before write-off.
            </div>
          )}
        </Card>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Order Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="font-mono font-bold text-indigo-600 text-lg">{selectedOrder.id}</div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div className="space-y-3 text-sm">
              {Object.entries(selectedOrder).map(([key, value]) => {
                if (key === "id" || key === "status") return null;
                const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
                return (
                  <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-900 font-medium">
                      {typeof value === "number" && key === "total"
                        ? `$${value.toLocaleString()}`
                        : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sales order actions */}
            {tab === "sales" && selectedOrder.status !== "fulfilled" && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="text-sm font-medium text-slate-700 mb-2">Update Status</div>
                <div className="flex gap-2">
                  {selectedOrder.status === "pending" && (
                    <button
                      onClick={() => updateSalesStatus(selectedOrder.id, "confirmed")}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  )}
                  {selectedOrder.status === "confirmed" && (
                    <button
                      onClick={() => updateSalesStatus(selectedOrder.id, "shipped")}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                    >
                      Ship
                    </button>
                  )}
                  {selectedOrder.status === "shipped" && (
                    <button
                      onClick={() => updateSalesStatus(selectedOrder.id, "fulfilled")}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                    >
                      Mark Fulfilled
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Return Action Modal */}
      {showReturnModal && selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {returnAction === "restock" ? "Restock Return" : returnAction === "reject" ? "Reject Return" : "Approve Return"}
              </h3>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="font-mono font-bold text-indigo-600">{selectedReturn.id}</div>
              <div className="text-sm text-slate-700">{selectedReturn.book}</div>
              <div className="text-xs text-slate-500 mt-1">
                Order: {selectedReturn.order} • Qty: {selectedReturn.qty}
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              {returnAction === "restock"
                ? `Are you sure you want to restock ${selectedReturn.qty} units of ${selectedReturn.book}?`
                : returnAction === "reject"
                ? `Are you sure you want to reject this return? The customer will be notified.`
                : "Approve this return?"}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReturnAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium ${
                  returnAction === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}