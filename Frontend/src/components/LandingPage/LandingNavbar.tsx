import React from "react";
import TubixLogo from "../../assets/Tubix(SVG)/3.svg";
const LandingNavbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/70 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={TubixLogo} alt="" className="size-15 sm:size-25" />
          <span className="text-xl font-bold sm:text-2xl">Tubix</span>
        </div>

        {/* Nav Links (Desktop) */}
        <div className="hidden items-center space-x-6 md:flex">
          <a
            href="#features"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-gray-300 transition-colors hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#ai"
            className="text-gray-300 transition-colors hover:text-white"
          >
            AI Tools
          </a>
        </div>

        {/* CTA Button */}
        <a
          href="/register"
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/50"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
};

export default LandingNavbar;
