"use client";

import { useAppState } from "@/components/app/AppProvider";
import { BrandTile } from "@/components/BrandTile";
import { BrandWordmark } from "@/components/BrandWordmark";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Decision Feed", href: "/app" },
  { label: "Posture", href: "/app/posture" },
  { label: "History", href: "/app/history" },
  { label: "Settings", href: "/app/settings" }
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppState();

  return (
    <aside
      className={`sticky top-0 h-screen border-r transition-all duration-150 ${sidebarCollapsed ? "lg:w-16" : "lg:w-[260px]"} w-16`}
      style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-page)" }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b" style={{ borderColor: "var(--tessera-border)" }}>
          <a href="/" className="flex items-center gap-2" aria-label="Back to marketing site">
            {sidebarCollapsed ? (
              <BrandTile className="h-7 w-auto" variant="collapsed" />
            ) : (
              <>
                <div className="hidden lg:block">
                  <BrandWordmark className="relative block h-12 w-[230px] overflow-hidden" />
                </div>
                <BrandTile className="h-7 w-auto lg:hidden" variant="collapsed" />
              </>
            )}
          </a>
        </div>

        <button
          type="button"
          className="m-2 hidden rounded-button border px-3 py-2 text-xs uppercase tracking-[0.08em] lg:block"
          style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? "Expand" : "Collapse"}
        </button>

        <nav className="mt-2 flex flex-col gap-2 px-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[10px] px-3 py-3 text-sm transition duration-150"
                style={{
                  color: active ? "var(--tessera-text-primary)" : "var(--tessera-text-secondary)",
                  background: active ? "color-mix(in srgb, var(--tessera-text-primary) 10%, transparent)" : "transparent"
                }}
              >
                <span className={`${sidebarCollapsed ? "hidden" : "hidden lg:inline"}`}>{item.label}</span>
                <span className={`${sidebarCollapsed ? "inline" : "inline lg:hidden"}`}>{item.label.charAt(0)}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto border-t p-3" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
          <p className={`${sidebarCollapsed ? "hidden" : "hidden lg:block"} text-xs uppercase tracking-[0.1em]`}>Current Shift</p>
          <p className={`${sidebarCollapsed ? "text-center" : "hidden lg:block"} mt-1 text-sm font-medium`}>PM-2</p>
        </div>
      </div>
    </aside>
  );
}
