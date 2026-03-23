"use client";

import { DetailPanel } from "@/components/app/DetailPanel";
import { useAppState } from "@/components/app/AppProvider";
import { useMemo, useState } from "react";

export function BatchingView() {
  const { data } = useAppState();
  const [showWmsDefault, setShowWmsDefault] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  const selectedBatch = useMemo(
    () => data.batches.find((batch) => batch.id === selectedBatchId) ?? null,
    [data.batches, selectedBatchId]
  );

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <h1 className="font-display text-3xl uppercase tracking-[-0.01em]">Batching View</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          12 batches formed. Travel reduction vs WMS default: 22%. All zones &lt; 65%.
        </p>
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Drag-and-drop regrouping is mocked in this implementation build.
        </p>
        <button type="button" className="btn-secondary text-sm" onClick={() => setShowWmsDefault(!showWmsDefault)}>
          {showWmsDefault ? "Hide WMS default" : "Show WMS default"}
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {data.batches.map((batch) => (
          <article key={batch.id} className="app-card cursor-pointer p-4" onClick={() => setSelectedBatchId(batch.id)}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl uppercase">{batch.id}</h2>
              <p className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>{batch.deadlineRisk} risk</p>
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              {batch.orderIds.length} orders · {batch.pickCount} picks · {batch.primaryZones.join(" + ")}
            </p>
            <div className="mt-3 rounded-[10px] border p-2" style={{ borderColor: "var(--tessera-border)" }}>
              <p className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>Predicted travel</p>
              <p className="mt-1 text-sm font-medium">{batch.predictedTravelDelta}%</p>
              {showWmsDefault && (
                <p className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>
                  WMS default {batch.wmsDefaultTravelDelta}%
                </p>
              )}
            </div>
            <div className="mt-3 flex gap-1">
              {batch.zoneDistribution.map((segment) => (
                <div key={segment.zone} className="h-2 rounded-full" style={{ width: `${segment.share}%`, background: "var(--tessera-accent-signal)", opacity: 0.4 + segment.share / 200 }} />
              ))}
            </div>
          </article>
        ))}
      </section>

      <DetailPanel open={Boolean(selectedBatch)} title="Batch Detail" onClose={() => setSelectedBatchId(null)}>
        {selectedBatch && (
          <div className="space-y-4 text-sm">
            <p>{selectedBatch.explanation}</p>
            <div className="app-card p-3">
              <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
                Pick Sequence
              </p>
              <p className="mt-1">{selectedBatch.sequence.join(" -> ")}</p>
            </div>
            <div className="app-card p-3">
              <p className="text-xs uppercase tracking-[0.08em]" style={{ color: "var(--tessera-text-secondary)" }}>
                Orders
              </p>
              <p className="mt-1">{selectedBatch.orderIds.join(", ")}</p>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
