import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { ReactNode } from "react";

type MarketingShellProps = {
  children: ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <>
      <Header />
      <main className="page-fade pt-16 md:pt-0">{children}</main>
      <Footer />
    </>
  );
}
