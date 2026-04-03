"use client";

import { HeartbeatProposalCard } from "@/components/app/HeartbeatProposalCard";
import { useAppState } from "@/components/app/AppProvider";
import type { HeartbeatPlan } from "@/lib/app-types";
import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";

type ObjectiveKey = "tardiness" | "travel_time" | "balance";
type ObjectiveTier = 1 | 2 | 3;
type PenaltyKey = "zone_cross" | "split_order" | "grouping_violation";
type PenaltyLevel = "Relaxed" | "Normal" | "Strict";
type BlockedLocation = { id: string; locationId: string; reason: string };
type BlockedZone = { id: string; zoneId: string; reason: string };
type BlockedAisle = { id: string; aisleId: string; reason: string };
type BlockedTerminal = { id: string; nodeId: string; reason: string };

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

function createRowId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function DecisionFeedView() {
  const { mode, data, setCopilotDraftAttachments, setCopilotOpen, openRunTab, heartbeatRemaining, heartbeatCycleCount } = useAppState();
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
  const [isConfigEditing, setIsConfigEditing] = useState(false);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(false);
  const [isPenaltiesOpen, setIsPenaltiesOpen] = useState(false);
  const [isLimitsOpen, setIsLimitsOpen] = useState(false);
  const [availableCarts, setAvailableCarts] = useState(18);
  const [maxBatches, setMaxBatches] = useState(20);
  const [maxTasksPerZone, setMaxTasksPerZone] = useState(40);
  const [isFloorStateEditing, setIsFloorStateEditing] = useState(false);
  const [isBlockedLocationsOpen, setIsBlockedLocationsOpen] = useState(false);
  const [isBlockedZonesOpen, setIsBlockedZonesOpen] = useState(false);
  const [isBlockedAislesOpen, setIsBlockedAislesOpen] = useState(false);
  const [isBlockedTerminalsOpen, setIsBlockedTerminalsOpen] = useState(false);
  const [blockedLocations, setBlockedLocations] = useState<BlockedLocation[]>([
    { id: "loc-1", locationId: "A1-24-006A", reason: "cycle_count" },
    { id: "loc-2", locationId: "B2-10-004", reason: "replenishment_pending" }
  ]);
  const [blockedZones, setBlockedZones] = useState<BlockedZone[]>([{ id: "zone-1", zoneId: "ZONE_D", reason: "equipment_down" }]);
  const [blockedAisles, setBlockedAisles] = useState<BlockedAisle[]>([{ id: "aisle-1", aisleId: "A1-24", reason: "spill" }]);
  const [blockedTerminals, setBlockedTerminals] = useState<BlockedTerminal[]>([{ id: "terminal-1", nodeId: "PACK_2", reason: "equipment_down" }]);

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

  const lateOrdersColor = data.kpi.lateOrders > 2 ? "var(--tessera-danger)" : data.kpi.lateOrders > 0 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const zoneLoadColor = data.kpi.maxZoneLoad > 40 ? "var(--tessera-danger)" : data.kpi.maxZoneLoad > 32 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const zoneCrossingsColor = data.kpi.zoneCrossings > 6 ? "var(--tessera-danger)" : data.kpi.zoneCrossings > 3 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const priorityAlignmentColor = data.kpi.priorityAlignment < 0.85 ? "var(--tessera-danger)" : data.kpi.priorityAlignment < 0.92 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const throughputColor = data.kpi.throughputPicksPerHour < 150 ? "var(--tessera-danger)" : data.kpi.throughputPicksPerHour < 170 ? "var(--tessera-warning)" : "var(--tessera-success)";
  const metricCardClass = "app-card flex h-full flex-col p-4";
  const metricLabelClass = "min-h-[2.75rem] text-xs uppercase tracking-[0.08em]";

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

  const askTessAboutHeartbeatPlan = (planId: string) => {
    const plan = activeHeartbeatPlans?.find((item) => item.id === planId);
    if (!plan) {
      return;
    }

    setCopilotDraftAttachments((current) => {
      const existing = current.find((item) => item.id === plan.id);
      if (existing) {
        return current;
      }
      return [
        ...current,
        {
          id: plan.id,
          type: "heartbeat-plan",
          title: `${plan.run.runId} - ${plan.label}`,
          subtitle: "Heartbeat plan"
        }
      ];
    });
    setCopilotOpen(true);
  };

  const openHeartbeatPlanDetails = (planId: string) => {
    const plan = activeHeartbeatPlans?.find((item) => item.id === planId);
    if (!plan) {
      return;
    }
    openRunTab(plan.run);
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
          onViewDetails={openHeartbeatPlanDetails}
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

      <section className="app-card space-y-6 p-4 md:p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl uppercase tracking-[-0.01em]">Configure Job</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              Set optimization priorities, policy strictness, and run limits.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={() => setIsConfigEditing((current) => !current)}>
              {isConfigEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setIsObjectivesOpen((current) => !current)}>
            <h3 className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Objectives
            </h3>
            <span className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{isObjectivesOpen ? "Collapse" : "Expand"}</span>
          </button>
          {isObjectivesOpen ? (
          <div className="grid gap-3 lg:grid-cols-3">
            {[1, 2, 3].map((tier) => {
              const typedTier = tier as ObjectiveTier;
              return (
                <article
                  key={tier}
                  className="rounded-[12px] border p-3"
                  style={{
                    borderColor: "var(--tessera-border)",
                    background: "color-mix(in srgb, var(--tessera-bg-surface) 82%, var(--tessera-bg-page))",
                    opacity: isConfigEditing ? 1 : 0.9
                  }}
                  onDragOver={(event) => {
                    if (isConfigEditing) {
                      event.preventDefault();
                    }
                  }}
                  onDrop={(event) => {
                    if (!isConfigEditing) {
                      return;
                    }
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
                          draggable={isConfigEditing}
                          onDragStart={(event) => {
                            if (!isConfigEditing) {
                              return;
                            }
                            event.dataTransfer.setData(objectiveDragKey, objective);
                            event.dataTransfer.effectAllowed = "move";
                          }}
                          onDragOver={(event) => {
                            if (isConfigEditing) {
                              event.preventDefault();
                            }
                          }}
                          onDrop={(event) => {
                            if (!isConfigEditing) {
                              return;
                            }
                            event.preventDefault();
                            event.stopPropagation();
                            const draggedObjective = getDraggedObjective(event);
                            if (draggedObjective) {
                              moveObjective(draggedObjective, typedTier, index);
                            }
                          }}
                          className="flex w-full items-center justify-between rounded-[10px] border px-3 py-2 text-left text-sm"
                          style={{
                            borderColor: "var(--tessera-border)",
                            background: "var(--tessera-bg-page)",
                            cursor: isConfigEditing ? "grab" : "default"
                          }}
                        >
                          <span>{objectiveLabels[objective]}</span>
                          <span className="font-code text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{isConfigEditing ? "drag" : "locked"}</span>
                        </button>
                      ))
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          ) : null}
        </div>

        <div className="space-y-3 border-t pt-4" style={{ borderColor: "var(--tessera-border)" }}>
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setIsPenaltiesOpen((current) => !current)}>
            <h3 className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Penalties
            </h3>
            <span className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{isPenaltiesOpen ? "Collapse" : "Expand"}</span>
          </button>
          {isPenaltiesOpen ? (
          <div className="grid gap-3 md:grid-cols-3">
            {penaltyControlMeta.map((penalty) => (
              <label key={penalty.key} className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
                {penalty.label}
                <select
                  className="mt-1 block w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                  style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  disabled={!isConfigEditing}
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
          ) : null}
        </div>

        <div className="space-y-3 border-t pt-4" style={{ borderColor: "var(--tessera-border)" }}>
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setIsLimitsOpen((current) => !current)}>
            <h3 className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Limits
            </h3>
            <span className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{isLimitsOpen ? "Collapse" : "Expand"}</span>
          </button>
          {isLimitsOpen ? (
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Available Carts
              <input
                type="number"
                min={1}
                max={60}
                disabled={!isConfigEditing}
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
                disabled={!isConfigEditing}
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
                disabled={!isConfigEditing}
                value={maxTasksPerZone}
                onChange={(event) => setMaxTasksPerZone(Number(event.target.value))}
                className="mt-1 block w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
              />
            </label>
          </div>
          ) : null}
        </div>
      </section>

      <section className="app-card space-y-6 p-4 md:p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl uppercase tracking-[-0.01em]">Update Floor State</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              Update temporary physical blockers used in optimizer `state`.
            </p>
          </div>
          <button type="button" className="btn-secondary px-3 py-2 text-xs" onClick={() => setIsFloorStateEditing((current) => !current)}>
            {isFloorStateEditing ? "Save" : "Edit"}
          </button>
        </div>

        <div className="space-y-3">
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setIsBlockedLocationsOpen((current) => !current)}>
            <h3 className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Blocked Locations
            </h3>
            <span className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{isBlockedLocationsOpen ? "Collapse" : "Expand"}</span>
          </button>
          {isBlockedLocationsOpen ? (
            <div className="space-y-2">
              {blockedLocations.map((row, index) => (
                <div key={row.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="text"
                    value={row.locationId}
                    disabled={!isFloorStateEditing}
                    onChange={(event) =>
                      setBlockedLocations((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, locationId: event.target.value } : item)))
                    }
                    placeholder="location_id"
                    className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  />
                  <input
                    type="text"
                    value={row.reason}
                    disabled={!isFloorStateEditing}
                    onChange={(event) =>
                      setBlockedLocations((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, reason: event.target.value } : item)))
                    }
                    placeholder="reason"
                    className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  />
                  <button
                    type="button"
                    className="btn-secondary px-3 py-2 text-xs"
                    disabled={!isFloorStateEditing}
                    onClick={() => setBlockedLocations((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary px-3 py-2 text-xs"
                disabled={!isFloorStateEditing}
                onClick={() => setBlockedLocations((current) => [...current, { id: createRowId("loc"), locationId: "", reason: "" }])}
              >
                Add Location Block
              </button>
            </div>
          ) : null}
        </div>

        <div className="space-y-3 border-t pt-4" style={{ borderColor: "var(--tessera-border)" }}>
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setIsBlockedZonesOpen((current) => !current)}>
            <h3 className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Blocked Zones
            </h3>
            <span className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{isBlockedZonesOpen ? "Collapse" : "Expand"}</span>
          </button>
          {isBlockedZonesOpen ? (
            <div className="space-y-2">
              {blockedZones.map((row, index) => (
                <div key={row.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="text"
                    value={row.zoneId}
                    disabled={!isFloorStateEditing}
                    onChange={(event) =>
                      setBlockedZones((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, zoneId: event.target.value } : item)))
                    }
                    placeholder="zone_id"
                    className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  />
                  <input
                    type="text"
                    value={row.reason}
                    disabled={!isFloorStateEditing}
                    onChange={(event) =>
                      setBlockedZones((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, reason: event.target.value } : item)))
                    }
                    placeholder="reason"
                    className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  />
                  <button
                    type="button"
                    className="btn-secondary px-3 py-2 text-xs"
                    disabled={!isFloorStateEditing}
                    onClick={() => setBlockedZones((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary px-3 py-2 text-xs"
                disabled={!isFloorStateEditing}
                onClick={() => setBlockedZones((current) => [...current, { id: createRowId("zone"), zoneId: "", reason: "" }])}
              >
                Add Zone Block
              </button>
            </div>
          ) : null}
        </div>

        <div className="space-y-3 border-t pt-4" style={{ borderColor: "var(--tessera-border)" }}>
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setIsBlockedAislesOpen((current) => !current)}>
            <h3 className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Blocked Aisles
            </h3>
            <span className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{isBlockedAislesOpen ? "Collapse" : "Expand"}</span>
          </button>
          {isBlockedAislesOpen ? (
            <div className="space-y-2">
              {blockedAisles.map((row, index) => (
                <div key={row.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="text"
                    value={row.aisleId}
                    disabled={!isFloorStateEditing}
                    onChange={(event) =>
                      setBlockedAisles((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, aisleId: event.target.value } : item)))
                    }
                    placeholder="aisle_id"
                    className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  />
                  <input
                    type="text"
                    value={row.reason}
                    disabled={!isFloorStateEditing}
                    onChange={(event) =>
                      setBlockedAisles((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, reason: event.target.value } : item)))
                    }
                    placeholder="reason"
                    className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  />
                  <button
                    type="button"
                    className="btn-secondary px-3 py-2 text-xs"
                    disabled={!isFloorStateEditing}
                    onClick={() => setBlockedAisles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary px-3 py-2 text-xs"
                disabled={!isFloorStateEditing}
                onClick={() => setBlockedAisles((current) => [...current, { id: createRowId("aisle"), aisleId: "", reason: "" }])}
              >
                Add Aisle Block
              </button>
            </div>
          ) : null}
        </div>

        <div className="space-y-3 border-t pt-4" style={{ borderColor: "var(--tessera-border)" }}>
          <button type="button" className="flex w-full items-center justify-between" onClick={() => setIsBlockedTerminalsOpen((current) => !current)}>
            <h3 className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Blocked Terminals
            </h3>
            <span className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{isBlockedTerminalsOpen ? "Collapse" : "Expand"}</span>
          </button>
          {isBlockedTerminalsOpen ? (
            <div className="space-y-2">
              {blockedTerminals.map((row, index) => (
                <div key={row.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="text"
                    value={row.nodeId}
                    disabled={!isFloorStateEditing}
                    onChange={(event) =>
                      setBlockedTerminals((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, nodeId: event.target.value } : item)))
                    }
                    placeholder="node_id"
                    className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  />
                  <input
                    type="text"
                    value={row.reason}
                    disabled={!isFloorStateEditing}
                    onChange={(event) =>
                      setBlockedTerminals((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, reason: event.target.value } : item)))
                    }
                    placeholder="reason"
                    className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
                    style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
                  />
                  <button
                    type="button"
                    className="btn-secondary px-3 py-2 text-xs"
                    disabled={!isFloorStateEditing}
                    onClick={() => setBlockedTerminals((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary px-3 py-2 text-xs"
                disabled={!isFloorStateEditing}
                onClick={() => setBlockedTerminals((current) => [...current, { id: createRowId("terminal"), nodeId: "", reason: "" }])}
              >
                Add Terminal Block
              </button>
            </div>
          ) : null}
        </div>
      </section>

    </div>
  );
}
