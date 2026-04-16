"use client";

import { LayoutCanvas } from "@/components/app/layout/LayoutCanvas";
import { useLayoutGraphData } from "@/components/app/layout/useLayoutGraphData";

export function LayoutView() {
  const { data, error, loading } = useLayoutGraphData("demo_layout_1_v1");

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="app-card p-4 md:p-6">
          <h1 className="font-display text-2xl uppercase tracking-[-0.01em]">Layout</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-danger)" }}>
            {error}
          </p>
        </section>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <section className="app-card p-4 md:p-6">
          <h1 className="font-display text-2xl uppercase tracking-[-0.01em]">Layout</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            Loading layout graph...
          </p>
        </section>
      </div>
    );
  }

  return <LayoutCanvas title="Layout" data={data} />;
}
