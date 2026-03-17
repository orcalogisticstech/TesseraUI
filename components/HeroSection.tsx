export function HeroSection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--divider)", minHeight: "calc(100vh - 5rem)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="text-sm uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
            Warehouse Optimization OS
          </p>
          <h1 className="headline mt-4 max-w-5xl text-5xl font-bold leading-[1] md:text-[64px]">
            TURN CONSTRAINTS INTO EXECUTION.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Three decision APIs that tell your warehouse what work to start, how to group it, and what to do first.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-primary" href="#contact">Request a demo</a>
            <a className="btn-secondary" href="#how-it-works">See it run</a>
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
              Decision Loop
            </p>
            <p className="mt-3 text-lg">
              Every 15 minutes, Tessera ingests a floor snapshot and returns an executable plan with clear trade-offs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
