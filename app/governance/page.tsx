"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  proposals as seedProposals,
  meetings as seedMeetings,
  roleConfig,
  groupConfig,
  Proposal,
  Concern,
  Block,
  Meeting,
  Group,
} from "@/lib/data";
import { daysUntil, cn } from "@/lib/utils";

// ── Maps ──────────────────────────────────────────────────────────────────────

const categoryLabel: Record<string, string> = {
  daily: "Daily ops",
  community: "Community",
  structural: "Structural",
};

const categoryColor: Record<string, string> = {
  daily: "bg-[#E8DDD0] text-[#2C1A0E]",
  community: "bg-[#6B7C4E] text-white",
  structural: "bg-[#C5603B] text-white",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Open — silence = consent", color: "text-[#6B7C4E]" },
  consented: { label: "Consented", color: "text-[#6B7C4E] font-semibold" },
  blocked: { label: "Blocked", color: "text-[#C5603B]" },
  withdrawn: { label: "Withdrawn", color: "text-[#8C7B6E]" },
};

// ── Types ─────────────────────────────────────────────────────────────────────

type UserAction = "consented" | "concerned" | "blocked" | null;
type MeetingRSVP = "attending" | "declining" | null;
type Tab = "proposals" | "weekly" | "biweekly";

interface LocalState {
  extraConsenters: number;
  extraConcerns: Concern[];
  extraBlocks: Block[];
  userAction: UserAction;
}

interface NewProposal {
  id: string;
  title: string;
  description: string;
  category: "daily" | "community" | "structural";
  proposedBy: string;
  role: "member" | "keeper";
  pending: true;
}

// ── ProposalCard ──────────────────────────────────────────────────────────────

function ProposalCard({
  proposal,
  localState,
  canVote,
  onConsent,
  onConcern,
  onBlock,
  pending,
}: {
  proposal: Proposal;
  localState: LocalState;
  canVote: boolean;
  onConsent: () => void;
  onConcern: (text: string) => void;
  onBlock: (reason: string) => void;
  pending?: boolean;
}) {
  const [expanded, setExpanded] = useState(pending ?? false);
  const [activeForm, setActiveForm] = useState<"concern" | "block" | null>(null);
  const [inputText, setInputText] = useState("");

  const days = daysUntil(proposal.deadlineAt);
  const isOpen = proposal.status === "open";

  const allConcerns = [...proposal.concerns, ...localState.extraConcerns];
  const allBlocks = [...proposal.blocks, ...localState.extraBlocks];
  const totalConsenters = proposal.silentConsenters + localState.extraConsenters;
  const hasBlock = allBlocks.length > 0;
  const { userAction } = localState;

  function submitConcern() {
    if (!inputText.trim()) return;
    onConcern(inputText.trim());
    setInputText("");
    setActiveForm(null);
  }

  function submitBlock() {
    if (!inputText.trim()) return;
    onBlock(inputText.trim());
    setInputText("");
    setActiveForm(null);
  }

  function openForm(form: "concern" | "block") {
    setActiveForm(activeForm === form ? null : form);
    setInputText("");
    if (!expanded) setExpanded(true);
  }

  return (
    <div
      className="rounded-2xl p-6 border-2 transition-all"
      style={{
        background: "var(--sand)",
        borderColor: pending ? "var(--olive)" : hasBlock ? "var(--terracotta)" : "transparent",
      }}
    >
      {pending && (
        <div className="text-xs font-semibold mb-3 px-3 py-1 rounded-full inline-block" style={{ background: "#D4EAD0", color: "#2C4A2E" }}>
          ✓ Submitted — awaiting community review
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[proposal.category]}`}>
              {categoryLabel[proposal.category]}
            </span>
            {!pending && (
              <span className={`text-xs ${statusConfig[proposal.status].color}`}>
                {statusConfig[proposal.status].label}
              </span>
            )}
            {hasBlock && (
              <span className="text-xs font-medium" style={{ color: "var(--terracotta)" }}>
                ⚠ {allBlocks.length} block{allBlocks.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base" style={{ color: "var(--warm-brown)" }}>
            {proposal.title}
          </h3>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            by <span className="font-medium">{proposal.proposedBy}</span> ({roleConfig[proposal.role].label})
            {isOpen && !pending && (
              <span className={cn("ml-2", days <= 3 ? "text-[var(--terracotta)] font-semibold" : "")}>
                · {days > 0 ? `${days}d left` : "deadline passed"}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs px-3 py-1 rounded-full shrink-0"
          style={{ background: "var(--sand-dark)", color: "var(--warm-brown)" }}
        >
          {expanded ? "Less" : "More"}
        </button>
      </div>

      {isOpen && !pending && (
        <div className="mb-4">
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            {totalConsenters} silent consenter{totalConsenters !== 1 ? "s" : ""} · {allConcerns.length} concern{allConcerns.length !== 1 ? "s" : ""}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--sand-dark)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((totalConsenters / 12) * 100, 100)}%`,
                background: hasBlock ? "var(--terracotta)" : "var(--olive)",
              }}
            />
          </div>
        </div>
      )}

      {expanded && (
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "var(--warm-brown)" }}>
            {proposal.description}
          </p>

          {allConcerns.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>Concerns raised:</p>
              {allConcerns.map((c, i) => (
                <div key={i} className="text-sm rounded-xl p-3 mb-2" style={{ background: "var(--cream)" }}>
                  <span className="font-medium">{c.by}:</span> {c.text}
                </div>
              ))}
            </div>
          )}

          {allBlocks.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--terracotta)" }}>Blocks:</p>
              {allBlocks.map((b, i) => (
                <div key={i} className="text-sm rounded-xl p-3 mb-2 border" style={{ background: "var(--cream)", borderColor: "var(--terracotta)" }}>
                  <span className="font-medium">{b.by}:</span> {b.reason}
                </div>
              ))}
            </div>
          )}

          {canVote && isOpen && !pending && (
            <div className="pt-2 space-y-3">
              {userAction === null && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={onConsent}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-80"
                    style={{ background: "var(--olive)" }}
                  >
                    Consent silently
                  </button>
                  <button
                    onClick={() => openForm("concern")}
                    className="px-4 py-2 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{
                      background: activeForm === "concern" ? "var(--warm-brown)" : "var(--sand-dark)",
                      color: activeForm === "concern" ? "white" : "var(--warm-brown)",
                    }}
                  >
                    Raise a concern
                  </button>
                  <button
                    onClick={() => openForm("block")}
                    className="px-4 py-2 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{
                      background: activeForm === "block" ? "var(--terracotta)" : "var(--cream)",
                      color: activeForm === "block" ? "white" : "var(--terracotta)",
                    }}
                  >
                    Block
                  </button>
                </div>
              )}

              {userAction === "consented" && (
                <div className="text-xs font-medium px-4 py-2 rounded-full inline-block" style={{ background: "#D4EAD0", color: "#2C4A2E" }}>
                  ✓ You consented silently
                </div>
              )}
              {userAction === "concerned" && (
                <div className="text-xs font-medium px-4 py-2 rounded-full inline-block" style={{ background: "var(--sand-dark)", color: "var(--warm-brown)" }}>
                  ✓ Concern submitted
                </div>
              )}
              {userAction === "blocked" && (
                <div className="text-xs font-medium px-4 py-2 rounded-full inline-block" style={{ background: "#FDE8E0", color: "var(--terracotta)" }}>
                  ✓ Block recorded
                </div>
              )}

              {activeForm === "concern" && userAction === null && (
                <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--cream)" }}>
                  <p className="text-xs font-semibold" style={{ color: "var(--warm-brown)" }}>Raise a concern</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    A concern doesn&apos;t stop the proposal — it invites a response before the deadline.
                  </p>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Describe your concern..."
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 text-sm border resize-none focus:outline-none"
                    style={{ background: "var(--sand)", borderColor: "var(--sand-dark)", color: "var(--warm-brown)" }}
                  />
                  <div className="flex gap-2">
                    <button onClick={submitConcern} disabled={!inputText.trim()} className="px-4 py-1.5 rounded-full text-xs font-semibold text-white disabled:opacity-40" style={{ background: "var(--warm-brown)" }}>
                      Submit concern
                    </button>
                    <button onClick={() => { setActiveForm(null); setInputText(""); }} className="px-4 py-1.5 rounded-full text-xs" style={{ color: "var(--muted)" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {activeForm === "block" && userAction === null && (
                <div className="rounded-xl p-4 space-y-3 border" style={{ background: "var(--cream)", borderColor: "var(--terracotta)" }}>
                  <p className="text-xs font-semibold" style={{ color: "var(--terracotta)" }}>Block this proposal</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    A block stops the proposal until your objection is resolved. Use only when this would cause genuine harm.
                  </p>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Explain why you're blocking..."
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 text-sm border resize-none focus:outline-none"
                    style={{ background: "var(--sand)", borderColor: "var(--terracotta)", color: "var(--warm-brown)" }}
                  />
                  <div className="flex gap-2">
                    <button onClick={submitBlock} disabled={!inputText.trim()} className="px-4 py-1.5 rounded-full text-xs font-semibold text-white disabled:opacity-40" style={{ background: "var(--terracotta)" }}>
                      Confirm block
                    </button>
                    <button onClick={() => { setActiveForm(null); setInputText(""); }} className="px-4 py-1.5 rounded-full text-xs" style={{ color: "var(--muted)" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── NewProposalForm ───────────────────────────────────────────────────────────

function NewProposalForm({
  role,
  onSubmit,
  onCancel,
}: {
  role: "member" | "keeper";
  onSubmit: (p: NewProposal) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"daily" | "community" | "structural">("community");

  const categories = role === "keeper"
    ? (["daily", "community", "structural"] as const)
    : (["daily", "community"] as const);

  function submit() {
    if (!title.trim() || !description.trim()) return;
    onSubmit({
      id: `new-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      proposedBy: "You",
      role,
      pending: true,
    });
  }

  return (
    <div className="rounded-2xl p-6 border-2" style={{ background: "var(--sand)", borderColor: "var(--olive)" }}>
      <h3 className="font-semibold text-base mb-1" style={{ color: "var(--warm-brown)" }}>New proposal</h3>
      <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>
        Once submitted, this will open for community review. Silence by the deadline counts as consent.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold block mb-2" style={{ color: "var(--muted)" }}>Type</label>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background: category === c
                    ? c === "structural" ? "var(--terracotta)" : c === "community" ? "var(--olive)" : "var(--sand-dark)"
                    : "var(--cream)",
                  color: category === c
                    ? c === "daily" ? "var(--warm-brown)" : "white"
                    : "var(--muted)",
                }}
              >
                {categoryLabel[c]}
              </button>
            ))}
          </div>
          {category === "structural" && (
            <p className="text-xs mt-2" style={{ color: "var(--terracotta)" }}>
              Structural proposals require unanimous Keeper consent and stay open 30 days.
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A short, clear description of what you're proposing..."
            className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
            style={{ background: "var(--cream)", borderColor: "var(--sand-dark)", color: "var(--warm-brown)" }}
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Details</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what you're proposing and why. Include any costs, logistics, or things people should know before deciding..."
            rows={4}
            className="w-full rounded-lg px-3 py-2 text-sm border resize-none focus:outline-none"
            style={{ background: "var(--cream)", borderColor: "var(--sand-dark)", color: "var(--warm-brown)" }}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={submit}
            disabled={!title.trim() || !description.trim()}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-40 transition-opacity hover:opacity-90"
            style={{ background: "var(--olive)" }}
          >
            Submit proposal
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-full text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MeetingCard ───────────────────────────────────────────────────────────────

function MeetingCard({
  meeting,
  rsvp,
  canRSVP,
  onAttend,
  onDecline,
  onReset,
}: {
  meeting: Meeting;
  rsvp: MeetingRSVP;
  canRSVP: boolean;
  onAttend: () => void;
  onDecline: () => void;
  onReset: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPast = new Date(meeting.suggestedDate) < new Date();

  return (
    <div
      className="rounded-2xl p-5 border-2 transition-all"
      style={{
        background: "var(--sand)",
        borderColor:
          rsvp === "attending" ? "var(--olive)" :
          rsvp === "declining" ? "var(--terracotta)" :
          "transparent",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {meeting.group && (
            <div className="mb-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: groupConfig[meeting.group].bgColor,
                  color: groupConfig[meeting.group].textColor,
                }}
              >
                {groupConfig[meeting.group].label} · {groupConfig[meeting.group].floors}
              </span>
            </div>
          )}
          <div className="font-semibold text-sm" style={{ color: "var(--warm-brown)" }}>
            {new Date(meeting.suggestedDate).toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long",
            })} at {meeting.suggestedTime}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Suggested by <span className="font-medium">{meeting.suggestedBy}</span>{" "}
            ({roleConfig[meeting.proposerRole].label})
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs px-3 py-1 rounded-full shrink-0"
          style={{ background: "var(--sand-dark)", color: "var(--warm-brown)" }}
        >
          {expanded ? "Less" : "Agenda"}
        </button>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <span className="text-xs font-medium" style={{ color: "var(--olive)" }}>
          ✓ {meeting.attendees.length} attending
        </span>
        {meeting.declines.length > 0 && (
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            ✗ {meeting.declines.length} can&apos;t make it
          </span>
        )}
        {isPast && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--sand-dark)", color: "var(--muted)" }}
          >
            Past
          </span>
        )}
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Agenda</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--warm-brown)" }}>{meeting.agenda}</p>
          </div>
          {meeting.attendees.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Confirmed attending</p>
              <div className="flex flex-wrap gap-1">
                {meeting.attendees.map((a) => (
                  <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#D4EAD0", color: "#2C4A2E" }}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
          {meeting.declines.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Can&apos;t make it</p>
              <div className="flex flex-wrap gap-1">
                {meeting.declines.map((d) => (
                  <span key={d} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--sand-dark)", color: "var(--muted)" }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {canRSVP && !isPast && (
        <div className="flex gap-2 mt-4 items-center flex-wrap">
          {rsvp === null && (
            <>
              <button
                onClick={onAttend}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: "var(--olive)" }}
              >
                I&apos;m attending
              </button>
              <button
                onClick={onDecline}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: "var(--cream)", color: "var(--muted)" }}
              >
                Can&apos;t make it
              </button>
            </>
          )}
          {rsvp === "attending" && (
            <>
              <span className="text-xs px-4 py-1.5 rounded-full font-medium" style={{ background: "#D4EAD0", color: "#2C4A2E" }}>
                ✓ You&apos;re attending
              </span>
              <button
                onClick={onReset}
                className="text-xs transition-opacity hover:opacity-80 underline"
                style={{ color: "var(--muted)" }}
              >
                Change
              </button>
            </>
          )}
          {rsvp === "declining" && (
            <>
              <span className="text-xs px-4 py-1.5 rounded-full font-medium" style={{ background: "var(--sand-dark)", color: "var(--muted)" }}>
                ✗ You declined
              </span>
              <button
                onClick={onReset}
                className="text-xs transition-opacity hover:opacity-80 underline"
                style={{ color: "var(--muted)" }}
              >
                Change
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── SuggestMeetingForm ────────────────────────────────────────────────────────

function SuggestMeetingForm({
  type,
  group,
  proposerRole,
  onSubmit,
  onCancel,
}: {
  type: "weekly" | "biweekly";
  group: Group | null;
  proposerRole: "member" | "keeper";
  onSubmit: (m: Meeting) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [agenda, setAgenda] = useState("");

  function submit() {
    if (!date || !agenda.trim()) return;
    onSubmit({
      id: `m-${Date.now()}`,
      type,
      group,
      suggestedBy: "You",
      proposerRole,
      suggestedDate: date,
      suggestedTime: time,
      agenda: agenda.trim(),
      attendees: ["You"],
      declines: [],
    });
  }

  return (
    <div className="rounded-2xl p-5 border-2" style={{ background: "var(--sand)", borderColor: "var(--olive)" }}>
      <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--warm-brown)" }}>
        {type === "weekly"
          ? `Suggest a weekly meeting${group ? ` · ${groupConfig[group].label}` : ""}`
          : "Suggest a biweekly Keeper meeting"}
      </h3>
      <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
        {type === "weekly"
          ? "Propose a time for your group to meet. Members and Keepers can mark their attendance once posted."
          : "Propose a time for all Keepers to meet across all three groups. For constitutional decisions."}
      </p>

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
              style={{ background: "var(--cream)", borderColor: "var(--sand-dark)", color: "var(--warm-brown)" }}
            />
          </div>
          <div className="w-28">
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
              style={{ background: "var(--cream)", borderColor: "var(--sand-dark)", color: "var(--warm-brown)" }}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Agenda</label>
          <textarea
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            placeholder="What needs to be discussed at this meeting?"
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-sm border resize-none focus:outline-none"
            style={{ background: "var(--cream)", borderColor: "var(--sand-dark)", color: "var(--warm-brown)" }}
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={submit}
            disabled={!date || !agenda.trim()}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-40 transition-opacity hover:opacity-90"
            style={{ background: "var(--olive)" }}
          >
            Suggest meeting
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-full text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const emptyLocalState: LocalState = {
  extraConsenters: 0,
  extraConcerns: [],
  extraBlocks: [],
  userAction: null,
};

function newToProposal(p: NewProposal): Proposal {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    proposedBy: p.proposedBy,
    role: p.role,
    category: p.category,
    status: "open",
    createdAt: new Date().toISOString().slice(0, 10),
    deadlineAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    silentConsenters: 0,
    blocks: [],
    concerns: [],
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GovernancePage() {
  const { role } = useRole();

  // tab
  const [activeTab, setActiveTab] = useState<Tab>("proposals");

  // proposals
  const [filter, setFilter] = useState<"all" | "open" | "closed">("open");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProposals, setNewProposals] = useState<NewProposal[]>([]);
  const [localStates, setLocalStates] = useState<Record<string, LocalState>>(() =>
    Object.fromEntries(seedProposals.map((p) => [p.id, { ...emptyLocalState }]))
  );

  // meetings
  const [userGroup, setUserGroup] = useState<Group>("group1");
  const [allMeetings, setAllMeetings] = useState<Meeting[]>(seedMeetings);
  const [meetingRSVPs, setMeetingRSVPs] = useState<Record<string, MeetingRSVP>>({});
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);
  const [showBiweeklyForm, setShowBiweeklyForm] = useState(false);

  const canVote = role === "member" || role === "keeper";
  const canPropose = role === "member" || role === "keeper";
  const isKeeper = role === "keeper";

  // proposal handlers
  function handleConsent(id: string) {
    setLocalStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], extraConsenters: prev[id].extraConsenters + 1, userAction: "consented" },
    }));
  }

  function handleConcern(id: string, text: string) {
    setLocalStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], extraConcerns: [...prev[id].extraConcerns, { by: "You", text }], userAction: "concerned" },
    }));
  }

  function handleBlock(id: string, reason: string) {
    setLocalStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], extraBlocks: [...prev[id].extraBlocks, { by: "You", reason }], userAction: "blocked" },
    }));
  }

  function handleNewProposal(p: NewProposal) {
    setNewProposals((prev) => [p, ...prev]);
    setShowNewForm(false);
  }

  // meeting handlers
  function handleMeetingRSVP(id: string, decision: "attending" | "declining") {
    setMeetingRSVPs((prev) => ({ ...prev, [id]: decision }));
    setAllMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (decision === "attending") {
          return {
            ...m,
            attendees: [...m.attendees.filter((a) => a !== "You"), "You"],
            declines: m.declines.filter((d) => d !== "You"),
          };
        }
        return {
          ...m,
          declines: [...m.declines.filter((d) => d !== "You"), "You"],
          attendees: m.attendees.filter((a) => a !== "You"),
        };
      })
    );
  }

  function handleResetRSVP(id: string) {
    setMeetingRSVPs((prev) => ({ ...prev, [id]: null }));
    setAllMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          attendees: m.attendees.filter((a) => a !== "You"),
          declines: m.declines.filter((d) => d !== "You"),
        };
      })
    );
  }

  function handleNewMeeting(m: Meeting) {
    setAllMeetings((prev) => [m, ...prev]);
    if (m.type === "weekly") setShowWeeklyForm(false);
    else setShowBiweeklyForm(false);
  }

  const filtered = seedProposals.filter((p) => {
    if (filter === "open") return p.status === "open";
    if (filter === "closed") return p.status !== "open";
    return true;
  });
  const openCount = seedProposals.filter((p) => p.status === "open").length;

  const weeklyMeetings = allMeetings.filter((m) => m.type === "weekly" && m.group === userGroup);
  const biweeklyMeetings = allMeetings.filter((m) => m.type === "biweekly");

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3" style={{ color: "var(--warm-brown)" }}>Governance</h1>
        <p className="text-base max-w-2xl" style={{ color: "var(--muted)" }}>
          Third Home runs on consent across three groups managing six floors. Proposals are open for a set
          period — silence means agreement. Meetings are organised within groups weekly, and across
          groups biweekly.
        </p>
      </div>

      {/* Groups overview */}
      <section className="grid grid-cols-3 gap-3 mb-8">
        {(["group1", "group2", "group3"] as Group[]).map((g) => (
          <div key={g} className="rounded-xl p-4" style={{ background: groupConfig[g].bgColor }}>
            <div className="font-bold text-sm mb-0.5" style={{ color: groupConfig[g].textColor }}>
              {groupConfig[g].label}
            </div>
            <div className="text-xs mb-3 font-medium" style={{ color: groupConfig[g].textColor, opacity: 0.7 }}>
              {groupConfig[g].floors}
            </div>
            <div className="space-y-0.5 text-xs" style={{ color: groupConfig[g].textColor }}>
              <div>Keepers: <span className="font-semibold">2–3</span></div>
              <div>Members: <span className="font-semibold">8–10</span></div>
              <div>Guests: <span className="font-semibold">7–10</span></div>
            </div>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b" style={{ borderColor: "var(--sand-dark)" }}>
        {([
          { id: "proposals" as Tab, label: "Proposals" },
          { id: "weekly" as Tab, label: "Weekly Meetings" },
          { id: "biweekly" as Tab, label: "Biweekly Meetings" },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-5 py-2.5 text-sm font-medium transition-all -mb-px border-b-2"
            style={{
              borderColor: activeTab === t.id ? "var(--terracotta)" : "transparent",
              color: activeTab === t.id ? "var(--terracotta)" : "var(--muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Proposals tab ─────────────────────────────────────────────────── */}
      {activeTab === "proposals" && (
        <>
          <section className="rounded-2xl p-6 mb-10" style={{ background: "var(--sand)" }}>
            <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--warm-brown)" }}>Decision tiers</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  label: "Instant / Daily",
                  color: "var(--sand-dark)", textColor: "var(--warm-brown)",
                  desc: "Whoever is present decides on the spot. Food, welcoming new guests, fixing small things.",
                },
                {
                  label: "Weekly group meetings",
                  color: "var(--olive)", textColor: "#11012e",
                  desc: "More complex decisions in weekly group meetings. Planning events, changing cleaning tasks, addressing noise.",
                },
                {
                  label: "Biweekly Keeper meetings",
                  color: "var(--terracotta)", textColor: "white",
                  desc: "Constitutional decisions across all groups. New Keepers or Members, financial decisions, cross-group cooperation.",
                },
              ].map((tier) => (
                <div key={tier.label} className="rounded-xl p-4" style={{ background: tier.color }}>
                  <div className="font-bold text-sm mb-1" style={{ color: tier.textColor }}>{tier.label}</div>
                  <p className="text-xs leading-relaxed" style={{ color: tier.textColor, opacity: 0.85 }}>{tier.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {!canVote && (
            <div className="rounded-xl px-5 py-3 mb-8 text-sm" style={{ background: "var(--sand)", color: "var(--muted)" }}>
              You&apos;re viewing as a <strong style={{ color: "var(--warm-brown)" }}>Guest</strong>. Switch to Member or Keeper using the role selector in the nav to participate.
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {(["open", "all", "closed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
                  style={{
                    background: filter === f ? "var(--warm-brown)" : "var(--sand)",
                    color: filter === f ? "var(--cream)" : "var(--muted)",
                  }}
                >
                  {f} {f === "open" && `(${openCount})`}
                </button>
              ))}
            </div>
            {canPropose && !showNewForm && (
              <button
                onClick={() => setShowNewForm(true)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--olive)" }}
              >
                + New proposal
              </button>
            )}
          </div>

          {showNewForm && canPropose && (
            <div className="mb-6">
              <NewProposalForm
                role={role as "member" | "keeper"}
                onSubmit={handleNewProposal}
                onCancel={() => setShowNewForm(false)}
              />
            </div>
          )}

          {newProposals.length > 0 && (
            <div className="space-y-4 mb-4">
              {newProposals.map((p) => (
                <ProposalCard
                  key={p.id}
                  proposal={newToProposal(p)}
                  localState={emptyLocalState}
                  canVote={false}
                  onConsent={() => {}}
                  onConcern={() => {}}
                  onBlock={() => {}}
                  pending
                />
              ))}
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((p) => (
              <ProposalCard
                key={p.id}
                proposal={p}
                localState={localStates[p.id]}
                canVote={canVote}
                onConsent={() => handleConsent(p.id)}
                onConcern={(text) => handleConcern(p.id, text)}
                onBlock={(reason) => handleBlock(p.id, reason)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Weekly meetings tab ───────────────────────────────────────────── */}
      {activeTab === "weekly" && (
        <div>
          <div className="rounded-xl p-4 mb-6" style={{ background: "var(--sand)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Weekly meetings happen within each group — Keepers, Members and Guests plan and arrange
              together. These cover <strong style={{ color: "var(--warm-brown)" }}>more complex decisions</strong> like
              planning events, changing cleaning tasks, or addressing noise.
            </p>
          </div>

          {/* Group selector */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>Your group:</span>
            <div className="flex gap-2 flex-wrap">
              {(["group1", "group2", "group3"] as Group[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setUserGroup(g)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2"
                  style={{
                    background: userGroup === g ? groupConfig[g].bgColor : "var(--sand)",
                    color: userGroup === g ? groupConfig[g].textColor : "var(--muted)",
                    borderColor: userGroup === g ? groupConfig[g].textColor : "transparent",
                  }}
                >
                  {groupConfig[g].label} · {groupConfig[g].floors}
                </button>
              ))}
            </div>
          </div>

          {!canVote && (
            <div className="rounded-xl px-5 py-3 mb-6 text-sm" style={{ background: "var(--sand)", color: "var(--muted)" }}>
              You&apos;re viewing as a <strong style={{ color: "var(--warm-brown)" }}>Guest</strong>. Switch to Member or Keeper to suggest or RSVP to meetings.
            </div>
          )}

          {canVote && !showWeeklyForm && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowWeeklyForm(true)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--olive)" }}
              >
                + Suggest weekly meeting
              </button>
            </div>
          )}

          {showWeeklyForm && canVote && (
            <div className="mb-6">
              <SuggestMeetingForm
                type="weekly"
                group={userGroup}
                proposerRole={role as "member" | "keeper"}
                onSubmit={handleNewMeeting}
                onCancel={() => setShowWeeklyForm(false)}
              />
            </div>
          )}

          <div className="space-y-4">
            {weeklyMeetings.length === 0 ? (
              <div className="text-sm text-center py-12 rounded-2xl" style={{ background: "var(--sand)", color: "var(--muted)" }}>
                No weekly meetings suggested yet for {groupConfig[userGroup].label}.
                {canVote && " Be the first to suggest one."}
              </div>
            ) : (
              weeklyMeetings.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  rsvp={meetingRSVPs[m.id] ?? null}
                  canRSVP={canVote}
                  onAttend={() => handleMeetingRSVP(m.id, "attending")}
                  onDecline={() => handleMeetingRSVP(m.id, "declining")}
                  onReset={() => handleResetRSVP(m.id)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Biweekly meetings tab ─────────────────────────────────────────── */}
      {activeTab === "biweekly" && (
        <div>
          <div className="rounded-xl p-4 mb-6" style={{ background: "var(--sand)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Biweekly meetings bring Keepers from all three groups together to handle{" "}
              <strong style={{ color: "var(--warm-brown)" }}>constitutional decisions</strong> — inviting new Keepers
              or Members, financial and structural decisions, and cooperation between groups and floors.
            </p>
          </div>

          {!isKeeper && (
            <div className="rounded-xl px-5 py-3 mb-6 text-sm" style={{ background: "var(--sand)", color: "var(--muted)" }}>
              Biweekly meetings are for <strong style={{ color: "var(--warm-brown)" }}>Keepers only</strong>. You can view them here but only Keepers can attend or suggest them.
            </div>
          )}

          {isKeeper && !showBiweeklyForm && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowBiweeklyForm(true)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--terracotta)" }}
              >
                + Suggest biweekly meeting
              </button>
            </div>
          )}

          {showBiweeklyForm && isKeeper && (
            <div className="mb-6">
              <SuggestMeetingForm
                type="biweekly"
                group={null}
                proposerRole="keeper"
                onSubmit={handleNewMeeting}
                onCancel={() => setShowBiweeklyForm(false)}
              />
            </div>
          )}

          <div className="space-y-4">
            {biweeklyMeetings.length === 0 ? (
              <div className="text-sm text-center py-12 rounded-2xl" style={{ background: "var(--sand)", color: "var(--muted)" }}>
                No biweekly meetings suggested yet.
                {isKeeper && " Suggest one above."}
              </div>
            ) : (
              biweeklyMeetings.map((m) => (
                <MeetingCard
                  key={m.id}
                  meeting={m}
                  rsvp={meetingRSVPs[m.id] ?? null}
                  canRSVP={isKeeper}
                  onAttend={() => handleMeetingRSVP(m.id, "attending")}
                  onDecline={() => handleMeetingRSVP(m.id, "declining")}
                  onReset={() => handleResetRSVP(m.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
