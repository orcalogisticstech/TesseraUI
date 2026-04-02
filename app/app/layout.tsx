import { AppProvider } from "@/components/app/AppProvider";
import { AppShell } from "@/components/app/AppShell";
import { BrandWordmark } from "@/components/BrandWordmark";
import { getMockSession } from "@/lib/mock-auth-server";
import type { ReactNode } from "react";

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const session = await getMockSession();

  return (
    <>
      <main className="flex min-h-screen items-center justify-center px-6 py-10 lg:hidden" style={{ background: "var(--tessera-bg-page)" }}>
        <section className="w-full max-w-[420px] rounded-[14px] border p-6 text-center" style={{ borderColor: "var(--tessera-border)", background: "var(--tessera-bg-surface)" }}>
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
        {session ? (
          <AppProvider session={session}>
            <AppShell />
          </AppProvider>
        ) : (
          <>{children}</>
        )}
      </div>
    </>
  );
}
