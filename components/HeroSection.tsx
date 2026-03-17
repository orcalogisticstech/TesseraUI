export function HeroSection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-10">
          <p className="text-sm uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
            The Decision Intelligence Layer for Warehouse Operations
          </p>
          <h1 className="headline mt-4 max-w-5xl text-5xl font-bold leading-[1] md:text-[64px]">
            DECISIONS, NOT DASHBOARDS.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--tessera-text-secondary)" }}>
            The decision intelligence layer for warehouse operations. Detect problems, prescribe fixes, show predicted impact — all from a single model.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-primary" href="#contact">Request a demo</a>
            <a className="btn-secondary" href="#capabilities">See it run</a>
          </div>
        </div>
      </div>
    </section>
  );
}
