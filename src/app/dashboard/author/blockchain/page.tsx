"use client";

import { Card, StatusBadge } from "@/components/ui/cards";

const BLOCKCHAIN_RECORDS = [
  { id: "1", hash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069", txId: "TX-2025-001247", type: "copyright", version: 3, timestamp: "2025-01-15T14:30:00Z", status: "verified" },
  { id: "2", hash: "0x3f758864a0e7cc29c2bf9f47e5a23c06e52f33dbb2c56f2e05e0e05f2bbd5a23", txId: "TX-2025-001180", type: "copyright", version: 2, timestamp: "2025-01-10T09:15:00Z", status: "verified" },
  { id: "3", hash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2", txId: "TX-2025-001050", type: "copyright", version: 1, timestamp: "2025-01-02T16:45:00Z", status: "verified" },
];

const SMART_CONTRACTS = [
  { id: "1", stakeholder: "Dr. Elara Voss (Author)", percentage: "60.00", address: "0x1234...abcd", active: true },
  { id: "2", stakeholder: "Quantum Press (Publisher)", percentage: "25.00", address: "0x5678...efgh", active: true },
  { id: "3", stakeholder: "Editor: James Park", percentage: "10.00", address: "0x9abc...ijkl", active: true },
  { id: "4", stakeholder: "Cover Artist: Nova Studios", percentage: "5.00", address: "0xdef0...mnop", active: false },
];

export default function BlockchainPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Blockchain Rights Center
        </h2>
        <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
        <span className="text-sm text-emerald-600">Blockchain Connected</span>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-bold text-slate-900">3</div>
            <div className="text-sm text-slate-500">Copyright Timestamps</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl mb-2">📜</div>
            <div className="text-2xl font-bold text-slate-900">4</div>
            <div className="text-sm text-slate-500">Smart Contracts</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Copyright Chain */}
        <Card title="Copyright Timestamps (Hyperledger Fabric)">
          <div className="space-y-4">
            {BLOCKCHAIN_RECORDS.map((record) => (
              <div key={record.id} className="chain-link">
                <div className="p-4 rounded-lg border border-slate-100 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-slate-500">
                      {record.txId}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="text-sm text-slate-700 mb-1">
                    Version {record.version} — Copyright Registration
                  </div>
                  <div className="font-mono text-xs text-slate-400 truncate">
                    Hash: {record.hash}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(record.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Timestamp Current Version (v4)
          </button>
        </Card>

        {/* Smart Contracts */}
        <Card title="Royalty Smart Contracts">
          <div className="space-y-3">
            {SMART_CONTRACTS.map((contract) => (
              <div
                key={contract.id}
                className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-slate-900">
                    {contract.stakeholder}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      contract.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {contract.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600">
                    {contract.percentage}%
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {contract.address}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${contract.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
            <strong>Total Royalty Allocation:</strong>{" "}
            {SMART_CONTRACTS.reduce(
              (sum, c) => sum + parseFloat(c.percentage),
              0
            ).toFixed(2)}
            % — Smart contract will automatically distribute royalties on each sale.
          </div>
        </Card>
      </div>
    </div>
  );
}