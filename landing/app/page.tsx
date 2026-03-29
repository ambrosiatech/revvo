import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import SocialProofBar from "@/components/landing/SocialProofBar";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import ComparisonTable from "@/components/landing/ComparisonTable";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Waitlist from "@/components/landing/Waitlist";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Nav />
      <main>
        <Hero />
        <SocialProofBar />
        <HowItWorks />
        <FeaturesGrid />
        <ComparisonTable />
        <Testimonials />
        <Pricing />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
