"use client";

import { useState } from "react";
import { Card, StatusBadge, KpiCard } from "@/components/ui/cards";

const ASSIGNMENTS = [
  {
    id: "1",
    title: "Whispers of the Forgotten",
    author: "Sarah Chen",
    genre: "Fantasy",
    deadline: "2025-02-15",
    progress: 65,
    chapters: 20,
    readChapters: 13,
    status: "in_progress",
  },
  {
    id: "2",
    title: "Midnight in Marrakech",
    author: "Omar Hassan",
    genre: "Thriller",
    deadline: "2025-03-01",
    progress: 20,
    chapters: 18,
    readChapters: 4,
    status: "assigned",
  },
];

const SAMPLE_CONTENT = `Chapter 12: The Obsidian Gate

The ancient stones hummed beneath her fingers, each vibration carrying a memory older than the kingdom itself. Kaelith pressed her palm flat against the obsidian surface, feeling the warmth of a thousand years of waiting pulse through her skin.

"Are you certain about this?" Darien's voice was barely a whisper, as though speaking too loudly might shatter whatever spell held the gate together.

"No," she admitted. "But certainty is a luxury we stopped being able to afford three kingdoms ago."

The gate began to glow, faintly at first — like embers stirred from a dying fire — then brighter, until the entire cavern was bathed in deep violet light. Shadows danced on the walls, but they were not the shadows of anything present. They were memories, replaying across the stone like a theater of the dead.`;

export default function BetaReaderPage() {
  const [selectedAssignment, setSelectedAssignment] = useState(ASSIGNMENTS[0]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Beta Reader Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard title="Assigned Manuscripts" value="2" icon="📚" color="indigo" />
        <KpiCard title="Feedback Given" value="47" icon="💬" color="purple" />
        <KpiCard title="Avg Rating Given" value="4.2" icon="⭐" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment List */}
        <div className="space-y-4">
          <Card title="My Assignments">
            <div className="space-y-3">
              {ASSIGNMENTS.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    a.id === selectedAssignment.id
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setSelectedAssignment(a)}
                >
                  <div className="font-medium text-sm text-slate-900">
                    {a.title}
                  </div>
                  <div className="text-xs text-slate-500 mb-2">
                    by {a.author} • {a.genre}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">
                      {a.readChapters}/{a.chapters} chapters
                    </span>
                    <span className="text-xs font-bold text-indigo-600">
                      {a.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <StatusBadge status={a.status} />
                    <span className="text-xs text-slate-400">
                      Due: {a.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Reading View */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900">
                  {selectedAssignment.title}
                </h3>
                <span className="text-sm text-slate-500">
                  Chapter {selectedAssignment.readChapters + 1} of{" "}
                  {selectedAssignment.chapters}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                >
                  💬 Give Feedback
                </button>
                <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                  🔖 Bookmark
                </button>
              </div>
            </div>

            {/* Distraction-free reader */}
            <div className="prose prose-slate max-w-none bg-white p-6 rounded-lg border border-slate-100 leading-relaxed min-h-[300px]">
              {SAMPLE_CONTENT.split("\n\n").map((para, i) => (
                <p key={i} className="text-slate-700 mb-4">
                  {para}
                </p>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">
                ← Previous Chapter
              </button>
              <span className="text-sm text-slate-400">Page 42 of 187</span>
              <button className="px-4 py-2 text-sm text-indigo-600 font-medium hover:text-indigo-700">
                Next Chapter →
              </button>
            </div>
          </Card>

          {/* Feedback Form */}
          {showFeedback && (
            <Card title="Submit Feedback">
              <div className="space-y-4">
                <div className="flex gap-2">
                  {["general", "plot", "character", "pacing", "prose", "confusing"].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setFeedbackType(type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                          feedbackType === type
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
                <textarea
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  placeholder="Share your thoughts on this chapter..."
                  className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500 mr-2">
                      Rating:
                    </span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-xl ${
                          star <= rating ? "text-amber-400" : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                    Submit Feedback
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}