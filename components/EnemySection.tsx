const enemyBullets = [
  {
    title: "Plans that arrive too late",
    detail: "Overnight planning cannot react to floor changes in the next 15 minutes."
  },
  {
    title: "Rules that do not generalize",
    detail: "Hard-coded logic fails when demand, labor, or congestion shifts mid-shift."
  },
  {
    title: "Dashboards that do not decide",
    detail: "Visibility without execution creates coordination tax."
  },
  {
    title: "Local heroics masking systemic waste",
    detail: "One great operator cannot fix a broken decision loop."
  }
];

export function EnemySection() {
  return (
    <section id="enemy" className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">
            KILL OPTIMIZATION THEATER.
          </h2>
          <p className="mt-5 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
            If it does not execute, it is a slideshow. Tessera replaces stale plans with continuous recommendations your floor can run.
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
