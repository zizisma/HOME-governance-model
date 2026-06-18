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

export async function GET() {
  try {
    const raw = await kv.lrange("backstories", 0, -1);
    const stories = raw.map((s) => (typeof s === "string" ? JSON.parse(s) : s));
    return NextResponse.json(stories);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const { name, text } = await req.json();
    if (!name?.trim() || !text?.trim()) {
      return NextResponse.json({ error: "Name and text required" }, { status: 400 });
    }

    const count = await kv.llen("backstories");
    const story = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      text: text.trim(),
      bg: NOTE_COLORS[count % NOTE_COLORS.length].bg,
      fg: NOTE_COLORS[count % NOTE_COLORS.length].fg,
      rotate: ROTATIONS[count % ROTATIONS.length],
    };

    await kv.lpush("backstories", JSON.stringify(story));
    return NextResponse.json(story, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save story" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const raw = await kv.lrange("backstories", 0, -1);
    for (const item of raw) {
      const parsed = typeof item === "string" ? JSON.parse(item) : item;
      if (parsed.id === id) {
        await kv.lrem("backstories", 0, typeof item === "string" ? item : JSON.stringify(item));
        break;
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
