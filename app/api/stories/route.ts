import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const NOTE_COLORS = [
  { bg: "#ffcc00", fg: "#11012e" },
  { bg: "#ff018f", fg: "#ffffff" },
  { bg: "#2a0c62", fg: "#ffcc00" },
  { bg: "#ff6dc0", fg: "#11012e" },
  { bg: "#ffe566", fg: "#11012e" },
];

const ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg", "-0.5deg", "1deg"];

function isKvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function GET() {
  if (!isKvConfigured()) return NextResponse.json([]);
  try {
    const stories = await kv.lrange("stories", 0, -1);
    return NextResponse.json(stories ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  if (!isKvConfigured()) {
    return NextResponse.json({ error: "KV_NOT_CONFIGURED" }, { status: 503 });
  }
  try {
    const { name, text } = await req.json();
    if (!name?.trim() || !text?.trim()) {
      return NextResponse.json({ error: "Name and text required" }, { status: 400 });
    }

    const count = await kv.llen("stories");
    const story = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      text: text.trim(),
      bg: NOTE_COLORS[count % NOTE_COLORS.length].bg,
      fg: NOTE_COLORS[count % NOTE_COLORS.length].fg,
      rotate: ROTATIONS[count % ROTATIONS.length],
    };

    await kv.lpush("stories", story);
    return NextResponse.json(story, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save story" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isKvConfigured()) {
    return NextResponse.json({ ok: true });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const stories = await kv.lrange("stories", 0, -1) as { id: string }[];
    const target = stories.find((s) => s.id === id);
    if (target) await kv.lrem("stories", 1, target);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
