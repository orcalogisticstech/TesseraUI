"use client";

import type { AlternativePlan, SystemMode } from "@/lib/app-types";
import Link from "next/link";
import { useMemo, useState } from "react";

type TradeoffPanelProps = {
  alternatives: AlternativePlan[];
  mode: SystemMode;
  onAdopt: (label: string) => void;
};

export function TradeoffPanel({ alternatives, mode, onAdopt }: TradeoffPanelProps) {
  const [view, setView] = useState<"cards" | "table">("cards");
  const allMetricLabels = useMemo(
    () => Array.from(new Set(alternatives.flatMap((alt) => alt.metrics.map((metric) => metric.label)))),
    [alternatives]
  );

  const deltaColor = (state: "better" | "worse" | "neutral") => {
    if (state === "better") {
      return "var(--tessera-success)";
    }
    if (state === "worse") {
      return "var(--tessera-danger)";
    }
    return "var(--tessera-text-secondary)";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Compare alternatives for this cycle and adopt the plan that best matches shift intent.
        </p>
        <div className="flex rounded-button border p-1" style={{ borderColor: "var(--tessera-border)" }}>
          <button type="button" className="rounded-button px-3 py-1 text-sm" style={{ background: view === "cards" ? "color-mix(in srgb, var(--tessera-text-primary) 10%, transparent)" : "transparent" }} onClick={() => setView("cards")}>
            Cards
          </button>
          <button type="button" className="rounded-button px-3 py-1 text-sm" style={{ background: view === "table" ? "color-mix(in srgb, var(--tessera-text-primary) 10%, transparent)" : "transparent" }} onClick={() => setView("table")}>
            Table
          </button>
        </div>
      </div>

      {view === "cards" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {alternatives.map((alternative) => (
            <article key={alternative.label} className="app-card p-4 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">{alternative.label}</h3>
                {alternative.isTessChoice && (
                  <span className="rounded-full px-2 py-1 text-xs font-medium" style={{ background: "var(--tessera-accent-signal)", color: "#0B0D10" }}>
                    Tess's Choice
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {alternative.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
                    <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
                      {metric.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{metric.value}</p>
                    <p className="mt-1 text-xs" style={{ color: deltaColor(metric.deltaState) }}>
                      {metric.delta}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                {alternative.summary}
              </p>

              <button type="button" className="btn-secondary mt-4" onClick={() => onAdopt(alternative.label)}>
                {mode === "Closed-Loop" ? "Adopt This Plan (Re-Execute)" : "Adopt This Plan"}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-auto rounded-[10px] border" style={{ borderColor: "var(--tessera-border)" }}>
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                  Metric
                </th>
                {alternatives.map((alt) => (
                  <th key={alt.label} className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                    {alt.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allMetricLabels.map((label) => (
                <tr key={label}>
                  <td className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>{label}</td>
                  {alternatives.map((alt) => {
                    const metric = alt.metrics.find((item) => item.label === label);
                    return (
                      <td key={`${alt.label}-${label}`} className="border-b px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>
                        <div>{metric?.value ?? "-"}</div>
                        <div className="text-xs" style={{ color: metric ? deltaColor(metric.deltaState) : "var(--tessera-text-secondary)" }}>
                          {metric?.delta ?? ""}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-[10px] border p-4 text-sm" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
        Consistently preferring a different strategy? <Link href="/app" className="underline">Adjust your posture to match.</Link>
      </div>
    </div>
  );
}
