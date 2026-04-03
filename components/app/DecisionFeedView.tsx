"use client";

import { DetailPanel } from "@/components/app/DetailPanel";
import { HeartbeatProposalCard } from "@/components/app/HeartbeatProposalCard";
import { ModeBadge } from "@/components/app/ModeBadge";
import { StatusChip } from "@/components/app/StatusChip";
import { TradeoffPanel } from "@/components/app/TradeoffPanel";
import { useAppState } from "@/components/app/AppProvider";
import { BrandTile } from "@/components/BrandTile";
import type { DecisionCycle, DecisionStatus, HeartbeatPlan } from "@/lib/app-types";
import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";

type PanelState =
  | { type: "none" }
  | { type: "alternatives"; cycle: DecisionCycle }
  | { type: "detail"; cycle: DecisionCycle };

type ObjectiveKey = "tardiness" | "travel_time" | "balance";
type ObjectiveTier = 1 | 2 | 3;
type PenaltyKey = "zone_cross" | "split_order" | "grouping_violation";
type PenaltyLevel = "Relaxed" | "Normal" | "Strict";

const objectiveLabels: Record<ObjectiveKey, string> = {
  tardiness: "Deadline Protection",
  travel_time: "Travel Efficiency",
  balance: "Zone Balance"
};

const tierDescriptions: Record<ObjectiveTier, string> = {
  1: "Optimize first",
  2: "Secondary",
  3: "Tertiary"
};

const objectiveDragKey = "application/x-tessera-objective";

