"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type SourceType = "upload" | "url";
const LINK_SOURCES = [
  { id: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/reel/..." },
  { id: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/watch/..." },
  { id: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/posts/..." },
  { id: "google_drive", label: "Google Drive", placeholder: "https://drive.google.com/..." },
  { id: "other", label: "Autre lien", placeholder: "https://..." },
] as const;

export default function NewVideoPage() {
  const [sourceType, setSourceType] = useState<SourceType>("upload");
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkSource, setLinkSource] = useState<string>("other");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    try {
      const body: { title: string; source_type: "upload" | "url"; source_url?: string } = {
        title: title.trim() || "Sans titre",
        source_type: sourceType,
      };
      if (sourceType === "url") {
        if (!linkUrl.trim()) {
          setError("Indiquez l’URL de la vidéo.");
          setLoading(false);
          return;
        }
        body.source_url = linkUrl.trim();
      }
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du projet.");
        setLoading(false);
        return;
      }
      const videoId = data.id as string;
      if (sourceType === "upload" && file) {
        const uploadPath = data.uploadPath as string;
        const { error: uploadError } = await supabase.storage
          .from("videos-original")
          .upload(uploadPath, file, { upsert: true });
        if (uploadError) {
          setError("Upload échoué : " + uploadError.message);
          setLoading(false);
          return;
        }
        await fetch(`/api/videos/${videoId}/start`, { method: "POST" });
      }
      setCreatedId(videoId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  if (createdId) {
    return (
      <AppShell title="Nouveau projet">
        <div className="mx-auto max-w-2xl rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-8 text-center">
          <p className="text-[var(--text-primary)]">Projet créé avec succès.</p>
          <Link
            href={`/videos/${createdId}`}
            className="mt-4 inline-block rounded-lg bg-[var(--accent-blue)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Voir le projet
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Nouveau projet">
      <div className="mx-auto max-w-2xl rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-8">
        <h2 className="mb-6 text-xl font-bold text-[var(--text-primary)]">Créer un projet vidéo</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
              Titre du projet
            </label>
            <input
              id="title"
              type="text"
              placeholder="Ex. Podcast Épisode 42"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--body)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-blue)]"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-[var(--text-muted)]">Source vidéo</span>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="sourceType"
                  checked={sourceType === "upload"}
                  onChange={() => setSourceType("upload")}
                  className="rounded-full"
                />
                <span className="text-[var(--text-primary)]">Télécharger un fichier</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="sourceType"
                  checked={sourceType === "url"}
                  onChange={() => setSourceType("url")}
                  className="rounded-full"
                />
                <span className="text-[var(--text-primary)]">Lien (Instagram, Facebook, LinkedIn, Google Drive…)</span>
              </label>
            </div>
          </div>

          {sourceType === "upload" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                Fichier vidéo (MP4)
              </label>
              <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-subtle)] bg-[var(--body)] py-12 transition-colors hover:border-[var(--text-muted)] cursor-pointer">
                <span className="text-4xl text-[var(--text-muted)]">📁</span>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {file ? file.name : "Glissez-déposez ou cliquez pour importer"}
                </p>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="mt-2 hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          )}

          {sourceType === "url" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                Type de lien
              </label>
              <select
                value={linkSource}
                onChange={(e) => setLinkSource(e.target.value)}
                className="mb-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--body)] px-4 py-2.5 text-[var(--text-primary)]"
              >
                {LINK_SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <label className="mb-2 block text-sm font-medium text-[var(--text-muted)]">
                URL de la vidéo
              </label>
              <input
                type="url"
                placeholder={LINK_SOURCES.find((s) => s.id === linkSource)?.placeholder ?? "https://..."}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--body)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-blue)]"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading || (sourceType === "upload" && !file)}
              className="rounded-lg bg-[var(--accent-blue)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Création…" : "Créer et lancer"}
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
