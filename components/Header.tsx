import { BrandWordmark } from "@/components/BrandWordmark";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ borderColor: "var(--tessera-border)", background: "color-mix(in srgb, var(--tessera-bg-page) 92%, transparent)" }}>
      <div className="section-wrap flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" aria-label="Tessera home">
            <BrandWordmark className="relative block h-14 w-[320px] overflow-hidden" />
          </a>
          <span className="hidden text-xs uppercase tracking-[0.14em] xl:block" style={{ color: "var(--tessera-text-secondary)" }}>
            Decision Intelligence Layer
          </span>
        </div>
        <nav className="hidden gap-8 text-sm md:flex" style={{ color: "var(--tessera-text-secondary)" }}>
          <a href="#apis" className="hover:text-[var(--tessera-text-primary)]">APIs</a>
          <a href="#capabilities" className="hover:text-[var(--tessera-text-primary)]">How It Works</a>
          <a href="#guardrails" className="hover:text-[var(--tessera-text-primary)]">Trust</a>
          <a href="#contact" className="hover:text-[var(--tessera-text-primary)]">Demo</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
