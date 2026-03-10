"use client";

import { Badge } from "@/components/shared/Badge";

interface TopbarProps {
  title?: string;
  beta?: boolean;
}

export function Topbar({ title = "Tableau de bord", beta = false }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--body)] px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
        {beta && (
          <Badge variant="outline" className="text-xs">
            Beta
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          title="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--elevated)] hover:text-[var(--text-primary)]"
        >
          🔔
        </button>
        <div className="flex items-center gap-2 rounded-lg bg-[var(--elevated)] px-3 py-1.5">
          <span className="text-sm">⚡</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">0</span>
          <span className="text-xs text-[var(--text-muted)]">crédits</span>
        </div>
        <button
          type="button"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Ajouter des crédits
        </button>
      </div>
    </header>
  );
}
