"use client";

type Variant = "success" | "warning" | "danger" | "info" | "neutral";

const variants: Record<Variant, string> = {
  success: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20",
  warning: "bg-amber-100/80 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20",
  danger: "bg-rose-100/80 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20",
  info: "bg-blue-100/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20",
  neutral: "bg-slate-100/80 text-slate-700 dark:bg-zinc-800/80 dark:text-slate-300 border border-slate-200/50 dark:border-zinc-700/50",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

/**
 * Badge de status colorido premium (suporta dark mode nativamente)
 */
export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export { type Variant, variants };
