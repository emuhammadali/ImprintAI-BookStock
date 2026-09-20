"use client";

import { Card, StatusBadge } from "@/components/ui/cards";

const MANUSCRIPTS = [
  { id: "1", title: "Whispers of the Forgotten", author: "Sarah Chen", genre: "Fantasy", words: 112000, status: "in_review", versions: 3, comments: 47 },
  { id: "2", title: "Midnight in Marrakech", author: "Omar Hassan", genre: "Thriller", words: 78000, status: "in_review", versions: 1, comments: 12 },
  { id: "3", title: "The Quantum Garden", author: "Dr. Elara Voss", genre: "Sci-Fi", words: 78450, status: "revision", versions: 3, comments: 89 },
  { id: "4", title: "Beneath the Willow", author: "Maria Garcia", genre: "Literary", words: 64000, status: "in_review", versions: 2, comments: 23 },
];

export default function EditorManuscriptsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Manuscripts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MANUSCRIPTS.map((ms) => (
          <Card key={ms.id} className="card-hover cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900">{ms.title}</h3>
                <p className="text-sm text-slate-500">by {ms.author}</p>
              </div>
              <StatusBadge status={ms.status} />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">{(ms.words / 1000).toFixed(0)}k</div>
                <div className="text-xs text-slate-500">words</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">{ms.versions}</div>
                <div className="text-xs text-slate-500">versions</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">{ms.comments}</div>
                <div className="text-xs text-slate-500">comments</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                Review
              </button>
              <button className="flex-1 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                AI Report
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}