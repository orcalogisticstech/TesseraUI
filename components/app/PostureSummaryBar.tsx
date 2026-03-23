"use client";

import { useAppState } from "@/components/app/AppProvider";

export function PostureSummaryBar() {
  const { posture } = useAppState();

  const topObjective = Object.entries(posture.weights).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "deadlineCompliance";
  const restrictedZones = posture.zones.filter((zone) => zone.status !== "Active").map((zone) => zone.zoneName);

  return (
    <div className="border-b px-4 py-3 md:px-6 lg:px-8" style={{ borderColor: "var(--tessera-border)", background: "color-mix(in srgb, var(--tessera-bg-surface) 55%, var(--tessera-bg-page))" }}>
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
        <span>Active posture {posture.presetName}</span>
        <span>Top priority {topObjective.replace(/[A-Z]/g, (m) => ` ${m}`).trim()}</span>
        <span>Zone restrictions {restrictedZones.length ? restrictedZones.join(", ") : "None"}</span>
        <span>Horizon {posture.horizon}</span>
      </div>
    </div>
  );
}
