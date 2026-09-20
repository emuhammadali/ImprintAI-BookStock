"use client";

import { Card, Table, Td } from "@/components/ui/cards";

const FEEDBACK_HISTORY = [
  { date: "2025-01-15", manuscript: "Whispers of the Forgotten", chapter: "Ch. 13", type: "pacing", content: "The pacing in the middle section feels slow. Consider cutting some of the inner monologue.", rating: 3 },
  { date: "2025-01-14", manuscript: "Whispers of the Forgotten", chapter: "Ch. 12", type: "character", content: "Kaelith's decision to trust Darien feels rushed. Maybe add a moment of hesitation.", rating: 4 },
  { date: "2025-01-13", manuscript: "Whispers of the Forgotten", chapter: "Ch. 11", type: "prose", content: "Beautiful descriptions in this chapter. The obsidian gate scene is vivid and immersive.", rating: 5 },
  { date: "2025-01-12", manuscript: "Midnight in Marrakech", chapter: "Ch. 4", type: "confusing", content: "The timeline jumps confused me. Could use clearer transitions between the present and flashback.", rating: 3 },
  { date: "2025-01-11", manuscript: "Midnight in Marrakech", chapter: "Ch. 3", type: "plot", content: "Great twist with the hidden room. Did not see it coming at all!", rating: 5 },
];

export default function FeedbackHistoryPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">🕐 Feedback History</h2>
      <Card>
        <Table headers={["Date", "Manuscript", "Chapter", "Type", "Feedback", "Rating"]}>
          {FEEDBACK_HISTORY.map((fb, i) => (
            <tr key={i} className="table-row-hover">
              <Td className="text-sm text-slate-500">{fb.date}</Td>
              <Td className="font-medium text-slate-900 text-sm">{fb.manuscript}</Td>
              <Td className="text-sm text-slate-600">{fb.chapter}</Td>
              <Td>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full capitalize">
                  {fb.type}
                </span>
              </Td>
              <Td className="text-sm text-slate-600 max-w-md">{fb.content}</Td>
              <Td>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-sm ${star <= fb.rating ? "text-amber-400" : "text-slate-200"}`}>
                      ★
                    </span>
                  ))}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}