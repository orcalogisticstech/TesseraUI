"use client";

import { useAppState } from "@/components/app/AppProvider";

export function PostureSummaryBar() {
  const { posture } = useAppState();

  const topObjective = Object.entries(posture.weights).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "deadlineCompliance";
  const restrictedZones = posture.zones.filter((zone) => zone.status !== "Active").map((zone) => zone.zoneName);
  const items = [
    { label: "ACTIVE POSTURE", value: posture.presetName },
    { label: "TOP PRIORITY", value: topObjective.replace(/[A-Z]/g, (m) => ` ${m}`).trim() },
    { label: "ZONE RESTRICTIONS", value: restrictedZones.length ? restrictedZones.join(", ") : "None" },
    { label: "HORIZON", value: posture.horizon }
  ];

  return (
    <div className="border-b px-4 py-3 md:px-6 lg:px-8" style={{ borderColor: "var(--tessera-border)", background: "color-mix(in srgb, var(--tessera-bg-surface) 55%, var(--tessera-bg-page))" }}>
      <div className="flex flex-wrap items-center text-xs uppercase tracking-[0.08em]">
        {items.map((item, index) => (
          <div key={item.label} className="inline-flex items-center">
            <span style={{ color: "#6B7280" }}>{item.label}</span>
            <span style={{ color: "#6B7280" }}>:</span>
            <span className="ml-1" style={{ color: "#D5DAE2" }}>
              {item.value}
            </span>
            {index < items.length - 1 ? <span className="mx-6 h-[6px] w-[6px] rounded-full" style={{ background: "#D8FF2A" }} aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
