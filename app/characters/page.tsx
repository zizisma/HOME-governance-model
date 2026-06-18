"use client";
import Link from "next/link";
import { useRef, useCallback } from "react";

const STYLES = `
  @keyframes ch-float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-14px); }
  }
  @keyframes ch-shadow {
    0%,100% { transform: scaleX(1);   opacity:.3; }
    50%      { transform: scaleX(.6);  opacity:.12; }
  }
  .ch-figure { animation: ch-float 3.8s ease-in-out infinite; }
  .ch-shadow { animation: ch-shadow 3.8s ease-in-out infinite; }
  .ch-figure-1 { animation-delay: 0s; }   .ch-shadow-1 { animation-delay: 0s; }
  .ch-figure-2 { animation-delay: 1s; }   .ch-shadow-2 { animation-delay: 1s; }
  .ch-figure-3 { animation-delay: 2s; }   .ch-shadow-3 { animation-delay: 2s; }
  .ch-figure-4 { animation-delay: 3s; }   .ch-shadow-4 { animation-delay: 3s; }
  .ch-card {
    transition: transform .25s ease, box-shadow .25s ease;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .ch-card:hover { box-shadow: 0 32px 64px rgba(0,0,0,.6); }
`;

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    const y = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    el.style.transform = `perspective(900px) rotateX(${-x * 7}deg) rotateY(${y * 7}deg) scale(1.03)`;
  }, []);
  const onLeave = useCallback(() => { if (ref.current) ref.current.style.transform = ""; }, []);
  return { ref, onMove, onLeave };
}

/* ─── Comic eye helper ──────────────────────────────────────────────
   cx/cy = iris center, rx/ry = sclera size, iris = iris color       */
