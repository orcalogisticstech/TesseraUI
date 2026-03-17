const guardrailBullets = [
  {
    title: "Hard constraints in the model",
    detail: "Never defer near-cutoff orders, never exceed active-work caps, and never assign blocked zones. Enforced structurally, not post-hoc."
  },
  {
    title: "Anomaly detection and fallback",
    detail: "If actual outcomes diverge from predictions, Tessera automatically pulls back to advisory mode and surfaces an alert."
  },
  {
    title: "Graduated autonomy",
    detail: "Start with low-risk write-back decisions. Expand automation scope only after confidence is earned."
  },
  {
    title: "Full audit trail",
    detail: "Every recommendation, override, and predicted impact is logged so each cycle is replayable and reviewable."
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
            Hard constraints in the optimizer. Automatic fallback when reality diverges. Human control over autonomy boundaries.
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
