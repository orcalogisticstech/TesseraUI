"use client";

import type { HeartbeatPlan, SystemMode } from "@/lib/app-types";

type HeartbeatProposalCardProps = {
  plans: HeartbeatPlan[];
  mode: SystemMode;
  onAdopt: (planId: string) => void;
  onViewDetails: (planId: string) => void;
  onAskTess: (planId: string) => void;
};

const metricRows: Array<{
  key: keyof HeartbeatPlan["metrics"];
  label: string;
  direction: "higher" | "lower";
  format: (value: number) => string;
}> = [
  { key: "lateOrders", label: "Late Orders", direction: "lower", format: (value) => String(value) },
  { key: "selectedTasks", label: "Selected Tasks", direction: "higher", format: (value) => String(value) },
  { key: "maxZoneLoad", label: "Max Zone Load", direction: "lower", format: (value) => String(value) },
  { key: "zoneCrossings", label: "Zone Crossings", direction: "lower", format: (value) => String(value) },
  { key: "priorityAlignment", label: "Priority Alignment", direction: "higher", format: (value) => `${Math.round(value * 100)}%` },
  { key: "throughputPicksPerHour", label: "Throughput", direction: "higher", format: (value) => `${value} picks/hr` }
];

function getMetricColor(row: (typeof metricRows)[number], plans: HeartbeatPlan[], value: number) {
  const values = plans.map((plan) => plan.metrics[row.key]);
  const bestValue = row.direction === "higher" ? Math.max(...values) : Math.min(...values);
  const worstValue = row.direction === "higher" ? Math.min(...values) : Math.max(...values);

  if (bestValue === worstValue) {
    return "var(--tessera-warning)";
  }
  if (value === bestValue) {
    return "var(--tessera-success)";
  }
  if (value === worstValue) {
    return "var(--tessera-danger)";
  }
  return "var(--tessera-warning)";
}

export function HeartbeatProposalCard({ plans, mode, onAdopt, onViewDetails, onAskTess }: HeartbeatProposalCardProps) {
  return (
    <section className="app-card space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-accent-signal)" }}>
            Heartbeat Ready
          </p>
          <h2 className="font-display text-2xl uppercase tracking-[-0.01em]">Plan Comparison</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            New cycle recommendation arrived. Adopt one plan to continue.
          </p>
        </div>
      </div>

      <div className="overflow-auto rounded-[10px] border" style={{ borderColor: "var(--tessera-border)" }}>
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                Metric
              </th>
              {plans.map((plan) => (
                <th key={plan.id} className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                  <span style={plan.isTessChoice ? { color: "var(--tessera-accent-signal)" } : undefined}>{plan.label}</span>
                  <p className="mt-1 text-xs font-normal" style={{ color: "var(--tessera-text-secondary)" }}>
                    {plan.summary}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricRows.map((row) => (
              <tr key={row.key}>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{row.label}</td>
                {plans.map((plan) => {
                  const value = plan.metrics[row.key];
                  return (
                  <td key={`${plan.id}-${row.key}`} className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>
                    <span style={{ color: getMetricColor(row, plans, value) }}>{row.format(value)}</span>
                  </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="px-3 py-3" style={{ color: "var(--tessera-text-secondary)" }}>Action</td>
              {plans.map((plan) => (
                <td key={`${plan.id}-adopt`} className="px-3 py-3">
                  <div className="flex flex-col gap-2">
                    <button type="button" className="btn-secondary btn-adopt-glow w-full px-3 py-2 text-sm" onClick={() => onAdopt(plan.id)}>
                      {mode === "Closed-Loop" ? "Adopt This Plan (Re-Execute)" : "Adopt This Plan"}
                    </button>
                    <button type="button" className="btn-secondary w-full px-3 py-2 text-sm" onClick={() => onViewDetails(plan.id)}>
                      View Details
                    </button>
                    <button type="button" className="btn-secondary w-full px-3 py-2 text-sm" onClick={() => onAskTess(plan.id)}>
                      Ask TESS
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
