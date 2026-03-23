"use client";

import { TradeoffPanel } from "@/components/app/TradeoffPanel";
import { useAppState } from "@/components/app/AppProvider";
import type { ObjectiveWeights } from "@/lib/app-types";
import { useMemo, useState } from "react";

export function ExploreView() {
  const { data, mode, setPosturePanelOpen } = useAppState();
  const alternatives = data.alternativesByCycle[data.cycles[0]?.id] ?? [];
  const [releaseCount, setReleaseCount] = useState(data.scenarioDefaults.releaseCount);
  const [lockedBatches, setLockedBatches] = useState<string[]>(data.scenarioDefaults.lockedBatches);
  const [weights, setWeights] = useState<ObjectiveWeights>(data.scenarioDefaults.objectiveOverrides);

  const zoneCaps = useMemo(() => data.scenarioDefaults.zoneCaps, [data.scenarioDefaults.zoneCaps]);

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <h1 className="font-display text-3xl uppercase tracking-[-0.01em]">Trade-Off Explorer</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Build scenarios, compare strategies side-by-side, and adopt the plan you want.
        </p>
      </section>

      <section className="app-card space-y-4 p-4">
        <h2 className="font-display text-xl uppercase">Scenario Builder</h2>
        <label className="block text-sm">
          Release count {releaseCount}
          <input
            type="range"
            min={40}
            max={140}
            value={releaseCount}
            className="mt-2 w-full accent-[var(--tessera-accent-signal)]"
            onChange={(event) => setReleaseCount(Number(event.target.value))}
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(zoneCaps).map(([zone, cap]) => (
            <label key={zone} className="block text-sm">
              {zone} cap {cap}%
              <input type="range" min={40} max={95} defaultValue={cap} className="mt-2 w-full accent-[var(--tessera-accent-signal)]" />
            </label>
          ))}
        </div>

        <div>
          <p className="text-sm">Locked batches</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.batches.slice(0, 6).map((batch) => {
              const active = lockedBatches.includes(batch.id);
              return (
                <button
                  key={batch.id}
                  type="button"
                  className="btn-secondary text-xs"
                  style={active ? { borderColor: "var(--tessera-accent-signal)", color: "var(--tessera-accent-signal)" } : undefined}
                  onClick={() => setLockedBatches(active ? lockedBatches.filter((id) => id !== batch.id) : [...lockedBatches, batch.id])}
                >
                  {batch.id}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {(Object.keys(weights) as Array<keyof ObjectiveWeights>).map((key) => (
            <label key={key} className="block text-sm">
              {key.replace(/[A-Z]/g, (m) => ` ${m}`)} {weights[key]}
              <input
                type="range"
                min={10}
                max={95}
                value={weights[key]}
                className="mt-2 w-full accent-[var(--tessera-accent-signal)]"
                onChange={(event) => setWeights({ ...weights, [key]: Number(event.target.value) })}
              />
            </label>
          ))}
        </div>

        <button type="button" className="btn-primary">Run Scenario</button>
      </section>

      <section className="app-card p-4">
        <TradeoffPanel
          alternatives={alternatives}
          mode={mode}
          onAdopt={(label) => {
            window.alert(`Adopted ${label}. This mock run applies on next cycle.`);
          }}
        />
      </section>

      <section className="app-card p-4 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
        Consistently preferring a different strategy? <button type="button" className="underline" onClick={() => setPosturePanelOpen(true)}>Adjust your posture.</button>
      </section>
    </div>
  );
}
