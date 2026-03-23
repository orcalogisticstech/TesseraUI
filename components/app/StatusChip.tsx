import type { DecisionStatus } from "@/lib/app-types";

export function StatusChip({ status }: { status: DecisionStatus }) {
  const colorByStatus: Record<DecisionStatus, string> = {
    Executed: "var(--tessera-success)",
    Pending: "var(--tessera-accent-signal)",
    Overridden: "var(--tessera-warning)",
    Anomaly: "var(--tessera-danger)"
  };

  const color = colorByStatus[status];

  return (
    <span
      className="rounded-full border px-2 py-1 text-xs font-medium"
      style={{
        color,
        borderColor: color,
        background: `color-mix(in srgb, ${color} 18%, transparent)`
      }}
    >
      {status}
    </span>
  );
}
