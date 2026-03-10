"use client";

import { useState } from "react";
import Link from "next/link";

const features = [
  { icon: "🎬", label: "Long → Shorts" },
  { icon: "💬", label: "IA Sous-titres" },
  { icon: "✂️", label: "Éditeur vidéo" },
  { icon: "🎤", label: "Amélioration vocale" },
  { icon: "🖼️", label: "IA Reframe" },
  { icon: "📹", label: "IA B-Roll" },
  { icon: "🪝", label: "IA Hook" },
];

export function HeroUploadPanel() {
  const [url, setUrl] = useState("");

  return (
    <div className="flex flex-col gap-8">
      {/* Bloc central upload */}
      <div className="rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] p-8 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Déposez un lien Zoom, YouTube ou importez une vidéo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full max-w-xl rounded-lg border border-[var(--border-subtle)] bg-[var(--body)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-blue)]"
          />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--elevated-hover)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--border-subtle)]"
            >
              Télécharger
            </button>
            <button
              type="button"
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--elevated-hover)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--border-subtle)]"
            >
              Google Drive
            </button>
            <Link
              href="/videos/new"
              className="rounded-lg bg-[var(--accent-blue)] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Obtenir des clips en 1 clic
            </Link>
          </div>
        </div>
      </div>

      {/* Ligne d’icônes fonctionnalités */}
      <div className="flex flex-wrap justify-center gap-4">
        {features.map(({ icon, label }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-center gap-2 rounded-full bg-[var(--elevated)] p-4 transition-all duration-150 hover:bg-[var(--elevated-hover)]"
            title={label}
          >
            <span className="text-2xl">{icon}</span>
            <span className="max-w-[80px] text-center text-xs text-[var(--text-muted)]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
