"use client";

import { useAppState } from "@/components/app/AppProvider";
import { useMemo, useState } from "react";

export function PrioritizeView() {
  const { data } = useAppState();
  const [customOrder, setCustomOrder] = useState(data.workPackages.map((item) => item.id));

  const customPackages = useMemo(
    () => customOrder.map((id) => data.workPackages.find((pkg) => pkg.id === id)).filter(Boolean),
    [customOrder, data.workPackages]
  );

  const move = (id: string, direction: -1 | 1) => {
    const index = customOrder.findIndex((item) => item === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= customOrder.length) {
      return;
    }
    const updated = [...customOrder];
    [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];
    setCustomOrder(updated);
  };

  return (
    <div className="mx-auto w-full max-w-[960px] space-y-4">
      <section className="app-card p-4 md:p-6">
        <h1 className="font-display text-3xl uppercase tracking-[-0.01em]">Prioritization View</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Ranked active work packages with reasoned scores and side-by-side sequence impact.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="app-card p-4">
          <h2 className="font-display text-xl uppercase">Tessera's Order</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {data.workPackages.map((work) => (
              <li key={work.id} className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
                <p className="font-medium">#{work.rank} · {work.batchId}</p>
                <p style={{ color: "var(--tessera-text-secondary)" }}>
                  Deadline {work.deadlineProximity} · {work.zone} · Score {work.score}
                </p>
                <p className="mt-1" style={{ color: "var(--tessera-text-secondary)" }}>{work.reason}</p>
              </li>
            ))}
          </ol>
        </article>

        <article className="app-card p-4">
          <h2 className="font-display text-xl uppercase">Your Custom Order</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {customPackages.map((work) =>
              work ? (
                <li key={work.id} className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{work.batchId}</p>
                    <div className="flex gap-1">
                      <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => move(work.id, -1)}>Up</button>
                      <button type="button" className="btn-secondary px-2 py-1 text-xs" onClick={() => move(work.id, 1)}>Down</button>
                    </div>
                  </div>
                  <p style={{ color: "var(--tessera-text-secondary)" }}>{work.reason}</p>
                </li>
              ) : null
            )}
          </ul>
        </article>
      </section>

      <section className="app-card p-4">
        <h2 className="font-display text-xl uppercase">Predicted Outcome Comparison</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
            <p className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>Tessera's order</p>
            <p className="mt-1 text-sm">Late shipments: 0 · Travel: -14% · Congestion peak: 72%</p>
          </div>
          <div className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
            <p className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>WMS default</p>
            <p className="mt-1 text-sm">Late shipments: 3 · Travel: -5% · Congestion peak: 88%</p>
          </div>
          <div className="rounded-[10px] border p-3" style={{ borderColor: "var(--tessera-border)" }}>
            <p className="text-xs" style={{ color: "var(--tessera-text-secondary)" }}>Your custom order</p>
            <p className="mt-1 text-sm">Late shipments: 1 · Travel: -10% · Congestion peak: 79%</p>
          </div>
        </div>
      </section>
    </div>
  );
}
