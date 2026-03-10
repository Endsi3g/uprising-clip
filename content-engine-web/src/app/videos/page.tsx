import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import Link from "next/link";

const demoProjects = [
  { id: "1", title: "Podcast Épisode 42", subtitle: "5 clips", badge: "demo" as const },
  { id: "2", title: "Live Instagram replay", subtitle: "3 clips", badge: "gratuito" as const },
];

export default function VideosPage() {
  return (
    <AppShell title="Projets">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Tous les projets</h2>
        <Link
          href="/videos/new"
          className="rounded-lg bg-[var(--accent-blue)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Nouveau projet
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoProjects.map((p) => (
          <ProjectCard key={p.id} id={p.id} title={p.title} subtitle={p.subtitle} badge={p.badge} />
        ))}
      </div>
    </AppShell>
  );
}
