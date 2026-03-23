import { Reveal } from "@/components/Reveal";
import { RuledFeatureList } from "@/components/marketing/RuledFeatureList";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import Link from "next/link";

const problemCards = [
  {
    title: "Isolated fixes",
    description: "Rules that fix one problem create two more. Escalating a priority floods an already-congested zone."
  },
  {
    title: "Frozen configuration",
    description: "WMS settings reflect last year's reality. Nobody re-tunes because the interdependencies are too complex."
  },
  {
    title: "No counterfactuals",
    description: "You can see what happened, but not what a better decision would have produced."
  },
  {
    title: "Exception paralysis",
    description: "Every disruption - short picks, late trailers, hot orders - requires a judgment call with incomplete information."
  }
];

const explainSteps = [
  {
    id: "01",
    title: "EXPLAIN",
    body: "Trace the root cause. This zone is congested because the last release cycle pushed too many orders into a narrow area, and the current batch structure is concentrating picks there. Tessera surfaces optimizer-level counterfactuals between what happened and what a better decision would have produced."
  },
  {
    id: "02",
    title: "DECIDE",
    body: "Prescribe a fix that accounts for everything. Re-batch active work to shift picks across zones, re-rank priorities, and throttle the next release in a single optimization pass. The optimizer finds non-obvious trade-offs a rule-based system would not discover."
  },
  {
    id: "03",
    title: "PREDICT",
    body: "See the impact before you commit. The same model that decides also predicts. What if you release 80 instead of 120? Zero gap between what the system predicts and what it would actually do."
  }
];

const metrics = [
  { value: "-12%", label: "Travel distance" },
  { value: "-8%", label: "Pick time" },
  { value: "+15%", label: "Throughput at same labor" },
  { value: "100%", label: "Constraint compliance" }
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="relative flex min-h-screen items-center border-b" style={{ borderColor: "var(--tessera-border)" }}>
        <div className="section-wrap py-16">
          <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Decision Intelligence Layer
          </p>
          <h1 className="headline mt-6 max-w-5xl text-5xl font-bold leading-[1] md:text-[64px]">OPTIMIZE THE SHIFT, NOT JUST THE PICK.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--tessera-text-secondary)" }}>
            Tessera sits on top of your WMS and continuously makes better decisions about what work to release, how to group it, and what to prioritize - all from a single optimization model.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="btn-primary">
              Request a Demo
            </Link>
            <a href="#explain-decide-predict" className="inline-flex items-center px-1 py-3 text-sm font-medium" style={{ color: "var(--tessera-text-secondary)" }}>
              See How It Works
            </a>
          </div>
          <p className="mt-10 text-2xl" style={{ color: "var(--tessera-text-secondary)" }}>
            ↓
          </p>
        </div>
      </section>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
              The Problem
            </p>
            <h2 className="headline mt-3 text-4xl font-semibold md:text-[44px]">KILL OPTIMIZATION THEATER.</h2>
            <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Your WMS can see the problem. It cannot tell you what to do about it given everything else happening on the floor.
            </p>
            <div className="mt-10">
              <RuledFeatureList items={problemCards} />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="explain-decide-predict" className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">EXPLAIN, DECIDE, PREDICT.</h2>
            <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              One model. Three capabilities. Every decision grounded in the same optimization that reasons about all constraints simultaneously.
            </p>
            <div className="mt-10 space-y-4">
              {explainSteps.map((step) => (
                <article key={step.id} className="marketing-card grid gap-4 p-6 md:grid-cols-[140px_minmax(0,1fr)] md:items-start">
                  <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
                    Step {step.id}
                  </p>
                  <div>
                    <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em]">{step.title}</h3>
                    <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>
                      {step.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">RIGOR YOU CAN MEASURE.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <article key={metric.label} className="marketing-card px-5 py-6">
                  <p className="font-display text-5xl font-semibold text-signal">{metric.value}</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.1em]" style={{ color: "var(--tessera-text-secondary)" }}>
                    {metric.label}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
              Placeholder metrics. Replace with observed facility data when available.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space">
          <div className="section-wrap marketing-card p-8 md:p-12">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">READY TO SEE IT RUN?</h2>
            <p className="mt-5 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
              Bring one facility. We&apos;ll produce an executable plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/demo" className="btn-primary">
                Request a Demo
              </Link>
              <Link href="/product" className="inline-flex items-center text-sm font-medium" style={{ color: "var(--tessera-text-secondary)" }}>
                Learn how it works →
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </MarketingShell>
  );
}
