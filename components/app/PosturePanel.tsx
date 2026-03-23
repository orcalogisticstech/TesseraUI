"use client";

import { useAppState } from "@/components/app/AppProvider";
import type { ObjectiveWeights, TimeHorizon, ZoneStatus } from "@/lib/app-types";

function normalizeWeights(weights: ObjectiveWeights): ObjectiveWeights {
  const entries = Object.entries(weights) as Array<[keyof ObjectiveWeights, number]>;
  const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;

  const normalized = entries.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: Math.round((value / total) * 100) }),
    {} as ObjectiveWeights
  );

  const roundedTotal = Object.values(normalized).reduce((sum, value) => sum + value, 0);
  if (roundedTotal !== 100) {
    normalized.deadlineCompliance += 100 - roundedTotal;
  }

  return normalized;
}

function objectiveSummary(weights: ObjectiveWeights) {
  const ranked = Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => ` ${m}`).trim()}: ${value}%`);

  return `${ranked[0]} leads this posture. ${ranked[1]} is secondary. ${ranked[2]} and ${ranked[3]} remain lower priority.`;
}

export function PosturePanel() {
  const { data, posture, setPosture, posturePanelOpen, setPosturePanelOpen } = useAppState();

  const updateWeight = (key: keyof ObjectiveWeights, value: number) => {
    const updated = normalizeWeights({ ...posture.weights, [key]: value });
    setPosture({ ...posture, weights: updated });
  };

  const updateZone = (index: number, patch: Partial<(typeof posture.zones)[number]>) => {
    setPosture({
      ...posture,
      zones: posture.zones.map((zone, zoneIndex) => (zoneIndex === index ? { ...zone, ...patch } : zone))
    });
  };

  return (
    <>
      {posturePanelOpen && (
        <button
          type="button"
          aria-label="Close posture panel backdrop"
          className="fixed inset-0 z-30 bg-black/45"
          onClick={() => setPosturePanelOpen(false)}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-40 h-screen w-full border-l transition-transform duration-[250ms] ease-out md:w-[480px] ${posturePanelOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}
      >
        <div className="flex h-16 items-center justify-between border-b px-4" style={{ borderColor: "var(--tessera-border)" }}>
          <h2 className="font-display text-xl uppercase tracking-[-0.01em]">Edit Posture</h2>
          <button
            type="button"
            className="btn-secondary px-3 py-2 text-sm"
            onClick={() => setPosturePanelOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="h-[calc(100vh-4rem)] space-y-5 overflow-y-auto p-4">
          <section className="app-card space-y-3 p-4">
            <h3 className="font-display text-lg uppercase">Objective Weights</h3>
            {(
              [
                ["deadlineCompliance", "Deadline Compliance"],
                ["travelEfficiency", "Travel Efficiency"],
                ["zoneBalance", "Zone Balance"],
                ["congestionMinimization", "Congestion Minimization"]
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span>{label}</span>
                  <span style={{ color: "var(--tessera-text-secondary)" }}>{posture.weights[key]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={posture.weights[key]}
                  className="w-full accent-[var(--tessera-accent-signal)]"
                  onChange={(event) => updateWeight(key, Number(event.target.value))}
                />
              </label>
            ))}
            <p className="rounded-[10px] border p-3 text-sm" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
              {objectiveSummary(posture.weights)}
            </p>
          </section>

          <section className="app-card space-y-3 p-4">
            <h3 className="font-display text-lg uppercase">Zone Constraints</h3>
            {posture.zones.map((zone, index) => (
              <div key={zone.zoneId} className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{zone.zoneName}</p>
                  <select
                    value={zone.status}
                    onChange={(event) => updateZone(index, { status: event.target.value as ZoneStatus })}
                    className="rounded-[8px] border bg-transparent px-2 py-1 text-xs"
                    style={{ borderColor: "var(--tessera-border)" }}
                  >
                    <option>Active</option>
                    <option>Restricted</option>
                    <option>Blocked</option>
                  </select>
                </div>
                <label className="mt-2 block text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
                  Max active work {zone.maxActiveWork}%
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={zone.maxActiveWork}
                    className="mt-1 w-full accent-[var(--tessera-accent-signal)]"
                    onChange={(event) => updateZone(index, { maxActiveWork: Number(event.target.value) })}
                  />
                </label>
                <input
                  type="text"
                  value={zone.reason}
                  onChange={(event) => updateZone(index, { reason: event.target.value })}
                  placeholder="Reason"
                  className="mt-2 w-full rounded-[8px] border bg-transparent px-2 py-1 text-xs"
                  style={{ borderColor: "var(--tessera-border)" }}
                />
              </div>
            ))}
          </section>

          <section className="app-card space-y-3 p-4">
            <h3 className="font-display text-lg uppercase">Hard Constraints</h3>
            <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              Never defer within {data.settings.hardConstraints.cutoffWindowHours}h of cutoff. Floor cap: {data.settings.hardConstraints.floorCap} active tasks.
            </p>
          </section>

          <section className="app-card space-y-3 p-4">
            <h3 className="font-display text-lg uppercase">Time Horizon</h3>
            <select
              value={posture.horizon}
              onChange={(event) => setPosture({ ...posture, horizon: event.target.value as TimeHorizon })}
              className="w-full rounded-[10px] border bg-transparent px-3 py-2 text-sm"
              style={{ borderColor: "var(--tessera-border)" }}
            >
              <option>This shift</option>
              <option>Next 4 hours</option>
              <option>Until I change it</option>
            </select>
            <div className="flex flex-wrap gap-2">
              {data.posturePresets.map((name) => (
                <button key={name} type="button" className="btn-secondary text-xs" onClick={() => setPosture({ ...posture, presetName: name })}>
                  {name}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t p-4" style={{ borderColor: "var(--tessera-border)" }}>
          <button type="button" className="btn-primary w-full" onClick={() => setPosturePanelOpen(false)}>
            Apply to next cycle
          </button>
        </div>
      </aside>
    </>
  );
}
