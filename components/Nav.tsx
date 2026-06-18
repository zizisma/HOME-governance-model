"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { roleConfig, Role } from "@/lib/data";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/governance", label: "Governance" },
  { href: "/events", label: "Events" },
  { href: "/stay", label: "Stay" },
  { href: "/community", label: "Community" },
  { href: "/backstories", label: "Back Stories" },
  { href: "/characters", label: "Characters" },
];

export default function Nav() {
  const pathname = usePathname();
  const { role, setRole } = useRole();

  return (
    <header style={{ borderBottom: "1px solid var(--sand-dark)", background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight" style={{ color: "var(--terracotta)", fontFamily: "Georgia, serif" }}>
          Third Home
          <span className="text-sm font-normal ml-2" style={{ color: "var(--muted)" }}>Wolfsburg</span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm transition-colors",
                pathname === l.href
                  ? "font-semibold"
                  : "opacity-60 hover:opacity-100"
              )}
              style={{ color: "var(--warm-brown)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Role switcher */}
        <div className="flex items-center gap-1 rounded-full p-1" style={{ background: "var(--sand)" }}>
          {(["guest", "member", "keeper"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                role === r ? roleConfig[r].color + " shadow-sm" : "opacity-50 hover:opacity-80"
              )}
            >
              {roleConfig[r].label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-4 px-6 pb-3 overflow-x-auto">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn("text-sm whitespace-nowrap", pathname === l.href ? "font-semibold" : "opacity-60")}
            style={{ color: "var(--warm-brown)" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
