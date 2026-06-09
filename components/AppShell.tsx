"use client";

import { ReactNode } from "react";
import { useViewMode } from "@/lib/view-mode-context";
import { useRole } from "@/lib/role-context";
import { roleConfig, Role } from "@/lib/data";
import { cn } from "@/lib/utils";
import Nav from "./Nav";
import MobileNav from "./MobileNav";

export default function AppShell({ children }: { children: ReactNode }) {
  const { mode } = useViewMode();
  const { role, setRole } = useRole();

  if (mode === "desktop") {
    return (
      <>
        <Nav />
        <main>{children}</main>
      </>
    );
  }

  return (
    <div
      className="min-h-screen flex items-start justify-center py-8"
      style={{ background: "var(--background)" }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: "min(844px, calc(100vh - 4rem))",
          borderRadius: "3rem",
          border: "10px solid #0a0010",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)",
          background: "var(--background)",
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-20 rounded-b-2xl"
          style={{ width: 110, height: 26, background: "#0a0010" }}
        />

        {/* Mini top bar: role switcher */}
        <div
          className="shrink-0 flex items-center justify-between px-4 pt-8 pb-2"
          style={{ background: "var(--cream)", borderBottom: "1px solid var(--sand-dark)" }}
        >
          <span className="text-xs font-bold tracking-tight" style={{ color: "var(--terracotta)" }}>
            Third Home
          </span>
          <div className="flex items-center gap-0.5 rounded-full p-0.5" style={{ background: "var(--sand)" }}>
            {(["guest", "member", "keeper"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-medium transition-all",
                  role === r ? roleConfig[r].color + " shadow-sm" : "opacity-50"
                )}
              >
                {roleConfig[r].label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable page content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <main>{children}</main>
        </div>

        {/* Bottom tab nav */}
        <MobileNav />
      </div>
    </div>
  );
}
