"use client";

import { useState } from "react";
import { Card, StatusBadge } from "@/components/ui/cards";

const CHARACTERS = [
  {
    id: "1",
    name: "Dr. Elara Voss",
    age: "34",
    desc: "Tall, athletic build. Short auburn hair often tucked behind her ears. Green eyes with flecks of gold.",
    personality: "Brilliant, methodical, deeply empathetic but struggles with vulnerability. Tends to over-explain scientific concepts.",
    arc: "Begins as a cautious researcher; transforms into a bold explorer willing to risk everything for discovery.",
    relationships: "Colleague and romantic tension with Marcus; estranged from father; mentored by Dr. Okonkwo",
    firstCh: "Ch. 1",
    lastCh: "Ch. 15",
    approved: true,
  },
  {
    id: "2",
    name: "Marcus Chen",
    age: "31",
    desc: "Blue eyes (⚠️ continuity flag in Ch.12), lean build, always wears a worn leather journal on his belt.",
    personality: "Charming, impulsive, secretly insecure. Uses humor as defense mechanism.",
    arc: "Supports Elara's journey while confronting his own fear of failure.",
    relationships: "Elara's field partner; brother to Mei Chen; owes debt to consortium",
    firstCh: "Ch. 1",
    lastCh: "Ch. 14",
    approved: true,
  },
  {
    id: "3",
    name: "The Gardener",
    age: "Unknown",
    desc: "Shifting form, approximately 2m tall. Bioluminescent patterns across translucent skin.",
    personality: "Ancient, patient, speaks in metaphors. Views humans as 'young seeds'.",
    arc: "Antagonist-ally: guards the quantum garden but gradually reveals its secrets.",
    relationships: "Connected to the garden ecosystem; distrusts Marcus",
    firstCh: "Ch. 5",
    lastCh: "Ch. 15",
    approved: false,
  },
];

const WORLD_FACTS = [
  { id: "1", category: "Science", fact: "Quantum gardens exist on planets with extreme magnetic fields", source: "Ch. 2", approved: true },
  { id: "2", category: "Science", fact: "FTL travel takes 17 minutes per light-year via quantum tunneling", source: "Ch. 1", approved: true },
  { id: "3", category: "Culture", fact: "The Gardener's species communicates through bioluminescent patterns", source: "Ch. 5", approved: true },
  { id: "4", category: "History", fact: "Earth's first quantum garden discovery was in 2147 on Kepler-442b", source: "Ch. 3", approved: false },
  { id: "5", category: "Technology", fact: "Bio-suits auto-adapt to alien atmospheres within 30 seconds", source: "Ch. 1", approved: true },
];

const TIMELINE = [
  { id: "1", event: "Mission launch from Earth Orbital Station", chapter: "Ch. 1", seq: 1, approved: true },
  { id: "2", event: "Arrival at destination planet", chapter: "Ch. 2", seq: 2, approved: true },
  { id: "3", event: "First contact with The Gardener", chapter: "Ch. 5", seq: 3, approved: true },
  { id: "4", event: "Marcus discovers the light-helix formation", chapter: "Ch. 12", seq: 4, approved: false },
  { id: "5", event: "Quantum garden destabilization begins", chapter: "Ch. 14", seq: 5, approved: false },
];

export default function StoryBiblePage() {
  const [activeSection, setActiveSection] = useState("characters");

  const sections = [
    { key: "characters", label: "Characters", icon: "👤", count: CHARACTERS.length },
    { key: "world", label: "World Facts", icon: "🌍", count: WORLD_FACTS.length },
    { key: "timeline", label: "Timeline", icon: "📅", count: TIMELINE.length },
    { key: "contradictions", label: "Contradictions", icon: "⚠️", count: 1 },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Living Story Bible
        </h2>
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
          Auto-extracted by AI
        </span>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
              activeSection === s.key
                ? "bg-white shadow-sm border border-slate-200 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeSection === s.key
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Characters */}
      {activeSection === "characters" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHARACTERS.map((char) => (
            <Card key={char.id} className="card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{char.name}</h3>
                  <span className="text-sm text-slate-500">Age: {char.age}</span>
                </div>
                {char.approved ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                    ✓ Approved
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                    Pending
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Appearance: </span>
                  <span className="text-slate-600">{char.desc}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Personality: </span>
                  <span className="text-slate-600">{char.personality}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Arc: </span>
                  <span className="text-slate-600">{char.arc}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Relationships: </span>
                  <span className="text-slate-600">{char.relationships}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                <span>
                  {char.firstCh} → {char.lastCh}
                </span>
                {!char.approved && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-medium hover:bg-emerald-700">
                      Approve
                    </button>
                    <button className="px-3 py-1 border border-slate-200 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-50">
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* World Facts */}
      {activeSection === "world" && (
        <Card>
          <div className="space-y-3">
            {WORLD_FACTS.map((fact) => (
              <div
                key={fact.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="w-20 flex-shrink-0">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    {fact.category}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{fact.fact}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Source: {fact.source}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {fact.approved ? (
                    <span className="text-emerald-600 text-xs font-medium">
                      ✓
                    </span>
                  ) : (
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-emerald-600 text-white rounded text-xs">
                        ✓
                      </button>
                      <button className="px-2 py-1 border border-slate-200 text-red-600 rounded text-xs">
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      {activeSection === "timeline" && (
        <Card>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
            <div className="space-y-6">
              {TIMELINE.map((event) => (
                <div key={event.id} className="relative flex items-start gap-4 pl-14">
                  <div className="absolute left-4 w-5 h-5 rounded-full bg-white border-2 border-indigo-500 z-10" />
                  <div className="flex-1 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-slate-900">
                        {event.event}
                      </p>
                      <span className="text-xs text-slate-400">
                        {event.chapter}
                      </span>
                    </div>
                    {!event.approved && (
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1 bg-emerald-600 text-white rounded text-xs">
                          Approve
                        </button>
                        <button className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-xs">
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Contradictions */}
      {activeSection === "contradictions" && (
        <Card title="⚠️ Contradiction Alerts">
          <div className="space-y-4">
            <div className="border-l-4 border-l-red-500 bg-red-50 rounded-r-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-red-800 text-sm">
                  Eye Color Inconsistency
                </span>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                  Critical
                </span>
              </div>
              <p className="text-sm text-red-700">
                Marcus Chen&apos;s eye color changes between chapters. In Chapter 3,
                his eyes are described as <strong>&quot;blue&quot;</strong>, but in
                Chapter 12 they are <strong>&quot;green&quot;</strong>. The Story Bible
                records his eye color as blue.
              </p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-medium">
                  Fix in Ch. 12
                </button>
                <button className="px-3 py-1.5 border border-red-200 text-red-700 rounded-md text-xs font-medium bg-white">
                  Update Story Bible
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}