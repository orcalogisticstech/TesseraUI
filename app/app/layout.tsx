import { AppProvider } from "@/components/app/AppProvider";
import { AppShell } from "@/components/app/AppShell";
import { BrandWordmark } from "@/components/BrandWordmark";
import { getMockSession } from "@/lib/mock-auth-server";
import { fetchBootstrapRaw } from "@/lib/server/tesserapick-client";
import { normalizeBootstrap } from "@/lib/tesserapick-normalizers";
import type { ReactNode } from "react";

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const session = await getMockSession();
  const bootstrap = session ? await loadBootstrap(session) : null;

  return (
    <>
      <main className="flex min-h-screen items-center justify-center px-6 py-10 lg:hidden" style={{ background: "var(--tessera-bg-page)" }}>
        <section className="w-full max-w-[420px] border p-6 text-center" style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}>
          <div className="mx-auto w-max">
            <BrandWordmark className="relative block h-10 w-[220px] overflow-hidden" />
          </div>
          <p className="mt-5 font-code text-xs uppercase tracking-[0.12em]" style={{ color: "var(--tessera-text-secondary)" }}>
            Desktop Required
          </p>
          <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
            Tessera app is available on desktop only. Please reopen this workspace on a larger screen.
          </p>
        </section>
      </main>

      <div className="hidden lg:block">
        {session && bootstrap ? (
          <AppProvider
            session={session}
            initialData={bootstrap.data}
            initialHeartbeatPlanSets={bootstrap.initialHeartbeatPlanSets}
            initialAdoptedPlansHistory={bootstrap.adoptedPlansHistory}
            initialJobConfig={bootstrap.jobConfig}
            initialActiveJobIds={bootstrap.activeJobIds}
          >
            <AppShell />
          </AppProvider>
        ) : session ? (
          <BackendUnavailable />
        ) : (
          <>{children}</>
        )}
      </div>
    </>
  );
}

async function loadBootstrap(session: NonNullable<Awaited<ReturnType<typeof getMockSession>>>) {
  try {
    const raw = await fetchBootstrapRaw("demo", "ATL1");
    return normalizeBootstrap(raw, session);
  } catch {
    return null;
  }
}

function BackendUnavailable() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10" style={{ background: "var(--tessera-bg-page)" }}>
      <section className="w-full max-w-[520px] border p-6 text-center" style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}>
        <div className="mx-auto w-max">
          <BrandWordmark className="relative block h-10 w-[220px] overflow-hidden" />
        </div>
        <p className="mt-5 font-code text-xs uppercase tracking-[0.12em]" style={{ color: "var(--tessera-text-secondary)" }}>
          TesseraPick Unavailable
        </p>
        <p className="mt-3 text-sm" style={{ color: "var(--tessera-text-secondary)" }}>
          Start the backend orchestrator at http://localhost:8100, then refresh this workspace.
        </p>
      </section>
    </main>
  );
}
