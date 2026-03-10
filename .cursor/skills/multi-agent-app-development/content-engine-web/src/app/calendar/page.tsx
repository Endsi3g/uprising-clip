import { AppShell } from "@/components/layout/AppShell";

export default function CalendarPage() {
  return (
    <AppShell title="Calendrier">
      <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-6">
        <p className="text-[var(--text-muted)]">Vue calendrier à venir.</p>
      </div>
    </AppShell>
  );
}
