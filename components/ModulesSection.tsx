import { Card } from "@/components/Card";

const modules = [
  {
    title: "Optimize Release",
    description:
      "Decides which work should become active now and which should wait for the next cycle.",
    tag: "API",
    step: "01"
  },
  {
    title: "Optimize Batching",
    description:
      "Groups active work into efficient packages so operators do not get flooded with scattered tasks.",
    tag: "API",
    step: "02"
  },
  {
    title: "Prioritize Work",
    description:
      "Ranks active packages by urgency, congestion risk, and operational efficiency.",
    tag: "API",
    step: "03"
  },
  {
    title: "More Tiles Coming",
    description: "Slotting, labor planning, and load optimization are next in the decision mosaic.",
    tag: "Roadmap"
  }
];

export function ModulesSection() {
  return (
    <section id="modules" className="section-space border-b" style={{ borderColor: "var(--divider)" }}>
      <div className="section-wrap">
        <h2 className="headline text-4xl font-semibold leading-[1.05] md:text-[44px]">AUTONOMY, WITH GUARDRAILS.</h2>
        <p className="mt-5 max-w-2xl text-lg" style={{ color: "var(--text-secondary)" }}>
          Tessera is a decision layer on top of your WMS. It recommends what to release, how to batch, and what to do first.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <Card key={module.title} title={module.title} description={module.description} tag={module.tag} step={module.step} />
          ))}
        </div>
      </div>
    </section>
  );
}
