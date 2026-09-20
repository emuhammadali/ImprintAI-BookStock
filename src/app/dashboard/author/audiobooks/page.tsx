"use client";

import { Card } from "@/components/ui/cards";

const CHAPTERS = [
  { num: 1, title: "The Beginning", duration: "12:34", status: "completed", voice: "Sarah (Narrator)" },
  { num: 2, title: "First Light", duration: "15:21", status: "completed", voice: "Sarah (Narrator)" },
  { num: 3, title: "Breach", duration: "11:08", status: "completed", voice: "Sarah (Narrator)" },
  { num: 4, title: "Convergence", duration: "14:55", status: "processing", voice: "Sarah (Narrator)" },
  { num: 5, title: "The Signal", duration: "13:30", status: "pending", voice: "Marcus (Male, Deep)" },
  { num: 6, title: "Descent", duration: "16:42", status: "pending", voice: "Sarah (Narrator)" },
];

const VOICE_PROFILES = [
  { id: "sarah", name: "Sarah", type: "Narrator", gender: "Female", tone: "Warm, authoritative", lang: "English" },
  { id: "marcus", name: "Marcus", type: "Character", gender: "Male", tone: "Deep, resonant", lang: "English" },
  { id: "gardener", name: "The Gardener", type: "Character", gender: "Neutral", tone: "Ethereal, whispery", lang: "English (with alien accent)" },
];

export default function AudiobooksPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        🎧 Audiobook Studio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">6</div>
            <div className="text-sm text-slate-500">Total Chapters</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">3</div>
            <div className="text-sm text-slate-500">Completed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">1h 24m</div>
            <div className="text-sm text-slate-500">Total Duration</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapter List */}
        <div className="lg:col-span-2">
          <Card title="Chapters">
            <div className="space-y-2">
              {CHAPTERS.map((ch) => (
                <div key={ch.num} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                    {ch.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900">{ch.title}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">🎙️ {ch.voice}</span>
                      <span className="text-xs text-slate-400">⏱️ {ch.duration}</span>
                    </div>
                    {/* Waveform visualization */}
                    <div className="flex items-end gap-0.5 h-8 mt-2">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full ${
                            ch.status === "completed" ? "bg-emerald-400" : ch.status === "processing" ? "bg-amber-400" : "bg-slate-200"
                          }`}
                          style={{ height: `${Math.random() * 24 + 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ch.status === "completed" ? (
                      <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100">
                        ▶ Play
                      </button>
                    ) : ch.status === "processing" ? (
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium">
                        ⏳ Processing...
                      </span>
                    ) : (
                      <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100">
                        Generate
                      </button>
                    )}
                    <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100">
                      🔄 Redo
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              🎙️ Generate All Remaining Chapters
            </button>
          </Card>
        </div>

        {/* Voice Configuration */}
        <div className="space-y-4">
          <Card title="Voice Profiles">
            <div className="space-y-3">
              {VOICE_PROFILES.map((voice) => (
                <div key={voice.id} className="p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-slate-900">{voice.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{voice.type}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    <div>{voice.gender} • {voice.tone}</div>
                    <div>{voice.lang}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              + Add Voice Profile
            </button>
          </Card>

          <Card title="Export Options">
            <div className="space-y-2">
              {["MP3", "M4B (Audiobook)", "WAV"].map((format) => (
                <button key={format} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 text-left transition-colors">
                  Export as {format}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Emotion Tags">
            <div className="flex flex-wrap gap-2">
              {["whisper", "tense", "laugh", "pause", "gasp", "sigh", "shout", "cry"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full cursor-pointer hover:bg-purple-100">
                  [{tag}]
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Insert tags in your manuscript to add emotional nuance to the narration.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}