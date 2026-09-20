"use client";

import { Card, StatusBadge, Table, Td } from "@/components/ui/cards";

const USERS = [
  { id: "1", name: "Dr. Elara Voss", email: "author@demo.com", role: "author", tenant: "Quantum Press", lastLogin: "2 hours ago", status: "active" },
  { id: "2", name: "James Park", email: "editor@demo.com", role: "editor", tenant: "Quantum Press", lastLogin: "1 hour ago", status: "active" },
  { id: "3", name: "Sarah Chen", email: "publisher@demo.com", role: "publisher", tenant: "Quantum Press", lastLogin: "30 min ago", status: "active" },
  { id: "4", name: "Admin User", email: "admin@demo.com", role: "admin", tenant: "System", lastLogin: "5 min ago", status: "active" },
  { id: "5", name: "Beta Reader", email: "beta@demo.com", role: "beta_reader", tenant: "Quantum Press", lastLogin: "3 days ago", status: "active" },
];

export default function UsersPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">👤 User Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          + Add User
        </button>
      </div>
      <Card>
        <Table headers={["User", "Email", "Role", "Tenant", "Last Login", "Status", "Actions"]}>
          {USERS.map((user) => (
            <tr key={user.id} className="table-row-hover">
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-900">{user.name}</span>
                </div>
              </Td>
              <Td className="text-sm text-slate-500">{user.email}</Td>
              <Td>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium capitalize">
                  {user.role.replace("_", " ")}
                </span>
              </Td>
              <Td className="text-sm text-slate-500">{user.tenant}</Td>
              <Td className="text-sm text-slate-500">{user.lastLogin}</Td>
              <Td><StatusBadge status={user.status} /></Td>
              <Td>
                <button className="px-3 py-1 text-xs font-medium bg-slate-50 text-slate-600 rounded-md hover:bg-slate-100">
                  Edit
                </button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}