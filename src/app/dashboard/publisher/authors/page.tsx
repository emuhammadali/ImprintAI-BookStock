"use client";

import { Card, Table, Td } from "@/components/ui/cards";

const AUTHORS = [
  { id: "1", name: "Dr. Elara Voss", email: "elara@demo.com", books: 1, totalSales: 4650, royalty: "$14,499", status: "active" },
  { id: "2", name: "Alex Park", email: "alex@demo.com", books: 2, totalSales: 1450, royalty: "$6,909", status: "active" },
  { id: "3", name: "Sarah Chen", email: "sarah@demo.com", books: 1, totalSales: 0, royalty: "$0", status: "active" },
  { id: "4", name: "Omar Hassan", email: "omar@demo.com", books: 1, totalSales: 0, royalty: "$0", status: "active" },
  { id: "5", name: "Maria Garcia", email: "maria@demo.com", books: 1, totalSales: 0, royalty: "$0", status: "active" },
];

export default function AuthorsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">👥 Author Management</h2>
      <Card>
        <Table headers={["Author", "Email", "Books", "Total Sales", "Royalty Paid", "Actions"]}>
          {AUTHORS.map((author) => (
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
                  <button className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100">
                    Contract
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-slate-50 text-slate-600 rounded-md hover:bg-slate-100">
                    View
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}