import { Hero } from "@/components/archive/Hero";
import { CaseWall } from "@/components/archive/CaseWall";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { McpConnect } from "@/components/landing/McpConnect";

export default function Home() {
  return (
    <main>
      <Hero />
      <CaseWall />
      <div id="how-it-works" className="scroll-mt-20">
        <HowItWorks />
      </div>
      <div id="connect" className="scroll-mt-20">
        <McpConnect />
      </div>
    </main>
  );
}
