"use client";

import { useState } from "react";
import { Card, Table, Td } from "@/components/ui/cards";

// ✅ Real authors (baad mein database se aayenge)
const INITIAL_AUTHORS = [
  { id: "1", name: "Dr. Elara Voss", email: "elara.voss@quantumpress.com", books: 1, totalSales: 4650, royalty: "$14,499", status: "active", joined: "2024-03-15", phone: "+1 (555) 123-4567" },
  { id: "2", name: "Alex Park", email: "alex.park@quantumpress.com", books: 2, totalSales: 1450, royalty: "$6,909", status: "active", joined: "2024-05-20", phone: "+1 (555) 234-5678" },
  { id: "3", name: "Sarah Chen", email: "sarah.chen@quantumpress.com", books: 1, totalSales: 0, royalty: "$0", status: "active", joined: "2024-08-10", phone: "+1 (555) 345-6789" },
  { id: "4", name: "Omar Hassan", email: "omar.hassan@quantumpress.com", books: 1, totalSales: 0, royalty: "$0", status: "active", joined: "2024-09-01", phone: "+1 (555) 456-7890" },
  { id: "5", name: "Maria Garcia", email: "maria.garcia@quantumpress.com", books: 1, totalSales: 0, royalty: "$0", status: "active", joined: "2024-11-12", phone: "+1 (555) 567-8901" },
];

export default function AuthorsPage() {
  const [authors] = useState(INITIAL_AUTHORS);
  const [selectedAuthor, setSelectedAuthor] = useState<typeof INITIAL_AUTHORS[0] | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  function handleView(author: typeof INITIAL_AUTHORS[0]) {
    setSelectedAuthor(author);
    setShowViewModal(true);
  }

  function handleContract(author: typeof INITIAL_AUTHORS[0]) {
    setSelectedAuthor(author);
    setShowContractModal(true);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">👥 Author Management</h2>

      <Card>
        <Table headers={["Author", "Email", "Books", "Total Sales", "Royalty Paid", "Actions"]}>
          {authors.map((author) => (
            <tr key={author.id} className="table-row-hover">
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {author.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-900">{author.name}</span>
                </div>
              </Td>
              <Td className="text-slate-500">{author.email}</Td>
              <Td className="font-mono">{author.books}</Td>
              <Td className="font-mono">{author.totalSales.toLocaleString()}</Td>
              <Td className="font-mono font-medium text-emerald-600">{author.royalty}</Td>
              <Td>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleContract(author)}
                    className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    Contract
                  </button>
                  <button
                    onClick={() => handleView(author)}
                    className="px-3 py-1 text-xs font-medium bg-slate-50 text-slate-600 rounded-md hover:bg-slate-100"
                  >
                    View
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* ✅ View Author Modal */}
      {showViewModal && selectedAuthor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Author Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {selectedAuthor.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">{selectedAuthor.name}</div>
                <div className="text-sm text-slate-500">{selectedAuthor.email}</div>
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs rounded-full">
                  {selectedAuthor.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="text-slate-900 font-medium">{selectedAuthor.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Joined</span>
                <span className="text-slate-900 font-medium">{selectedAuthor.joined}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Books Published</span>
                <span className="text-slate-900 font-medium">{selectedAuthor.books}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Sales</span>
                <span className="text-slate-900 font-medium">{selectedAuthor.totalSales.toLocaleString()} copies</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Royalty Paid</span>
                <span className="text-emerald-600 font-bold">{selectedAuthor.royalty}</span>
              </div>
            </div>

            <button
              onClick={() => setShowViewModal(false)}
              className="w-full mt-5 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Contract Modal */}
      {showContractModal && selectedAuthor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Publishing Contract</h3>
              <button onClick={() => setShowContractModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-slate-500 mb-1">Contract with</div>
              <div className="font-bold text-slate-900">{selectedAuthor.name}</div>
              <div className="text-xs text-slate-500">{selectedAuthor.email}</div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Contract ID</span>
                <span className="font-mono text-slate-900">CTR-{selectedAuthor.id.padStart(4, "0")}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Start Date</span>
                <span className="text-slate-900">{selectedAuthor.joined}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Duration</span>
                <span className="text-slate-900">3 Years (Auto-renewable)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Royalty Rate</span>
                <span className="text-slate-900 font-bold">15% of net sales</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Advance Paid</span>
                <span className="text-slate-900">$2,000</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Status</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs rounded-full">Active</span>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowContractModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading contract for ${selectedAuthor.name}...`);
                  setShowContractModal(false);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}