function ComicEye({ cx, cy, rx = 10, ry = 8.5, iris = "#6b3a1f", flip = false }: {
  cx: number; cy: number; rx?: number; ry?: number; iris?: string; flip?: boolean;
}) {
  const x0 = cx - rx, x1 = cx + rx, yMid = cy;
  const lidPath = `M${x0},${yMid} Q${x0},${cy - ry} ${cx},${cy - ry - 1} Q${x1},${cy - ry} ${x1},${yMid}`;
  const outlineD = `M${x0},${yMid} Q${x0},${cy - ry} ${cx},${cy - ry - 1} Q${x1},${cy - ry} ${x1},${yMid} Q${x1},${cy + ry} ${cx},${cy + ry} Q${x0},${cy + ry} ${x0},${yMid}Z`;

  // outer corner lash positions
  const lashX = flip ? x0 : x1;
  const lashDir = flip ? -1 : 1;
  return (
    <g>
      {/* sclera */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="white"/>
      {/* thick upper lid */}
      <path d={lidPath} fill="#1a1010" strokeLinejoin="round"/>
      {/* iris */}
      <circle cx={cx} cy={cy + 0.5} r={ry * 0.68} fill={iris}/>
      {/* iris ring */}
      <circle cx={cx} cy={cy + 0.5} r={ry * 0.68} fill="none" stroke="#1a0a00" strokeWidth="0.8"/>
      {/* pupil */}
      <circle cx={cx} cy={cy + 0.5} r={ry * 0.35} fill="#0a0000"/>
      {/* main shine */}
      <circle cx={cx - rx * 0.32} cy={cy - ry * 0.42} r={ry * 0.28} fill="white"/>
      {/* tiny secondary shine */}
      <circle cx={cx + rx * 0.18} cy={cy + ry * 0.38} r={ry * 0.14} fill="rgba(255,255,255,0.55)"/>
      {/* full outline */}
      <path d={outlineD} fill="none" stroke="#1a1010" strokeWidth="1.9" strokeLinejoin="round"/>
      {/* outer corner lashes */}
      <line x1={lashX} y1={cy - ry * 0.3} x2={lashX + lashDir * 3.5} y2={cy - ry * 0.9} stroke="#1a1010" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1={lashX} y1={cy - ry * 0.7} x2={lashX + lashDir * 3} y2={cy - ry * 1.4} stroke="#1a1010" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1={cx + lashDir * rx * 0.55} y1={cy - ry * 0.9} x2={cx + lashDir * (rx * 0.55 + 2)} y2={cy - ry * 1.5} stroke="#1a1010" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  );
}

/* ─── SVG: Maximilian ───────────────────────────────────────────────
   Pose: arms folded, warm confident stance                           */
function MaximilianSVG() {
  const sk = "#c87840"; // skin
  const sh = "#4a7ab5"; // shirt
  const pt = "#1e2a4a"; // pants
  const ol = "#1a1010"; // outline
  const sw = 2.2;
  return (
    <svg viewBox="0 0 160 330" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      {/* ── SHOES ── */}
      <path d="M44,310 Q44,322 62,324 Q80,326 82,314 L80,302Z" fill="#1a1828" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M78,302 L80,314 Q82,322 98,320 Q114,318 114,308 L110,298Z" fill="#1a1828" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* ── PANTS ── */}
      <path d="M50,214 L44,308 L84,308 L82,214Z" fill={pt} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M82,214 L78,308 L116,308 L110,214Z" fill={pt} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* crease lines */}
      <line x1="62" y1="218" x2="59" y2="305" stroke="#161e38" strokeWidth="1.5"/>
      <line x1="100" y1="218" x2="103" y2="305" stroke="#161e38" strokeWidth="1.5"/>
      {/* belt */}
      <rect x="46" y="210" width="68" height="8" rx="3" fill="#2a1808" stroke={ol} strokeWidth={sw}/>
      <rect x="72" y="210" width="14" height="8" rx="2" fill="#c9a030" stroke={ol} strokeWidth="1.5"/>
      {/* ── SHIRT BODY ── */}
      <path d="M36,132 L32,216 L128,216 L124,132 Q80,116 36,132Z" fill={sh} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* plaid stripes */}
      {[62,80,98].map(x => <line key={x} x1={x} y1="134" x2={x - 3} y2="214" stroke="#3a6395" strokeWidth="2.2" opacity="0.55"/>)}
      {[150,168,188,208].map(y => <line key={y} x1="33" y1={y} x2="127" y2={y} stroke="#3a6395" strokeWidth="2.2" opacity="0.55"/>)}
      {/* shirt fold shadows */}
      <path d="M56,160 Q52,175 54,190" stroke="#3a6395" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M104,160 Q108,175 106,190" stroke="#3a6395" strokeWidth="1.5" fill="none" opacity="0.4"/>
      {/* ── FOLDED ARMS ── */}
      {/* left forearm (behind) */}
      <path d="M104,184 Q86,176 54,182 L52,200 Q84,194 106,200Z" fill={sh} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* right forearm (in front) */}
      <path d="M56,182 Q74,174 106,180 L108,198 Q74,192 54,198Z" fill={sh} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* left hand (peeking right) */}
      <path d="M104,180 Q118,183 118,192 Q118,200 106,200Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* right hand (peeking left) */}
      <path d="M56,180 Q42,183 42,192 Q42,200 54,200Z" fill={sk} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* ── COLLAR ── */}
      <path d="M66,120 L58,138 L80,128 L102,138 L94,120Z" fill={sh} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M66,120 L73,132 L80,126Z" fill="#e8e4dc" stroke={ol} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M94,120 L87,132 L80,126Z" fill="#e8e4dc" stroke={ol} strokeWidth="1.5" strokeLinejoin="round"/>
      {/* ── NECK ── */}
      <path d="M68,112 Q66,130 70,136 L90,136 Q94,130 92,112Z" fill={sk} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* ── EARS ── */}
      <path d="M46,68 Q38,72 40,82 Q42,90 50,88 Q56,84 56,76 Q56,68 50,66Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M44,73 Q42,78 43,83" stroke="#a06030" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <path d="M114,66 Q120,68 122,76 Q122,84 118,88 Q110,90 108,82 Q108,72 114,68Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M118,73 Q120,78 119,83" stroke="#a06030" strokeWidth="1.2" fill="none" opacity="0.5"/>
      {/* ── HEAD ── */}
      <path d="M52,46 Q44,58 44,74 Q44,94 54,106 Q66,120 80,122 Q94,120 106,106 Q116,94 116,74 Q116,58 108,46 Q98,28 80,26 Q62,28 52,46Z" fill={sk} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* ── HAIR ── */}
      {/* main silver mass */}
      <path d="M50,48 Q50,18 80,16 Q110,18 110,48 Q108,28 80,26 Q52,28 50,48Z" fill="#c2c2c2" stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* hair highlights */}
      <path d="M56,38 Q68,22 80,22 Q72,24 68,32 Q62,36 58,42Z" fill="#dcdcdc"/>
      <path d="M104,38 Q92,22 80,22 Q88,24 92,32 Q98,36 102,42Z" fill="#dcdcdc"/>
      {/* side silver strands */}
      <path d="M50,48 Q46,60 48,72 Q52,62 54,50Z" fill="#c2c2c2"/>
      <path d="M110,48 Q114,60 112,72 Q108,62 106,50Z" fill="#c2c2c2"/>
      {/* ── EYEBROWS (bushy, silver) ── */}
      <path d="M54,58 Q65,50 76,56 Q65,62 54,58Z" fill="#aaaaaa" stroke={ol} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M84,56 Q95,50 106,58 Q95,62 84,56Z" fill="#aaaaaa" stroke={ol} strokeWidth="1.2" strokeLinejoin="round"/>
      {/* ── EYES ── */}
      <ComicEye cx={65} cy={70} rx={10} ry={8.5} iris="#7a4a20" flip={true}/>
      <ComicEye cx={95} cy={70} rx={10} ry={8.5} iris="#7a4a20"/>
      {/* ── NOSE ── */}
      <path d="M80,82 Q76,88 77,93 Q80,96 83,93 Q84,88 80,82Z" fill="#a06030" opacity="0.35"/>
      <path d="M77,93 Q79,96 80,96 Q81,96 83,93" stroke="#a06030" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* ── SMILE + LINES ── */}
      {/* cheek smile lines */}
      <path d="M52,84 Q50,93 54,100" stroke="#a06030" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M108,84 Q110,93 106,100" stroke="#a06030" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* lips */}
      <path d="M66,102 Q72,99 76,100 Q80,98 84,100 Q88,99 94,102" stroke={ol} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M66,102 Q80,112 94,102" stroke={ol} strokeWidth="1.9" strokeLinecap="round" fill="none"/>
      <path d="M66,102 Q74,99 80,97 Q86,99 94,102 Q86,110 80,111 Q74,110 66,102Z" fill="#c07858" opacity="0.55"/>
      {/* stubble dots */}
      {[60,66,72,78,84,90,96].map(x => <circle key={x} cx={x} cy={112} r="1.2" fill="#aaaaaa" opacity="0.35"/>)}
    </svg>
  );
}

