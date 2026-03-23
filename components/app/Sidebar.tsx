"use client";

import { useAppState } from "@/components/app/AppProvider";
import { BrandTile } from "@/components/BrandTile";
import { BrandWordmark } from "@/components/BrandWordmark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Decision Feed", href: "/app", icon: "home" },
  { label: "Release", href: "/app/release", icon: "play" },
  { label: "Batching", href: "/app/batching", icon: "layers" },
  { label: "Prioritize", href: "/app/prioritize", icon: "list" },
  { label: "Explore", href: "/app/explore", icon: "branch" },
  { label: "History", href: "/app/history", icon: "clock" },
  { label: "Settings", href: "/app/settings", icon: "gear", divider: true }
];

function NavIcon({ kind }: { kind: string }) {
  if (kind === "home") {
    return <path d="M3 9.5 12 3l9 6.5V21h-6v-7h-6v7H3z" />;
  }
  if (kind === "play") {
    return <path d="M5 4h14v16H5z M10 8l6 4-6 4z" />;
  }
  if (kind === "layers") {
    return <path d="m12 4 9 4.5-9 4.5L3 8.5z M3 13.5 12 18l9-4.5 M3 18l9 4 9-4" />;
  }
  if (kind === "list") {
    return <path d="M4 7h2M8 7h12M4 12h2M8 12h12M4 17h2M8 17h12" />;
  }
  if (kind === "branch") {
    return <path d="M6 4v8a4 4 0 0 0 4 4h8 M18 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M6 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M18 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />;
  }
  if (kind === "clock") {
    return <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 7v6l4 2" />;
  }
  return <path d="M12 3l8 4v10l-8 4-8-4V7z M12 10v4 M10 12h4" />;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppState();

  const logout = async () => {
    await fetch("/api/mock-auth/logout", { method: "POST" });
    router.push("/app/login");
    router.refresh();
  };

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
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[10px] px-3 py-3 text-sm transition duration-150 ${item.divider ? "mt-3 border-t pt-5" : ""}`}
                style={{
                  color: active ? "var(--tessera-text-primary)" : "var(--tessera-text-secondary)",
                  background: active ? "color-mix(in srgb, var(--tessera-text-primary) 10%, transparent)" : "transparent",
                  borderColor: "var(--tessera-border)"
                }}
              >
                <span className="inline-flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <NavIcon kind={item.icon} />
                  </svg>
                  <span className={`${sidebarCollapsed ? "hidden" : "hidden lg:inline"}`}>{item.label}</span>
                  <span className={`${sidebarCollapsed ? "inline" : "inline lg:hidden"}`}>{item.label.charAt(0)}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t p-3" style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
          <p className={`${sidebarCollapsed ? "hidden" : "hidden lg:block"} text-xs uppercase tracking-[0.1em]`}>Current Shift</p>
          <p className={`${sidebarCollapsed ? "text-center" : "hidden lg:block"} mt-1 text-sm font-medium`}>Day Shift - Mar 23</p>
          <button type="button" className={`${sidebarCollapsed ? "hidden" : "hidden lg:block"} btn-secondary mt-3 w-full text-xs`} onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
