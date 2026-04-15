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

function dominates(left: HeartbeatPlan, right: HeartbeatPlan) {
  let strictlyBetter = false;

  for (const row of metricRows) {
    const leftValue = left.metrics[row.key];
    const rightValue = right.metrics[row.key];

    if (row.direction === "higher") {
      if (leftValue < rightValue) {
        return false;
      }
      if (leftValue > rightValue) {
        strictlyBetter = true;
      }
    } else {
      if (leftValue > rightValue) {
        return false;
      }
      if (leftValue < rightValue) {
        strictlyBetter = true;
      }
    }
  }

  return strictlyBetter;
}

function getMetricSignature(plan: HeartbeatPlan) {
  return JSON.stringify(metricRows.map((row) => plan.metrics[row.key]));
}

function getVisiblePlans(plans: HeartbeatPlan[]) {
  return plans.filter((plan, index) => !plans.some((candidate, candidateIndex) => candidateIndex !== index && dominates(candidate, plan)));
}

function getTessChoicePlanId(plans: HeartbeatPlan[], visiblePlans: HeartbeatPlan[]) {
  const primaryPlan = plans.find((plan) => plan.run.tradeoffLabel === "primary");

  if (!primaryPlan) {
    return visiblePlans.find((plan) => plan.isTessChoice)?.id ?? null;
  }

  if (visiblePlans.some((plan) => plan.id === primaryPlan.id)) {
    return primaryPlan.id;
  }

  const dominatingVisiblePlans = visiblePlans.filter((plan) => dominates(plan, primaryPlan));
  if (dominatingVisiblePlans.length === 1) {
    return dominatingVisiblePlans[0].id;
  }

  return null;
}

function dedupeVisiblePlans(plans: HeartbeatPlan[], visiblePlans: HeartbeatPlan[], tessChoicePlanId: string | null) {
  const primaryPlanId = plans.find((plan) => plan.run.tradeoffLabel === "primary")?.id ?? null;
  const planOrder = new Map(plans.map((plan, index) => [plan.id, index]));
  const groups = new Map<string, HeartbeatPlan[]>();

  for (const plan of visiblePlans) {
    const signature = getMetricSignature(plan);
    groups.set(signature, [...(groups.get(signature) ?? []), plan]);
  }

  return Array.from(groups.values())
    .map((group) => {
      const tessChoicePlan = tessChoicePlanId ? group.find((plan) => plan.id === tessChoicePlanId) : null;
      if (tessChoicePlan) {
        return tessChoicePlan;
      }

      const primaryPlan = primaryPlanId ? group.find((plan) => plan.id === primaryPlanId) : null;
      if (primaryPlan) {
        return primaryPlan;
      }

      return [...group].sort((left, right) => (planOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (planOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER))[0];
    })
    .sort((left, right) => (planOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (planOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER));
}

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
  const frontierPlans = getVisiblePlans(plans);
  const tessChoicePlanId = getTessChoicePlanId(plans, frontierPlans);
  const visiblePlans = dedupeVisiblePlans(plans, frontierPlans, tessChoicePlanId);

  return (
    <section className="app-card space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-accent-signal)" }}>
            Heartbeat Ready
          </p>
          <h2 className="font-display text-2xl uppercase tracking-[-0.01em]">Plan Comparison</h2>
        </div>
      </div>

      <div className="overflow-auto border" style={{ borderColor: "var(--tessera-border)" }}>
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                Metric
              </th>
              {visiblePlans.map((plan) => (
                <th key={plan.id} className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                  <span style={plan.id === tessChoicePlanId ? { color: "var(--tessera-accent-signal)" } : undefined}>
                    {plan.id === tessChoicePlanId ? "Tess's Choice" : plan.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricRows.map((row) => (
              <tr key={row.key}>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{row.label}</td>
                {visiblePlans.map((plan) => {
                  const value = plan.metrics[row.key];
                  return (
                  <td key={`${plan.id}-${row.key}`} className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>
                    <span style={{ color: getMetricColor(row, visiblePlans, value) }}>{row.format(value)}</span>
                  </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="px-3 py-3" style={{ color: "var(--tessera-text-secondary)" }}>Action</td>
              {visiblePlans.map((plan) => (
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
