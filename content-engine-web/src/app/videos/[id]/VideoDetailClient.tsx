"use client";

import { useEffect, useState } from "react";

type Video = {
  id: string;
  title: string;
  status: string;
  source_type: string;
  source_url?: string | null;
  duration_sec?: number | null;
  created_at: string;
  clips: Array<{
    id: string;
    title: string;
    hook: string | null;
    virality_score: number | null;
    status: string;
    output_path: string | null;
    start_sec: number;
    end_sec: number;
  }>;
};

export function VideoDetailClient({ videoId }: { videoId: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/videos/${videoId}`);
        if (!res.ok) {
          if (!cancelled) setError("Vidéo introuvable");
          return;
        }
        const data = await res.json();
        if (!cancelled) setVideo(data);
      } catch {
        if (!cancelled) setError("Erreur chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [videoId]);

  async function handleDownload(clipId: string) {
    try {
      const res = await fetch(`/api/clips/${clipId}/download`);
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-8">
        <p className="text-[var(--text-muted)]">Chargement…</p>
      </div>
    );
  }
  if (error || !video) {
    return (
      <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-8">
        <p className="text-red-400">{error ?? "Vidéo introuvable"}</p>
      </div>
    );
  }

  const statusLabel: Record<string, string> = {
    uploading: "Upload en cours",
    transcribing: "Transcription",
    analyzing: "Analyse",
    rendering: "Rendu des clips",
    done: "Terminé",
    error: "Erreur",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-8">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{video.title}</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Statut : {statusLabel[video.status] ?? video.status}
          {video.source_type === "url" && video.source_url && (
            <> · Source : <a href={video.source_url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-blue)] hover:underline truncate max-w-xs inline-block align-bottom" title={video.source_url}>{video.source_url}</a></>
          )}
        </p>
        {video.duration_sec != null && (
          <p className="mt-1 text-sm text-[var(--text-muted)]">Durée : {Math.floor(video.duration_sec / 60)} min</p>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Clips</h3>
        {video.clips.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Aucun clip pour l’instant. Le traitement peut prendre quelques minutes.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {video.clips.map((clip) => (
              <div
                key={clip.id}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--elevated)] p-4"
              >
                <p className="font-medium text-[var(--text-primary)]">{clip.title}</p>
                {clip.hook && <p className="mt-1 text-sm text-[var(--text-muted)] line-clamp-2">{clip.hook}</p>}
                {clip.virality_score != null && (
                  <p className="mt-2 text-xs text-[var(--text-muted)]">Score viral : {clip.virality_score}</p>
                )}
                {clip.status === "ready" && clip.output_path && (
                  <button
                    type="button"
                    onClick={() => handleDownload(clip.id)}
                    className="mt-3 rounded-lg bg-[var(--accent-blue)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                  >
                    Télécharger
                  </button>
                )}
                {clip.status !== "ready" && (
                  <p className="mt-3 text-xs text-[var(--text-muted)]">{clip.status}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
