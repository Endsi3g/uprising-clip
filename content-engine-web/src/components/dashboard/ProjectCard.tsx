import Link from "next/link";
import { Badge } from "@/components/shared/Badge";

interface ProjectCardProps {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string | null;
  badge?: "demo" | "gratuito" | "pro";
  status?: string;
}

export function ProjectCard({ id, title, subtitle, thumbnail, badge = "demo", status }: ProjectCardProps) {
  const badgeLabel = badge === "gratuito" ? "Forfait Gratuito" : badge === "pro" ? "Pro" : "Demo";

  return (
    <Link
      href={`/videos/${id}`}
      className="group block overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--elevated)] transition-all duration-200 hover:border-[var(--border-subtle)] hover:bg-[var(--elevated-hover)]"
    >
      <div className="relative aspect-video w-full bg-[var(--body)]">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-[var(--text-muted)]">
            🎬
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge variant={badge === "pro" ? "pro" : "free"}>{badgeLabel}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
        )}
        {status && (
          <p className="mt-2 text-xs uppercase tracking-wide text-[var(--text-muted)]">
            {status}
          </p>
        )}
      </div>
    </Link>
  );
}
