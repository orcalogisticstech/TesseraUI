const enemyBullets = [
  {
    title: "Isolated responses",
    detail: "Deferring one batch to relieve congestion can push three other orders past cutoff."
  },
  {
    title: "Manual decisions under pressure",
    detail: "Operators react with incomplete information while the coordination tax compounds each cycle."
  },
  {
    title: "Sequential rule firing",
    detail: "Escalate priority, check side effects, then patch again. No system reasons jointly about all constraints."
  },
  {
    title: "No counterfactual reasoning",
    detail: "Most systems cannot show what happened versus what a better decision would have produced."
  }
];

export function EnemySection() {
  return (
    <section id="enemy" className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">
            THE GAP IS NOT VISIBILITY.
          </h2>
          <p className="mt-5 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
            Your WMS can detect congestion and delay risk. The missing step is deciding the best response given everything else happening on the floor.
          </p>
        </div>
        <div className="md:col-span-6">
          <ul className="surface-card divide-y" style={{ borderColor: "var(--divider)" }}>
            {enemyBullets.map((item) => (
              <li key={item.title} className="px-6 py-5">
                <p className="text-base font-medium">{item.title}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
