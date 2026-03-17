import { AppProvider } from "@/components/app/AppProvider";
import { AppShell } from "@/components/app/AppShell";
import type { ReactNode } from "react";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
