const phases = [
  {
    title: "Phase 1 -- Advisory",
    detail:
      "Read-only connection. Recommendations on a dashboard. Immediate value: better decisions, visible reasoning."
  },
  {
    title: "Phase 2 -- Operator-Gated Execution",
    detail:
      "Low-risk decisions pushed to the WMS. Priority re-ranking, task holds, wave triggers."
  },
  {
    title: "Phase 3 -- Closed-Loop",
    detail:
      "Continuous automated execution with human override. The default is automated; intervention is the exception."
  }
];

export function EvolutionSection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">FROM ADVISORY TO CLOSED-LOOP.</h2>
        <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
          Same three APIs. Same optimization core. What changes is whether the output goes to a dashboard or gets pushed back into the WMS.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {phases.map((phase) => (
            <article key={phase.title} className="surface-card p-6">
              <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.02em]">{phase.title}</h3>
              <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>
                {phase.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
