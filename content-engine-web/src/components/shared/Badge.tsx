import { type ReactNode } from "react";

type BadgeVariant = "solid" | "outline" | "free" | "pro";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  solid: "bg-[var(--accent)] text-black border-transparent",
  outline: "border border-[var(--border-subtle)] bg-transparent text-[var(--text-muted)]",
  free: "border border-[var(--border-subtle)] bg-[var(--elevated)] text-[var(--text-muted)]",
  pro: "bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] border border-[var(--accent-blue)]/40",
};

export function Badge({ children, variant = "outline", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
