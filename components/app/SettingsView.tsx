"use client";

import { useState } from "react";
import { BrandTile } from "@/components/BrandTile";

export function SettingsView() {
  const [anomalyThreshold, setAnomalyThreshold] = useState(12);
  const [allowWriteBack, setAllowWriteBack] = useState(true);
  const [autonomyScope, setAutonomyScope] = useState("Priority re-ranking only");

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <div className="flex items-center gap-3">
          <BrandTile className="h-6 w-auto" variant="collapsed" />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[-0.01em]">Settings</h1>
        </div>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Configure hard constraints, anomaly thresholds, autonomy scope, and integration status.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="app-card p-4 md:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Hard Constraints</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            <li>Never defer near-cutoff orders</li>
            <li>Never exceed active-work cap by zone</li>
            <li>Never assign work to blocked zone</li>
          </ul>
        </article>

        <article className="app-card p-4 md:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Integration Status</h2>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>WMS connection healthy. Last sync 14:11.</p>
          <p className="mt-2 text-sm" style={{ color: "var(--tessera-success)" }}>Read access active, write-back endpoint verified.</p>
        </article>
      </section>

      <section className="app-card space-y-4 p-4 md:p-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-[-0.01em]">Autonomy and Anomaly Controls</h2>

        <label className="block text-sm">
          Anomaly threshold {anomalyThreshold}%
          <input type="range" min={1} max={25} value={anomalyThreshold} onChange={(event) => setAnomalyThreshold(Number(event.target.value))} className="mt-2 w-full" />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={allowWriteBack} onChange={(event) => setAllowWriteBack(event.target.checked)} />
          Enable selective write-back
        </label>

        <label className="block text-sm">
          Autonomy scope
          <select value={autonomyScope} onChange={(event) => setAutonomyScope(event.target.value)} className="mt-2 w-full rounded-[10px] border bg-transparent px-3 py-2" style={{ borderColor: "var(--tessera-border)" }}>
            <option>Priority re-ranking only</option>
            <option>Priority + task holds</option>
            <option>Release + batching + priority</option>
          </select>
        </label>
      </section>
    </div>
  );
}
