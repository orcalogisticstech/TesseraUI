"use client";

import { DetailPanel } from "@/components/app/DetailPanel";
import { ModeBadge } from "@/components/app/ModeBadge";
import { StatusChip } from "@/components/app/StatusChip";
import { TradeoffPanel } from "@/components/app/TradeoffPanel";
import { useAppState } from "@/components/app/AppProvider";
import { alternativesByCycle, decisionCycles } from "@/lib/product-mock";
import type { ApiFilter, DecisionCycle, StatusFilter, TriggerFilter } from "@/lib/product-types";
import { useMemo, useState } from "react";

type PanelState =
  | { type: "none" }
  | { type: "alternatives"; cycle: DecisionCycle }
  | { type: "detail"; cycle: DecisionCycle };

const timeRanges = ["Last 2 hours", "This shift", "24 hours"];

function filterByTrigger(cycle: DecisionCycle, triggerFilter: TriggerFilter) {
  if (triggerFilter === "All") {
    return true;
  }
  if (triggerFilter === "Heartbeat") {
    return cycle.triggerType === "Heartbeat";
  }
  return cycle.triggerType !== "Heartbeat";
}

function filterByStatus(cycle: DecisionCycle, statusFilter: StatusFilter) {
  if (statusFilter === "All") {
    return true;
  }
  if (statusFilter === "Pending") {
    return cycle.status === "Pending Review";
  }
  return cycle.status === statusFilter;
}

export function DecisionFeedView() {
  const { mode } = useAppState();
  const [apiFilter, setApiFilter] = useState<ApiFilter>("All");
  const [triggerFilter, setTriggerFilter] = useState<TriggerFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [timeRange, setTimeRange] = useState(timeRanges[1]);
  const [connectionError, setConnectionError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cycles, setCycles] = useState(decisionCycles);
  const [panel, setPanel] = useState<PanelState>({ type: "none" });

  const filtered = useMemo(
    () =>
      cycles.filter((cycle) => {
        const apiMatch = apiFilter === "All" || cycle.apisTouched.includes(apiFilter);
        return apiMatch && filterByTrigger(cycle, triggerFilter) && filterByStatus(cycle, statusFilter);
      }),
    [apiFilter, triggerFilter, statusFilter, cycles]
  );

  const selectedAlternatives =
    panel.type === "alternatives" ? alternativesByCycle[panel.cycle.id] ?? alternativesByCycle["cycle-4821"] : [];

  const setCycleStatus = (cycleId: string, status: DecisionCycle["status"]) => {
    setCycles((current) => current.map((cycle) => (cycle.id === cycleId ? { ...cycle, status } : cycle)));
  };

  const simulateLoading = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            API
            <select className="mt-1 block rounded-[10px] border bg-transparent px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)" }} value={apiFilter} onChange={(event) => setApiFilter(event.target.value as ApiFilter)}>
              <option>All</option>
              <option>Release</option>
              <option>Batching</option>
              <option>Priority</option>
            </select>
          </label>

          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Trigger
            <select className="mt-1 block rounded-[10px] border bg-transparent px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)" }} value={triggerFilter} onChange={(event) => setTriggerFilter(event.target.value as TriggerFilter)}>
              <option>All</option>
              <option>Heartbeat</option>
              <option>Event</option>
            </select>
          </label>

          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Status
            <select className="mt-1 block rounded-[10px] border bg-transparent px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)" }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
              <option>All</option>
              <option>Pending</option>
              <option>Executed</option>
              <option>Overridden</option>
              <option>Anomaly</option>
            </select>
          </label>

          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Time range
            <select className="mt-1 block rounded-[10px] border bg-transparent px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)" }} value={timeRange} onChange={(event) => setTimeRange(event.target.value)}>
              {timeRanges.map((range) => (
                <option key={range}>{range}</option>
              ))}
            </select>
          </label>

          <button type="button" className="btn-secondary ml-auto" onClick={simulateLoading}>
            Simulate Loading
          </button>
          <button type="button" className="btn-secondary" onClick={() => setConnectionError((current) => !current)}>
            {connectionError ? "Clear Error" : "Simulate Error"}
          </button>
        </div>
      </section>

      {connectionError && (
        <section className="app-card p-4 text-sm" style={{ borderColor: "var(--tessera-danger)", color: "var(--tessera-danger)" }}>
          Connection to WMS interrupted. Last successful sync: 14:11.
        </section>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="app-card animate-pulse p-6">
              <div className="h-4 w-1/3 rounded bg-white/10" />
              <div className="mt-3 h-4 w-full rounded bg-white/10" />
              <div className="mt-2 h-4 w-4/5 rounded bg-white/10" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <section className="app-card p-6 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          No decisions yet this shift. Next heartbeat in 07:42.
        </section>
      ) : (
        <div className="space-y-3">
          {filtered.map((cycle) => (
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
              Full breakdown for cycle {panel.cycle.cycleNumber}. Includes Release, Batching, and Priority recommendations with prediction deltas.
            </p>
            <div className="app-card p-4">
              <h3 className="font-display text-lg uppercase tracking-[-0.01em]" style={{ color: "var(--tessera-text-primary)" }}>Release</h3>
              <p className="mt-2">42 released, 36 deferred. Deferred set avoids Zone C threshold and preserves carrier cutoff windows.</p>
            </div>
            <div className="app-card p-4">
              <h3 className="font-display text-lg uppercase tracking-[-0.01em]" style={{ color: "var(--tessera-text-primary)" }}>Batching</h3>
              <p className="mt-2">8 batches formed with proximity + equipment constraints. Predicted travel reduction: 12%.</p>
            </div>
            <div className="app-card p-4">
              <h3 className="font-display text-lg uppercase tracking-[-0.01em]" style={{ color: "var(--tessera-text-primary)" }}>Priority</h3>
              <p className="mt-2">3 active batches re-ranked for 2pm cutoff under current posture weights.</p>
            </div>
          </div>
        ) : null}
      </DetailPanel>
    </div>
  );
}
