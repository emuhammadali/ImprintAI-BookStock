"use client";

import { useState } from "react";
import { Card, StatusBadge, KpiCard } from "@/components/ui/cards";

const INITIAL_ASSIGNMENTS = [
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

const CHAPTER_CONTENTS: Record<number, string> = {
  11: `Chapter 11: The Obsidian Gate

The ancient stones hummed beneath her fingers, each vibration carrying a memory older than the kingdom itself. Kaelith pressed her palm flat against the obsidian surface, feeling the warmth of a thousand years of waiting pulse through her skin.

"Are you certain about this?" Darien's voice was barely a whisper, as though speaking too loudly might shatter whatever spell held the gate together.

"No," she admitted. "But certainty is a luxury we stopped being able to afford three kingdoms ago."`,
  12: `Chapter 12: The Obsidian Gate

The gate began to glow, faintly at first — like embers stirred from a dying fire — then brighter, until the entire cavern was bathed in deep violet light. Shadows danced on the walls, but they were not the shadows of anything present. They were memories, replaying across the stone like a theater of the dead.

Kaelith took a step forward, and the gate responded with a low hum that resonated in her chest. Behind her, she heard Darien's sharp intake of breath.

"It's opening," he said. "Gods help us, it's actually opening."`,
  13: `Chapter 13: The Crossing

Beyond the gate lay a corridor of light — not blinding, but soft, like the glow of dawn filtering through morning mist. Kaelith stepped through first, her boots making no sound on the impossible floor that seemed to be made of solidified starlight.

"Wait—" Darien called, but she was already gone, swallowed by the shimmering passage.`,
};

const SAMPLE_CONTENT = `Chapter 12: The Obsidian Gate

The ancient stones hummed beneath her fingers, each vibration carrying a memory older than the kingdom itself. Kaelith pressed her palm flat against the obsidian surface, feeling the warmth of a thousand years of waiting pulse through her skin.

"Are you certain about this?" Darien's voice was barely a whisper, as though speaking too loudly might shatter whatever spell held the gate together.

"No," she admitted. "But certainty is a luxury we stopped being able to afford three kingdoms ago."

The gate began to glow, faintly at first — like embers stirred from a dying fire — then brighter, until the entire cavern was bathed in deep violet light. Shadows danced on the walls, but they were not the shadows of anything present. They were memories, replaying across the stone like a theater of the dead.`;

export default function BetaReaderPage() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [selectedAssignment, setSelectedAssignment] = useState(INITIAL_ASSIGNMENTS[0]);
  const [currentChapter, setCurrentChapter] = useState(12);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [rating, setRating] = useState(0);
  const [submittedFeedback, setSubmittedFeedback] = useState<Array<{chapter: number, type: string, content: string, rating: number, date: string}>>([]);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // ✅ Dynamic KPIs
  const assignedCount = assignments.length;
  const totalFeedback = assignments.reduce((sum, a) => sum + a.readChapters, 0) + submittedFeedback.length;
  const avgRating = submittedFeedback.length > 0
    ? (submittedFeedback.reduce((sum, f) => sum + f.rating, 0) / submittedFeedback.length).toFixed(1)
    : "4.2";

  const currentContent = CHAPTER_CONTENTS[currentChapter] || SAMPLE_CONTENT;
  const isBookmarked = bookmarks.has(currentChapter);

  // ✅ Navigate chapters
  function goToChapter(ch: number) {
    if (ch < 1 || ch > selectedAssignment.chapters) return;
    setCurrentChapter(ch);
    setShowFeedback(false);
    setFeedbackContent("");
    setRating(0);
  }

  // ✅ Toggle bookmark
  function toggleBookmark() {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(currentChapter)) {
      newBookmarks.delete(currentChapter);
    } else {
      newBookmarks.add(currentChapter);
    }
    setBookmarks(newBookmarks);
  }

  // ✅ Submit feedback
  function submitFeedback() {
    if (!feedbackContent.trim()) {
      alert("Please write your feedback before submitting.");
      return;
    }
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    const newFeedback = {
      chapter: currentChapter,
      type: feedbackType,
      content: feedbackContent,
      rating,
      date: new Date().toISOString().split("T")[0],
    };

    setSubmittedFeedback([newFeedback, ...submittedFeedback]);

    // Update assignment progress
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAssignment.id
          ? {
              ...a,
              readChapters: Math.min(a.chapters, a.readChapters + 1),
              progress: Math.min(100, Math.round(((a.readChapters + 1) / a.chapters) * 100)),
            }
          : a
      )
    );

    // Reset form
    setFeedbackContent("");
    setRating(0);
    setFeedbackType("general");
    setShowFeedback(false);

    // Show success toast
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  }

  // ✅ Switch assignment
  function selectAssignment(a: typeof INITIAL_ASSIGNMENTS[0]) {
    setSelectedAssignment(a);
    setCurrentChapter(Math.max(1, a.readChapters + 1));
    setShowFeedback(false);
    setFeedbackContent("");
    setRating(0);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Beta Reader Dashboard
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard title="Assigned Manuscripts" value={assignedCount.toString()} icon="📚" color="indigo" />
        <KpiCard title="Feedback Given" value={totalFeedback.toString()} icon="💬" color="purple" />
        <KpiCard title="Avg Rating Given" value={avgRating} icon="⭐" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment List */}
        <div className="space-y-4">
          <Card title="My Assignments">
            <div className="space-y-3">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    a.id === selectedAssignment.id
                      ? "border-indigo-200 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => selectAssignment(a)}
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
                      className="h-full bg-indigo-500 rounded-full transition-all"
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

          {/* Submitted Feedback (recent) */}
          {submittedFeedback.length > 0 && (
            <Card title={`My Recent Feedback (${submittedFeedback.length})`}>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {submittedFeedback.slice(0, 5).map((fb, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">Ch. {fb.chapter}</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full capitalize">
                        {fb.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{fb.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-xs ${star <= fb.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{fb.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
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
                  Chapter {currentChapter} of {selectedAssignment.chapters}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showFeedback
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  💬 {showFeedback ? "Hide Feedback" : "Give Feedback"}
                </button>
                <button
                  onClick={toggleBookmark}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isBookmarked
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
                </button>
              </div>
            </div>

            {/* Chapter Content */}
            <div className="prose prose-slate max-w-none bg-white p-6 rounded-lg border border-slate-100 leading-relaxed min-h-[300px]">
              {currentContent.split("\n\n").map((para, i) => (
                <p key={i} className="text-slate-700 mb-4">
                  {para}
                </p>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => goToChapter(currentChapter - 1)}
                disabled={currentChapter <= 1}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous Chapter
              </button>
              <span className="text-sm text-slate-400">
                Chapter {currentChapter} of {selectedAssignment.chapters}
              </span>
              <button
                onClick={() => goToChapter(currentChapter + 1)}
                disabled={currentChapter >= selectedAssignment.chapters}
                className="px-4 py-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next Chapter →
              </button>
            </div>
          </Card>

          {/* Feedback Form */}
          {showFeedback && (
            <Card title="Submit Feedback">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Feedback Type
                  </label>
                  <div className="flex flex-wrap gap-2">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    placeholder="Share your thoughts on this chapter..."
                    className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500 mr-2">
                      Rating: <span className="text-red-500">*</span>
                    </span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${
                          star <= rating ? "text-amber-400" : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="text-sm text-slate-500 ml-2">{rating}/5</span>
                    )}
                  </div>
                  <button
                    onClick={submitFeedback}
                    disabled={!feedbackContent.trim() || rating === 0}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ✅ Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <span className="text-xl">✅</span>
          <div>
            <div className="font-medium">Feedback submitted!</div>
            <div className="text-xs opacity-90">Your feedback has been saved.</div>
          </div>
        </div>
      )}
    </div>
  );
}