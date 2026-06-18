"use client";
import Link from "next/link";
import { useRef, useCallback } from "react";

/* ─── Keyframe styles injected once ─────────────────────────────── */
const STYLES = `
  @keyframes ch-float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-14px); }
  }
  @keyframes ch-shadow {
    0%,100% { transform: scaleX(1);   opacity:.22; }
    50%      { transform: scaleX(.65); opacity:.12; }
  }
  .ch-figure { animation: ch-float 3.6s ease-in-out infinite; }
  .ch-shadow { animation: ch-shadow 3.6s ease-in-out infinite; }
  .ch-figure-1 { animation-delay: 0s; }    .ch-shadow-1 { animation-delay: 0s; }
  .ch-figure-2 { animation-delay: .9s; }   .ch-shadow-2 { animation-delay: .9s; }
  .ch-figure-3 { animation-delay: 1.8s; }  .ch-shadow-3 { animation-delay: 1.8s; }
  .ch-figure-4 { animation-delay: 2.7s; }  .ch-shadow-4 { animation-delay: 2.7s; }
  .ch-card {
    transition: box-shadow .25s;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .ch-card:hover { box-shadow: 0 28px 60px rgba(0,0,0,.55); }
`;

/* ─── 3-D tilt hook ──────────────────────────────────────────────── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    const y = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    el.style.transform = `perspective(900px) rotateX(${-x * 8}deg) rotateY(${y * 8}deg) scale(1.03)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { ref, onMove, onLeave };
}

/* ─── SVG: Maximilian ────────────────────────────────────────────── */
function MaximilianSVG() {
  return (
    <svg viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* shoes */}
      <rect x="50" y="270" width="28" height="13" rx="6" fill="#1a1830"/>
      <rect x="82" y="270" width="28" height="13" rx="6" fill="#1a1830"/>
      {/* pants */}
      <rect x="53" y="188" width="25" height="84" rx="4" fill="#1e2a4a"/>
      <rect x="82" y="188" width="25" height="84" rx="4" fill="#1e2a4a"/>
      <line x1="65" y1="192" x2="63" y2="270" stroke="#16203a" strokeWidth="1.5"/>
      <line x1="94" y1="192" x2="96" y2="270" stroke="#16203a" strokeWidth="1.5"/>
      {/* belt */}
      <rect x="48" y="185" width="64" height="7" rx="2" fill="#2d1a0a"/>
      <rect x="74" y="185" width="12" height="7" rx="1" fill="#c9a02a"/>
      {/* shirt */}
      <path d="M42 118 L38 188 L122 188 L118 118 Q80 106 42 118Z" fill="#4a7ab5"/>
      <line x1="60" y1="120" x2="55" y2="186" stroke="#3a6395" strokeWidth="2" opacity=".55"/>
      <line x1="80" y1="116" x2="80" y2="188" stroke="#3a6395" strokeWidth="2" opacity=".55"/>
      <line x1="100" y1="120" x2="105" y2="186" stroke="#3a6395" strokeWidth="2" opacity=".55"/>
      <line x1="38" y1="144" x2="122" y2="144" stroke="#3a6395" strokeWidth="2" opacity=".55"/>
      <line x1="38" y1="164" x2="122" y2="164" stroke="#3a6395" strokeWidth="2" opacity=".55"/>
      {/* left arm */}
      <path d="M43 124 Q22 158 24 190" stroke="#4a7ab5" strokeWidth="24" strokeLinecap="round" fill="none"/>
      <ellipse cx="24" cy="194" rx="11" ry="9" fill="#c57840"/>
      {/* right arm + book */}
      <path d="M117 124 Q136 158 132 190" stroke="#4a7ab5" strokeWidth="24" strokeLinecap="round" fill="none"/>
      <ellipse cx="133" cy="194" rx="11" ry="9" fill="#c57840"/>
      <rect x="122" y="182" width="28" height="20" rx="3" fill="#ffcc00"/>
      <rect x="122" y="182" width="5"  height="20" rx="1" fill="#cc9900"/>
      <line x1="129" y1="188" x2="148" y2="188" stroke="#cc9900" strokeWidth="1"/>
      <line x1="129" y1="193" x2="148" y2="193" stroke="#cc9900" strokeWidth="1"/>
      <line x1="129" y1="198" x2="148" y2="198" stroke="#cc9900" strokeWidth="1"/>
      {/* collar */}
      <path d="M67 106 L60 122 L80 114 L100 122 L93 106Z" fill="#4a7ab5"/>
      <path d="M67 106 L72 118 L80 112Z" fill="#e8e0d0"/>
      <path d="M93 106 L88 118 L80 112Z" fill="#e8e0d0"/>
      {/* neck */}
      <rect x="70" y="96" width="20" height="14" rx="7" fill="#c57840"/>
      {/* head */}
      <ellipse cx="80" cy="66" rx="33" ry="36" fill="#c57840"/>
      {/* silver hair */}
      <path d="M47 62 Q47 26 80 24 Q113 26 113 62 Q109 38 80 36 Q51 38 47 62Z" fill="#b8b8b8"/>
      <path d="M47 62 Q44 72 49 80 Q51 68 53 62Z" fill="#b8b8b8"/>
      <path d="M113 62 Q116 72 111 80 Q109 68 107 62Z" fill="#b8b8b8"/>
      {/* ears */}
      <ellipse cx="47" cy="68" rx="6" ry="7" fill="#c57840"/>
      <ellipse cx="113" cy="68" rx="6" ry="7" fill="#c57840"/>
      {/* brows */}
      <path d="M62 56 Q68 53 74 56" stroke="#989898" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M86 56 Q92 53 98 56" stroke="#989898" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* eyes */}
      <ellipse cx="68" cy="63" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="92" cy="63" rx="5" ry="5.5" fill="white"/>
      <circle cx="69" cy="64" r="3" fill="#3a2010"/>
      <circle cx="93" cy="64" r="3" fill="#3a2010"/>
      <circle cx="70" cy="63" r="1" fill="white"/>
      <circle cx="94" cy="63" r="1" fill="white"/>
      {/* nose */}
      <path d="M79 68 Q76 75 78 79 Q80 81 82 79 Q84 75 81 68Z" fill="#a05428" opacity=".4"/>
      {/* smile */}
      <path d="M69 85 Q80 93 91 85" stroke="#8a4520" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* stubble */}
      <path d="M63 82 Q66 91 72 94 Q80 96 88 94 Q94 91 97 82" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".35"/>
    </svg>
  );
}

