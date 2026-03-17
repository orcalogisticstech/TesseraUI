const interactionLayers = [
  {
    title: "Strategic Posture",
    detail:
      "Set shift-level intent as optimizer inputs: prioritize deadline compliance, cap workload in a short-staffed zone, or suppress congestion during cycle count windows."
  },
  {
    title: "Trade-Off Exploration",
    detail:
      "Compare alternatives with explicit gains and costs. Minimize travel, balance zones, or guarantee zero late risk with predicted impact shown for each path."
  },
  {
    title: "Tess's Choice",
    detail:
      "The default recommendation each cycle based on current posture and constraints. Advisory mode shows recommended actions. Closed-loop mode executes automatically."
  }
];

export function OperatorSection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">YOUR INTENT. TESSERA'S EXECUTION.</h2>
        <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--text-secondary)" }}>
          Experienced operators know things the model does not. Tessera captures that intuition and converts it into strategic intent the optimizer can execute.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {interactionLayers.map((layer) => (
            <article key={layer.title} className="surface-card p-6">
              <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.02em]">{layer.title}</h3>
              <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
                {layer.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
