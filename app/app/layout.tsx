import { AppProvider } from "@/components/app/AppProvider";
import { AppShell } from "@/components/app/AppShell";
import { getMockSession } from "@/lib/mock-auth-server";
import type { ReactNode } from "react";

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const session = await getMockSession();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <AppProvider session={session}>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
