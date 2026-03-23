"use client";

import { useAppState } from "@/components/app/AppProvider";

export function PostureView() {
  const { posture, setPosturePanelOpen } = useAppState();

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <h1 className="font-display text-3xl uppercase tracking-[-0.01em]">Posture Configuration</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Per-shift objective weights and zone constraints are configured from the shared posture panel.
        </p>
      </section>

      <section className="app-card p-4 md:p-6">
        <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Active preset: {posture.presetName} · Horizon: {posture.horizon}
        </p>
        <button type="button" className="btn-primary mt-4" onClick={() => setPosturePanelOpen(true)}>
          Open Posture Panel
        </button>
      </section>
    </div>
  );
}
