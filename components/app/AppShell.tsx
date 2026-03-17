import { PostureSummaryBar } from "@/components/app/PostureSummaryBar";
import { Sidebar } from "@/components/app/Sidebar";
import { TopBar } from "@/components/app/TopBar";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--tessera-bg-page)" }}>
      <Sidebar />
      <div className="min-w-0 flex-1">
        <TopBar />
        <PostureSummaryBar />
        <main className="app-shell-main">{children}</main>
      </div>
    </div>
  );
}
