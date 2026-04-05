"use client";

import { BrandWordmark } from "@/components/BrandWordmark";
import { useAppState } from "@/components/app/AppProvider";
import { useRouter } from "next/navigation";

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TopBar() {
  const { mode, setMode, copilotOpen, setCopilotOpen, openTab, heartbeatRemaining, theme } = useAppState();
  const router = useRouter();
  const topControlClass = "inline-flex h-9 items-center rounded-button border px-3 text-xs font-medium";
  const iconControlClass = "inline-flex h-9 w-9 items-center justify-center rounded-button border";
  const modeSelectStyle =
    mode === "Closed-Loop"
      ? {
          borderColor: "var(--tessera-accent-signal)",
          background: "var(--tessera-accent-signal)",
          color: "#0B0D10"
        }
      : {
          borderColor: "var(--tessera-border)",
          background: "transparent",
          color: "var(--tessera-text-secondary)"
        };

  const logout = async () => {
    await fetch("/api/mock-auth/logout", { method: "POST" });
    router.push("/app/login");
    router.refresh();
  };

  return (
    <header
      className="border-b backdrop-blur"
      style={{
        borderColor: "var(--tessera-border)",
        background: "var(--tessera-bg-page)"
      }}
    >
      <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-sm">
          <span className={topControlClass} style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}>
            NEXT HEARTBEAT: <span style={{ color: "var(--tessera-accent-signal)" }}>{formatCountdown(heartbeatRemaining)}</span>
          </span>
          <div className="relative">
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as typeof mode)}
              className="h-9 appearance-none rounded-button border bg-transparent pl-3 pr-8 text-xs font-medium"
              style={modeSelectStyle}
            >
              <option>Advisory</option>
              <option>Closed-Loop</option>
            </select>
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: modeSelectStyle.color }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 4.5 6 8l3.5-3.5" />
              </svg>
            </span>
          </div>
        </div>

        <a href="/" className="justify-self-center" aria-label="Go to home page">
          <BrandWordmark
            tone={theme === "light" ? "light" : "dark"}
            className="relative block h-9 w-[360px] overflow-hidden"
            imageClassName="object-contain object-center -translate-y-[2%] scale-[3.5]"
          />
        </a>

        <div className="flex items-center justify-self-end gap-2">
          <button
            type="button"
            className={iconControlClass}
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
            onClick={() => openTab("settings")}
            aria-label="Open settings tab"
            title="Open settings"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
              <path d="M19 12a7.1 7.1 0 0 0-.1-1.1l2-1.6-1.9-3.3-2.4 1a7.5 7.5 0 0 0-1.9-1.1l-.3-2.5h-3.8l-.3 2.5a7.5 7.5 0 0 0-1.9 1.1l-2.4-1-1.9 3.3 2 1.6A7.1 7.1 0 0 0 5 12c0 .4 0 .7.1 1.1l-2 1.6 1.9 3.3 2.4-1a7.5 7.5 0 0 0 1.9 1.1l.3 2.5h3.8l.3-2.5a7.5 7.5 0 0 0 1.9-1.1l2.4 1 1.9-3.3-2-1.6c.1-.4.1-.7.1-1.1z" />
            </svg>
          </button>
          <button
            type="button"
            className={topControlClass}
            style={{ borderColor: "var(--tessera-border)", color: "var(--tessera-text-secondary)" }}
            onClick={logout}
          >
            Sign out
          </button>
          <button
            type="button"
            className={topControlClass}
            style={{
              borderColor: copilotOpen ? "var(--tessera-accent-signal)" : "var(--tessera-border)",
              color: copilotOpen ? "var(--tessera-accent-signal)" : "var(--tessera-text-secondary)"
            }}
            onClick={() => setCopilotOpen(!copilotOpen)}
          >
            TESS
          </button>
        </div>
      </div>
    </header>
  );
}
