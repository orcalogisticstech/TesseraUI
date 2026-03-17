const guardrailBullets = [
  {
    title: "Constraint-first decisions",
    detail: "Capacity, service windows, and floor conditions are respected before optimization targets."
  },
  {
    title: "Explainable trade-offs",
    detail: "Each recommendation returns a short reason and estimated effect on travel, flow, or risk."
  },
  {
    title: "Approval gates where needed",
    detail: "Operators can approve, defer, or override recommendations where policy requires control."
  },
  {
    title: "Replayable decision logs",
    detail: "Every decision loop is auditable so teams can review what happened and why."
  }
];

export function GuardrailsSection() {
  return (
    <section id="guardrails" className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">
            AUTONOMY, WITH GUARDRAILS.
          </h2>
          <p className="mt-5 max-w-lg text-lg" style={{ color: "var(--text-secondary)" }}>
            Transparent trade-offs. Configurable approvals. Full audit trail.
          </p>
        </div>
        <div className="grid gap-3 md:col-span-7 sm:grid-cols-2">
          {guardrailBullets.map((item) => (
            <article key={item.title} className="surface-card p-5">
              <p className="text-base font-medium">{item.title}</p>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
