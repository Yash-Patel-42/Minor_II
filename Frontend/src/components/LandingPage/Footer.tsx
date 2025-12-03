import React from "react";
import { FaGithub, FaInstagram } from "react-icons/fa";
import TubixLogo from "../../assets/Tubix(SVG)/3.svg";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-700 bg-gray-900">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2">
              <img src={TubixLogo} alt="" className="size-15 sm:size-25" />
              <span className="text-xl font-semibold">Tubix</span>
            </div>
            <p className="mt-4 max-w-xs text-gray-400">
              The secure control panel your YouTube channel has been missing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div>
              <h3 className="font-semibold uppercase text-white">Product</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#ai"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    AI Tools
                  </a>
                </li>
                <li>
                  <a
                    href="/register"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold uppercase text-white">Resources</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Link Column 3 */}
            <div>
              <h3 className="font-semibold uppercase text-white">Legal</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-service"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Tubix. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a
              href="https://www.instagram.com/"
              className="text-gray-400 transition-colors hover:text-white"
              aria-label="Instagram"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/Yash-Patel-42/Minor_II"
              className="text-gray-400 transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <FaGithub className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
