"use client";

import { useAppState } from "@/components/app/AppProvider";
import { BrandTile } from "@/components/BrandTile";
import { posturePresetNames } from "@/lib/product-mock";
import type { ObjectiveWeights, PostureConfig, TimeHorizon, ZoneStatus } from "@/lib/product-types";

function objectiveSummary(weights: ObjectiveWeights) {
  const ranked = Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.replace(/[A-Z]/g, (m) => ` ${m}`).trim().toLowerCase());

  return `Current posture: ${ranked[0]} is the top priority, followed by ${ranked[1]}. ${ranked[2]} and ${ranked[3]} are lower priority.`;
}

export function PostureView() {
  const { posture, setPosture } = useAppState();

  const updateWeight = (key: keyof ObjectiveWeights, value: number) => {
    setPosture({ ...posture, weights: { ...posture.weights, [key]: value } });
  };

  const updateZone = (index: number, patch: Partial<PostureConfig["zones"][number]>) => {
    setPosture({
      ...posture,
      zones: posture.zones.map((zone, zoneIndex) => (zoneIndex === index ? { ...zone, ...patch } : zone))
    });
  };

  const applyPreset = (presetName: string) => {
    if (presetName === "Tuesday PM - carrier crunch") {
      setPosture({
        ...posture,
        presetName,
        weights: { deadlineCompliance: 90, travelEfficiency: 42, zoneBalance: 58, congestionMinimization: 76 }
      });
      return;
    }
    if (presetName === "Cycle count - Zone A restricted") {
      setPosture({
        ...posture,
        presetName,
        zones: posture.zones.map((zone) => (zone.zone === "Zone A" ? { ...zone, status: "Restricted", reason: "Cycle count in progress" } : zone))
      });
      return;
    }

    setPosture({
      ...posture,
      presetName,
      weights: { deadlineCompliance: 82, travelEfficiency: 56, zoneBalance: 56, congestionMinimization: 68 }
    });
  };

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <BrandTile className="h-6 w-auto" variant="collapsed" />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.01em]">Strategic Posture</h1>
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Configure shift-level priorities. Every control maps directly to optimization parameters.
        </p>
      </section>

      <section className="app-card space-y-4 p-4 md:p-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Objective Weights</h2>
        {(
          [
            ["deadlineCompliance", "Deadline compliance"],
            ["travelEfficiency", "Travel efficiency"],
            ["zoneBalance", "Zone balance"],
            ["congestionMinimization", "Congestion minimization"]
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <div className="mb-2 flex justify-between text-sm">
              <span>{label}</span>
              <span style={{ color: "var(--tessera-text-secondary)" }}>{posture.weights[key]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={posture.weights[key]}
              onChange={(event) => updateWeight(key, Number(event.target.value))}
              className="w-full"
            />
          </label>
        ))}
        <p className="rounded-[10px] border p-3 text-sm" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
          {objectiveSummary(posture.weights)}
        </p>
      </section>

      <section className="app-card space-y-4 p-4 md:p-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Zone Constraints</h2>
        <div className="grid gap-3">
          {posture.zones.map((zone, index) => (
            <div key={zone.zone} className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
              <div className="flex items-center justify-between">
                <p className="font-medium">{zone.zone}</p>
                <select value={zone.status} className="rounded-[8px] border bg-transparent px-2 py-1 text-sm" style={{ borderColor: "var(--tessera-border)" }} onChange={(event) => updateZone(index, { status: event.target.value as ZoneStatus })}>
                  <option>Active</option>
                  <option>Restricted</option>
                  <option>Blocked</option>
                </select>
              </div>
              <label className="mt-3 block text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                Max active work {zone.maxActiveWork}%
                <input type="range" min={0} max={100} value={zone.maxActiveWork} onChange={(event) => updateZone(index, { maxActiveWork: Number(event.target.value) })} className="mt-2 w-full" />
              </label>
              <input
                type="text"
                value={zone.reason}
                placeholder="Reason (stored in audit log)"
                className="mt-3 w-full rounded-[8px] border bg-transparent px-3 py-2 text-sm"
                style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
                onChange={(event) => updateZone(index, { reason: event.target.value })}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="app-card p-4 md:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Time Horizon</h2>
          <select
            value={posture.horizon}
            onChange={(event) => setPosture({ ...posture, horizon: event.target.value as TimeHorizon })}
            className="mt-3 w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: "var(--tessera-border)" }}
          >
            <option>This shift</option>
            <option>Next 4 hours</option>
            <option>Until I change it</option>
          </select>
        </article>

        <article className="app-card p-4 md:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Posture Presets</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {posturePresetNames.map((name) => (
              <button type="button" key={name} className="btn-secondary text-sm" onClick={() => applyPreset(name)}>
                {name}
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
