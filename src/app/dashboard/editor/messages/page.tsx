"use client";

import { Card } from "@/components/ui/cards";

const MESSAGES = [
  { from: "Sarah Chen", subject: "Re: Chapter 7 pacing notes", time: "2 hours ago", unread: true, preview: "Thanks for the detailed feedback! I've restructured the market scene as you suggested..." },
  { from: "Omar Hassan", subject: "Timeline question", time: "5 hours ago", unread: true, preview: "Hi, I'm a bit confused about the timeline discrepancy you flagged in Chapter 12..." },
  { from: "Dr. Elara Voss", subject: "Version 4 ready for review", time: "1 day ago", unread: false, preview: "I've completed all the revisions from your feedback. Version 4 is now uploaded..." },
  { from: "Maria Garcia", subject: "Thank you!", time: "2 days ago", unread: false, preview: "Your editorial guidance has been invaluable. The new opening chapter is so much stronger..." },
];

export default function MessagesPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">💬 Messages</h2>
      <Card>
        <div className="space-y-1">
          {MESSAGES.map((msg, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors ${msg.unread ? "bg-indigo-50 hover:bg-indigo-100" : "hover:bg-slate-50"}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {msg.from.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${msg.unread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                    {msg.from}
                  </span>
                  <span className="text-xs text-slate-400">{msg.time}</span>
                </div>
                <div className={`text-sm ${msg.unread ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                  {msg.subject}
                </div>
                <div className="text-xs text-slate-500 mt-1 truncate">{msg.preview}</div>
              </div>
              {msg.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}