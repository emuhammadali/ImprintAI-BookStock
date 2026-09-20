"use client";

import { Card } from "@/components/ui/cards";

export default function ContentPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">📝 Content Management</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Editorial Templates">
          <div className="space-y-3">
            {["Structural Analysis Report", "Line Edit Feedback", "Continuity Check", "Market Analysis", "Authenticity Report"].map((t) => (
              <div key={t} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <span className="text-sm text-slate-700">{t}</span>
                <button className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md">Edit</button>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Audiobook Settings">
          <div className="space-y-3">
            {[
              { label: "Default Narrator Voice", value: "Sarah (Female, Warm)" },
              { label: "Output Format", value: "M4B (Audiobook)" },
              { label: "Sample Rate", value: "44.1 kHz" },
              { label: "Bit Rate", value: "192 kbps" },
              { label: "Chapter Silence", value: "2 seconds" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <span className="text-sm text-slate-700">{s.label}</span>
                <span className="text-sm font-medium text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}