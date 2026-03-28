"use client";

import type { AlternativePlan, SystemMode } from "@/lib/app-types";
import Link from "next/link";
import { useMemo } from "react";

type TradeoffPanelProps = {
  alternatives: AlternativePlan[];
  mode: SystemMode;
  onAdopt: (label: string) => void;
};

export function TradeoffPanel({ alternatives, mode, onAdopt }: TradeoffPanelProps) {
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
      <div>
        <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Compare alternatives for this cycle and adopt the plan that best matches shift intent.
        </p>
      </div>

      <div className="overflow-auto rounded-[10px] border" style={{ borderColor: "var(--tessera-border)" }}>
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                Metric
              </th>
              {alternatives.map((alt) => (
                <th key={alt.label} className="border-b px-3 py-2 text-left" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                  <div className="flex items-center gap-2">
                    <span>{alt.label}</span>
                    {alt.isTessChoice ? (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em]" style={{ background: "var(--tessera-accent-signal)", color: "#0B0D10" }}>
                        Tess's Choice
                      </span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b px-3 py-2 align-top" style={{ borderColor: "var(--tessera-border)" }}>Summary</td>
              {alternatives.map((alt) => (
                <td key={`${alt.label}-summary`} className="border-b px-3 py-2 align-top" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
                  {alt.summary}
                </td>
              ))}
            </tr>
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
            <tr>
              <td className="px-3 py-3" style={{ color: "var(--tessera-text-secondary)" }}>Action</td>
              {alternatives.map((alt) => (
                <td key={`${alt.label}-adopt`} className="px-3 py-3">
                  <button type="button" className="btn-secondary" onClick={() => onAdopt(alt.label)}>
                    {mode === "Closed-Loop" ? "Adopt This Plan (Re-Execute)" : "Adopt This Plan"}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-[10px] border p-4 text-sm" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
        Consistently preferring a different strategy? <Link href="/app" className="underline">Adjust your posture to match.</Link>
      </div>
    </div>
  );
}
