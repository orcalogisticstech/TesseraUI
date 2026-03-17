const steps = [
  {
    id: "01",
    title: "EXPLAIN",
    description:
      "Tessera traces root cause, not just symptoms. Congestion, delay risk, and imbalance are explained from the same model that drives decisions."
  },
  {
    id: "02",
    title: "DECIDE",
    description:
      "One optimization pass can re-batch work, re-rank priorities, and adjust release flow while accounting for deadlines, travel, capacity, and zone balance."
  },
  {
    id: "03",
    title: "PREDICT",
    description:
      "Run what-if alternatives before acting. Compare predicted travel, congestion, and deadline compliance against the same objective function used for recommendations."
  }
];

export function HowItWorksSection() {
  return (
    <section id="capabilities" className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">ONE MODEL. THREE CAPABILITIES.</h2>
        <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--text-secondary)" }}>
          Tessera unifies analytics, decision-making, and prediction because each is an expression of the same optimization model.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.id} className="surface-card p-6">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
                Step {step.id}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
