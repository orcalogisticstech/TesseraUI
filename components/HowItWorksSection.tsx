const steps = [
  {
    id: "01",
    title: "EXPLAIN",
    description:
      "Trace the root cause: this zone is congested because the last release cycle pushed too many orders into a narrow area, and the batch structure is concentrating picks there. Counterfactual analysis shows how much a better decision would have saved."
  },
  {
    id: "02",
    title: "DECIDE",
    description:
      "Prescribe a fix that accounts for every constraint at once. Re-batch active work, re-rank priorities, and throttle the next release — in a single pass. No sequential rule-firing. No fix-one-break-two loops."
  },
  {
    id: "03",
    title: "PREDICT",
    description:
      "Before committing, see the predicted impact. Same model that decides also predicts. Scenario analysis consistent with actual recommendations — no gap between what the simulation promised and what the optimizer does."
  }
];

export function HowItWorksSection() {
  return (
    <section id="capabilities" className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">EXPLAIN, DECIDE, PREDICT.</h2>
        <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
          One model. Three capabilities. Every decision grounded in the same optimization that reasons about all constraints simultaneously.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.id} className="surface-card p-6">
              <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
                Step {step.id}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
