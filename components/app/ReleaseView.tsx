"use client";

import { DetailPanel } from "@/components/app/DetailPanel";
import { useAppState } from "@/components/app/AppProvider";
import { useMemo, useState } from "react";

export function ReleaseView() {
  const { data, mode } = useAppState();
  const [query, setQuery] = useState("");
  const [recommendationFilter, setRecommendationFilter] = useState<"All" | "Release" | "Defer">("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      data.orders.filter((order) => {
        const queryMatch =
          order.id.toLowerCase().includes(query.toLowerCase()) ||
          order.zones.join(" ").toLowerCase().includes(query.toLowerCase());
        const recommendationMatch = recommendationFilter === "All" || order.recommendation === recommendationFilter;
        return queryMatch && recommendationMatch;
      }),
    [data.orders, query, recommendationFilter]
  );

  const released = data.orders.filter((order) => order.recommendation === "Release").length;
  const deferred = data.orders.length - released;
  const selected = data.orders.find((order) => order.id === selectedOrderId) ?? null;

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <h1 className="font-display text-3xl uppercase tracking-[-0.01em]">Release View</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Recommending release of {released} orders, deferring {deferred}. Predicted floor utilization: 72%. Late-risk: 0.
        </p>
      </section>

      <section className="app-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search order id or zone"
            className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: "var(--tessera-border)" }}
          />
          <select
            value={recommendationFilter}
            onChange={(event) => setRecommendationFilter(event.target.value as typeof recommendationFilter)}
            className="rounded-[10px] border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: "var(--tessera-border)" }}
          >
            <option>All</option>
            <option>Release</option>
            <option>Defer</option>
          </select>
        </div>
      </section>

      <section className="overflow-auto rounded-card border" style={{ borderColor: "var(--tessera-border)" }}>
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              {[
                "Order ID",
                "Ship Deadline",
                "Priority",
                "Zone(s)",
                "Recommendation",
                "Reason"
              ].map((col) => (
                <th key={col} className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 60).map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer"
                style={{ opacity: order.recommendation === "Defer" ? 0.72 : 1 }}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{order.id}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{order.shipDeadline}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{order.priority}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{order.zones.join(", ")}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{order.recommendation}</td>
                <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>{order.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary">Accept All</button>
        <button type="button" className="btn-secondary">Accept with Changes</button>
        <button type="button" className="btn-secondary">Reject</button>
        <p className="ml-auto text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
          Current mode: {mode}
        </p>
      </section>

      <DetailPanel open={Boolean(selected)} title="Release Detail" onClose={() => setSelectedOrderId(null)}>
        {selected && (
          <div className="space-y-3 text-sm">
            <p>Order {selected.id}</p>
            <p style={{ color: "var(--tessera-text-secondary)" }}>{selected.reason}</p>
            <p style={{ color: "var(--tessera-text-secondary)" }}>{selected.predictedImpact}</p>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
