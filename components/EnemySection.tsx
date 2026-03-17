const enemyBullets = [
  "Rules that fix one problem and create two more",
  "Escalations that flood already-congested zones",
  "Dashboards that show the fire but don't hand you the extinguisher",
  "Every fix evaluated in isolation, never jointly"
];

export function EnemySection() {
  return (
    <section id="enemy" className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6">
          <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">
            KILL OPTIMIZATION THEATER.
          </h2>
          <p className="mt-5 max-w-xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
            Your WMS can see the problem. It cannot tell you what to do about it given everything else happening on the floor.
          </p>
        </div>
        <div className="md:col-span-6">
          <ul className="surface-card divide-y" style={{ borderColor: "var(--tessera-border)" }}>
            {enemyBullets.map((item) => (
              <li key={item} className="px-6 py-5 text-base font-medium">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
