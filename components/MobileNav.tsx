"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scale, Calendar, BedDouble, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/governance", label: "Govern", Icon: Scale },
  { href: "/events", label: "Events", Icon: Calendar },
  { href: "/stay", label: "Stay", Icon: BedDouble },
  { href: "/community", label: "People", Icon: Users },
  { href: "/backstories", label: "Stories", Icon: BookOpen },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex shrink-0 border-t"
      style={{ borderColor: "var(--sand-dark)", background: "var(--cream)" }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center py-2 gap-0.5 transition-opacity",
              active ? "" : "opacity-50 hover:opacity-80"
            )}
          >
            <Icon
              size={16}
              style={{ color: active ? "var(--terracotta)" : "var(--warm-brown)" }}
            />
            <span
              className="text-[9px] font-medium"
              style={{ color: active ? "var(--terracotta)" : "var(--warm-brown)" }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
