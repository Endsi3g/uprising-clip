import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";
import { VideoDetailClient } from "./VideoDetailClient";

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
      <VideoDetailClient videoId={id} />
    </AppShell>
  );
}
