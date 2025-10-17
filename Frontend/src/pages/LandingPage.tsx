import Navbar from "../components/LandingPage/Navbar"
import Hero from "../components/LandingPage/Hero"
import Features from "../components/LandingPage/Features"
import HowItWorks from "../components/LandingPage/HowItWorks"
import AiFeatures from "../components/LandingPage/AiFeatures"
import CallToAction from "../components/LandingPage/CallToAction"
import Footer from "../components/LandingPage/Footer"


const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AiFeatures />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default LandingPage