import { CopilotPanel } from "@/components/app/CopilotPanel";
import { PosturePanel } from "@/components/app/PosturePanel";
import { TopBar } from "@/components/app/TopBar";
import { WorkspaceTabBar, WorkspaceTabContent } from "@/components/app/WorkspaceTabs";

export function AppShell() {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--tessera-bg-page)" }}>
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-20">
          <TopBar />
          <WorkspaceTabBar />
        </div>
        <WorkspaceTabContent />
      </div>
      <CopilotPanel />
      <PosturePanel />
    </div>
  );
}
