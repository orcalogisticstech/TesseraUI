import type { SystemMode } from "@/lib/product-types";

export function ModeBadge({ mode }: { mode: SystemMode }) {
  const styles: Record<SystemMode, string> = {
    Advisory: "text-[var(--tessera-accent-signal)] border-[var(--tessera-accent-signal)]",
    "Write-Back": "text-[var(--tessera-text-primary)] border-[var(--tessera-border)]",
    "Closed-Loop": "text-[var(--tessera-success)] border-[var(--tessera-success)]"
  };

  return <span className={`rounded-full border px-2 py-1 text-xs font-medium ${styles[mode]}`}>{mode}</span>;
}
