import SEOHead from "@/components/SEOHead";
import HeroSection from "@/components/sections/HeroSection";
import TrustMarquee from "@/components/sections/TrustMarquee";
import VideoSection from "@/components/sections/VideoSection";
import ProblemLight from "@/components/sections/ProblemLight";
import ArquitecturaSection from "@/components/sections/ArquitecturaSection";
import MetodologiaLight from "@/components/sections/MetodologiaLight";
import SecuritySection from "@/components/sections/SecuritySection";
import ComparativaLight from "@/components/sections/ComparativaLight";
import ImpactoBand from "@/components/sections/ImpactoBand";
import TestimoniosLight from "@/components/sections/TestimoniosLight";
import CtaLight from "@/components/sections/CtaLight";
import { seo } from "@config/seo";

export default function Home() {
  return (
    <div className="site-light">
      <SEOHead
        title={seo.pages.home.title}
        description={seo.pages.home.description}
      />
      <HeroSection />
      <TrustMarquee />
      <VideoSection />
      <ProblemLight />
      <ArquitecturaSection />
      <MetodologiaLight />
      <SecuritySection />
      <ComparativaLight />
      <ImpactoBand />
      <TestimoniosLight />
      <CtaLight />
    </div>
  );
}
