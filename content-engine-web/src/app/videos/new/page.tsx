import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";

export default function NewVideoPage() {
  return (
    <AppShell title="Nouveau projet">
      <div className="mx-auto max-w-2xl rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-8">
        <h2 className="mb-6 text-xl font-bold text-[var(--text-primary)]">Créer un projet vidéo</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
              Titre du projet
            </label>
            <input
              id="title"
              type="text"
              placeholder="Ex. Podcast Épisode 42"
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--body)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-blue)]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
              Fichier vidéo (MP4)
            </label>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-subtle)] bg-[var(--body)] py-12 transition-colors hover:border-[var(--text-muted)]">
              <span className="text-4xl text-[var(--text-muted)]">📁</span>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Glissez-déposez ou cliquez pour importer
              </p>
              <input type="file" accept="video/mp4" className="mt-2 hidden" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent-blue)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Créer et lancer
            </button>
            <Link
              href="/videos"
              className="rounded-lg border border-[var(--border-subtle)] px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--elevated-hover)]"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