const penaltyControlMeta: Array<{ key: PenaltyKey; label: string }> = [
  { key: "zone_cross", label: "Zone Crossing" },
  { key: "split_order", label: "Split Orders" },
  { key: "grouping_violation", label: "Grouping Violations" }
];

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function DecisionFeedView() {
  const { mode, data, cycles, setCycles, setCopilotMessages, setCopilotOpen, heartbeatRemaining, heartbeatCycleCount } = useAppState();
  const [panel, setPanel] = useState<PanelState>({ type: "none" });
  const [now, setNow] = useState(() => new Date());
  const [activeHeartbeatPlans, setActiveHeartbeatPlans] = useState<HeartbeatPlan[] | null>(null);
  const nextHeartbeatPlanSetIndexRef = useRef(0);
  const [objectiveTiers, setObjectiveTiers] = useState<Record<ObjectiveTier, ObjectiveKey[]>>({
    1: ["tardiness", "travel_time"],
    2: ["balance"],
    3: []
  });
  const [penaltyLevels, setPenaltyLevels] = useState<Record<PenaltyKey, PenaltyLevel>>({
    zone_cross: "Normal",
    split_order: "Strict",
    grouping_violation: "Normal"
  });
  const [availableCarts, setAvailableCarts] = useState(18);
  const [maxBatches, setMaxBatches] = useState(20);
  const [maxTasksPerZone, setMaxTasksPerZone] = useState(40);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const totalPlanSets = data.heartbeatPlanSets.length;
    if (heartbeatCycleCount < 1 || totalPlanSets === 0) {
      return;
    }

    const normalizedIndex = nextHeartbeatPlanSetIndexRef.current % totalPlanSets;
    setActiveHeartbeatPlans(data.heartbeatPlanSets[normalizedIndex]);
    nextHeartbeatPlanSetIndexRef.current = (normalizedIndex + 1) % totalPlanSets;
  }, [heartbeatCycleCount, data.heartbeatPlanSets]);

  const selectedAlternatives = panel.type === "alternatives" ? data.alternativesByCycle[panel.cycle.id] ?? [] : [];
  const lateOrdersColor = data.kpi.lateOrders > 2 ? "var(--tessera-danger)" : data.kpi.lateOrders > 0 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const zoneLoadColor = data.kpi.maxZoneLoad > 40 ? "var(--tessera-danger)" : data.kpi.maxZoneLoad > 32 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const zoneCrossingsColor = data.kpi.zoneCrossings > 6 ? "var(--tessera-danger)" : data.kpi.zoneCrossings > 3 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const priorityAlignmentColor = data.kpi.priorityAlignment < 0.85 ? "var(--tessera-danger)" : data.kpi.priorityAlignment < 0.92 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const throughputColor = data.kpi.throughputPicksPerHour < 150 ? "var(--tessera-danger)" : data.kpi.throughputPicksPerHour < 170 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const metricCardClass = "app-card flex h-full flex-col p-4";
  const metricLabelClass = "min-h-[2.75rem] text-xs uppercase tracking-[0.08em]";

  const setCycleStatus = (cycleId: string, status: DecisionStatus) => {
    setCycles((current) => current.map((cycle) => (cycle.id === cycleId ? { ...cycle, status } : cycle)));
  };

  const moveObjective = (objective: ObjectiveKey, nextTier: ObjectiveTier, nextIndex?: number) => {
    setObjectiveTiers((current) => {
      const tierKeys: ObjectiveTier[] = [1, 2, 3];
      const fromTier = tierKeys.find((tier) => current[tier].includes(objective));
      if (!fromTier) {
        return current;
      }

      const nextState: Record<ObjectiveTier, ObjectiveKey[]> = {
        1: [...current[1]],
        2: [...current[2]],
        3: [...current[3]]
      };
      nextState[fromTier] = nextState[fromTier].filter((item) => item !== objective);

      const insertIndex = nextIndex === undefined ? nextState[nextTier].length : Math.max(0, Math.min(nextIndex, nextState[nextTier].length));
      nextState[nextTier].splice(insertIndex, 0, objective);
      return nextState;
    });
  };

  const getDraggedObjective = (event: DragEvent<HTMLElement>) => {
    const objective = event.dataTransfer.getData(objectiveDragKey) as ObjectiveKey;
    if (objective in objectiveLabels) {
      return objective;
    }
    return null;
  };

  const askTessAboutCycle = (cycle: DecisionCycle) => {
    const timestamp = Date.now();
    const operatorMessage = {
      id: `op-${timestamp}`,
      actor: "operator" as const,
      text: `Help me understand cycle ${cycle.cycleNumber}.`
    };

    const keyMetrics = cycle.metrics.slice(0, 3).map((metric) => `${metric.label}: ${metric.value}`).join(" · ");
    const tessMessage = {
      id: `ts-${timestamp + 1}`,
      actor: "tess" as const,
      text: `Cycle ${cycle.cycleNumber} was triggered by ${cycle.triggerType} in ${cycle.mode} mode. ${cycle.summary} Key indicators: ${keyMetrics}.`,
      grounding: {
        cycleNumber: cycle.cycleNumber,
        constraintIds: [],
        metrics: cycle.metrics.map((metric) => metric.label)
      },
      action: { label: "Apply this posture change", actionId: "open-posture" as const }
    };

    setCopilotMessages((current) => [...current, operatorMessage, tessMessage]);
    setCopilotOpen(true);
  };

  const askTessAboutHeartbeatPlan = (planId: string) => {
    const plan = activeHeartbeatPlans?.find((item) => item.id === planId);
    if (!plan) {
      return;
    }

    const timestamp = Date.now();
    const operatorMessage = {
      id: `op-hb-${timestamp}`,
      actor: "operator" as const,
      text: `Help me evaluate the ${plan.label} heartbeat plan.`
    };

    const tessMessage = {
      id: `ts-hb-${timestamp + 1}`,
      actor: "tess" as const,
      text: `${plan.label}: ${plan.summary} Late Orders ${plan.metrics.lateOrders}, Selected Tasks ${plan.metrics.selectedTasks}, Max Zone Load ${plan.metrics.maxZoneLoad}, Zone Crossings ${plan.metrics.zoneCrossings}, Priority Alignment ${Math.round(plan.metrics.priorityAlignment * 100)}%, Throughput ${plan.metrics.throughputPicksPerHour} picks/hr.`,
      grounding: {
        cycleNumber: cycles[0]?.cycleNumber ?? 0,
        constraintIds: [],
        metrics: ["late-orders", "selected-tasks", "max-zone-load", "zone-crossings", "priority-alignment", "throughput"]
      },
      action: { label: "Apply this posture change", actionId: "open-posture" as const }
    };

    setCopilotMessages((current) => [...current, operatorMessage, tessMessage]);
    setCopilotOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="grid gap-3 md:grid-cols-2">
        <article className="app-card p-4 md:p-6">
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Today</p>
          <p className="mt-2 font-display text-[30px]" style={{ color: "var(--tessera-text-primary)" }}>
            {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <p className="mt-1 font-code text-base" style={{ color: "var(--tessera-text-primary)" }}>
            {now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })}
          </p>
        </article>
        <article className="app-card p-4 md:p-6">
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Next Heartbeat</p>
          <p className="mt-2 font-display text-[36px]" style={{ color: "var(--tessera-accent-signal)" }}>
            {formatCountdown(heartbeatRemaining)}
          </p>
        </article>
      </section>

      {activeHeartbeatPlans ? (
        <HeartbeatProposalCard
          plans={activeHeartbeatPlans}
          mode={mode}
          onAdopt={(_planId) => setActiveHeartbeatPlans(null)}
          onAskTess={askTessAboutHeartbeatPlan}
        />
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <article className={metricCardClass}>
          <p className={metricLabelClass} style={{ color: "var(--tessera-text-secondary)" }}>Late Orders</p>
          <p className="font-display text-[28px]" style={{ color: lateOrdersColor }}>
            {data.kpi.lateOrders}
          </p>
        </article>
        <article className={metricCardClass}>
          <p className={metricLabelClass} style={{ color: "var(--tessera-text-secondary)" }}>Selected Tasks</p>
          <p className="font-display text-[28px]">{data.kpi.selectedTasks}</p>
          <p className="mt-1 text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
            of {data.kpi.candidateTasks} candidates
          </p>
        </article>
        <article className={metricCardClass}>
          <p className={metricLabelClass} style={{ color: "var(--tessera-text-secondary)" }}>Max Zone Load</p>
          <p className="font-display text-[28px]" style={{ color: zoneLoadColor }}>
            {data.kpi.maxZoneLoad}
          </p>
        </article>
        <article className={metricCardClass}>
          <p className={metricLabelClass} style={{ color: "var(--tessera-text-secondary)" }}>Zone Crossings</p>
          <p className="font-display text-[28px]" style={{ color: zoneCrossingsColor }}>
            {data.kpi.zoneCrossings}
          </p>
        </article>
        <article className={metricCardClass}>
          <p className={metricLabelClass} style={{ color: "var(--tessera-text-secondary)" }}>Priority Alignment</p>
          <p className="font-display text-[28px]" style={{ color: priorityAlignmentColor }}>
            {Math.round(data.kpi.priorityAlignment * 100)}%
          </p>
        </article>
        <article className={metricCardClass}>
          <p className={metricLabelClass} style={{ color: "var(--tessera-text-secondary)" }}>Throughput</p>
          <p className="font-display text-[28px]" style={{ color: throughputColor }}>
            {data.kpi.throughputPicksPerHour}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
            picks/hr
          </p>
        </article>
      </section>

      <section className="app-card space-y-5 p-4 md:p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl uppercase tracking-[-0.01em]">Posture</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              Tier objectives by strategic priority, then tune penalty strictness and release limits.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {[1, 2, 3].map((tier) => {
            const typedTier = tier as ObjectiveTier;
            return (
              <article
                key={tier}
                className="rounded-[12px] border p-3"
                style={{ borderColor: "var(--tessera-border)", background: "color-mix(in srgb, var(--tessera-bg-surface) 82%, var(--tessera-bg-page))" }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const objective = getDraggedObjective(event);
                  if (objective) {
                    moveObjective(objective, typedTier);
                  }
                }}
              >
                <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
                  Tier {tier}
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
                  {tierDescriptions[typedTier]}
                </p>
                <div className="mt-3 min-h-[70px] space-y-2">
                  {objectiveTiers[typedTier].length === 0 ? (
                    <div className="rounded-[10px] border border-dashed px-3 py-2 text-xs" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                      Drop objective here
                    </div>
                  ) : (
                    objectiveTiers[typedTier].map((objective, index) => (
                      <button
                        key={objective}
                        type="button"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData(objectiveDragKey, objective);
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const draggedObjective = getDraggedObjective(event);
                          if (draggedObjective) {
                            moveObjective(draggedObjective, typedTier, index);
                          }
                        }}
                        className="flex w-full items-center justify-between rounded-[10px] border px-3 py-2 text-left text-sm"
                        style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-page)" }}
                      >
                        <span>{objectiveLabels[objective]}</span>
                        <span className="font-code text-xs" style={{ color: "var(--tessera-text-secondary)" }}>drag</span>
                      </button>
                    ))
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {penaltyControlMeta.map((penalty) => (
            <label key={penalty.key} className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              {penalty.label}
              <select
                className="mt-1 block w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                value={penaltyLevels[penalty.key]}
                onChange={(event) =>
                  setPenaltyLevels((current) => ({
                    ...current,
                    [penalty.key]: event.target.value as PenaltyLevel
                  }))
                }
              >
                <option>Relaxed</option>
                <option>Normal</option>
                <option>Strict</option>
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="app-card space-y-4 p-4 md:p-6">
        <div>
          <h2 className="font-display text-xl uppercase tracking-[-0.01em]">Limits</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            Set release and floor-cap boundaries for this run.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Available Carts
            <input
              type="number"
              min={1}
              max={60}
              value={availableCarts}
              onChange={(event) => setAvailableCarts(Number(event.target.value))}
              className="mt-1 block w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
              style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
            />
          </label>
          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Max Batches
            <input
              type="number"
              min={1}
              max={80}
              value={maxBatches}
              onChange={(event) => setMaxBatches(Number(event.target.value))}
              className="mt-1 block w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
              style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
            />
          </label>
          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Max Tasks / Zone
            <input
              type="number"
              min={1}
              max={120}
              value={maxTasksPerZone}
              onChange={(event) => setMaxTasksPerZone(Number(event.target.value))}
              className="mt-1 block w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
              style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
            />
          </label>
        </div>
      </section>

      {cycles.length === 0 ? (
        <section className="app-card p-6 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          <div className="flex items-center gap-3">
            <BrandTile className="h-6 w-auto" variant="collapsed" />
            <span>No decisions yet this shift. Next heartbeat in 07:42.</span>
          </div>
        </section>
      ) : (
        <div className="space-y-3">
          {cycles.map((cycle) => (
            <article key={cycle.id} className="app-card p-4 md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
                  {cycle.timestamp} {cycle.triggerType}
                </p>
                <span className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
                  Cycle #{cycle.cycleNumber}
                </span>
                <ModeBadge mode={cycle.mode} />
                <StatusChip status={cycle.status} />
              </div>

              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--tessera-text-secondary)" }}>
                {cycle.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {cycle.metrics.map((metric) => (
                  <span key={metric.label} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                    {metric.label}: {metric.value}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={() => setPanel({ type: "alternatives", cycle })}>
                  View Alternatives
                </button>
                <button type="button" className="btn-secondary" onClick={() => setPanel({ type: "detail", cycle })}>
                  View Detail
                </button>

                {cycle.mode === "Advisory" ? (
                  <>
                    <button type="button" className="btn-primary" onClick={() => setCycleStatus(cycle.id, "Executed")}>
                      Approve
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setCycleStatus(cycle.id, "Overridden")}>
                      Override
                    </button>
                  </>
                ) : cycle.mode === "Closed-Loop" ? (
                  <>
                    <button type="button" className="btn-secondary" onClick={() => setCycleStatus(cycle.id, "Overridden")}>
                      Override
                    </button>
                    <button type="button" className="btn-secondary">
                      Audit Log
                    </button>
                  </>
                ) : null}

                <button
                  type="button"
                  className="btn-secondary"
                  style={{ border: "1.5px solid var(--tessera-accent-signal)", color: "var(--tessera-accent-signal)" }}
                  onClick={() => askTessAboutCycle(cycle)}
                >
                  Ask TESS
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <DetailPanel
        open={panel.type !== "none"}
        title={panel.type === "alternatives" ? "Trade-Off Exploration" : "Decision Detail"}
        onClose={() => setPanel({ type: "none" })}
      >
        {panel.type === "alternatives" ? (
          <TradeoffPanel
            alternatives={selectedAlternatives}
            mode={mode}
            onAdopt={(label) => {
              setCycleStatus(panel.cycle.id, "Overridden");
              setPanel({ type: "none" });
              window.alert(`Adopted ${label} for cycle ${panel.cycle.cycleNumber}.`);
            }}
          />
        ) : panel.type === "detail" ? (
          <div className="space-y-4 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            <p>
              Full breakdown for cycle {panel.cycle.cycleNumber}. Includes release, batching, prioritization, operator action, and predicted-vs-actual deltas.
            </p>
            <div className="app-card p-4">
              <h3 className="font-display text-lg uppercase tracking-[-0.01em]" style={{ color: "var(--tessera-text-primary)" }}>Release</h3>
              <p className="mt-2">{panel.cycle.recommendation.releaseSummary}</p>
            </div>
            <div className="app-card p-4">
              <h3 className="font-display text-lg uppercase tracking-[-0.01em]" style={{ color: "var(--tessera-text-primary)" }}>Batching</h3>
              <p className="mt-2">{panel.cycle.recommendation.batchingSummary}</p>
            </div>
            <div className="app-card p-4">
              <h3 className="font-display text-lg uppercase tracking-[-0.01em]" style={{ color: "var(--tessera-text-primary)" }}>Priority</h3>
              <p className="mt-2">{panel.cycle.recommendation.prioritizeSummary}</p>
            </div>
            <div className="app-card p-4">
              <h3 className="font-display text-lg uppercase tracking-[-0.01em]" style={{ color: "var(--tessera-text-primary)" }}>Operator Action</h3>
              <p className="mt-2">{panel.cycle.operatorAction}</p>
            </div>
          </div>
        ) : null}
      </DetailPanel>
    </div>
  );
}
