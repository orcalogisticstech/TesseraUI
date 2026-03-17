const metrics = [
  { value: "-12%", label: "Travel distance" },
  { value: "-8%", label: "Pick time" },
  { value: "+15%", label: "Throughput at same labor" },
  { value: "100%", label: "Constraint compliance" }
];

export function ProofSection() {
  return (
    <section id="proof" className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">RIGOR YOU CAN MEASURE.</h2>
        <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--text-secondary)" }}>
          Before and after metrics plus full constraint adherence on every run.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="surface-card px-5 py-6">
              <p className="font-display text-4xl font-semibold uppercase tracking-[-0.02em]">{metric.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.12em]" style={{ color: "var(--text-secondary)" }}>
                {metric.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          Placeholder metrics shown. Live runs include explanation logs and measurable effect estimates.
        </p>
      </div>
    </section>
  );
}
