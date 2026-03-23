"use client";

import { BrandWordmark } from "@/components/BrandWordmark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/product", label: "Product" },
  { href: "/trust", label: "Trust" },
  { href: "/team", label: "Team" }
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-[12px]" style={{ borderColor: "var(--tessera-border)", background: "color-mix(in srgb, var(--tessera-bg-page) 80%, transparent)" }}>
      <div className="section-wrap flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Tessera home" onClick={() => setMenuOpen(false)}>
            <BrandWordmark className="relative block h-14 w-[320px] overflow-hidden" />
          </Link>
          <span className="hidden text-xs uppercase tracking-[0.14em] xl:block" style={{ color: "var(--tessera-text-secondary)" }}>
            Decision Intelligence Layer
          </span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex gap-6 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} className="group relative pb-1 transition-colors hover:text-[var(--tessera-accent-signal)]" style={{ color: active ? "var(--tessera-text-primary)" : undefined }}>
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full transition-opacity group-hover:opacity-100" style={{ background: "var(--tessera-accent-signal)", opacity: active ? 1 : 0 }} />
                </Link>
              );
            })}
          </nav>
          <Link href="/demo" className="btn-primary text-sm uppercase tracking-[0.08em]">
            Request Demo
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-button border md:hidden"
          style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-primary)" }}
          aria-label="Open site navigation"
          onClick={() => setMenuOpen(true)}
        >
          <span className="font-code text-lg leading-none">≡</span>
        </button>
      </div>

      <div className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button
          type="button"
          className={`absolute inset-0 bg-black/50 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
          aria-label="Close navigation overlay"
          onClick={() => setMenuOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[280px] flex-col border-l p-6 transition-transform duration-200 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}
        >
          <div className="mb-8 flex items-center justify-between">
            <p className="font-code text-xs uppercase tracking-[0.14em]" style={{ color: "var(--tessera-text-secondary)" }}>
              Menu
            </p>
            <button type="button" className="text-2xl leading-none" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              ×
            </button>
          </div>
          <nav className="flex flex-col gap-4 text-base">
            <Link href="/" className="py-1" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between py-1"
                  style={{ color: active ? "var(--tessera-text-primary)" : "var(--tessera-text-secondary)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  {active ? <span style={{ color: "var(--tessera-accent-signal)" }}>•</span> : null}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto">
            <Link href="/demo" className="btn-primary inline-flex w-full justify-center text-sm uppercase tracking-[0.08em]" onClick={() => setMenuOpen(false)}>
              Request Demo
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}
