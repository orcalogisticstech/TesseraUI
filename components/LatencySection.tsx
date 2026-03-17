const loopPoints = [
  {
    value: "15 MIN",
    label: "Baseline heartbeat"
  },
  {
    value: "3 APIS",
    label: "Event-driven triggers"
  },
  {
    value: "INCREMENTAL",
    label: "Independent API calls"
  }
];

export function LatencySection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">LATENCY IS WASTE.</h2>
          <p className="mt-5 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
            Tessera runs a dual-cadence model: a steady heartbeat for normal operations and event-driven triggers when conditions shift too fast to wait.
          </p>
          <p className="mt-4 max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
            Batch completion, rush-order arrival, or congestion thresholds can trigger only the relevant API without re-solving the full pipeline.
          </p>
        </div>
        <div className="grid gap-3 md:col-span-7 sm:grid-cols-3">
          {loopPoints.map((point) => (
            <article key={point.value} className="surface-card p-5">
              <p className="font-display text-2xl font-semibold uppercase tracking-[-0.02em]">{point.value}</p>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {point.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
