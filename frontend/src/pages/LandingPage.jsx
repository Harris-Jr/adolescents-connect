import { Hero } from "@/components/Hero";
import { FeatureCards } from "@/components/FeatureCards";
import { QuickActions } from "@/components/QuickActions";
import { ImpactStats } from "@/components/ImpactStats";
function LandingPage() {
  return (
    <main className="pb-10">
      <Hero />
      <FeatureCards />
      <QuickActions />
      <ImpactStats />
    </main>
  );
}
export default LandingPage;
