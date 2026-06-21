import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: "https://natural-kit-127415.upstash.io",
  token: "gQAAAAAAAfG3AAIgcDE2YWRlN2VhMjY4ZTI0NDY4YjJmNjVkNmE0ZGNhYzE4Ng",
});

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
    const stories = await redis.lrange("stories", 0, -1);
    return NextResponse.json(stories ?? []);
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

    const count = await redis.llen("stories");
    const story = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      text: text.trim(),
      bg: NOTE_COLORS[count % NOTE_COLORS.length].bg,
      fg: NOTE_COLORS[count % NOTE_COLORS.length].fg,
      rotate: ROTATIONS[count % ROTATIONS.length],
    };

    await redis.lpush("stories", story);
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

    const stories = await redis.lrange<{ id: string }>("stories", 0, -1);
    const target = stories.find((s) => s.id === id);
    if (target) await redis.lrem("stories", 1, target);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
