const phases = [
  {
    title: "Phase 1: Advisory Mode",
    detail:
      "State snapshots in, recommendation lists out. Supervisors review actions before execution. Integration stays light with read-only data flow."
  },
  {
    title: "Phase 2: Selective Write-Back",
    detail:
      "On platforms with public write surfaces, Tessera pushes low-risk reversible decisions back into the WMS: priority updates, holds, releases, and wave triggers."
  },
  {
    title: "Phase 3: Closed-Loop Automation",
    detail:
      "Tessera continuously ingests state, optimizes release, batching, and priority, then executes by default with human override and guardrails."
  }
];

export function EvolutionSection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">ADVISORY TODAY. CLOSED-LOOP TOMORROW.</h2>
        <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--text-secondary)" }}>
          The same three APIs and optimization core power every phase. What changes is where the decision lands: dashboard first, write-back next.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {phases.map((phase) => (
            <article key={phase.title} className="surface-card p-6">
              <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.02em]">{phase.title}</h3>
              <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
                {phase.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
