const steps = [
  {
    id: "01",
    title: "OPTIMIZE RELEASE",
    description:
      "Send a fresh snapshot of orders, deadlines, active work, and staffing. Tessera recommends what to activate now and what to hold for the next cycle."
  },
  {
    id: "02",
    title: "OPTIMIZE BATCHING",
    description:
      "Released work is grouped into efficient packages so the floor is not flooded with scattered picks and avoidable travel."
  },
  {
    id: "03",
    title: "PRIORITIZE WORK",
    description:
      "Work packages are ranked by urgency, congestion, and operational fit so teams execute the right next move."
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">A MOSAIC OF DECISIONS.</h2>
        <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--text-secondary)" }}>
          One loop. Three APIs. Release the right work, package it well, and focus operators on what matters first.
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
