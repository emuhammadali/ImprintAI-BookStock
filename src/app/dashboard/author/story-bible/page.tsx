"use client";

import { useState, useMemo } from "react";
import { Card, KpiCard } from "@/components/ui/cards";

const INITIAL_CHARACTERS = [
  { id: "1", name: "Dr. Elara Voss", age: "34", desc: "Tall, athletic build. Short auburn hair often tucked behind her ears. Green eyes with flecks of gold.", personality: "Brilliant, methodical, deeply empathetic but struggles with vulnerability. Tends to over-explain scientific concepts.", arc: "Begins as a cautious researcher; transforms into a bold explorer willing to risk everything for discovery.", relationships: "Colleague and romantic tension with Marcus; estranged from father; mentored by Dr. Okonkwo", firstCh: "Ch. 1", lastCh: "Ch. 15", approved: true },
  { id: "2", name: "Marcus Chen", age: "31", desc: "Blue eyes, lean build, always wears a worn leather journal on his belt.", personality: "Charming, impulsive, secretly insecure. Uses humor as defense mechanism.", arc: "Supports Elara's journey while confronting his own fear of failure.", relationships: "Elara's field partner; brother to Mei Chen; owes debt to consortium", firstCh: "Ch. 1", lastCh: "Ch. 14", approved: true },
  { id: "3", name: "The Gardener", age: "Unknown", desc: "Shifting form, approximately 2m tall. Bioluminescent patterns across translucent skin.", personality: "Ancient, patient, speaks in metaphors. Views humans as 'young seeds'.", arc: "Antagonist-ally: guards the quantum garden but gradually reveals its secrets.", relationships: "Connected to the garden ecosystem; distrusts Marcus", firstCh: "Ch. 5", lastCh: "Ch. 15", approved: false },
];

const INITIAL_WORLD_FACTS = [
  { id: "1", category: "Science", fact: "Quantum gardens exist on planets with extreme magnetic fields", source: "Ch. 2", approved: true },
  { id: "2", category: "Science", fact: "FTL travel takes 17 minutes per light-year via quantum tunneling", source: "Ch. 1", approved: true },
  { id: "3", category: "Culture", fact: "The Gardener's species communicates through bioluminescent patterns", source: "Ch. 5", approved: true },
  { id: "4", category: "History", fact: "Earth's first quantum garden discovery was in 2147 on Kepler-442b", source: "Ch. 3", approved: false },
  { id: "5", category: "Technology", fact: "Bio-suits auto-adapt to alien atmospheres within 30 seconds", source: "Ch. 1", approved: true },
];

const INITIAL_TIMELINE = [
  { id: "1", event: "Mission launch from Earth Orbital Station", chapter: "Ch. 1", seq: 1, approved: true },
  { id: "2", event: "Arrival at destination planet", chapter: "Ch. 2", seq: 2, approved: true },
  { id: "3", event: "First contact with The Gardener", chapter: "Ch. 5", seq: 3, approved: true },
  { id: "4", event: "Marcus discovers the light-helix formation", chapter: "Ch. 12", seq: 4, approved: false },
  { id: "5", event: "Quantum garden destabilization begins", chapter: "Ch. 14", seq: 5, approved: false },
];

const INITIAL_CONTRADICTIONS = [
  { id: "1", title: "Eye Color Inconsistency", severity: "Critical", description: "Marcus Chen's eye color changes between chapters. In Chapter 3, his eyes are described as 'blue', but in Chapter 12 they are 'green'. The Story Bible records his eye color as blue.", chapter: "Ch. 12", resolved: false },
];

const CATEGORIES = ["Science", "Culture", "History", "Technology", "Geography", "Politics"];

