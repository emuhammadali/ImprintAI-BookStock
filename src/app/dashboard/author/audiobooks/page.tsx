"use client";

import { useState, useMemo } from "react";
import { Card, KpiCard } from "@/components/ui/cards";

const INITIAL_CHAPTERS = [
  { num: 1, title: "The Beginning", duration: "12:34", status: "completed", voice: "Sarah (Narrator)" },
  { num: 2, title: "First Light", duration: "15:21", status: "completed", voice: "Sarah (Narrator)" },
  { num: 3, title: "Breach", duration: "11:08", status: "completed", voice: "Sarah (Narrator)" },
  { num: 4, title: "Convergence", duration: "14:55", status: "processing", voice: "Sarah (Narrator)" },
  { num: 5, title: "The Signal", duration: "13:30", status: "pending", voice: "Marcus (Male, Deep)" },
  { num: 6, title: "Descent", duration: "16:42", status: "pending", voice: "Sarah (Narrator)" },
];

const INITIAL_VOICES = [
  { id: "sarah", name: "Sarah", type: "Narrator", gender: "Female", tone: "Warm, authoritative", lang: "English" },
  { id: "marcus", name: "Marcus", type: "Character", gender: "Male", tone: "Deep, resonant", lang: "English" },
  { id: "gardener", name: "The Gardener", type: "Character", gender: "Neutral", tone: "Ethereal, whispery", lang: "English (with alien accent)" },
];

const EMOTION_TAGS = ["whisper", "tense", "laugh", "pause", "gasp", "sigh", "shout", "cry"];

// ✅ Fixed waveform (deterministic based on chapter number, not random)
function getWaveform(chapterNum: number, count = 40) {
  return Array.from({ length: count }, (_, i) => {
    const seed = (chapterNum * 7 + i * 13) % 100;
    return (seed % 24) + 4;
  });
}

