"use client";

import { DetailPanel } from "@/components/app/DetailPanel";
import { ModeBadge } from "@/components/app/ModeBadge";
import { StatusChip } from "@/components/app/StatusChip";
import { TradeoffPanel } from "@/components/app/TradeoffPanel";
import { useAppState } from "@/components/app/AppProvider";
import { BrandTile } from "@/components/BrandTile";
import type { ApiName, DecisionCycle, DecisionStatus, TriggerType } from "@/lib/app-types";
import { useMemo, useState } from "react";

type PanelState =
  | { type: "none" }
  | { type: "alternatives"; cycle: DecisionCycle }
  | { type: "detail"; cycle: DecisionCycle };

const timeRanges = ["Last 2 hours", "This shift", "24 hours"];

export function DecisionFeedView() {
  const { mode, posture, data, cycles, setCycles, setPosturePanelOpen, setCopilotMessages, setCopilotOpen } = useAppState();
  const [apiFilter, setApiFilter] = useState<"All" | ApiName>("All");
  const [triggerFilter, setTriggerFilter] = useState<"All" | TriggerType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | DecisionStatus>("All");
  const [timeRange, setTimeRange] = useState(timeRanges[1]);
  const [connectionError, setConnectionError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [panel, setPanel] = useState<PanelState>({ type: "none" });

  const filtered = useMemo(
    () =>
      cycles.filter((cycle) => {
        const apiMatch = apiFilter === "All" || cycle.apisTouched.includes(apiFilter);
        const triggerMatch = triggerFilter === "All" || cycle.triggerType === triggerFilter;
        const statusMatch = statusFilter === "All" || cycle.status === statusFilter;
        return apiMatch && triggerMatch && statusMatch;
      }),
    [apiFilter, triggerFilter, statusFilter, cycles]
  );

  const selectedAlternatives = panel.type === "alternatives" ? data.alternativesByCycle[panel.cycle.id] ?? [] : [];

  const setCycleStatus = (cycleId: string, status: DecisionStatus) => {
    setCycles((current) => current.map((cycle) => (cycle.id === cycleId ? { ...cycle, status } : cycle)));
  };

  const simulateLoading = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 500);
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

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-code text-xs uppercase tracking-[0.12em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Shift Header
            </p>
            <h1 className="font-display text-3xl uppercase tracking-[-0.01em]">Day Shift - Mar 23</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              {posture.presetName}. Zone B capped at 70% active work.
            </p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => setPosturePanelOpen(true)}>
            Edit Posture
          </button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="app-card p-4">
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Active Work</p>
          <p className="mt-2 font-display text-[28px]" style={{ color: data.kpi.activeWork.current / data.kpi.activeWork.cap > 0.95 ? "var(--tessera-danger)" : data.kpi.activeWork.current / data.kpi.activeWork.cap > 0.8 ? "var(--tessera-warning)" : "var(--tessera-success)" }}>
            {data.kpi.activeWork.current}/{data.kpi.activeWork.cap}
          </p>
        </article>
        <article className="app-card p-4">
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Late-Risk Orders</p>
          <p className="mt-2 font-display text-[28px]" style={{ color: data.kpi.lateRiskOrders > 3 ? "var(--tessera-danger)" : data.kpi.lateRiskOrders > 0 ? "var(--tessera-warning)" : "var(--tessera-success)" }}>
            {data.kpi.lateRiskOrders}
          </p>
        </article>
        <article className="app-card p-4">
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Zone Balance</p>
          <p className="mt-2 font-display text-[28px]" style={{ color: data.kpi.maxZoneUtilization > 85 ? "var(--tessera-danger)" : data.kpi.maxZoneUtilization > 70 ? "var(--tessera-warning)" : "var(--tessera-success)" }}>
            {data.kpi.maxZoneUtilization}%
          </p>
        </article>
        <article className="app-card p-4">
          <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Cycle Status</p>
          <p className="mt-2 font-code text-lg">{data.kpi.cycleStatus}</p>
        </article>
      </section>

      <section className="app-card p-4 md:p-6">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            API
            <select className="mt-1 block rounded-[10px] border bg-transparent px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)" }} value={apiFilter} onChange={(event) => setApiFilter(event.target.value as "All" | ApiName)}>
              <option>All</option>
              <option>Release</option>
              <option>Batching</option>
              <option>Prioritize</option>
            </select>
          </label>

          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Trigger
            <select className="mt-1 block rounded-[10px] border bg-transparent px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)" }} value={triggerFilter} onChange={(event) => setTriggerFilter(event.target.value as "All" | TriggerType)}>
              <option>All</option>
              <option>Heartbeat</option>
              <option>Batch Completed</option>
              <option>Rush Order</option>
              <option>Congestion Alert</option>
            </select>
          </label>

          <label className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Status
            <select className="mt-1 block rounded-[10px] border bg-transparent px-3 py-2 text-sm" style={{ borderColor: "var(--tessera-border)" }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | DecisionStatus)}>
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
          <div className="flex items-center gap-3">
            <BrandTile className="h-6 w-auto" variant="collapsed" />
            <span>No decisions yet this shift. Next heartbeat in 07:42.</span>
          </div>
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