/* ─── SVG: Julian ───────────────────────────────────────────────────
   Pose: hand through messy hair, easy grin                           */
function JulianSVG() {
  const sk = "#D4956A";
  const hd = "#2a1a08"; // hair dark
  const sw = 2.2;
  const ol = "#1a1010";
  return (
    <svg viewBox="0 0 160 330" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      {/* ── SHOES ── */}
      <path d="M46,308 Q44,322 62,324 Q80,326 82,314 L80,302Z" fill="#e8e8e8" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M80,302 L82,314 Q84,322 100,320 Q116,318 116,308 L112,298Z" fill="#e8e8e8" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* sole stripe */}
      <path d="M44,314 Q62,318 82,314" stroke="#aaaaaa" strokeWidth="2" fill="none"/>
      <path d="M82,314 Q100,318 116,314" stroke="#aaaaaa" strokeWidth="2" fill="none"/>
      {/* ── JEANS ── */}
      <path d="M52,196 L46,308 L84,308 L82,196Z" fill="#2c3e70" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M82,196 L78,308 L114,308 L110,196Z" fill="#2c3e70" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <line x1="65" y1="200" x2="63" y2="305" stroke="#253464" strokeWidth="1.5"/>
      <line x1="99" y1="200" x2="101" y2="305" stroke="#253464" strokeWidth="1.5"/>
      {/* ── HOODIE BODY ── */}
      <path d="M45,122 L40,198 L120,198 L115,122 Q80,108 45,122Z" fill="#7a7a8a" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* centre seam */}
      <line x1="80" y1="126" x2="80" y2="198" stroke="#6a6a7a" strokeWidth="1.5"/>
      {/* pocket */}
      <path d="M58,162 L58,184 Q66,188 80,188 Q94,188 102,184 L102,162 Q94,158 80,158 Q66,158 58,162Z" fill="#6a6a7a" stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* hoodie fold lines */}
      <path d="M55,145 Q52,158 54,172" stroke="#6a6a7a" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M105,145 Q108,158 106,172" stroke="#6a6a7a" strokeWidth="1.5" fill="none" opacity="0.7"/>
      {/* ── HOOD ── */}
      <path d="M55,120 Q48,102 52,90 Q58,78 80,76 Q102,78 108,90 Q112,102 105,120Z" fill="#6a6a7a" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* hood inner shadow */}
      <path d="M62,120 Q60,106 64,96 Q70,84 80,82 Q90,84 96,96 Q100,106 98,120" fill="#5a5a68"/>
      {/* ── LEFT ARM (raised — hand through hair) ── */}
      <path d="M45,128 Q22,100 18,72" stroke="#7a7a8a" strokeWidth="26" strokeLinecap="round" fill="none"/>
      <path d="M45,128 Q22,100 18,72" stroke="#7a7a8a" strokeWidth="26" strokeLinecap="round" fill="none" stroke-linejoin="round"/>
      {/* left sleeve outline */}
      <path d="M34,126 Q12,100 8,72 M56,130 Q33,103 28,74" stroke={ol} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* left hand in hair */}
      <path d="M10,68 Q6,60 12,56 Q18,52 24,58 Q28,64 22,74Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* fingers */}
      <path d="M10,58 Q8,52 12,50" stroke={sk} strokeWidth="5" strokeLinecap="round"/>
      <path d="M16,55 Q14,48 18,46" stroke={sk} strokeWidth="5" strokeLinecap="round"/>
      <path d="M22,56 Q22,49 26,48" stroke={sk} strokeWidth="5" strokeLinecap="round"/>
      {/* finger outlines */}
      <path d="M7,52 Q9,46 14,48" stroke={ol} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M13,48 Q15,42 20,44" stroke={ol} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M20,48 Q22,43 27,46" stroke={ol} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      {/* ── RIGHT ARM (at side) ── */}
      <path d="M115,128 Q134,162 132,196" stroke="#7a7a8a" strokeWidth="26" strokeLinecap="round" fill="none"/>
      <path d="M106,130 Q124,164 122,198 M124,128 Q144,162 143,196" stroke={ol} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M122,196 Q120,208 130,212 Q140,210 140,198 Q138,188 130,188 Q122,188 122,196Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* ── COLLAR / NECK ── */}
      <path d="M68,112 Q66,128 70,134 L90,134 Q94,128 92,112Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* ── EARS ── */}
      <path d="M46,68 Q39,72 40,80 Q42,88 50,86 Q56,82 56,74 Q56,66 50,64Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M44,72 Q42,77 43,82" stroke="#b07040" strokeWidth="1.1" fill="none" opacity="0.5"/>
      <path d="M114,64 Q120,66 120,74 Q120,82 114,86 Q106,88 108,80 Q110,72 114,68Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* ── HEAD ── */}
      <path d="M50,48 Q42,60 42,76 Q42,96 54,110 Q66,124 80,126 Q94,124 106,110 Q118,96 118,76 Q118,60 110,48 Q100,28 80,26 Q60,28 50,48Z" fill={sk} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* ── HAIR (dark, messy) ── */}
      <path d="M48,50 Q48,18 80,16 Q112,18 112,50 Q110,28 80,26 Q50,28 48,50Z" fill={hd} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* messy front strands */}
      <path d="M60,36 Q64,26 72,28 Q66,30 64,40 Q62,44 58,48Z" fill={hd}/>
      <path d="M54,44 Q56,32 64,30 Q58,34 56,44 Q54,50 52,56Z" fill="#1a1008"/>
      <path d="M72,28 Q80,20 88,22 Q82,24 78,32 Q74,38 70,42Z" fill={hd}/>
      {/* strand over forehead */}
      <path d="M62,36 Q66,42 68,52 Q64,44 60,40Z" fill="#1a1008"/>
      <path d="M68,32 Q72,40 74,52 Q70,42 66,36Z" fill="#1a1008"/>
      {/* side wisps */}
      <path d="M48,50 Q44,62 46,74 Q50,62 52,52Z" fill={hd}/>
      <path d="M112,50 Q116,62 114,74 Q110,62 108,52Z" fill={hd}/>
      {/* ── EYEBROWS ── */}
      <path d="M53,58 Q65,50 76,55 Q65,60 53,58Z" fill={hd} stroke={ol} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M84,55 Q95,50 107,58 Q95,60 84,55Z" fill={hd} stroke={ol} strokeWidth="1.2" strokeLinejoin="round"/>
      {/* ── EYES ── */}
      <ComicEye cx={65} cy={72} rx={10} ry={8.5} iris="#3a2010" flip={true}/>
      <ComicEye cx={95} cy={72} rx={10} ry={8.5} iris="#3a2010"/>
      {/* ── NOSE ── */}
      <path d="M80,84 Q76,90 77,95 Q80,98 83,95 Q84,90 80,84Z" fill="#b07040" opacity="0.3"/>
      <path d="M77,95 Q79,98 80,98 Q81,98 83,95" stroke="#b07040" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* ── MOUTH (easy grin) ── */}
      <path d="M67,106 Q73,103 76,104 Q80,102 84,104 Q87,103 93,106" stroke={ol} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M67,106 Q80,116 93,106" stroke={ol} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M67,106 Q74,103 80,101 Q86,103 93,106 Q86,114 80,115 Q74,114 67,106Z" fill="#c07858" opacity="0.5"/>
      {/* teeth hint */}
      <path d="M70,108 Q80,114 90,108" fill="white" opacity="0.4"/>
    </svg>
  );
}

