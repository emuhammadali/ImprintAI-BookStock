"use client";

import { useState, useMemo } from "react";
import { Card, KpiCard } from "@/components/ui/cards";

const INITIAL_MESSAGES = [
  {
    id: "1",
    from: "Sarah Chen",
    email: "sarah.chen@quantumpress.com",
    subject: "Re: Chapter 7 pacing notes",
    time: "2 hours ago",
    timestamp: "2025-01-15T14:30:00",
    unread: true,
    preview: "Thanks for the detailed feedback! I've restructured the market scene as you suggested...",
    body: `Hi,

Thanks for the detailed feedback! I've restructured the market scene as you suggested, moving the confrontation earlier and cutting about 400 words of description.

I think the pacing feels much tighter now. Let me know what you think of the revised version.

Best,
Sarah`,
    attachments: ["Chapter7_v2.docx"],
  },
  {
    id: "2",
    from: "Omar Hassan",
    email: "omar.hassan@quantumpress.com",
    subject: "Timeline question",
    time: "5 hours ago",
    timestamp: "2025-01-15T11:15:00",
    unread: true,
    preview: "Hi, I'm a bit confused about the timeline discrepancy you flagged in Chapter 12...",
    body: `Hi,

I'm a bit confused about the timeline discrepancy you flagged in Chapter 12. I thought the flashback was clearly marked, but if it's not landing, I can add chapter headers with dates.

Let me know which approach you prefer.

Thanks,
Omar`,
    attachments: [],
  },
  {
    id: "3",
    from: "Dr. Elara Voss",
    email: "elara.voss@quantumpress.com",
    subject: "Version 4 ready for review",
    time: "1 day ago",
    timestamp: "2025-01-14T16:00:00",
    unread: false,
    preview: "I've completed all the revisions from your feedback. Version 4 is now uploaded...",
    body: `Hello,

I've completed all the revisions from your feedback. Version 4 is now uploaded to the shared folder.

Major changes:
- Restructured Chapters 3-5
- Added two new scenes in the middle act
- Cut about 8,000 words of exposition
- Rewrote the ending

Looking forward to your thoughts.

Elara`,
    attachments: ["QuantumGarden_v4.docx", "RevisionNotes.pdf"],
  },
  {
    id: "4",
    from: "Maria Garcia",
    email: "maria.garcia@quantumpress.com",
    subject: "Thank you!",
    time: "2 days ago",
    timestamp: "2025-01-13T09:00:00",
    unread: false,
    preview: "Your editorial guidance has been invaluable. The new opening chapter is so much stronger...",
    body: `Dear Editor,

Your editorial guidance has been invaluable. The new opening chapter is so much stronger than the original.

I never would have caught the pacing issues myself. Thank you for the careful, thoughtful notes.

Gratefully,
Maria`,
    attachments: [],
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<typeof INITIAL_MESSAGES[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [replyText, setReplyText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: "", subject: "", body: "" });

  // ✅ Filtered messages
  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.preview.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "all" || (filter === "unread" && m.unread);
      return matchesSearch && matchesFilter;
    });
  }, [messages, searchQuery, filter]);

  const unreadCount = messages.filter((m) => m.unread).length;

  // ✅ Open message & mark as read
  function openMessage(msg: typeof INITIAL_MESSAGES[0]) {
    setSelectedMessage(msg);
    setReplyText("");
    if (msg.unread) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m))
      );
    }
  }

  // ✅ Reply
  function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    alert(`✅ Reply sent to ${selectedMessage.from}:\n\n"${replyText}"`);
    setReplyText("");
  }

  // ✅ Mark unread
  function markUnread(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: true } : m))
    );
    setSelectedMessage(null);
  }

  // ✅ Delete
  function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelectedMessage(null);
  }

  // ✅ Compose
  function handleCompose(e: React.FormEvent) {
    e.preventDefault();
    if (!composeForm.to || !composeForm.subject || !composeForm.body) return;

    const newMsg = {
      id: String(messages.length + 1),
      from: "You",
      email: "you@imprintai.com",
      subject: composeForm.subject,
      time: "Just now",
      timestamp: new Date().toISOString(),
      unread: false,
      preview: composeForm.body.slice(0, 80) + "...",
      body: composeForm.body,
      attachments: [],
    };

    setMessages([newMsg, ...messages]);
    setShowCompose(false);
    setComposeForm({ to: "", subject: "", body: "" });
    alert(`✅ Message sent to ${composeForm.to}`);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">💬 Messages</h2>
        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          ✏️ Compose
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard title="Total Messages" value={messages.length.toString()} icon="📬" color="indigo" />
        <KpiCard title="Unread" value={unreadCount.toString()} icon="🔵" color="amber" />
        <KpiCard title="Authors" value={new Set(messages.map((m) => m.from)).size.toString()} icon="👥" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card>
            {/* Filters */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="🔍 Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  filter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  filter === "unread"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Message List */}
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  📭 No messages
                </div>
              ) : (
                filtered.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === msg.id
                        ? "bg-indigo-100 border border-indigo-200"
                        : msg.unread
                        ? "bg-indigo-50 hover:bg-indigo-100"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.from.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${msg.unread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                          {msg.from}
                        </span>
                        <span className="text-xs text-slate-400">{msg.time}</span>
                      </div>
                      <div className={`text-xs ${msg.unread ? "font-semibold text-slate-800" : "text-slate-600"} truncate`}>
                        {msg.subject}
                      </div>
                    </div>
                    {msg.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {!selectedMessage ? (
            <Card>
              <div className="text-center py-20 text-slate-400">
                <div className="text-6xl mb-4">💬</div>
                <p className="font-medium text-slate-600">Select a message to read</p>
                <p className="text-sm mt-1">Choose from the list on the left</p>
              </div>
            </Card>
          ) : (
            <Card>
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                    {selectedMessage.from.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedMessage.from}</h3>
                    <p className="text-xs text-slate-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markUnread(selectedMessage.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200"
                    title="Mark as unread"
                  >
                    ✉️ Unread
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* Subject + Time */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-slate-900 mb-1">{selectedMessage.subject}</h4>
                <p className="text-xs text-slate-500">{selectedMessage.time}</p>
              </div>

              {/* Body */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedMessage.body}
              </div>

              {/* Attachments */}
              {selectedMessage.attachments.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-medium text-slate-500 mb-2">📎 Attachments</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMessage.attachments.map((att) => (
                      <div
                        key={att}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-indigo-100"
                        onClick={() => alert(`Downloading: ${att}`)}
                      >
                        📄 {att}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleReply} className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reply to {selectedMessage.from}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full h-24 px-4 py-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    📤 Send Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyText("")}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>

      {/* ✅ Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">✏️ New Message</h3>
              <button onClick={() => setShowCompose(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <form onSubmit={handleCompose} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">To</label>
                <input
                  type="email"
                  value={composeForm.to}
                  onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                  placeholder="author@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  value={composeForm.body}
                  onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                  className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}