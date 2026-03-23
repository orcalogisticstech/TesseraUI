"use client";

import { useAppState } from "@/components/app/AppProvider";
import { BrandTile } from "@/components/BrandTile";
import { useMemo, useState } from "react";

export function HistoryView() {
  const { cycles } = useAppState();
  const [query, setQuery] = useState("");
  const [responseFilter, setResponseFilter] = useState<"All" | "local-repair" | "partial-reopt" | "full-reopt">("All");
  const [overrideOnly, setOverrideOnly] = useState(false);
  const [anomalyOnly, setAnomalyOnly] = useState(false);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      cycles.filter((cycle) => {
        const matchesQuery = cycle.summary.toLowerCase().includes(query.toLowerCase()) || String(cycle.cycleNumber).includes(query);
        const matchesResponse = responseFilter === "All" || cycle.responseType === responseFilter;
        const matchesOverride = !overrideOnly || cycle.status === "Overridden";
        const matchesAnomaly = !anomalyOnly || cycle.status === "Anomaly";
        return matchesQuery && matchesResponse && matchesOverride && matchesAnomaly;
      }),
    [query, responseFilter, overrideOnly, anomalyOnly, cycles]
  );

  const selectedCycle = rows.find((cycle) => cycle.id === selectedCycleId) ?? null;

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <BrandTile className="h-6 w-auto" variant="collapsed" />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.01em]">History</h1>
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Past cycles, replayable recommendations, and full audit context.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by cycle number or summary"
            className="w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: "var(--tessera-border)" }}
          />
          <select
            value={responseFilter}
            onChange={(event) => setResponseFilter(event.target.value as typeof responseFilter)}
            className="w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: "var(--tessera-border)" }}
          >
            <option value="All">All Response Types</option>
            <option value="local-repair">Local Repair</option>
            <option value="partial-reopt">Partial Re-Opt</option>
            <option value="full-reopt">Full Re-Opt</option>
          </select>
        </div>
        <div className="mt-3 flex gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={overrideOnly} onChange={(event) => setOverrideOnly(event.target.checked)} />
            Overrides only
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={anomalyOnly} onChange={(event) => setAnomalyOnly(event.target.checked)} />
            Anomalies only
          </label>
        </div>
      </section>

      <section className="space-y-3">
        {rows.map((cycle) => (
          <article key={cycle.id} className="app-card p-4">
            <button type="button" className="w-full text-left" onClick={() => setSelectedCycleId(cycle.id === selectedCycleId ? null : cycle.id)}>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-code text-xs uppercase tracking-[0.1em]" style={{ color: "var(--tessera-text-secondary)" }}>
                  {cycle.timestamp} · Cycle #{cycle.cycleNumber}
                </p>
                <p className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{cycle.responseType}</p>
                <p className="text-xs" style={{ color: cycle.status === "Anomaly" ? "var(--tessera-danger)" : cycle.status === "Overridden" ? "var(--tessera-warning)" : "var(--tessera-text-secondary)" }}>{cycle.status}</p>
              </div>
              <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>{cycle.summary}</p>
            </button>

            {selectedCycle?.id === cycle.id && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Operator Action</p>
                  <p className="mt-1 text-sm">{cycle.operatorAction}</p>
                </div>
                <div className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Predicted vs Actual</p>
                  <p className="mt-1 text-sm">Throughput {cycle.predictedVsActual.throughput}</p>
                  <p className="text-sm">Travel {cycle.predictedVsActual.travel}</p>
                  <p className="text-sm">Late Risk {cycle.predictedVsActual.lateRisk}</p>
                </div>
                <div className="rounded-[10px] border p-3 md:col-span-2" style={{ borderColor: "var(--tessera-border)" }}>
                  <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>Anomaly Flags</p>
                  <p className="mt-1 text-sm">{cycle.anomalyFlags.length ? cycle.anomalyFlags.join(", ") : "None"}</p>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