/* ─── SVG: Sarah ────────────────────────────────────────────────────
   Pose: mid-stride, one hand on hip, tote over shoulder              */
function SarahSVG() {
  const sk = "#E8B896";
  const ol = "#1a1010";
  const sw = 2.2;
  return (
    <svg viewBox="0 0 170 330" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      {/* ── SHOES (strappy heels for stride) ── */}
      <path d="M44,310 Q42,320 56,322 Q72,324 74,314 L72,302Z" fill="#2a1a0a" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M88,300 L92,314 Q96,326 110,322 Q122,318 120,308 L116,298Z" fill="#2a1a0a" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* heel */}
      <rect x="44" y="318" width="4" height="10" rx="2" fill="#2a1a0a" stroke={ol} strokeWidth="1.5"/>
      <rect x="116" y="316" width="4" height="10" rx="2" fill="#2a1a0a" stroke={ol} strokeWidth="1.5"/>
      {/* ── TROUSERS (wide stride) ── */}
      <path d="M52,198 L40,308 L76,308 L80,198Z" fill="#1e1e30" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M80,198 L84,308 L120,308 L108,198Z" fill="#1e1e30" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <line x1="58" y1="202" x2="52" y2="305" stroke="#16162a" strokeWidth="1.5"/>
      <line x1="104" y1="202" x2="110" y2="305" stroke="#16162a" strokeWidth="1.5"/>
      {/* ── TOTE BAG ── */}
      <path d="M116,154 L112,198 L148,198 L144,154Z" fill="#e8c060" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* bag handle */}
      <path d="M118,154 Q122,136 130,134 Q138,136 142,154" stroke={ol} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* bag detail */}
      <line x1="116" y1="170" x2="148" y2="170" stroke="#c9a030" strokeWidth="1.5"/>
      <rect x="126" y="178" width="12" height="10" rx="2" fill="#c9a030"/>
      {/* ── BLAZER BODY ── */}
      <path d="M48,118 L44,202 L116,202 L112,118 Q80,104 48,118Z" fill="#c04060" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* lapels */}
      <path d="M64,112 L56,132 L80,122 L104,132 L96,112Z" fill="#c04060" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M64,112 L71,126 L80,120Z" fill="#ede6de" stroke={ol} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M96,112 L89,126 L80,120Z" fill="#ede6de" stroke={ol} strokeWidth="1.5" strokeLinejoin="round"/>
      {/* button */}
      <circle cx="80" cy="158" r="4" fill="#a03050" stroke={ol} strokeWidth="1.5"/>
      <circle cx="80" cy="178" r="3" fill="#a03050" stroke={ol} strokeWidth="1.5"/>
      {/* blazer folds */}
      <path d="M56,145 Q54,158 56,172" stroke="#a03050" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M104,145 Q106,158 104,172" stroke="#a03050" strokeWidth="1.5" fill="none" opacity="0.5"/>
      {/* ── LEFT ARM (hand on hip) ── */}
      <path d="M48,124 Q28,158 30,192" stroke="#c04060" strokeWidth="22" strokeLinecap="round" fill="none"/>
      <path d="M38,124 Q18,158 20,192 M58,126 Q40,160 42,194" stroke={ol} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* hand on hip */}
      <path d="M20,192 Q16,202 22,208 Q32,212 40,206 Q44,198 38,192Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* ── RIGHT ARM (up holding tote strap) ── */}
      <path d="M112,124 Q126,136 130,152" stroke="#c04060" strokeWidth="22" strokeLinecap="round" fill="none"/>
      <path d="M103,124 Q116,136 120,152 M122,126 Q136,138 140,154" stroke={ol} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M120,152 Q118,164 128,168 Q138,166 138,154 Q136,142 128,140 Q120,140 120,152Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* ── NECK ── */}
      <path d="M70,110 Q68,126 72,132 L88,132 Q92,126 90,110Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* ── EARS ── */}
      <path d="M46,66 Q38,70 40,80 Q42,88 50,86 Q56,82 56,74 Q56,66 50,64Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M44,72 Q42,77 43,82" stroke="#c09070" strokeWidth="1.2" fill="none" opacity="0.5"/>
      {/* gold earring */}
      <circle cx="44" cy="85" r="4.5" fill="#ffcc00" stroke={ol} strokeWidth="1.5"/>
      <path d="M114,64 Q120,66 120,74 Q120,82 114,86 Q106,88 108,80 Q110,72 114,68Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="120" cy="83" r="4.5" fill="#ffcc00" stroke={ol} strokeWidth="1.5"/>
      {/* ── HEAD ── */}
      <path d="M50,46 Q42,58 42,74 Q42,94 54,108 Q66,122 80,124 Q94,122 106,108 Q118,94 118,74 Q118,58 110,46 Q100,28 80,26 Q60,28 50,46Z" fill={sk} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* cheek blush */}
      <ellipse cx="56" cy="88" rx="8" ry="5" fill="#e89898" opacity="0.35"/>
      <ellipse cx="104" cy="88" rx="8" ry="5" fill="#e89898" opacity="0.35"/>
      {/* ── HAIR (sleek bun) ── */}
      <path d="M50,48 Q50,18 80,16 Q110,18 110,48 Q108,28 80,26 Q52,28 50,48Z" fill="#5a2e0a" stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* bun */}
      <circle cx="80" cy="20" r="16" fill="#5a2e0a" stroke={ol} strokeWidth="1.8"/>
      <circle cx="80" cy="20" r="10" fill="#4a2408" stroke={ol} strokeWidth="1.2"/>
      {/* bun wrap detail */}
      <path d="M66,20 Q72,14 80,14 Q88,14 94,20" stroke="#3a1a06" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* flyaway strands */}
      <path d="M50,48 Q46,60 48,72 Q52,60 54,50Z" fill="#5a2e0a"/>
      <path d="M110,48 Q114,60 112,72 Q108,60 106,50Z" fill="#5a2e0a"/>
      <path d="M56,38 Q52,30 56,24 Q58,34 58,42Z" fill="#5a2e0a"/>
      <path d="M52,44 Q48,36 50,28 Q54,38 54,46Z" fill="#4a2408"/>
      {/* ── EYEBROWS ── */}
      <path d="M53,57 Q65,49 76,54 Q65,60 53,57Z" fill="#5a2e0a" stroke={ol} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M84,54 Q95,49 107,57 Q95,60 84,54Z" fill="#5a2e0a" stroke={ol} strokeWidth="1.2" strokeLinejoin="round"/>
      {/* ── EYES ── */}
      <ComicEye cx={65} cy={70} rx={10} ry={8.5} iris="#5a7a30" flip={true}/>
      <ComicEye cx={95} cy={70} rx={10} ry={8.5} iris="#5a7a30"/>
      {/* ── NOSE ── */}
      <path d="M80,82 Q76,88 77,92 Q80,95 83,92 Q84,88 80,82Z" fill="#c09070" opacity="0.3"/>
      <path d="M77,92 Q79,95 80,95 Q81,95 83,92" stroke="#c09070" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* ── MOUTH ── */}
      <path d="M67,103 Q72,100 76,101 Q80,99 84,101 Q88,100 93,103" stroke={ol} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M67,103 Q80,112 93,103" stroke={ol} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M67,103 Q74,100 80,98 Q86,100 93,103 Q86,111 80,112 Q74,111 67,103Z" fill="#c07858" opacity="0.55"/>
    </svg>
  );
}

