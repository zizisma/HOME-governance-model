import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const NOTE_COLORS = [
  { bg: "#ffcc00", fg: "#11012e" },
  { bg: "#ff018f", fg: "#ffffff" },
  { bg: "#2a0c62", fg: "#ffcc00" },
  { bg: "#ff6dc0", fg: "#11012e" },
  { bg: "#ffe566", fg: "#11012e" },
];

const ROTATIONS = ["-2deg", "1.5deg", "-1deg", "2deg", "-0.5deg", "1deg"];

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not set");
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data ?? []);
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

    const supabase = getSupabase();
    const { count } = await supabase.from("stories").select("*", { count: "exact", head: true });
    const idx = count ?? 0;

    const story = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      text: text.trim(),
      bg: NOTE_COLORS[idx % NOTE_COLORS.length].bg,
      fg: NOTE_COLORS[idx % NOTE_COLORS.length].fg,
      rotate: ROTATIONS[idx % ROTATIONS.length],
    };

    const { data, error } = await supabase.from("stories").insert(story).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save story" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = getSupabase();
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
