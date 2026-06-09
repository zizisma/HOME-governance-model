import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { ViewModeProvider } from "@/lib/view-mode-context";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Third Home — Wolfsburg",
  description: "A collectively-owned temporary living space in Wolfsburg",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <RoleProvider>
          <ViewModeProvider>
            <AppShell>{children}</AppShell>
          </ViewModeProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
