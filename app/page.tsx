import { EnemySection } from "@/components/EnemySection";
import { EvolutionSection } from "@/components/EvolutionSection";
import { Footer } from "@/components/Footer";
import { FooterCTA } from "@/components/FooterCTA";
import { GuardrailsSection } from "@/components/GuardrailsSection";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ModulesSection } from "@/components/ModulesSection";
import { OperatorSection } from "@/components/OperatorSection";
import { ProofSection } from "@/components/ProofSection";
import { Reveal } from "@/components/Reveal";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Reveal>
        <HeroSection />
      </Reveal>
      <Reveal>
        <EnemySection />
      </Reveal>
      <Reveal>
        <HowItWorksSection />
      </Reveal>
      <Reveal>
        <ModulesSection />
      </Reveal>
      <Reveal>
        <OperatorSection />
      </Reveal>
      <Reveal>
        <GuardrailsSection />
      </Reveal>
      <Reveal>
        <ProofSection />
      </Reveal>
      <Reveal>
        <EvolutionSection />
      </Reveal>
      <Reveal>
        <FooterCTA />
      </Reveal>
      <Footer />
    </main>
  );
}
