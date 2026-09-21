"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/cards";

const INITIAL_RECORDS = [
  { id: "1", hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069", txId: "TX-2025-001247", type: "copyright", version: 3, timestamp: "2025-01-15T14:30:00Z", status: "verified", block: 14823 },
  { id: "2", hash: "0x3f758864a0e7cc29c2bf9f47e5a23c06e52f33dbb2c56f2e05e0e05f2bbd5a23", txId: "TX-2025-001180", type: "copyright", version: 2, timestamp: "2025-01-10T09:15:00Z", status: "verified", block: 14789 },
  { id: "3", hash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2", txId: "TX-2025-001050", type: "copyright", version: 1, timestamp: "2025-01-02T16:45:00Z", status: "verified", block: 14702 },
];

const INITIAL_CONTRACTS = [
  { id: "1", stakeholder: "Dr. Elara Voss (Author)", percentage: 60.00, address: "0x1234...abcd", active: true, email: "elara.voss@quantumpress.com" },
  { id: "2", stakeholder: "Quantum Press (Publisher)", percentage: 25.00, address: "0x5678...efgh", active: true, email: "royalties@quantumpress.com" },
  { id: "3", stakeholder: "Editor: James Park", percentage: 10.00, address: "0x9abc...ijkl", active: true, email: "james.park@quantumpress.com" },
  { id: "4", stakeholder: "Cover Artist: Nova Studios", percentage: 5.00, address: "0xdef0...mnop", active: false, email: "contact@novastudios.com" },
];

export default function BlockchainPage() {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [currentVersion, setCurrentVersion] = useState(4);

  const [showTimestampModal, setShowTimestampModal] = useState(false);
  const [showAddStakeholderModal, setShowAddStakeholderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<typeof INITIAL_RECORDS[0] | null>(null);
  const [selectedContract, setSelectedContract] = useState<typeof INITIAL_CONTRACTS[0] | null>(null);

  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({ percentage: 0, stakeholder: "", email: "" });
  const [newStakeholder, setNewStakeholder] = useState({ stakeholder: "", percentage: 0, address: "0x" + Math.random().toString(16).slice(2, 10) + "...", email: "" });

  // ✅ Dynamic KPIs
  const totalTimestamps = records.length;
  const activeContracts = contracts.filter((c) => c.active).length;
  const totalAllocation = contracts
    .filter((c) => c.active)
    .reduce((sum, c) => sum + c.percentage, 0);
  const isValid = totalAllocation === 100;

  // ✅ Timestamp new version
  function handleTimestamp(e: React.FormEvent) {
    e.preventDefault();
    const newRecord = {
      id: String(records.length + 1),
      hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      txId: `TX-2025-${String(1248 + records.length).padStart(6, "0")}`,
      type: "copyright",
      version: currentVersion,
      timestamp: new Date().toISOString(),
      status: "verified",
      block: 14823 + records.length + 1,
    };
    setRecords([newRecord, ...records]);
    setCurrentVersion(currentVersion + 1);
    setShowTimestampModal(false);
  }

  // ✅ Add stakeholder
  function handleAddStakeholder(e: React.FormEvent) {
    e.preventDefault();
    if (totalAllocation + newStakeholder.percentage > 100) {
      alert(`Cannot add. Total allocation would exceed 100%. Current: ${totalAllocation}%`);
      return;
    }
    const contract = {
      id: String(contracts.length + 1),
      ...newStakeholder,
      active: true,
    };
    setContracts([...contracts, contract]);
    setShowAddStakeholderModal(false);
    setNewStakeholder({
      stakeholder: "",
      percentage: 0,
      address: "0x" + Math.random().toString(16).slice(2, 10) + "...",
      email: "",
    });
  }

  // ✅ Edit
  function openEdit(contract: typeof INITIAL_CONTRACTS[0]) {
    setSelectedContract(contract);
    setEditForm({ percentage: contract.percentage, stakeholder: contract.stakeholder, email: contract.email });
    setShowEditModal(true);
  }

  function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedContract) return;

    const otherTotal = contracts
      .filter((c) => c.id !== selectedContract.id && c.active)
      .reduce((s, c) => s + c.percentage, 0);

    if (editForm.percentage + otherTotal > 100) {
      alert(`Total would exceed 100%. Other stakeholders use ${otherTotal}%.`);
      return;
    }

    setContracts((prev) =>
      prev.map((c) =>
        c.id === selectedContract.id
          ? { ...c, percentage: editForm.percentage, stakeholder: editForm.stakeholder, email: editForm.email }
          : c
      )
    );
    setShowEditModal(false);
  }

  // ✅ Toggle active
  function toggleActive(id: string) {
    setContracts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  }

  // ✅ Delete
  function deleteContract(id: string) {
    if (!confirm("Remove this stakeholder from the contract?")) return;
    setContracts((prev) => prev.filter((c) => c.id !== id));
  }

  // ✅ View record
  function viewRecord(record: typeof INITIAL_RECORDS[0]) {
    setSelectedRecord(record);
    setShowDetailModal(true);
  }

  // ✅ Copy hash
  function copyHash(hash: string) {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  }

  // ✅ Download certificate
  function downloadCertificate(record: typeof INITIAL_RECORDS[0]) {
    const cert = `
═══════════════════════════════════════
   BLOCKCHAIN COPYRIGHT CERTIFICATE
═══════════════════════════════════════

Transaction ID: ${record.txId}
Version: ${record.version}
Block: #${record.block}
Timestamp: ${new Date(record.timestamp).toLocaleString()}

Hash: ${record.hash}

Status: ${record.status.toUpperCase()}

═══════════════════════════════════════
   Verified on Hyperledger Fabric
═══════════════════════════════════════
`;
    const blob = new Blob([cert], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `copyright-${record.txId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Blockchain Rights Center</h2>
        <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
        <span className="text-sm text-emerald-600">Blockchain Connected</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-bold text-slate-900">{totalTimestamps}</div>
            <div className="text-sm text-slate-500">Copyright Timestamps</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">📜</div>
            <div className="text-2xl font-bold text-slate-900">{activeContracts}</div>
            <div className="text-sm text-slate-500">Active Contracts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className={`text-2xl font-bold ${isValid ? "text-emerald-600" : "text-red-600"}`}>
              {totalAllocation.toFixed(2)}%
            </div>
            <div className="text-sm text-slate-500">Total Allocation</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-emerald-600">100%</div>
            <div className="text-sm text-slate-500">Verification Rate</div>
          </div>
        </Card>
      </div>

      {!isValid && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
          ⚠️ <strong>Warning:</strong> Active contract allocation is {totalAllocation.toFixed(2)}% (should be 100%).
          {totalAllocation < 100 ? " Some royalties are unallocated." : " Over-allocated!"}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Copyright Chain */}
        <Card title={`Copyright Timestamps (${records.length})`}>
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="p-4 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-slate-500">{record.txId}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                    ✓ Verified
                  </span>
                </div>
                <div className="text-sm text-slate-700 mb-1">
                  Version {record.version} — Copyright Registration
                </div>
                <div
                  className="font-mono text-xs text-slate-400 truncate cursor-pointer hover:text-indigo-600"
                  onClick={() => copyHash(record.hash)}
                  title="Click to copy"
                >
                  Hash: {record.hash}
                  {copiedHash === record.hash && <span className="ml-2 text-emerald-600">✓ Copied!</span>}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(record.timestamp).toLocaleString()} • Block #{record.block}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => viewRecord(record)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => downloadCertificate(record)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium bg-slate-50 text-slate-600 rounded-md hover:bg-slate-100"
                  >
                    📥 Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowTimestampModal(true)}
            className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            🔗 Timestamp Current Version (v{currentVersion})
          </button>
        </Card>

        {/* Smart Contracts */}
        <Card title={`Royalty Smart Contracts (${contracts.length})`}>
          <div className="space-y-3">
            {contracts.map((contract) => (
              <div key={contract.id} className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-slate-900">{contract.stakeholder}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        contract.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {contract.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-indigo-600">{contract.percentage.toFixed(2)}%</span>
                  <span className="font-mono text-xs text-slate-400">{contract.address}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mb-2 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${contract.percentage}%` }} />
                </div>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => openEdit(contract)}
                    className="flex-1 px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(contract.id)}
                    className="flex-1 px-2 py-1 text-xs font-medium bg-slate-50 text-slate-600 rounded hover:bg-slate-100"
                  >
                    {contract.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteContract(contract.id)}
                    className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAddStakeholderModal(true)}
            className="w-full mt-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            + Add Stakeholder
          </button>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
            <strong>Total Royalty Allocation:</strong> {totalAllocation.toFixed(2)}%
            {isValid ? (
              <span className="text-emerald-600 ml-2">✓ Valid</span>
            ) : (
              <span className="text-red-600 ml-2">✗ Should be 100%</span>
            )}
          </div>
        </Card>
      </div>

      {/* ✅ Timestamp Modal */}
      {showTimestampModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Timestamp Copyright</h3>
              <button onClick={() => setShowTimestampModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <div className="text-xs text-indigo-600 mb-1">Version to Timestamp</div>
              <div className="font-bold text-indigo-700 text-2xl">v{currentVersion}</div>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              This will create an immutable timestamp of your current manuscript version on Hyperledger Fabric.
              Once recorded, it cannot be altered or deleted.
            </p>

            <form onSubmit={handleTimestamp}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTimestampModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  🔗 Timestamp Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Add Stakeholder Modal */}
      {showAddStakeholderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add Stakeholder</h3>
              <button onClick={() => setShowAddStakeholderModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-800">
              Available allocation: <strong>{(100 - totalAllocation).toFixed(2)}%</strong>
            </div>

            <form onSubmit={handleAddStakeholder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Stakeholder Name</label>
                <input
                  type="text"
                  value={newStakeholder.stakeholder}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, stakeholder: e.target.value })}
                  placeholder="e.g., Translator: Anna Kim"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={newStakeholder.email}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newStakeholder.percentage}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, percentage: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={0}
                  max={100 - totalAllocation}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStakeholderModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Add Stakeholder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {showEditModal && selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Stakeholder</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <form onSubmit={submitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Stakeholder</label>
                <input
                  type="text"
                  value={editForm.stakeholder}
                  onChange={(e) => setEditForm({ ...editForm, stakeholder: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.percentage}
                  onChange={(e) => setEditForm({ ...editForm, percentage: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={0}
                  max={100}
                  required
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Copyright Record</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white mb-4">
              <div className="text-xs opacity-80 mb-1">Transaction ID</div>
              <div className="font-mono font-bold">{selectedRecord.txId}</div>
              <div className="text-xs opacity-80 mt-3 mb-1">Block Number</div>
              <div className="font-mono font-bold">#{selectedRecord.block}</div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Version</span>
                <span className="text-slate-900 font-medium">v{selectedRecord.version}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Timestamp</span>
                <span className="text-slate-900 text-xs">{new Date(selectedRecord.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className="text-emerald-600 font-bold">✓ Verified</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-1">Cryptographic Hash</div>
              <div
                className="font-mono text-xs text-slate-700 break-all bg-slate-50 p-3 rounded-lg cursor-pointer hover:bg-slate-100"
                onClick={() => copyHash(selectedRecord.hash)}
              >
                {selectedRecord.hash}
                {copiedHash === selectedRecord.hash && <div className="text-emerald-600 mt-1 text-xs">✓ Copied!</div>}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => downloadCertificate(selectedRecord)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                📥 Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}