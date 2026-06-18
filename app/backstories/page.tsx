"use client";

import { useState, useEffect } from "react";

interface Story {
  id: string;
  name: string;
  text: string;
  bg: string;
  fg: string;
  rotate: string;
}

const NOTE_COLORS = [
  { bg: "#ffcc00", fg: "#11012e" },
  { bg: "#ff018f", fg: "#ffffff" },
  { bg: "#2a0c62", fg: "#ffcc00" },
  { bg: "#ff6dc0", fg: "#11012e" },
  { bg: "#ffe566", fg: "#11012e" },
];

const ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg", "-0.5deg", "1deg"];

const SEED_STORIES: Story[] = [
  {
    id: "s1",
    name: "Maximilian",
    text: "57 years old, VW engineer for 29 years. Lives alone after his children moved out and his wife passed away five years ago. The idea of retirement terrified him — being completely alone with nothing to look forward to. He found Third Home by accident through a co-worker who had been to a dinner and game night. He started showing up on weekends. A Keeper noticed how consistent he was and invited him to become a member. Two months later he was offered a Keeper role. He moved in. He now manages the finances, gives story times to kids every week, and does the gardening two or three mornings a week when the city is still quiet.",
    bg: "#ffcc00",
    fg: "#11012e",
    rotate: "-2deg",
  },
  {
    id: "s2",
    name: "Julian & Sarah",
    text: "A couple from Hanover, together four years, thinking about starting a family. Sarah commutes daily to VW — expensive and exhausting. Julian found Third Home in a student essay. They came for an Easter event — egg hunts, live bands on the rooftop — and met Maximilian, who explained how it all worked. It sparked something. Two months after easter they moved in. A year later they had a child and felt genuinely held by the people around them. They now organise weekly events for other children in the community.",
    bg: "#ff018f",
    fg: "#ffffff",
    rotate: "1.5deg",
  },
  {
    id: "s3",
    name: "Anouk",
    text: "Performance artist from Paris. The library job barely covers rent and leaves no room for art. A friend who'd made a temporary installation outside Third Home said: 'It felt very wholesome and warm — light and flowy. This random small city in Germany. I'd check it out.' Anouk searched Third Home that same evening and contacted Sarah. There was space. And VW partially sponsors Third Home without having any say in decisions — so funding the art project was possible. First time Anouk could work as a full-time funded artist. They sold all their furniture on eBay and arrived two weeks later. Since then: creating, teaching, and pulling collaborators in from everywhere.",
    bg: "#2a0c62",
    fg: "#ffcc00",
    rotate: "-1deg",
  },
];

export default function BackStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then((data: Story[]) => {
        setStories([...data, ...SEED_STORIES]);
        setLoading(false);
      })
      .catch(() => {
        setStories(SEED_STORIES);
        setLoading(false);
      });
  }, []);

  async function submit() {
    if (!name.trim() || !text.trim() || submitting) return;
    setSubmitting(true);
    setSaveError(null);

    const idx = stories.length;
    const optimisticId = `u-${Date.now()}`;
    const optimistic: Story = {
      id: optimisticId,
      name: name.trim(),
      text: text.trim(),
      bg: NOTE_COLORS[idx % NOTE_COLORS.length].bg,
      fg: NOTE_COLORS[idx % NOTE_COLORS.length].fg,
      rotate: ROTATIONS[idx % ROTATIONS.length],
    };

    setStories((prev) => [optimistic, ...prev]);
    setName("");
    setText("");
    setShowForm(false);
    setSubmitting(false);

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: optimistic.name, text: optimistic.text }),
      });
      if (res.ok) {
        const saved: Story = await res.json();
        setStories((prev) => prev.map((s) => (s.id === optimisticId ? saved : s)));
      } else {
        setStories((prev) => prev.filter((s) => s.id !== optimisticId));
        const body = await res.json().catch(() => ({}));
        setSaveError(
          body.error === "KV_NOT_CONFIGURED"
            ? "The database isn't connected yet — go to your Vercel project → Storage → Connect KV to enable story saving."
            : "Couldn't save your story — please try again."
        );
      }
    } catch {
      setStories((prev) => prev.filter((s) => s.id !== optimisticId));
      setSaveError("Couldn't save your story — please try again.");
    }
  }

  async function deleteStory(id: string) {
    if (deleting) return;
    setDeleting(id);
    setStories((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/stories?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--warm-brown)" }}>
            Back Stories
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--muted)" }}>
            Everyone arrives at Third Home with a story. These are a few of them.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 shrink-0"
            style={{ background: "var(--terracotta)", color: "white" }}
          >
            + Add your story
          </button>
        )}
      </div>

      {/* Add story form */}
      {showForm && (
        <div
          className="rounded-2xl p-6 mb-10 border-2"
          style={{ background: "var(--sand)", borderColor: "var(--terracotta)" }}
        >
          <h2 className="font-semibold text-base mb-1" style={{ color: "var(--warm-brown)" }}>
            Your back story
          </h2>
          <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>
            How did you find Third Home? What brought you here? Write as much or as little as you like.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                style={{ background: "var(--cream)", borderColor: "var(--sand-dark)", color: "var(--warm-brown)" }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>
                Your story
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="How did you end up here?"
                rows={5}
                className="w-full rounded-lg px-3 py-2 text-sm border resize-none focus:outline-none"
                style={{ background: "var(--cream)", borderColor: "var(--sand-dark)", color: "var(--warm-brown)" }}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={submit}
                disabled={!name.trim() || !text.trim() || submitting}
                className="px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-40 transition-opacity hover:opacity-90"
                style={{ background: "var(--terracotta)", color: "white" }}
              >
                {submitting ? "Saving…" : "Pin my story"}
              </button>
              <button
                onClick={() => { setShowForm(false); setName(""); setText(""); }}
                className="px-5 py-2 rounded-full text-sm transition-opacity hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save error */}
      {saveError && (
        <div
          className="rounded-xl px-5 py-3 mb-6 text-sm flex items-center justify-between gap-4"
          style={{ background: "#ffe0e0", color: "#7a1a1a" }}
        >
          <span>{saveError}</span>
          <button
            onClick={() => setSaveError(null)}
            className="opacity-60 hover:opacity-100 transition-opacity font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Board */}
      <div
        className="rounded-3xl p-8 min-h-96"
        style={{ background: "var(--sand)" }}
      >
        {loading ? (
          <p className="text-center text-sm" style={{ color: "var(--muted)" }}>Loading stories…</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {stories.map((s) => (
              <div
                key={s.id}
                className="break-inside-avoid mb-6 rounded-2xl p-5 relative"
                style={{
                  background: s.bg,
                  transform: `rotate(${s.rotate})`,
                  boxShadow: "3px 5px 16px rgba(0,0,0,0.4)",
                }}
              >
                {s.id.startsWith("u-") && (
                  <button
                    onClick={() => deleteStory(s.id)}
                    className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold opacity-40 hover:opacity-90 transition-opacity"
                    style={{ background: s.fg, color: s.bg }}
                    title="Remove this story"
                  >
                    ×
                  </button>
                )}
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-4 -mt-1"
                  style={{ background: s.fg, opacity: 0.4 }}
                />
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-3 pb-2 border-b"
                  style={{ color: s.fg, borderColor: s.fg, opacity: 0.9 }}
                >
                  {s.name}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: s.fg }}
                >
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
