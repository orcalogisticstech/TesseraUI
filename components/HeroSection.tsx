export function HeroSection() {
  return (
    <section className="section-space border-b" style={{ borderColor: "var(--divider)", minHeight: "calc(100vh - 5rem)" }}>
      <div className="section-wrap grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="text-sm uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
            The Decision Intelligence Layer for Warehouse Operations
          </p>
          <h1 className="headline mt-4 max-w-5xl text-5xl font-bold leading-[1] md:text-[64px]">
            TURN CONSTRAINTS INTO EXECUTION.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Tessera detects operational problems, prescribes mathematically grounded fixes, shows predicted impact, and surfaces the trade-off space from one optimization model on top of your existing WMS.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-primary" href="#contact">Request a demo</a>
            <a className="btn-secondary" href="#capabilities">See it run</a>
          </div>
        </div>
        <div className="md:col-span-4">
          <div className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--text-secondary)" }}>
              One Model
            </p>
            <p className="mt-3 text-lg">
              The same optimization core explains causes, decides actions, and predicts outcomes. No separate analytics layer. No model mismatch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
