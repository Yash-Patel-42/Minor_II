import AiFeatures from "@components/LandingPage/AiFeatures";
import CallToAction from "@components/LandingPage/CallToAction";
import Features from "@components/LandingPage/Features";
import Footer from "@components/LandingPage/Footer";
import Hero from "@components/LandingPage/Hero";
import HowItWorks from "@components/LandingPage/HowItWorks";
import LandingNavbar from "@components/LandingPage/LandingNavbar";

const LandingPage = () => {
  return (
    <div className="overflow-x-hidden bg-gray-900 text-white">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AiFeatures />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
