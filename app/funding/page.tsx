"use client";
import { useEffect, useState } from "react";

/* ─── Data ───────────────────────────────────────────────────────── */
const PHASES = [
  {
    tag: "Foundation",
    years: "Now — Year 2",
    city: 100,
    home: 0,
    homeColor: "#2a0c62",
    accent: "#ff018f",
    note: "City fully funds all operations. Any budget surplus is moved into a reserve fund to cushion the transition ahead.",
    milestone: "Reserve fund established",
  },
  {
    tag: "Growth",
    years: "Year 5",
    city: 40,
    home: 60,
    homeColor: "#ffcc00",
    accent: "#ffcc00",
    note: "HOME covers 60% of its own costs through memberships, room rentals, and events. The city steps back to an anchor role.",
    milestone: "First self-generated majority",
  },
  {
    tag: "Maturity",
    years: "Year 7",
    city: 20,
    home: 80,
    homeColor: "#ff6dc0",
    accent: "#ff6dc0",
    note: "A small 20% city anchor remains as a safety net while HOME's co-working, café, and licensing revenue matures.",
    milestone: "Model proven — replicable",
  },
  {
    tag: "Independence",
    years: "Year 10+",
    city: 0,
    home: 100,
    homeColor: "#a0f0a0",
    accent: "#a0f0a0",
    note: "HOME is fully self-sustaining. No public funding. A community land trust owns the building — no rent, no landlord.",
    milestone: "Full community ownership",
  },
];

const REVENUE_STREAMS = [
  { icon: "◉", label: "Memberships",        desc: "Monthly fees from residents and community members",    color: "#ffcc00",  from: 1 },
  { icon: "⌂",  label: "Room & Space Rentals", desc: "Private rooms, event spaces, studios for hire",     color: "#ff018f",  from: 1 },
  { icon: "✦",  label: "Events & Workshops",   desc: "Ticketed dinners, performances, skill-sharing",     color: "#ff6dc0",  from: 2 },
  { icon: "⊙",  label: "Co-working",           desc: "Hot desks and meeting rooms for local professionals",color: "#ffe566",  from: 3 },
  { icon: "◎",  label: "Café & Kitchen",        desc: "Community food and drink open to the neighbourhood",color: "#a0f0a0",  from: 3 },
  { icon: "⟳",  label: "Model Licensing",       desc: "Other cities adopting the HOME framework",          color: "#b0d0ff",  from: 5 },
];

const PROTECTIONS = [
  { label: "No governance role", desc: "Neither VW nor the City can vote on decisions, membership, or how the space is run." },
  { label: "No right of return", desc: "Once VW transfers the building to the CLT, it cannot reclaim or sell the asset." },
  { label: "No influence on residents", desc: "Who lives here, how long, and under what terms is decided by the community alone." },
  { label: "Funding ≠ ownership", desc: "Financial support ends. Community ownership is permanent." },
];

