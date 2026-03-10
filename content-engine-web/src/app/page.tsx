import { AppShell } from "@/components/layout/AppShell";
import { HeroUploadPanel } from "@/components/dashboard/HeroUploadPanel";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import Link from "next/link";

const demoProjects = [
  { id: "1", title: "Podcast Épisode 42", subtitle: "5 clips générés", badge: "demo" as const },
  { id: "2", title: "Live Instagram replay", subtitle: "3 clips", badge: "gratuito" as const },
  { id: "3", title: "Webinaire Q&A", subtitle: "En cours…", badge: "demo" as const, status: "transcription" },
];

export default function Home() {
  return (
    <AppShell title="Tableau de bord">
      <HeroUploadPanel />

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Tous les projets
          </h2>
          <Link
            href="/videos"
            className="text-sm font-medium text-[var(--accent-blue)] hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {demoProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              subtitle={project.subtitle}
              badge={project.badge}
              status={project.status}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
