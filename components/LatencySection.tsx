const loopPoints = [
  {
    value: "15 MIN",
    label: "Decision cycle"
  },
  {
    value: "3 APIS",
    label: "One execution loop"
  },
  {
    value: "0 BLACK BOXES",
    label: "Every output explainable"
  }
];

export function LatencySection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">LATENCY IS WASTE.</h2>
          <p className="mt-5 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
            Every 15 minutes, your warehouse sends a floor snapshot. Tessera returns an executable plan before conditions drift.
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
