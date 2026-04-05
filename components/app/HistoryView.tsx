"use client";

import { useAppState } from "@/components/app/AppProvider";
import { BrandTile } from "@/components/BrandTile";

function formatAdoptedTimestamp(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function getLateOrdersColor(value: number) {
  if (value > 2) {
    return "var(--tessera-danger)";
  }
  if (value > 0) {
    return "var(--tessera-warning)";
  }
  return "var(--tessera-success)";
}

function getZoneLoadColor(value: number) {
  if (value > 40) {
    return "var(--tessera-danger)";
  }
  if (value > 32) {
    return "var(--tessera-warning)";
  }
  return "var(--tessera-success)";
}

function getZoneCrossingsColor(value: number) {
  if (value > 6) {
    return "var(--tessera-danger)";
  }
  if (value > 3) {
    return "var(--tessera-warning)";
  }
  return "var(--tessera-success)";
}

function getPriorityAlignmentColor(value: number) {
  if (value < 0.85) {
    return "var(--tessera-danger)";
  }
  if (value < 0.92) {
    return "var(--tessera-warning)";
  }
  return "var(--tessera-success)";
}

function getThroughputColor(value: number) {
  if (value < 150) {
    return "var(--tessera-danger)";
  }
  if (value < 170) {
    return "var(--tessera-warning)";
  }
  return "var(--tessera-success)";
}

const strategyLabelMap: Record<string, string> = {
  primary: "Tess's Choice",
  minimize_travel: "Minimize Travel",
  zero_late_risk: "Zero Late Risk",
  balance_zones: "Balance Zones",
  maximize_throughput: "Throughput Push"
};

export function HistoryView() {
  const { adoptedPlansHistory, openRunTab, setCopilotDraftAttachments, setCopilotOpen, theme } = useAppState();
  const isLightTheme = theme === "light";

  const askTessAboutHistoryPlan = (entryId: string) => {
    const entry = adoptedPlansHistory.find((item) => item.id === entryId);
    if (!entry) {
      return;
    }

    setCopilotDraftAttachments((current) => {
      const attachmentId = `history-${entry.id}`;
      if (current.some((item) => item.id === attachmentId)) {
        return current;
      }
      return [
        ...current,
        {
          id: attachmentId,
          type: "heartbeat-plan",
          title: `${entry.plan.run.runId} - ${entry.plan.label}`,
          subtitle: "Adopted history plan"
        }
      ];
    });
    setCopilotOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <BrandTile className="h-6 w-auto" variant="collapsed" tone={theme === "light" ? "light" : "dark"} />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.01em]">History</h1>
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Adopted heartbeat plans, including strategy metrics and replay actions.
        </p>
      </section>

      {adoptedPlansHistory.length === 0 ? (
        <section className="app-card p-6 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          No adopted plans yet this shift.
        </section>
      ) : (
        <section className="space-y-3">
          {adoptedPlansHistory.map((entry) => (
            <article key={entry.id} className="app-card space-y-4 p-4 md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className="font-code text-xs uppercase tracking-[0.1em]"
                  style={{
                    color: "var(--tessera-text-secondary)",
                    background: isLightTheme ? "color-mix(in srgb, var(--tessera-neutral-support) 14%, transparent)" : "color-mix(in srgb, var(--tessera-accent-signal) 12%, transparent)",
                    border: isLightTheme
                      ? "1px solid color-mix(in srgb, var(--tessera-neutral-support) 55%, var(--tessera-border))"
                      : "1px solid var(--tessera-border)",
                    borderRadius: "999px",
                    padding: "0.35rem 0.6rem"
                  }}
                >
                  {formatAdoptedTimestamp(entry.adoptedAt)} · Adopted Plan
                </p>
                <span className="font-code text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
                  {entry.plan.run.runId}
                </span>
                {entry.plan.isTessChoice ? (
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--tessera-text-primary)",
                      background: isLightTheme
                        ? "color-mix(in srgb, var(--tessera-neutral-support) 20%, transparent)"
                        : "color-mix(in srgb, var(--tessera-accent-signal) 22%, transparent)",
                      border: isLightTheme
                        ? "1px solid color-mix(in srgb, var(--tessera-neutral-support) 65%, var(--tessera-border))"
                        : "1px solid color-mix(in srgb, var(--tessera-accent-signal) 50%, var(--tessera-border))",
                      borderRadius: "999px",
                      padding: "0.28rem 0.55rem"
                    }}
                  >
                    Tess's Choice
                  </span>
                ) : (
                  <span className="text-xs" style={{ color: "var(--tessera-text-primary)", border: "1px solid var(--tessera-border)", borderRadius: "999px", padding: "0.28rem 0.55rem" }}>
                    {strategyLabelMap[entry.plan.run.tradeoffLabel] ?? entry.plan.label}
                  </span>
                )}
              </div>

              <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                {entry.plan.run.postureName}
              </p>

              <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                {entry.plan.summary}
              </p>

              <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
                <div className="rounded-[10px] border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-[11px] uppercase" style={{ color: "var(--tessera-text-secondary)" }}>Late Orders</p>
                  <p className="text-base" style={{ color: getLateOrdersColor(entry.plan.metrics.lateOrders) }}>{entry.plan.metrics.lateOrders}</p>
                </div>
                <div className="rounded-[10px] border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-[11px] uppercase" style={{ color: "var(--tessera-text-secondary)" }}>Selected Tasks</p>
                  <p className="text-base">{entry.plan.metrics.selectedTasks}</p>
                </div>
                <div className="rounded-[10px] border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-[11px] uppercase" style={{ color: "var(--tessera-text-secondary)" }}>Max Zone Load</p>
                  <p className="text-base" style={{ color: getZoneLoadColor(entry.plan.metrics.maxZoneLoad) }}>{entry.plan.metrics.maxZoneLoad}</p>
                </div>
                <div className="rounded-[10px] border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-[11px] uppercase" style={{ color: "var(--tessera-text-secondary)" }}>Zone Crossings</p>
                  <p className="text-base" style={{ color: getZoneCrossingsColor(entry.plan.metrics.zoneCrossings) }}>{entry.plan.metrics.zoneCrossings}</p>
                </div>
                <div className="rounded-[10px] border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-[11px] uppercase" style={{ color: "var(--tessera-text-secondary)" }}>Priority Alignment</p>
                  <p className="text-base" style={{ color: getPriorityAlignmentColor(entry.plan.metrics.priorityAlignment) }}>{Math.round(entry.plan.metrics.priorityAlignment * 100)}%</p>
                </div>
                <div className="rounded-[10px] border p-2" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-[11px] uppercase" style={{ color: "var(--tessera-text-secondary)" }}>Throughput</p>
                  <p className="text-base" style={{ color: getThroughputColor(entry.plan.metrics.throughputPicksPerHour) }}>{entry.plan.metrics.throughputPicksPerHour} picks/hr</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={() => openRunTab(entry.plan.run)}>
                  View Details
                </button>
                <button type="button" className="btn-secondary" onClick={() => askTessAboutHistoryPlan(entry.id)}>
                  Ask TESS
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
