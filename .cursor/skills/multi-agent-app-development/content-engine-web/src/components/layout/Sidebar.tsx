"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "⌂", label: "Accueil" },
  { href: "/videos", icon: "⊞", label: "Projets" },
  { href: "/calendar", icon: "📅", label: "Calendrier" },
  { href: "/analytics", icon: "📊", label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col items-center border-r border-[var(--border-subtle)] bg-[var(--elevated)] py-4"
      style={{ width: "var(--sidebar-w)" }}
    >
      {/* Avatar / Profil en haut */}
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--border-subtle)] text-sm text-[var(--text-muted)]">
        U
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, icon, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-150 hover:bg-[var(--elevated-hover)] ${
                isActive ? "bg-[var(--elevated-hover)] ring-1 ring-inset ring-[var(--border-subtle)]" : ""
              }`}
            >
              <span className="text-xl" aria-hidden>{icon}</span>
            </Link>
          );
        })}
      </nav>

      {/* Aide en bas */}
      <button
        type="button"
        title="Aide"
        className="flex h-12 w-12 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--elevated-hover)] hover:text-[var(--text-primary)]"
      >
        ?
      </button>
    </aside>
  );
}
