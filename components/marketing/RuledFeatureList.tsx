type RuledFeatureItem = {
  title: string;
  description: string;
};

type RuledFeatureListProps = {
  items: RuledFeatureItem[];
};

export function RuledFeatureList({ items }: RuledFeatureListProps) {
  return (
    <div className="border-t" style={{ borderColor: "var(--tessera-border)" }}>
      {items.map((item, index) => {
        const showBottomDivider = index < items.length - 1;

        return (
          <article
            key={item.title}
            className={`py-8 ${showBottomDivider ? "border-b" : ""}`}
            style={showBottomDivider ? { borderColor: "var(--tessera-border)" } : undefined}
          >
            <h3 className="font-display text-xl font-bold uppercase tracking-[-0.01em] md:text-[20px]">
              {item.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed md:text-[17px]" style={{ color: "var(--tessera-text-secondary)" }}>
              {item.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}