/* ─── Animated stacked bar ───────────────────────────────────────── */
function StackedBar({
  city, home, homeColor, accent, visible, delay,
}: {
  city: number; home: number; homeColor: string; accent: string; visible: boolean; delay: number;
}) {
  const cityWidth  = visible ? city  : 0;
  const homeWidth  = visible ? home  : 0;
  const dur = `${0.9 + delay * 0.12}s`;

  return (
    <div className="flex rounded-xl overflow-hidden h-12 w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      {/* City segment */}
      <div
        className="flex items-center justify-center text-xs font-bold overflow-hidden shrink-0"
        style={{
          width: `${cityWidth}%`,
          background: "#ff018f",
          color: "white",
          transition: `width ${dur} cubic-bezier(.4,0,.2,1)`,
          minWidth: city > 0 ? 36 : 0,
        }}
      >
        {city > 0 && `${city}%`}
      </div>
      {/* HOME segment */}
      <div
        className="flex items-center justify-center text-xs font-bold overflow-hidden flex-1"
        style={{
          width: `${homeWidth}%`,
          background: home > 0 ? homeColor : "transparent",
          color: home > 70 ? "#11012e" : "#f0e6ff",
          transition: `width ${dur} cubic-bezier(.4,0,.2,1)`,
          minWidth: home > 0 ? 36 : 0,
        }}
      >
        {home > 0 && `${home}%`}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function FundingPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

      {/* ── Header ── */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-2 opacity-40" style={{ color: "#f0e6ff" }}>
          Third Home · Wolfsburg
        </p>
        <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--warm-brown)", fontFamily: "Georgia, serif" }}>
          Funding Model
        </h1>
        <p className="text-base max-w-2xl leading-relaxed" style={{ color: "#f0e6ff", opacity: 0.7 }}>
          HOME is co-funded by Volkswagen and the City of Wolfsburg — two institutions with a shared stake in the city's future. Both step back over time. The community takes over.
        </p>
      </div>

      {/* ── Founding Partners ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest opacity-40" style={{ color: "#f0e6ff" }}>
          Who funds what
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* VW */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,204,0,0.07)", border: "1px solid rgba(255,204,0,0.2)" }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ background: "#ffcc00", color: "#11012e" }}>
                VW
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "#ffcc00" }}>Volkswagen</div>
                <div className="text-xs opacity-50" style={{ color: "#f0e6ff" }}>Construction Partner</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-65" style={{ color: "#f0e6ff" }}>
              Funds all construction — materials, equipment, and build-out. On completion, VW transfers building ownership to HOME's community land trust. HOME never pays rent.
            </p>
            <div className="space-y-1.5">
              {[
                { l: "Materials & equipment", i: "→" },
                { l: "Full build-out funded", i: "→" },
                { l: "Building transferred to CLT", i: "✓" },
                { l: "No governance rights retained", i: "✓" },
              ].map(r => (
                <div key={r.l} className="flex items-center gap-2 text-xs" style={{ color: "#ffcc00" }}>
                  <span className="opacity-60">{r.i}</span>
                  <span className="opacity-75">{r.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* City */}
          <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,1,143,0.07)", border: "1px solid rgba(255,1,143,0.2)" }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ background: "#ff018f", color: "white" }}>
                WOB
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "#ff018f" }}>City of Wolfsburg</div>
                <div className="text-xs opacity-50" style={{ color: "#f0e6ff" }}>Operations Partner</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-65" style={{ color: "#f0e6ff" }}>
              Funds day-to-day operations and provides governance mentorship in the first two years. Steps back gradually as HOME builds its own revenue. Gone by Year 10.
            </p>
            <div className="space-y-1.5">
              {[
                { l: "100% operations — Years 1–2", i: "→" },
                { l: "Governance support & mentorship", i: "→" },
                { l: "Phased withdrawal over 10 years", i: "→" },
                { l: "No say in who lives here", i: "✓" },
              ].map(r => (
                <div key={r.l} className="flex items-center gap-2 text-xs" style={{ color: "#ff018f" }}>
                  <span className="opacity-60">{r.i}</span>
                  <span className="opacity-75">{r.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Diagram: Path to Independence ── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#f0e6ff", fontFamily: "Georgia, serif" }}>
            Path to independence
          </h2>
          <p className="text-sm opacity-55" style={{ color: "#f0e6ff" }}>
            How the funding split shifts over 10 years
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#ff018f" }}/>
            <span className="text-xs opacity-60" style={{ color: "#f0e6ff" }}>City of Wolfsburg</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#ffcc00" }}/>
            <span className="text-xs opacity-60" style={{ color: "#f0e6ff" }}>HOME (self-generated)</span>
          </div>
        </div>

        {/* Stacked bar rows */}
        <div className="space-y-3">
          {PHASES.map((phase, i) => (
            <div key={phase.tag} className="grid items-center gap-4" style={{ gridTemplateColumns: "7rem 1fr auto" }}>
              {/* Label */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: phase.accent }}>
                  {phase.tag}
                </div>
                <div className="text-xs opacity-45" style={{ color: "#f0e6ff" }}>{phase.years}</div>
              </div>
              {/* Bar */}
              <StackedBar
                city={phase.city}
                home={phase.home}
                homeColor={phase.homeColor}
                accent={phase.accent}
                visible={visible}
                delay={i}
              />
              {/* Milestone */}
              <div className="hidden sm:block text-xs opacity-40 text-right whitespace-nowrap" style={{ color: "#f0e6ff", minWidth: "10rem" }}>
                {phase.milestone}
              </div>
            </div>
          ))}
        </div>

        {/* Phase detail cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {PHASES.map((phase) => (
            <div
              key={phase.tag}
              className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${phase.accent}30` }}
            >
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.accent }}>
                {phase.years}
              </div>
              <p className="text-xs leading-relaxed opacity-60" style={{ color: "#f0e6ff" }}>
                {phase.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Revenue Streams ── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#f0e6ff", fontFamily: "Georgia, serif" }}>
            How HOME earns its own income
          </h2>
          <p className="text-sm opacity-55" style={{ color: "#f0e6ff" }}>
            Six revenue streams replace public funding over time
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVENUE_STREAMS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-5 flex gap-4 items-start"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}25` }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 font-bold"
                style={{ background: `${s.color}18`, color: s.color }}
              >
                {s.icon}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: s.color }}>{s.label}</div>
                <p className="text-xs leading-relaxed opacity-55" style={{ color: "#f0e6ff" }}>{s.desc}</p>
                <div className="text-xs opacity-40" style={{ color: "#f0e6ff" }}>
                  Active from Year {s.from}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue build-up timeline */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="text-xs font-semibold uppercase tracking-widest opacity-50" style={{ color: "#f0e6ff" }}>
            Revenue builds up gradually
          </div>
          <div className="space-y-3">
            {[
              { year: "Year 1", streams: ["Memberships", "Room Rentals"], pct: 20 },
              { year: "Year 3", streams: ["Memberships", "Room Rentals", "Events", "Co-working"], pct: 50 },
              { year: "Year 5", streams: ["Memberships", "Room Rentals", "Events", "Co-working", "Café"], pct: 60 },
              { year: "Year 10", streams: ["All 6 streams active"], pct: 100 },
            ].map((row) => (
              <div key={row.year} className="flex items-center gap-4">
                <div className="text-xs font-bold w-12 shrink-0" style={{ color: "#ffcc00" }}>{row.year}</div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: visible ? `${row.pct}%` : "0%",
                      background: "linear-gradient(to right, #ffcc00, #a0f0a0)",
                      transition: "width 1.2s cubic-bezier(.4,0,.2,1) 0.4s",
                    }}
                  />
                </div>
                <div className="text-xs opacity-50 shrink-0 hidden sm:block" style={{ color: "#f0e6ff", minWidth: "16rem" }}>
                  {row.streams.join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Governance Protections ── */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "#f0e6ff", fontFamily: "Georgia, serif" }}>
            What funders don't get
          </h2>
          <p className="text-sm opacity-55" style={{ color: "#f0e6ff" }}>
            Funding HOME is not the same as owning it
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROTECTIONS.map((p) => (
            <div
              key={p.label}
              className="rounded-xl p-5 flex gap-4"
              style={{ background: "rgba(160,240,160,0.05)", border: "1px solid rgba(160,240,160,0.15)" }}
            >
              <div className="text-base shrink-0 mt-0.5" style={{ color: "#a0f0a0" }}>✗</div>
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "#a0f0a0" }}>{p.label}</div>
                <p className="text-xs leading-relaxed opacity-60" style={{ color: "#f0e6ff" }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom summary ── */}
      <div
        className="rounded-2xl p-7 text-center space-y-2"
        style={{ background: "rgba(255,204,0,0.06)", border: "1px solid rgba(255,204,0,0.2)" }}
      >
        <div className="text-2xl font-bold" style={{ color: "#ffcc00", fontFamily: "Georgia, serif" }}>
          By Year 10, HOME belongs to no one but its community.
        </div>
        <p className="text-sm opacity-60 max-w-xl mx-auto leading-relaxed" style={{ color: "#f0e6ff" }}>
          VW builds it. Wolfsburg launches it. The community runs it — and eventually owns it outright through a community land trust that can never be sold.
        </p>
      </div>
    </div>
  );
}
