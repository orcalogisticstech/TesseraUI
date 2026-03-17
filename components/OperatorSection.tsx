const interactionLayers = [
  {
    title: "Strategic Posture",
    detail:
      "Set shift-level priorities. This shift, prioritize deadline compliance over travel efficiency. Translates directly into objective weights."
  },
  {
    title: "Trade-Off Exploration",
    detail:
      "See meaningfully different strategies: minimize travel, balance zones, zero late risk. Each with predicted impact. Available when you want to engage with it."
  },
  {
    title: "Tess's Choice",
    detail:
      "The default recommendation, generated every cycle based on your posture. In advisory mode, it appears on the dashboard. In closed-loop mode, it executes."
  }
];

export function OperatorSection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">OPERATOR INTENT, OPTIMIZER EXECUTION.</h2>
        <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
          Your experience makes the system better, not the other way around. Set the strategy; the math handles the rest.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {interactionLayers.map((layer) => (
            <article key={layer.title} className="surface-card p-6">
              <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.02em]">{layer.title}</h3>
              <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>
                {layer.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