export default function StoryBiblePage() {
  const [activeSection, setActiveSection] = useState("characters");
  const [characters, setCharacters] = useState(INITIAL_CHARACTERS);
  const [worldFacts, setWorldFacts] = useState(INITIAL_WORLD_FACTS);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [contradictions, setContradictions] = useState(INITIAL_CONTRADICTIONS);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Forms
  const [characterForm, setCharacterForm] = useState({
    name: "", age: "", desc: "", personality: "", arc: "", relationships: "", firstCh: "", lastCh: "",
  });
  const [factForm, setFactForm] = useState({ category: "Science", fact: "", source: "" });
  const [timelineForm, setTimelineForm] = useState({ event: "", chapter: "" });

  const sections = [
    { key: "characters", label: "Characters", icon: "👤", count: characters.length },
    { key: "world", label: "World Facts", icon: "🌍", count: worldFacts.length },
    { key: "timeline", label: "Timeline", icon: "📅", count: timeline.length },
    { key: "contradictions", label: "Contradictions", icon: "⚠️", count: contradictions.filter((c) => !c.resolved).length },
  ];

  // ✅ Filtered by search
  const filteredCharacters = useMemo(() => {
    if (!searchQuery) return characters;
    const q = searchQuery.toLowerCase();
    return characters.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.personality.toLowerCase().includes(q)
    );
  }, [characters, searchQuery]);

  const filteredFacts = useMemo(() => {
    if (!searchQuery) return worldFacts;
    const q = searchQuery.toLowerCase();
    return worldFacts.filter((f) =>
      f.fact.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  }, [worldFacts, searchQuery]);

  const filteredTimeline = useMemo(() => {
    if (!searchQuery) return timeline;
    const q = searchQuery.toLowerCase();
    return timeline.filter((t) => t.event.toLowerCase().includes(q));
  }, [timeline, searchQuery]);

  // ✅ Approve/Unapprove
  function toggleCharacterApproval(id: string) {
    setCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, approved: !c.approved } : c)));
  }

  function toggleFactApproval(id: string) {
    setWorldFacts((prev) => prev.map((f) => (f.id === id ? { ...f, approved: !f.approved } : f)));
  }

  function toggleTimelineApproval(id: string) {
    setTimeline((prev) => prev.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t)));
  }

  // ✅ Delete
  function deleteCharacter(id: string) {
    if (!confirm("Delete this character?")) return;
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }

  function deleteFact(id: string) {
    if (!confirm("Delete this fact?")) return;
    setWorldFacts((prev) => prev.filter((f) => f.id !== id));
  }

  function deleteTimeline(id: string) {
    if (!confirm("Delete this timeline event?")) return;
    setTimeline((prev) => prev.filter((t) => t.id !== id));
  }

  // ✅ Add new
  function handleAddCharacter(e: React.FormEvent) {
    e.preventDefault();
    const newChar = { id: String(characters.length + 1), ...characterForm, approved: false };
    setCharacters([...characters, newChar]);
    setShowAddModal(false);
    setCharacterForm({ name: "", age: "", desc: "", personality: "", arc: "", relationships: "", firstCh: "", lastCh: "" });
  }

  function handleAddFact(e: React.FormEvent) {
    e.preventDefault();
    const newFact = { id: String(worldFacts.length + 1), ...factForm, approved: false };
    setWorldFacts([...worldFacts, newFact]);
    setShowAddModal(false);
    setFactForm({ category: "Science", fact: "", source: "" });
  }

  function handleAddTimeline(e: React.FormEvent) {
    e.preventDefault();
    const newEvent = { id: String(timeline.length + 1), ...timelineForm, seq: timeline.length + 1, approved: false };
    setTimeline([...timeline, newEvent]);
    setShowAddModal(false);
    setTimelineForm({ event: "", chapter: "" });
  }

  // ✅ Edit
  function openEdit(item: any) {
    setSelectedItem(item);
    if (activeSection === "characters") {
      setCharacterForm({
        name: item.name, age: item.age, desc: item.desc, personality: item.personality,
        arc: item.arc, relationships: item.relationships, firstCh: item.firstCh, lastCh: item.lastCh,
      });
    } else if (activeSection === "world") {
      setFactForm({ category: item.category, fact: item.fact, source: item.source });
    } else if (activeSection === "timeline") {
      setTimelineForm({ event: item.event, chapter: item.chapter });
    }
    setShowEditModal(true);
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem) return;

    if (activeSection === "characters") {
      setCharacters((prev) => prev.map((c) => (c.id === selectedItem.id ? { ...c, ...characterForm } : c)));
    } else if (activeSection === "world") {
      setWorldFacts((prev) => prev.map((f) => (f.id === selectedItem.id ? { ...f, ...factForm } : f)));
    } else if (activeSection === "timeline") {
      setTimeline((prev) => prev.map((t) => (t.id === selectedItem.id ? { ...t, ...timelineForm } : t)));
    }
    setShowEditModal(false);
  }

  // ✅ Fix contradiction
  function fixContradiction(id: string, action: "fix" | "update") {
    const c = contradictions.find((x) => x.id === id);
    if (!c) return;

    if (action === "fix") {
      alert(`✅ Fixing "${c.title}" in ${c.chapter}...\n\nThe manuscript will be updated.`);
    } else {
      alert(`✅ Story Bible updated.\n\nThe recorded value has been changed to match Chapter 12.`);
    }
    setContradictions((prev) => prev.map((x) => (x.id === id ? { ...x, resolved: true } : x)));
  }

  function viewContradiction(c: any) {
    setSelectedItem(c);
    setShowDetailModal(true);
  }

  // ✅ Export
  function exportStoryBible() {
    const report = `
═══════════════════════════════════════════
        LIVING STORY BIBLE
═══════════════════════════════════════════

─── CHARACTERS (${characters.length}) ─────────
${characters.map((c) => `• ${c.name} (Age: ${c.age}) [${c.approved ? "✓" : "⏳"}]
  ${c.desc}
  Personality: ${c.personality}
  Arc: ${c.arc}
  Relationships: ${c.relationships}
  Appears: ${c.firstCh} → ${c.lastCh}`).join("\n\n")}

─── WORLD FACTS (${worldFacts.length}) ────────
${worldFacts.map((f) => `• [${f.category}] ${f.fact} (${f.source}) ${f.approved ? "✓" : "⏳"}`).join("\n")}

─── TIMELINE (${timeline.length}) ─────────────
${timeline.map((t) => `${t.seq}. ${t.event} (${t.chapter}) ${t.approved ? "✓" : "⏳"}`).join("\n")}

─── CONTRADICTIONS (${contradictions.filter((c) => !c.resolved).length} unresolved) ──
${contradictions.map((c) => `• [${c.severity}] ${c.title}\n  ${c.description}`).join("\n\n")}

═══════════════════════════════════════════
Generated: ${new Date().toLocaleString()}
═══════════════════════════════════════════
`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `story-bible-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleAddClick() {
    setShowAddModal(true);
  }

  const unresolvedContradictions = contradictions.filter((c) => !c.resolved).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">Living Story Bible</h2>
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
            Auto-extracted by AI
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportStoryBible}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
          >
            📥 Export
          </button>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            + Add {activeSection === "characters" ? "Character" : activeSection === "world" ? "Fact" : activeSection === "timeline" ? "Event" : ""}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Characters" value={characters.length.toString()} icon="👤" color="indigo" />
        <KpiCard title="World Facts" value={worldFacts.length.toString()} icon="🌍" color="blue" />
        <KpiCard title="Timeline Events" value={timeline.length.toString()} icon="📅" color="purple" />
        <KpiCard
          title="Unresolved Contradictions"
          value={unresolvedContradictions.toString()}
          icon="⚠️"
          color={unresolvedContradictions > 0 ? "red" : "green"}
        />
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search characters, facts, or events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Section Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => { setActiveSection(s.key); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              activeSection === s.key
                ? "bg-white shadow-sm border border-slate-200 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              activeSection === s.key ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
            }`}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Characters */}
      {activeSection === "characters" && (
        filteredCharacters.length === 0 ? (
          <Card><div className="text-center py-12 text-slate-400">No characters found</div></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharacters.map((char) => (
              <Card key={char.id} className="card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{char.name}</h3>
                    <span className="text-sm text-slate-500">Age: {char.age}</span>
                  </div>
                  {char.approved ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">✓ Approved</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Pending</span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium text-slate-700">Appearance: </span><span className="text-slate-600 line-clamp-2">{char.desc}</span></div>
                  <div><span className="font-medium text-slate-700">Personality: </span><span className="text-slate-600 line-clamp-2">{char.personality}</span></div>
                  <div><span className="font-medium text-slate-700">Arc: </span><span className="text-slate-600 line-clamp-2">{char.arc}</span></div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">{char.firstCh} → {char.lastCh}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleCharacterApproval(char.id)}
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        char.approved
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {char.approved ? "Unapprove" : "Approve"}
                    </button>
                    <button
                      onClick={() => openEdit(char)}
                      className="px-2 py-1 border border-slate-200 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCharacter(char.id)}
                      className="px-2 py-1 border border-red-200 text-red-600 rounded-md text-xs font-medium hover:bg-red-50"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* World Facts */}
      {activeSection === "world" && (
        <Card>
          {filteredFacts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No facts found</div>
          ) : (
            <div className="space-y-3">
              {filteredFacts.map((fact) => (
                <div key={fact.id} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-24 flex-shrink-0">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{fact.category}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{fact.fact}</p>
                    <p className="text-xs text-slate-400 mt-1">Source: {fact.source}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFactApproval(fact.id)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        fact.approved ? "text-emerald-600" : "bg-emerald-600 text-white"
                      }`}
                    >
                      {fact.approved ? "✓" : "Approve"}
                    </button>
                    <button
                      onClick={() => openEdit(fact)}
                      className="px-2 py-1 border border-slate-200 text-slate-600 rounded text-xs hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFact(fact.id)}
                      className="px-2 py-1 border border-red-200 text-red-600 rounded text-xs hover:bg-red-50"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Timeline */}
      {activeSection === "timeline" && (
        <Card>
          {filteredTimeline.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No events found</div>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
              <div className="space-y-6">
                {filteredTimeline.map((event) => (
                  <div key={event.id} className="relative flex items-start gap-4 pl-14">
                    <div className={`absolute left-4 w-5 h-5 rounded-full bg-white border-2 ${event.approved ? "border-emerald-500" : "border-indigo-500"} z-10`} />
                    <div className="flex-1 p-4 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-slate-900">{event.event}</p>
                        <span className="text-xs text-slate-400">{event.chapter}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => toggleTimelineApproval(event.id)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            event.approved ? "bg-slate-100 text-slate-600" : "bg-emerald-600 text-white"
                          }`}
                        >
                          {event.approved ? "Unapprove" : "Approve"}
                        </button>
                        <button
                          onClick={() => openEdit(event)}
                          className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTimeline(event.id)}
                          className="px-3 py-1 border border-red-200 text-red-600 rounded text-xs hover:bg-red-50"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Contradictions */}
      {activeSection === "contradictions" && (
        <Card title={`⚠️ Contradiction Alerts (${unresolvedContradictions} unresolved)`}>
          {contradictions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="text-4xl mb-2">✅</div>
              <p>No contradictions found. Great job!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contradictions.map((c) => (
                <div key={c.id} className={`border-l-4 ${c.resolved ? "border-l-emerald-500 bg-emerald-50" : "border-l-red-500 bg-red-50"} rounded-r-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-medium text-sm ${c.resolved ? "text-emerald-800" : "text-red-800"}`}>{c.title}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${c.resolved ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {c.resolved ? "✓ Resolved" : c.severity}
                    </span>
                  </div>
                  <p className={`text-sm ${c.resolved ? "text-emerald-700" : "text-red-700"}`}>{c.description}</p>
                  {!c.resolved && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => fixContradiction(c.id, "fix")}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700"
                      >
                        Fix in {c.chapter}
                      </button>
                      <button
                        onClick={() => fixContradiction(c.id, "update")}
                        className="px-3 py-1.5 border border-red-200 text-red-700 rounded-md text-xs font-medium bg-white hover:bg-red-100"
                      >
                        Update Story Bible
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ✅ Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Add {activeSection === "characters" ? "Character" : activeSection === "world" ? "World Fact" : "Timeline Event"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            {activeSection === "characters" && (
              <form onSubmit={handleAddCharacter} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                  <input type="text" value={characterForm.name} onChange={(e) => setCharacterForm({ ...characterForm, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
                  <input type="text" value={characterForm.age} onChange={(e) => setCharacterForm({ ...characterForm, age: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Appearance</label>
                  <textarea value={characterForm.desc} onChange={(e) => setCharacterForm({ ...characterForm, desc: e.target.value })} className="w-full h-20 px-4 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Personality</label>
                  <textarea value={characterForm.personality} onChange={(e) => setCharacterForm({ ...characterForm, personality: e.target.value })} className="w-full h-20 px-4 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First Chapter</label>
                    <input type="text" value={characterForm.firstCh} onChange={(e) => setCharacterForm({ ...characterForm, firstCh: e.target.value })} placeholder="Ch. 1" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Chapter</label>
                    <input type="text" value={characterForm.lastCh} onChange={(e) => setCharacterForm({ ...characterForm, lastCh: e.target.value })} placeholder="Ch. 15" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Add Character</button>
                </div>
              </form>
            )}

            {activeSection === "world" && (
              <form onSubmit={handleAddFact} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                  <select value={factForm.category} onChange={(e) => setFactForm({ ...factForm, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Fact</label>
                  <textarea value={factForm.fact} onChange={(e) => setFactForm({ ...factForm, fact: e.target.value })} className="w-full h-24 px-4 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Source Chapter</label>
                  <input type="text" value={factForm.source} onChange={(e) => setFactForm({ ...factForm, source: e.target.value })} placeholder="Ch. 5" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Add Fact</button>
                </div>
              </form>
            )}

            {activeSection === "timeline" && (
              <form onSubmit={handleAddTimeline} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Event</label>
                  <input type="text" value={timelineForm.event} onChange={(e) => setTimelineForm({ ...timelineForm, event: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Chapter</label>
                  <input type="text" value={timelineForm.chapter} onChange={(e) => setTimelineForm({ ...timelineForm, chapter: e.target.value })} placeholder="Ch. 6" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Add Event</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit {activeSection === "characters" ? "Character" : activeSection === "world" ? "Fact" : "Event"}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            {activeSection === "characters" && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                  <input type="text" value={characterForm.name} onChange={(e) => setCharacterForm({ ...characterForm, name: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
                  <input type="text" value={characterForm.age} onChange={(e) => setCharacterForm({ ...characterForm, age: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Appearance</label>
                  <textarea value={characterForm.desc} onChange={(e) => setCharacterForm({ ...characterForm, desc: e.target.value })} className="w-full h-20 px-4 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Save</button>
                </div>
              </form>
            )}

            {activeSection === "world" && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                  <select value={factForm.category} onChange={(e) => setFactForm({ ...factForm, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Fact</label>
                  <textarea value={factForm.fact} onChange={(e) => setFactForm({ ...factForm, fact: e.target.value })} className="w-full h-24 px-4 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Save</button>
                </div>
              </form>
            )}

            {activeSection === "timeline" && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Event</label>
                  <input type="text" value={timelineForm.event} onChange={(e) => setTimelineForm({ ...timelineForm, event: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Chapter</label>
                  <input type="text" value={timelineForm.chapter} onChange={(e) => setTimelineForm({ ...timelineForm, chapter: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Save</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}