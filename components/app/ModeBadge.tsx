import type { SystemMode } from "@/lib/app-types";

export function ModeBadge({ mode }: { mode: SystemMode }) {
  const styleByMode: Record<SystemMode, { color: string; borderColor: string; background: string }> = {
    Advisory: {
      color: "var(--tessera-text-secondary)",
      borderColor: "var(--tessera-border)",
      background: "transparent"
    },
    "Write-Back": {
      color: "var(--tessera-accent-signal)",
      borderColor: "var(--tessera-accent-signal)",
      background: "transparent"
    },
    "Closed-Loop": {
      color: "#0B0D10",
      borderColor: "var(--tessera-accent-signal)",
      background: "var(--tessera-accent-signal)"
    }
  };

  return (
    <span
      className="rounded-full border px-2 py-1 text-xs font-medium"
      style={styleByMode[mode]}
    >
      {mode}
    </span>
  );
}
