"use client";

import { ReactNode } from "react";

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = "indigo",
}: {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    pink: "bg-pink-50 text-pink-600",
    teal: "bg-teal-50 text-teal-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {change !== undefined && (
            <p
              className={`text-xs mt-1 font-medium ${
                change >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%{" "}
              {changeLabel || "vs last month"}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.indigo}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function Card({
  title,
  children,
  action,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    in_review: "bg-amber-100 text-amber-700",
    revision: "bg-pink-100 text-pink-700",
    approved: "bg-emerald-100 text-emerald-700",
    published: "bg-blue-100 text-blue-700",
    archived: "bg-gray-100 text-gray-600",
    pending: "bg-slate-100 text-slate-600",
    confirmed: "bg-blue-100 text-blue-700",
    fulfilled: "bg-emerald-100 text-emerald-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    sent: "bg-amber-100 text-amber-700",
    in_production: "bg-purple-100 text-purple-700",
    in_progress: "bg-blue-100 text-blue-700",
    review: "bg-amber-100 text-amber-700",
    done: "bg-emerald-100 text-emerald-700",
    todo: "bg-slate-100 text-slate-600",
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-red-100 text-red-700",
    healthy: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
    restocked: "bg-green-100 text-green-700",
    written_off: "bg-red-100 text-red-700",
    inspected: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">
        {description}
      </p>
      {action}
    </div>
  );
}

export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
      {children}
    </th>
  );
}