/* ─── SVG: Anouk ────────────────────────────────────────────────────
   Pose: arms wide, head tilted, electric energy                      */
function AnoukSVG() {
  const sk = "#A0622A";
  const ol = "#1a1010";
  const sw = 2.2;
  return (
    <svg viewBox="0 0 220 330" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
      {/* ── SHOES ── */}
      <path d="M56,308 Q54,322 70,324 Q86,326 88,314 L86,302Z" fill="#ffcc00" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M100,302 L102,314 Q104,326 120,324 Q136,322 136,310 L130,300Z" fill="#ffcc00" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* ── WIDE-LEG PANTS ── */}
      <path d="M54,196 L40,308 L90,308 L98,196Z" fill="#11012e" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M98,196 L100,308 L150,308 L136,196Z" fill="#11012e" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <line x1="60" y1="200" x2="52" y2="305" stroke="#1e0848" strokeWidth="1.5"/>
      <line x1="130" y1="200" x2="138" y2="305" stroke="#1e0848" strokeWidth="1.5"/>
      {/* ── BOLD YELLOW TOP ── */}
      <path d="M52,110 L48,198 L142,198 L138,110 Q95,96 52,110Z" fill="#ffcc00" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* centre seam */}
      <line x1="95" y1="114" x2="95" y2="198" stroke="#e8b800" strokeWidth="1.5"/>
      {/* graphic circle on top */}
      <circle cx="95" cy="154" r="18" fill="#ff018f" stroke={ol} strokeWidth="1.8"/>
      <circle cx="95" cy="154" r="10" fill="#ffcc00" stroke={ol} strokeWidth="1.5"/>
      <circle cx="95" cy="154" r="4"  fill="#ff018f"/>
      {/* fabric folds */}
      <path d="M64,130 Q62,145 64,162" stroke="#e8b800" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M126,130 Q128,145 126,162" stroke="#e8b800" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* collar */}
      <path d="M80,104 L74,118 L95,110 L116,118 L110,104Z" fill="#ffcc00" stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M80,104 L87,114 L95,108Z" fill="#e8b800" stroke={ol} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M110,104 L103,114 L95,108Z" fill="#e8b800" stroke={ol} strokeWidth="1.5" strokeLinejoin="round"/>
      {/* ── LEFT ARM (wide + raised, paint on hand) ── */}
      <path d="M52,118 Q20,86 8,58" stroke="#ffcc00" strokeWidth="28" strokeLinecap="round" fill="none"/>
      <path d="M40,116 Q8,84 -4,56 M64,120 Q34,88 22,60" stroke={ol} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* left hand */}
      <path d="M0,54 Q-6,44 0,38 Q8,32 16,40 Q22,46 16,58Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* paint smear */}
      <ellipse cx="8" cy="46" rx="7" ry="5" fill="#ff018f" opacity="0.7" transform="rotate(-20 8 46)"/>
      <ellipse cx="14" cy="54" rx="5" ry="3" fill="#ffcc00" opacity="0.6" transform="rotate(10 14 54)"/>
      {/* ── RIGHT ARM (wide out) ── */}
      <path d="M138,118 Q168,88 184,62" stroke="#ffcc00" strokeWidth="28" strokeLinecap="round" fill="none"/>
      <path d="M126,118 Q156,88 172,62 M150,120 Q180,90 196,64" stroke={ol} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* right hand */}
      <path d="M186,58 Q194,50 200,56 Q204,64 196,70 Q188,74 182,64Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* ── NECK ── */}
      <path d="M83,102 Q80,118 84,124 L106,124 Q110,118 107,102Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      {/* ── EARS ── */}
      <path d="M58,66 Q50,70 52,80 Q54,88 62,86 Q68,82 68,74 Q68,66 62,62Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M56,72 Q54,77 55,82" stroke="#885020" strokeWidth="1.2" fill="none" opacity="0.5"/>
      {/* pink earring */}
      <circle cx="54" cy="86" r="5.5" fill="#ff018f" stroke={ol} strokeWidth="1.5"/>
      <path d="M128,62 Q134,66 134,74 Q134,82 128,86 Q120,88 122,80 Q124,72 128,66Z" fill={sk} stroke={ol} strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="136" cy="84" r="5.5" fill="#ff018f" stroke={ol} strokeWidth="1.5"/>
      {/* ── HEAD (slight tilt) ── */}
      <path d="M58,46 Q50,58 50,74 Q50,94 62,108 Q74,122 95,124 Q116,122 128,108 Q140,94 140,74 Q140,58 132,46 Q122,26 95,24 Q68,26 58,46Z" fill={sk} stroke={ol} strokeWidth={sw} strokeLinejoin="round"/>
      {/* cheek blush */}
      <ellipse cx="66" cy="90" rx="9" ry="5.5" fill="#e89858" opacity="0.4"/>
      <ellipse cx="124" cy="90" rx="9" ry="5.5" fill="#e89858" opacity="0.4"/>
      {/* ── HAIR (full natural, big volume) ── */}
      {/* back mass */}
      <ellipse cx="95" cy="50" rx="52" ry="46" fill="#1a0a00" stroke={ol} strokeWidth="1.8"/>
      {/* volume detail */}
      <path d="M43,54 Q36,38 46,26 Q52,18 64,22 Q74,12 95,10 Q116,12 126,22 Q138,18 144,26 Q154,38 147,54" stroke="#2a1408" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* hair highlights / curl paths */}
      <path d="M50,42 Q44,54 48,66 Q54,48 58,44Z" fill="#1a0a00"/>
      <path d="M140,42 Q146,54 142,66 Q136,48 132,44Z" fill="#1a0a00"/>
      <path d="M58,28 Q68,18 80,18 Q72,20 68,28 Q64,34 62,42Z" fill="#2a1408"/>
      <path d="M132,28 Q122,18 110,18 Q118,20 122,28 Q126,34 128,42Z" fill="#2a1408"/>
      {/* curl detail strokes */}
      <path d="M50,58 Q46,68 50,74" stroke="#2a1408" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M140,58 Q144,68 140,74" stroke="#2a1408" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* ── EYEBROWS (bold) ── */}
      <path d="M66,60 Q77,52 88,57 Q77,64 66,60Z" fill="#1a0a00" stroke={ol} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M102,57 Q113,52 124,60 Q113,64 102,57Z" fill="#1a0a00" stroke={ol} strokeWidth="1.2" strokeLinejoin="round"/>
      {/* ── EYES (large, expressive) ── */}
      <ComicEye cx={77} cy={72} rx={11} ry={9} iris="#2a1a08" flip={true}/>
      <ComicEye cx={113} cy={72} rx={11} ry={9} iris="#2a1a08"/>
      {/* ── NOSE ── */}
      <path d="M95,84 Q91,91 92,96 Q95,99 98,96 Q99,91 95,84Z" fill="#885020" opacity="0.35"/>
      <path d="M92,96 Q94,99 95,99 Q96,99 98,96" stroke="#885020" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* ── MOUTH (open, expressive) ── */}
      <path d="M80,107 Q87,103 91,104 Q95,102 99,104 Q103,103 110,107" stroke={ol} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      <path d="M80,107 Q95,120 110,107" stroke={ol} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M80,107 Q87,104 95,102 Q103,104 110,107 Q103,118 95,119 Q87,118 80,107Z" fill="#c07858" opacity="0.6"/>
      {/* teeth visible */}
      <path d="M83,109 Q95,116 107,109 L107,113 Q95,116 83,113Z" fill="white" opacity="0.7"/>
    </svg>
  );
}