export default function AudiobooksPage() {
  const [chapters, setChapters] = useState(INITIAL_CHAPTERS);
  const [voices, setVoices] = useState(INITIAL_VOICES);
  const [playingChapter, setPlayingChapter] = useState<number | null>(null);
  const [showAddVoiceModal, setShowAddVoiceModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("MP3");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const [newVoice, setNewVoice] = useState({
    name: "",
    type: "Character",
    gender: "Female",
    tone: "",
    lang: "English",
  });

  // ✅ Dynamic KPIs
  const totalChapters = chapters.length;
  const completed = chapters.filter((c) => c.status === "completed").length;
  const processing = chapters.filter((c) => c.status === "processing").length;
  const pending = chapters.filter((c) => c.status === "pending").length;

  // Parse duration to minutes
  const totalMinutes = useMemo(() => {
    return chapters
      .filter((c) => c.status === "completed")
      .reduce((sum, c) => {
        const [m, s] = c.duration.split(":").map(Number);
        return sum + m + s / 60;
      }, 0);
  }, [chapters]);

  const totalDuration = `${Math.floor(totalMinutes / 60)}h ${Math.round(totalMinutes % 60)}m`;

  // ✅ Play/Pause
  function togglePlay(chapterNum: number) {
    if (playingChapter === chapterNum) {
      setPlayingChapter(null);
      alert(`⏸ Paused chapter ${chapterNum}`);
    } else {
      setPlayingChapter(chapterNum);
      alert(`▶ Now playing chapter ${chapterNum}`);
      // Simulate auto-stop after 3 seconds
      setTimeout(() => setPlayingChapter(null), 3000);
    }
  }

  // ✅ Generate chapter
  function generateChapter(chapterNum: number) {
    setChapters((prev) =>
      prev.map((c) => (c.num === chapterNum ? { ...c, status: "processing" } : c))
    );
    // Simulate processing complete after 3 seconds
    setTimeout(() => {
      setChapters((prev) =>
        prev.map((c) => (c.num === chapterNum ? { ...c, status: "completed" } : c))
      );
    }, 3000);
  }

  // ✅ Redo chapter
  function redoChapter(chapterNum: number) {
    if (!confirm(`Redo chapter ${chapterNum}? This will regenerate the audio.`)) return;
    setChapters((prev) =>
      prev.map((c) => (c.num === chapterNum ? { ...c, status: "processing" } : c))
    );
    setTimeout(() => {
      setChapters((prev) =>
        prev.map((c) => (c.num === chapterNum ? { ...c, status: "completed" } : c))
      );
    }, 3000);
  }

  // ✅ Generate All Remaining
  function generateAll() {
    if (pending === 0 && processing === 0) {
      alert("✅ No chapters to generate. All done!");
      return;
    }
    if (!confirm(`Generate ${pending} pending chapter(s)?`)) return;
    setChapters((prev) =>
      prev.map((c) => (c.status === "pending" ? { ...c, status: "processing" } : c))
    );
    setTimeout(() => {
      setChapters((prev) =>
        prev.map((c) => (c.status === "processing" ? { ...c, status: "completed" } : c))
      );
    }, 4000);
  }

  // ✅ Add Voice Profile
  function handleAddVoice(e: React.FormEvent) {
    e.preventDefault();
    const voice = {
      id: newVoice.name.toLowerCase().replace(/\s+/g, "-"),
      ...newVoice,
    };
    setVoices([...voices, voice]);
    setShowAddVoiceModal(false);
    setNewVoice({ name: "", type: "Character", gender: "Female", tone: "", lang: "English" });
  }

  // ✅ Export
  function handleExport(format: string) {
    setExportFormat(format);
    setShowExportModal(true);
  }

  function confirmExport(e: React.FormEvent) {
    e.preventDefault();
    setTimeout(() => {
      setShowExportModal(false);
      alert(`✅ Export started!\n\nFormat: ${exportFormat}\n\nDownload link will be emailed to you when ready.`);
    }, 500);
  }

  // ✅ Copy emotion tag
  function copyTag(tag: string) {
    navigator.clipboard.writeText(`[${tag}]`);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">🎧 Audiobook Studio</h2>
        <button
          onClick={generateAll}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          🎙️ Generate All Remaining
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Chapters" value={totalChapters.toString()} icon="📖" color="indigo" />
        <KpiCard title="Completed" value={completed.toString()} icon="✅" color="green" />
        <KpiCard title="In Progress" value={processing.toString()} icon="⏳" color="amber" />
        <KpiCard title="Total Duration" value={totalDuration} icon="⏱️" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chapter List */}
        <div className="lg:col-span-2">
          <Card title={`Chapters (${completed}/${totalChapters} complete)`}>
            <div className="space-y-2">
              {chapters.map((ch) => {
                const isPlaying = playingChapter === ch.num;
                return (
                  <div
                    key={ch.num}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      isPlaying ? "border-indigo-300 bg-indigo-50" : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                      {ch.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-slate-900">{ch.title}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">🎙️ {ch.voice}</span>
                        <span className="text-xs text-slate-400">⏱️ {ch.duration}</span>
                      </div>
                      {/* Fixed waveform */}
                      <div className="flex items-end gap-0.5 h-8 mt-2">
                        {getWaveform(ch.num).map((height, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              ch.status === "completed"
                                ? isPlaying ? "bg-indigo-500" : "bg-emerald-400"
                                : ch.status === "processing"
                                ? "bg-amber-400 animate-pulse"
                                : "bg-slate-200"
                            }`}
                            style={{ height: `${height}px` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {ch.status === "completed" && (
                        <button
                          onClick={() => togglePlay(ch.num)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            isPlaying
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                          }`}
                        >
                          {isPlaying ? "⏸ Pause" : "▶ Play"}
                        </button>
                      )}
                      {ch.status === "processing" && (
                        <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium">
                          ⏳ Processing...
                        </span>
                      )}
                      {ch.status === "pending" && (
                        <button
                          onClick={() => generateChapter(ch.num)}
                          className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100"
                        >
                          Generate
                        </button>
                      )}
                      {ch.status !== "processing" && (
                        <button
                          onClick={() => redoChapter(ch.num)}
                          className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100"
                        >
                          🔄 Redo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Card title={`Voice Profiles (${voices.length})`}>
            <div className="space-y-3">
              {voices.map((voice) => (
                <div key={voice.id} className="p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-slate-900">{voice.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      {voice.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    <div>{voice.gender} • {voice.tone}</div>
                    <div>{voice.lang}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAddVoiceModal(true)}
              className="w-full mt-3 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              + Add Voice Profile
            </button>
          </Card>

          <Card title="Export Options">
            <div className="space-y-2">
              {["MP3", "M4B (Audiobook)", "WAV"].map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  disabled={completed === 0}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 text-left transition-colors disabled:opacity-50"
                >
                  Export as {format}
                </button>
              ))}
              {completed === 0 && (
                <p className="text-xs text-amber-600 mt-2">Complete at least one chapter to export</p>
              )}
            </div>
          </Card>

          <Card title="Emotion Tags">
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => copyTag(tag)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    copiedTag === tag
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  }`}
                >
                  {copiedTag === tag ? "✓ Copied!" : `[${tag}]`}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Click a tag to copy it. Insert in your manuscript for emotional nuance.
            </p>
          </Card>
        </div>
      </div>

      {/* ✅ Add Voice Modal */}
      {showAddVoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add Voice Profile</h3>
              <button onClick={() => setShowAddVoiceModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <form onSubmit={handleAddVoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Voice Name</label>
                <input
                  type="text"
                  value={newVoice.name}
                  onChange={(e) => setNewVoice({ ...newVoice, name: e.target.value })}
                  placeholder="e.g., Elena"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                  <select
                    value={newVoice.type}
                    onChange={(e) => setNewVoice({ ...newVoice, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Narrator</option>
                    <option>Character</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                  <select
                    value={newVoice.gender}
                    onChange={(e) => setNewVoice({ ...newVoice, gender: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Neutral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tone Description</label>
                <input
                  type="text"
                  value={newVoice.tone}
                  onChange={(e) => setNewVoice({ ...newVoice, tone: e.target.value })}
                  placeholder="e.g., Warm, gentle"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Language</label>
                <input
                  type="text"
                  value={newVoice.lang}
                  onChange={(e) => setNewVoice({ ...newVoice, lang: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVoiceModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Add Voice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Export Audiobook</h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <div className="text-xs text-indigo-600 mb-1">Export Format</div>
              <div className="font-bold text-indigo-700 text-lg">{exportFormat}</div>
            </div>

            <div className="space-y-3 mb-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Include chapter metadata</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Normalize audio levels</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Add intro/outro music</span>
              </label>
            </div>

            <form onSubmit={confirmExport}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Start Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}