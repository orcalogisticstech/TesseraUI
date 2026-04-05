import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollToTopOnPathChange } from "@/components/marketing/ScrollToTopOnPathChange";
import type { ReactNode } from "react";

type MarketingShellProps = {
  children: ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <>
      <ScrollToTopOnPathChange />
      <Header />
      <main className="page-fade pt-16 md:pt-0">{children}</main>
      <Footer />
    </>
  );
}