/* ─── Character data ─────────────────────────────────────────────── */
const CHARACTERS = [
  { id: "maximilian", name: "Maximilian", role: "Keeper · Gardener · Storyteller",
    quote: "He manages the finances, gives story times to kids every week, and tends the garden two or three mornings a week when the city is still quiet.",
    accent: "#ffcc00", infoBg: "#1a0848", figBg: "#f5eed8", SVG: MaximilianSVG, delay: 1 },
  { id: "julian", name: "Julian", role: "Member · Event Organiser",
    quote: "Found Third Home in a student essay. Came for an Easter event — egg hunts, live bands on the rooftop — and never really left.",
    accent: "#ff018f", infoBg: "#0e0a2a", figBg: "#edf0f5", SVG: JulianSVG, delay: 2 },
  { id: "sarah", name: "Sarah", role: "Member · Event Organiser",
    quote: "A year after moving in she had a child and felt genuinely held by the people around her. They now organise weekly events for other children.",
    accent: "#ff6dc0", infoBg: "#1a0848", figBg: "#f5ece8", SVG: SarahSVG, delay: 3 },
  { id: "anouk", name: "Anouk", role: "Performance Artist · Collaborator",
    quote: "First time Anouk could work as a full-time funded artist. They sold all their furniture on eBay and arrived two weeks later.",
    accent: "#ffcc00", infoBg: "#0e0a2a", figBg: "#f8f2d8", SVG: AnoukSVG, delay: 4 },
];

