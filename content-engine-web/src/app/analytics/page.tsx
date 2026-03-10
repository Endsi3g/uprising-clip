import { AppShell } from "@/components/layout/AppShell";

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics" beta>
      <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-6">
        <p className="text-sm text-[var(--text-muted)]">
          Analytics (Beta) – actuellement pour TikTok et YouTube.
        </p>
      </div>
    </AppShell>
  );
}
