"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  beta?: boolean;
}

export function AppShell({ children, title, beta = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--body)]">
      <Sidebar />
        <div className="min-h-screen pl-[72px]">
        <Topbar title={title} beta={beta} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
