import { Reveal } from "@/components/Reveal";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import Link from "next/link";

const whyCards = [
  "The optimization core is not a wrapper around a generic solver. It is built by someone who published research on algorithms inside the solver.",
  "Amazon-scale logistics experience means the system is designed for the warehouse that exists right now, not a textbook model.",
  "An established network in 3PL and fulfillment keeps Tessera built with operators, not just for operators."
];

export default function TeamPage() {
  return (
    <MarketingShell>
      <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
        <div className="section-wrap py-8 md:py-12">
          <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Team
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em] md:text-6xl">
            Built by people who solve these problems for a living.
          </h1>
          <p className="mt-6 max-w-3xl text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
            Tessera comes from the intersection of mathematical optimization research and real warehouse operations.
          </p>
        </div>
      </section>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <article className="marketing-card p-8 md:p-10">
              <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
                Founder
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.01em]">Yatharth Dubey</h2>
              <p className="mt-1 text-sm uppercase tracking-[0.1em]" style={{ color: "var(--tessera-text-secondary)" }}>
                Founder
              </p>
              <p className="mt-5 text-lg" style={{ color: "var(--tessera-text-secondary)" }}>
                Yatharth holds a PhD in Operations Research from Georgia Tech and completed postdoctoral research at Carnegie Mellon University. His research in integer programming and branch-and-bound algorithms was recognized with second place at the INFORMS George Nicholson Student Paper Prize, with publications in Mathematical Programming. Before founding Tessera, he worked as an Applied Scientist at Amazon Global Logistics, where he built optimization systems for real warehouse operations at scale. Tessera applies that same rigor - mathematical optimization grounded in actual floor conditions - to every warehouse that runs it.
              </p>
            </article>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <div className="section-wrap">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">WHY THIS TEAM</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {whyCards.map((item) => (
                <article key={item} className="marketing-card p-6">
                  <p className="text-base" style={{ color: "var(--tessera-text-secondary)" }}>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section-space">
          <div className="section-wrap marketing-card p-8 md:p-12">
            <h2 className="headline text-4xl font-semibold md:text-[44px]">TALK TO US.</h2>
            <div className="mt-8">
              <Link href="/demo" className="btn-primary">Request a Demo</Link>
            </div>
          </div>
        </section>
      </Reveal>
    </MarketingShell>
  );
}
