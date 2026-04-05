import { Reveal } from "@/components/Reveal";
import { RuledFeatureList } from "@/components/marketing/RuledFeatureList";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import tileBlackFillLimeOutline from "@/tessera_svg_elements_exact/tile_black_fill_lime_outline.svg";
import Image from "next/image";
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
    title: "No way to compare",
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
    body: "Trace why the floor looks the way it does. Not just alerts — causal reasoning. This zone is slow because the last release was too dense and batching is concentrating picks there."
  },
  {
    id: "02",
    title: "DECIDE",
    body: "Prescribe a fix that respects every constraint at once — deadlines, congestion, travel, labor. One pass, not one rule at a time."
  },
  {
    id: "03",
    title: "PREDICT",
    body: "See impact before you commit. Same model that decides also predicts — zero gap between forecast and action."
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
      <section className="relative flex min-h-[calc(68vh-5rem)] items-start border-b md:min-h-[calc(100vh-5rem)] md:items-center" style={{ borderColor: "var(--tessera-border)" }}>
        <div className="pointer-events-none absolute left-1/2 top-[53%] hidden -translate-x-1/2 -translate-y-1/2 opacity-[0.02] md:block" aria-hidden>
          <Image src={tileBlackFillLimeOutline} alt="" width={1760} height={891} className="h-auto w-[1760px] max-w-none" />
        </div>
        <div className="section-wrap flex justify-center pb-12 pt-6 md:pb-16 md:pt-4">
          <div className="relative z-10 mx-auto flex max-w-[800px] flex-col items-center text-center">
            <p className="font-code text-[1.0rem] uppercase tracking-[0.14em] text-signal">
              Decision Intelligence Layer
            </p>
            <h1 className="headline mt-4 text-5xl font-bold leading-[1] md:mt-6 md:text-[64px]">
              OPTIMIZE THE SHIFT,
              <br />
              NOT JUST THE PICK.
            </h1>
            <p className="mt-4 text-lg leading-relaxed md:mt-6" style={{ color: "var(--tessera-text-secondary)" }}>
              Tessera sits on top of your WMS and decides what work to release, how to group it, and what to prioritize — accounting for every constraint on the floor simultaneously.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-7 md:mt-8">
              <Link href="/demo" className="btn-primary">
                Request a Demo
              </Link>
              <a
                href="#explain-decide-predict"
                className="inline-flex items-center px-1 py-3 text-sm font-medium text-[var(--tessera-text-secondary)] transition-colors duration-150 hover:text-[var(--tessera-accent-signal)]"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
        <a
          href="#the-problem"
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-2xl text-[var(--tessera-text-secondary)] transition-colors duration-150 hover:text-[var(--tessera-accent-signal)] md:inline-flex"
          aria-label="Scroll to the next section"
        >
          ↓
        </a>
      </section>

      <Reveal>
        <section id="the-problem" className="section-space scroll-mt-20 border-b md:scroll-mt-24" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
              The Problem
            </p>
            <h2 className="headline mt-3 text-4xl font-semibold md:text-[44px]">VISIBILITY ISN&apos;T THE GAP. THE RESPONSE IS.</h2>
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
        <section id="explain-decide-predict" className="section-space scroll-mt-20 border-b md:scroll-mt-24" style={{ borderColor: "var(--tessera-border)" }}>
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