/* ─── SVG: Julian ────────────────────────────────────────────────── */
function JulianSVG() {
  return (
    <svg viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* shoes */}
      <rect x="52" y="268" width="27" height="13" rx="5" fill="#e8e8e8"/>
      <rect x="81" y="268" width="27" height="13" rx="5" fill="#e8e8e8"/>
      <rect x="52" y="268" width="27" height="5"  rx="0" fill="#cccccc"/>
      <rect x="81" y="268" width="27" height="5"  rx="0" fill="#cccccc"/>
      {/* jeans */}
      <rect x="54" y="188" width="24" height="82" rx="4" fill="#2c3e70"/>
      <rect x="82" y="188" width="24" height="82" rx="4" fill="#2c3e70"/>
      <line x1="66" y1="192" x2="65" y2="268" stroke="#253464" strokeWidth="1.5"/>
      <line x1="94" y1="192" x2="95" y2="268" stroke="#253464" strokeWidth="1.5"/>
      {/* hoodie */}
      <path d="M48 118 L44 190 L116 190 L112 118 Q80 106 48 118Z" fill="#7a7a8a"/>
      <rect x="62" y="158" width="36" height="19" rx="4" fill="#6a6a7a"/>
      <line x1="80" y1="120" x2="80" y2="190" stroke="#6a6a7a" strokeWidth="1.5"/>
      {/* hood */}
      <path d="M58 116 Q52 98 56 88 Q62 78 80 78 Q98 78 104 88 Q108 98 102 116Z" fill="#6a6a7a"/>
      {/* left arm */}
      <path d="M48 124 Q27 156 25 190" stroke="#7a7a8a" strokeWidth="22" strokeLinecap="round" fill="none"/>
      <ellipse cx="24" cy="194" rx="10" ry="8" fill="#D4956A"/>
      {/* right arm */}
      <path d="M112 124 Q132 156 134 190" stroke="#7a7a8a" strokeWidth="22" strokeLinecap="round" fill="none"/>
      <ellipse cx="135" cy="194" rx="10" ry="8" fill="#D4956A"/>
      {/* neck */}
      <rect x="70" y="96" width="20" height="16" rx="7" fill="#D4956A"/>
      {/* head */}
      <ellipse cx="80" cy="66" rx="30" ry="33" fill="#D4956A"/>
      {/* hair */}
      <path d="M50 58 Q50 26 80 24 Q110 26 110 58 Q108 34 80 32 Q52 34 50 58Z" fill="#2a1a08"/>
      <path d="M50 58 Q47 68 52 76 Q54 66 56 58Z" fill="#2a1a08"/>
      <path d="M110 58 Q113 68 108 76 Q106 66 104 58Z" fill="#2a1a08"/>
      <path d="M60 36 Q70 30 80 32 Q72 32 68 40Z" fill="#1a1008"/>
      {/* ears */}
      <ellipse cx="50" cy="66" rx="5.5" ry="7" fill="#D4956A"/>
      <ellipse cx="110" cy="66" rx="5.5" ry="7" fill="#D4956A"/>
      {/* brows */}
      <path d="M63 56 Q69 53 74 56" stroke="#2a1a08" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M86 56 Q91 53 97 56" stroke="#2a1a08" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* eyes */}
      <ellipse cx="68" cy="63" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="92" cy="63" rx="5" ry="5.5" fill="white"/>
      <circle cx="69" cy="64" r="3" fill="#2a1a08"/>
      <circle cx="93" cy="64" r="3" fill="#2a1a08"/>
      <circle cx="70" cy="63" r="1" fill="white"/>
      <circle cx="94" cy="63" r="1" fill="white"/>
      {/* nose */}
      <path d="M79 69 Q77 75 78 79 Q80 80 82 79 Q83 75 81 69Z" fill="#c07840" opacity=".35"/>
      {/* smile */}
      <path d="M71 84 Q80 91 89 84" stroke="#8a4520" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

/* ─── SVG: Sarah ─────────────────────────────────────────────────── */
function SarahSVG() {
  return (
    <svg viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* shoes */}
      <rect x="54" y="272" width="24" height="10" rx="5" fill="#2a1a0a"/>
      <rect x="82" y="272" width="24" height="10" rx="5" fill="#2a1a0a"/>
      {/* trousers */}
      <rect x="56" y="188" width="23" height="86" rx="4" fill="#1e1e30"/>
      <rect x="81" y="188" width="23" height="86" rx="4" fill="#1e1e30"/>
      {/* tote bag */}
      <rect x="110" y="162" width="26" height="30" rx="4" fill="#e8c060"/>
      <path d="M114 162 Q117 148 123 148 Q129 148 132 162" stroke="#c9a030" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="115" y1="170" x2="135" y2="170" stroke="#c9a030" strokeWidth="1"/>
      {/* blazer */}
      <path d="M50 114 L46 190 L114 190 L110 114 Q80 102 50 114Z" fill="#c04060"/>
      <path d="M66 110 L60 128 L80 120 L100 128 L94 110Z" fill="#c04060"/>
      <path d="M66 110 L72 124 L80 118Z" fill="#ede8e0"/>
      <path d="M94 110 L88 124 L80 118Z" fill="#ede8e0"/>
      <circle cx="80" cy="152" r="3" fill="#a03050"/>
      {/* left arm */}
      <path d="M50 120 Q30 156 28 190" stroke="#c04060" strokeWidth="20" strokeLinecap="round" fill="none"/>
      <ellipse cx="27" cy="194" rx="9" ry="8" fill="#E8B896"/>
      {/* right arm holding bag */}
      <path d="M110 120 Q126 148 122 168" stroke="#c04060" strokeWidth="20" strokeLinecap="round" fill="none"/>
      <ellipse cx="121" cy="172" rx="9" ry="8" fill="#E8B896"/>
      {/* neck */}
      <rect x="71" y="98" width="18" height="16" rx="7" fill="#E8B896"/>
      {/* head */}
      <ellipse cx="80" cy="66" rx="29" ry="33" fill="#E8B896"/>
      {/* bun hair */}
      <path d="M51 58 Q51 26 80 24 Q109 26 109 58 Q107 34 80 32 Q53 34 51 58Z" fill="#5a2e0a"/>
      <circle cx="80" cy="24" r="13" fill="#5a2e0a"/>
      <circle cx="80" cy="24" r="8"  fill="#4a2408"/>
      <circle cx="80" cy="24" r="13" stroke="#3a1a06" strokeWidth="2" fill="none"/>
      <path d="M51 58 Q48 70 54 78 Q56 66 58 58Z" fill="#5a2e0a"/>
      <path d="M109 58 Q112 70 106 78 Q104 66 102 58Z" fill="#5a2e0a"/>
      {/* ears + earrings */}
      <ellipse cx="51" cy="66" rx="5" ry="7" fill="#E8B896"/>
      <ellipse cx="109" cy="66" rx="5" ry="7" fill="#E8B896"/>
      <circle cx="51" cy="73" r="3.5" fill="#ffcc00"/>
      <circle cx="109" cy="73" r="3.5" fill="#ffcc00"/>
      {/* brows */}
      <path d="M63 55 Q69 52 75 55" stroke="#5a2e0a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M85 55 Q91 52 97 55" stroke="#5a2e0a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* eyes */}
      <ellipse cx="68" cy="62" rx="5" ry="5.5" fill="white"/>
      <ellipse cx="92" cy="62" rx="5" ry="5.5" fill="white"/>
      <circle cx="69" cy="63" r="3"   fill="#3a1808"/>
      <circle cx="93" cy="63" r="3"   fill="#3a1808"/>
      <circle cx="70" cy="62" r="1"   fill="white"/>
      <circle cx="94" cy="62" r="1"   fill="white"/>
      {/* nose */}
      <path d="M79 67 Q77 73 78 77 Q80 78 82 77 Q83 73 81 67Z" fill="#c08060" opacity=".35"/>
      {/* smile */}
      <path d="M71 82 Q80 89 89 82" stroke="#8a4030" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

/* ─── SVG: Anouk ─────────────────────────────────────────────────── */
function AnoukSVG() {
  return (
    <svg viewBox="0 0 180 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* shoes */}
      <rect x="56" y="270" width="28" height="13" rx="6" fill="#ffcc00"/>
      <rect x="96" y="270" width="28" height="13" rx="6" fill="#ffcc00"/>
      {/* wide-leg pants */}
      <path d="M56 188 L46 278 L74 278 L90 218 L106 278 L134 278 L124 188Z" fill="#11012e"/>
      <line x1="64" y1="193" x2="57" y2="276" stroke="#1e0848" strokeWidth="2"/>
      <line x1="116" y1="193" x2="123" y2="276" stroke="#1e0848" strokeWidth="2"/>
      {/* bold yellow top */}
      <path d="M56 106 L52 190 L128 190 L124 106 Q90 94 56 106Z" fill="#ffcc00"/>
      <path d="M72 102 L68 116 L90 110 L112 116 L108 102Z" fill="#ffcc00"/>
      <path d="M72 102 L78 112 L90 108Z" fill="#e8b800"/>
      <path d="M108 102 L102 112 L90 108Z" fill="#e8b800"/>
      {/* graphic circle on top */}
      <circle cx="90" cy="150" r="14" fill="#ff018f" opacity=".75"/>
      <circle cx="90" cy="150" r="7"  fill="#ffcc00"/>
      {/* left arm raised */}
      <path d="M56 114 Q20 86 12 64"  stroke="#ffcc00" strokeWidth="22" strokeLinecap="round" fill="none"/>
      <ellipse cx="11" cy="60" rx="11" ry="10" fill="#A0622A"/>
      <ellipse cx="11" cy="60" rx="7"  ry="5"  fill="#ff018f" opacity=".6"/>
      {/* right arm out */}
      <path d="M124 114 Q158 96 168 74" stroke="#ffcc00" strokeWidth="22" strokeLinecap="round" fill="none"/>
      <ellipse cx="169" cy="70" rx="11" ry="10" fill="#A0622A"/>
      {/* neck */}
      <rect x="80" y="96" width="20" height="14" rx="7" fill="#A0622A"/>
      {/* head */}
      <ellipse cx="90" cy="64" rx="31" ry="34" fill="#A0622A"/>
      {/* natural hair – full volume */}
      <ellipse cx="90" cy="46" rx="42" ry="38" fill="#1a0a00"/>
      <path d="M48 52 Q42 36 52 26 Q58 20 68 24 Q78 16 90 18 Q102 16 112 24 Q122 20 128 26 Q138 36 132 52"
            stroke="#2a1408" strokeWidth="3" fill="none"/>
      <path d="M48 52 Q40 66 44 78 Q50 62 57 56Z" fill="#1a0a00"/>
      <path d="M132 52 Q140 66 136 78 Q130 62 123 56Z" fill="#1a0a00"/>
      {/* ears + earrings */}
      <ellipse cx="59" cy="68" rx="5.5" ry="7" fill="#A0622A"/>
      <ellipse cx="121" cy="68" rx="5.5" ry="7" fill="#A0622A"/>
      <circle cx="59" cy="75" r="4.5" fill="#ff018f"/>
      <circle cx="121" cy="75" r="4.5" fill="#ff018f"/>
      {/* brows */}
      <path d="M72 58 Q78 54 84 58" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M96 58 Q102 54 108 58" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* eyes */}
      <ellipse cx="78" cy="66" rx="6"   ry="6"   fill="white"/>
      <ellipse cx="102" cy="66" rx="6"   ry="6"   fill="white"/>
      <circle cx="79" cy="67" r="3.5" fill="#1a0a00"/>
      <circle cx="103" cy="67" r="3.5" fill="#1a0a00"/>
      <circle cx="80" cy="66" r="1.2" fill="white"/>
      <circle cx="104" cy="66" r="1.2" fill="white"/>
      {/* nose */}
      <path d="M89 71 Q87 78 88 82 Q90 83 92 82 Q93 78 91 71Z" fill="#885020" opacity=".4"/>
      {/* smile – expressive */}
      <path d="M79 88 Q90 98 101 88" stroke="#5a2a10" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

/* ─── Character data ─────────────────────────────────────────────── */
const CHARACTERS = [
  {
    id: "maximilian",
    name: "Maximilian",
    role: "Keeper · Gardener · Storyteller",
    quote: "He now manages the finances, gives story times to kids every week, and does the gardening two or three mornings a week when the city is still quiet.",
    accent: "#ffcc00",
    bg: "#1a0848",
    SVG: MaximilianSVG,
    delay: 1,
  },
  {
    id: "julian",
    name: "Julian",
    role: "Member · Event Organiser",
    quote: "Found Third Home in a student essay. Came for an Easter event — egg hunts, live bands on the rooftop — and never really left.",
    accent: "#ff018f",
    bg: "#0e0a2a",
    SVG: JulianSVG,
    delay: 2,
  },
  {
    id: "sarah",
    name: "Sarah",
    role: "Member · Event Organiser",
    quote: "The commute from Hanover was exhausting. A year after moving in she had a child and felt genuinely held by the people around her.",
    accent: "#ff6dc0",
    bg: "#1a0848",
    SVG: SarahSVG,
    delay: 3,
  },
  {
    id: "anouk",
    name: "Anouk",
    role: "Performance Artist · Collaborator",
    quote: "First time Anouk could work as a full-time funded artist. They sold all their furniture on eBay and arrived two weeks later.",
    accent: "#ffcc00",
    bg: "#0e0a2a",
    SVG: AnoukSVG,
    delay: 4,
  },
];

/* ─── Card ───────────────────────────────────────────────────────── */
function CharacterCard({ character, index }: { character: typeof CHARACTERS[0]; index: number }) {
  const { ref, onMove, onLeave } = useTilt();
  const { SVG, name, role, quote, accent, bg, delay } = character;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="ch-card rounded-3xl overflow-hidden flex flex-col"
      style={{ background: bg, transition: "transform .25s ease, box-shadow .25s ease" }}
    >
      {/* figure area */}
      <div className="relative flex items-end justify-center pt-10 pb-2 px-8" style={{ minHeight: 260 }}>
        <div className={`ch-figure ch-figure-${delay} relative z-10 w-36`} style={{ maxWidth: 160 }}>
          <SVG />
        </div>
        {/* ground shadow */}
        <div
          className={`ch-shadow ch-shadow-${delay} absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full`}
          style={{ width: 72, height: 14, background: "rgba(0,0,0,0.4)" }}
        />
      </div>

      {/* info */}
      <div className="px-6 pb-7 pt-3 flex-1 flex flex-col gap-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="text-xl font-bold tracking-tight" style={{ color: accent, fontFamily: "Georgia, serif" }}>
            {name}
          </h2>
          <span className="text-xs uppercase tracking-widest opacity-50" style={{ color: "#f0e6ff" }}>
            {role}
          </span>
        </div>
        <p className="text-sm leading-relaxed opacity-70 mt-1" style={{ color: "#f0e6ff" }}>
          "{quote}"
        </p>
      </div>

      {/* accent strip */}
      <div className="h-1 w-full" style={{ background: accent }} />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function CharactersPage() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2 opacity-50" style={{ color: "#f0e6ff" }}>
              Third Home · Wolfsburg
            </p>
            <h1 className="text-5xl font-bold leading-tight" style={{ color: "#ffcc00", fontFamily: "Georgia, serif" }}>
              The People
            </h1>
            <p className="text-base mt-3 max-w-lg opacity-70" style={{ color: "#f0e6ff" }}>
              Every person who found their way to Third Home arrived with a story. Here are four of them.
            </p>
          </div>
          <Link
            href="/backstories"
            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 shrink-0 self-start"
            style={{ background: "#ff018f", color: "white" }}
          >
            ← Back Stories
          </Link>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHARACTERS.map((c, i) => (
            <CharacterCard key={c.id} character={c} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
