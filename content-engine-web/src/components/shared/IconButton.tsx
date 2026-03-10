import { type ReactNode, type ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

export function IconButton({ icon, label, active = false, className = "", ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-[var(--elevated)] text-[var(--text-muted)] transition-all duration-150 hover:bg-[var(--elevated-hover)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-subtle)] ${
        active ? "bg-[var(--elevated-hover)] text-[var(--text-primary)]" : ""
      } ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
