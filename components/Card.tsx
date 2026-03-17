type CardProps = {
  title: string;
  description: string;
  tag?: string;
  step?: string;
};

export function Card({ title, description, tag, step }: CardProps) {
  return (
    <article className="surface-card p-6">
      {(tag || step) && (
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
          {step && <span>{step}</span>}
          {tag && (
            <span className="rounded-full border px-2 py-1" style={{ borderColor: "var(--tessera-border)" }}>
              {tag}
            </span>
          )}
        </div>
      )}
      <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.02em]">{title}</h3>
      <p className="mt-3 text-base" style={{ color: "var(--tessera-text-secondary)" }}>
        {description}
      </p>
    </article>
  );
}
