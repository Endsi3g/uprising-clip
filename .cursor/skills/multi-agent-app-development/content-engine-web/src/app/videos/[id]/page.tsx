import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell title="Détail projet">
      <div className="mb-6">
        <Link
          href="/videos"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ← Retour aux projets
        </Link>
      </div>
      <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-8">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Projet #{id}</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Statut : En attente (transcription, analyse LLM, rendu à venir).
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-[var(--body)] p-4 text-center">
            <span className="text-2xl">🎬</span>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Clips générés</p>
            <p className="font-semibold text-[var(--text-primary)]">0</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
