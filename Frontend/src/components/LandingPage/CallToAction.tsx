import React from "react";
import { FaShieldAlt } from "react-icons/fa";

const CallToAction: React.FC = () => {
  return (
    <div className="bg-gray-800/40">
      <div className="container mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-900/20 via-gray-900 to-purple-900/20 p-8 text-center shadow-2xl shadow-blue-500/30 md:p-12">
          <span className="inline-flex items-center rounded-full bg-blue-500/20 px-4 py-1 text-sm font-medium text-blue-300">
            No More Password Sharing
          </span>
          <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">
            Ready to Take Control of Your Channel?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-200">
            Join our private beta and be the first to experience secure,
            stress-free YouTube team management.
          </p>
          <a
            href="/register"
            className="mt-10 inline-block transform rounded-lg bg-blue-600 px-12 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/50"
          >
            Sign Up for the Beta
          </a>
          <p className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
            <FaShieldAlt className="h-4 w-4" />
            <span>Free to join. No credit card required.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
