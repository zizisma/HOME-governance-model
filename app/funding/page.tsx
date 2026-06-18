"use client";

const PHASES = [
  {
    label: "Now — Year 2",
    tag: "Launch",
    stateShare: 100,
    homeShare: 0,
    description: "City of Wolfsburg covers all operating costs while HOME establishes its community and revenue streams.",
    accent: "#ff018f",
  },
  {
    label: "Year 5",
    tag: "Growth",
    stateShare: 40,
    homeShare: 60,
    description: "HOME is generating 60% of its own operating costs through memberships, events, and partnerships.",
    accent: "#ffcc00",
  },
  {
    label: "Year 7+",
    tag: "Independence",
    stateShare: 0,
    homeShare: 100,
    description: "HOME is fully self-sufficient. No public funding required. A proven model for community-led living.",
    accent: "#a0f0a0",
  },
];

function Bar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <div className="text-xs font-semibold uppercase tracking-widest opacity-60" style={{ color: "#f0e6ff" }}>
        {label}
      </div>
      <div className="relative h-36 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div
          className="absolute bottom-0 left-0 right-0 rounded-xl transition-all duration-700"
          style={{ height: `${value}%`, background: color }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
          style={{ color: value > 30 ? "#11012e" : "#f0e6ff" }}
        >
          {value}%
        </div>
      </div>
    </div>
  );
}

function PhaseCard({ phase, index }: { phase: typeof PHASES[0]; index: number }) {
  const isLast = index === PHASES.length - 1;
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4">
      {/* phase header */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: phase.accent, color: "#11012e" }}
        >
          {index + 1}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: phase.accent }}>
            {phase.tag}
          </div>
          <div className="text-sm font-medium" style={{ color: "#f0e6ff" }}>
            {phase.label}
          </div>
        </div>
      </div>

      {/* bar chart */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex gap-3">
          <Bar value={phase.stateShare} color="#ff018f" label="City / State" />
          <Bar value={phase.homeShare} color={phase.accent} label="HOME" />
        </div>
      </div>

      {/* description */}
      <p className="text-sm leading-relaxed opacity-65" style={{ color: "#f0e6ff" }}>
        {phase.description}
      </p>

      {/* connector arrow */}
      {!isLast && (
        <div className="hidden lg:flex justify-end pr-0 items-center">
          <div className="text-2xl opacity-25" style={{ color: "#f0e6ff" }}>→</div>
        </div>
      )}
    </div>
  );
}

export default function FundingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest mb-2 opacity-50" style={{ color: "#f0e6ff" }}>
          Third Home · Wolfsburg
        </p>
        <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--warm-brown)", fontFamily: "Georgia, serif" }}>
          Funding Model
        </h1>
        <p className="text-base max-w-2xl opacity-70" style={{ color: "#f0e6ff" }}>
          HOME is built on a partnership between two institutions that share a vision for Wolfsburg — and a plan to hand full control back to the community.
        </p>
      </div>

      {/* Founding partners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {/* VW card */}
        <div
          className="rounded-2xl p-6 flex flex-col gap-3"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: "#ffcc00", color: "#11012e" }}
            >
              VW
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "#ffcc00" }}>Volkswagen</div>
              <div className="text-xs opacity-50" style={{ color: "#f0e6ff" }}>Construction Partner</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-65" style={{ color: "#f0e6ff" }}>
            Funds all construction costs — materials, equipment, and build-out of the space. VW's investment in HOME is part of its broader commitment to Wolfsburg's social fabric.
          </p>
          <div className="flex gap-2 flex-wrap mt-1">
            {["Materials", "Equipment", "Build-out"].map(t => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(255,204,0,0.15)", color: "#ffcc00" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* City card */}
        <div
          className="rounded-2xl p-6 flex flex-col gap-3"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: "#ff018f", color: "white" }}
            >
              WOB
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "#ff018f" }}>City of Wolfsburg</div>
              <div className="text-xs opacity-50" style={{ color: "#f0e6ff" }}>Operations Partner</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-65" style={{ color: "#f0e6ff" }}>
            Funds the day-to-day operations and running of the space, stepping back gradually as HOME grows its own revenue and community ownership.
          </p>
          <div className="flex gap-2 flex-wrap mt-1">
            {["Operations", "Staffing", "Programming"].map(t => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(255,1,143,0.15)", color: "#ff018f" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        <span className="text-xs uppercase tracking-widest opacity-40" style={{ color: "#f0e6ff" }}>
          Path to self-sufficiency
        </span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
      </div>

      {/* Phase timeline */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 mb-14">
        {PHASES.map((phase, i) => (
          <PhaseCard key={phase.tag} phase={phase} index={i} />
        ))}
      </div>

      {/* Summary strip */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: "rgba(160,240,160,0.08)", border: "1px solid rgba(160,240,160,0.2)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ background: "rgba(160,240,160,0.2)" }}
        >
          ✦
        </div>
        <div>
          <div className="text-sm font-bold mb-1" style={{ color: "#a0f0a0" }}>
            The goal: a community that owns itself
          </div>
          <p className="text-sm opacity-65 leading-relaxed" style={{ color: "#f0e6ff" }}>
            Neither VW nor the City of Wolfsburg have any say in how HOME is governed or who lives there. Their funding enables the space — the community shapes everything inside it.
          </p>
        </div>
      </div>
    </div>
  );
}