/* ─── Card ───────────────────────────────────────────────────────── */
function CharacterCard({ character }: { character: typeof CHARACTERS[0] }) {
  const { ref, onMove, onLeave } = useTilt();
  const { SVG, name, role, quote, accent, infoBg, figBg, delay } = character;
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className="ch-card rounded-3xl overflow-hidden flex flex-col">
      {/* figure on light background */}
      <div className="relative flex items-end justify-center pt-8 pb-2 px-4" style={{ background: figBg, minHeight: 270 }}>
        <div className={`ch-figure ch-figure-${delay} relative z-10`} style={{ width: 130, maxWidth: "85%" }}>
          <SVG />
        </div>
        <div className={`ch-shadow ch-shadow-${delay} absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full`}
          style={{ width: 68, height: 13, background: "rgba(0,0,0,0.35)" }}/>
      </div>
      {/* info on dark background */}
      <div className="px-5 pb-6 pt-4 flex-1 flex flex-col gap-1.5" style={{ background: infoBg }}>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="text-lg font-bold tracking-tight" style={{ color: accent, fontFamily: "Georgia, serif" }}>{name}</h2>
          <span className="text-xs uppercase tracking-widest opacity-50" style={{ color: "#f0e6ff" }}>{role}</span>
        </div>
        <p className="text-sm leading-relaxed opacity-70 mt-1" style={{ color: "#f0e6ff" }}>"{quote}"</p>
      </div>
      <div className="h-1 w-full" style={{ background: accent }}/>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function CharactersPage() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2 opacity-50" style={{ color: "#f0e6ff" }}>Third Home · Wolfsburg</p>
            <h1 className="text-5xl font-bold leading-tight" style={{ color: "#ffcc00", fontFamily: "Georgia, serif" }}>The People</h1>
            <p className="text-base mt-3 max-w-lg opacity-70" style={{ color: "#f0e6ff" }}>
              Every person who found their way to Third Home arrived with a story. Here are four of them.
            </p>
          </div>
          <Link href="/backstories" className="px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 shrink-0 self-start"
            style={{ background: "#ff018f", color: "white" }}>← Back Stories</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHARACTERS.map(c => <CharacterCard key={c.id} character={c}/>)}
        </div>
      </div>
    </>
  );
}
