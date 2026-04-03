"use client";

import { BrandWordmark } from "@/components/BrandWordmark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b backdrop-blur-[12px]" style={{ borderColor: "var(--tessera-border)", background: "color-mix(in srgb, var(--tessera-bg-page) 80%, transparent)" }}>
        <div className="section-wrap grid h-20 grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-3 md:flex md:justify-between">
          <div aria-hidden className="h-10 w-10 md:hidden" />

          <div className="flex items-center justify-center md:justify-start">
            <Link href="/" aria-label="Tessera home" onClick={() => setMenuOpen(false)}>
              <BrandWordmark className="relative block h-10 w-[216px] overflow-hidden sm:h-11 sm:w-[236px] md:h-14 md:w-[320px] md:origin-left md:scale-125" />
            </Link>
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
            aria-label={menuOpen ? "Close site navigation" : "Open site navigation"}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="font-code text-lg leading-none">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
      </header>

      <aside
        id="site-mobile-menu"
        className={`fixed inset-0 z-[70] flex flex-col p-6 transition-opacity duration-200 ease-out md:hidden ${menuOpen ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
        style={{ background: "#66707a" }}
      >
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" aria-label="Tessera home" onClick={() => setMenuOpen(false)}>
            <BrandWordmark className="relative block h-10 w-[216px] overflow-hidden" />
          </Link>
          <button type="button" className="text-2xl leading-none" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            ×
          </button>
        </div>
        <nav className="flex flex-col gap-6 text-xl">
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
        <div className="mt-auto pb-2">
          <Link href="/demo" className="btn-primary inline-flex w-full justify-center text-sm uppercase tracking-[0.08em]" onClick={() => setMenuOpen(false)}>
            Request Demo
          </Link>
        </div>
      </aside>
    </>
  );
}
