"use client";

import { decisionCycles } from "@/lib/product-mock";
import { BrandTile } from "@/components/BrandTile";
import { useMemo, useState } from "react";

export function HistoryView() {
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () => decisionCycles.filter((cycle) => cycle.summary.toLowerCase().includes(query.toLowerCase()) || String(cycle.cycleNumber).includes(query)),
    [query]
  );

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <BrandTile className="h-6 w-auto" variant="collapsed" />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.01em]">History</h1>
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Search past decisions and compare outcomes against predictions.
        </p>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by cycle number or summary"
          className="mt-4 w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
          style={{ borderColor: "var(--tessera-border)" }}
        />
      </section>

      <section className="overflow-auto rounded-[10px] border" style={{ borderColor: "var(--tessera-border)" }}>
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Cycle</th>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Trigger</th>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Status</th>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Throughput P/A</th>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Travel P/A</th>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>Late Risk P/A</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((cycle) => (
              <tr key={cycle.id}>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>#{cycle.cycleNumber}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{cycle.triggerType}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{cycle.status}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{cycle.predictedVsActual.throughput}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{cycle.predictedVsActual.travel}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{cycle.predictedVsActual.lateRisk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
