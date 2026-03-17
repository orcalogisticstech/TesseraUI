const guardrailBullets = [
  {
    title: "Hard constraints",
    detail: "Never defer an order near cutoff, never exceed the floor's active-work cap, never assign work to a blocked zone. Enforced inside optimization, not as post-processing."
  },
  {
    title: "Anomaly detection",
    detail: "If reality diverges from predictions, the system pulls back to advisory mode automatically."
  },
  {
    title: "Graduated autonomy",
    detail: "Start with low-risk decisions and expand scope as confidence builds. The customer controls the boundary."
  },
  {
    title: "Audit trail",
    detail: "Every recommendation, override, and predicted impact is logged so each cycle is replayable and reviewable."
  }
];

export function GuardrailsSection() {
  return (
    <section id="guardrails" className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">
            AUTONOMY, WITH GUARDRAILS.
          </h2>
          <p className="mt-5 max-w-lg text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
            Hard constraints. Anomaly detection. Graduated autonomy. Full audit trail.
          </p>
        </div>
        <div className="grid gap-3 md:col-span-7 sm:grid-cols-2">
          {guardrailBullets.map((item) => (
            <article key={item.title} className="surface-card p-5">
              <p className="text-base font-medium">{item.title}</p>
              <p className="mt-2 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
