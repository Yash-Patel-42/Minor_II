// src/components/HowItWorks.tsx
import React from "react";
// Import icons for each step
import { FaCheck, FaSearch, FaUpload, FaUserPlus } from "react-icons/fa";

const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="overflow-hidden bg-gray-800/40 py-24"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="mb-20 text-center text-3xl font-bold md:text-4xl"
        >
          How YouTube Video Approval Works
        </h2>
        <div className="relative grid grid-cols-1 gap-16 md:grid-cols-2 lg:gap-24">
          <div className="relative">
            <span
              className="absolute -left-10 -top-10 -z-0 text-9xl font-extrabold text-blue-600/40"
              aria-hidden="true"
            >
              1
            </span>
            <div className="relative z-10 -skew-y-2 transform rounded-lg border-l-4 border-blue-500 bg-gray-900 p-8 shadow-2xl transition-all duration-300 hover:skew-y-0 hover:scale-105">
              <FaUserPlus className="mb-4 h-10 w-10 text-blue-400" />
              <h3 className="mb-2 text-2xl font-bold">Invite Your Team</h3>
              <p className="text-gray-300">
                Create a workspace and invite your editors, managers, and
                designers with granular, role-based permissions.
              </p>
            </div>
          </div>
          <div className="relative">
            <span
              className="absolute -right-10 -top-10 -z-0 text-9xl font-extrabold text-green-600/40"
              aria-hidden="true"
            >
              2
            </span>
            <div className="relative z-10 skew-y-2 transform rounded-lg border-r-4 border-green-500 bg-gray-900 p-8 shadow-2xl transition-all duration-300 hover:skew-y-0 hover:scale-105">
              <FaUpload className="mb-4 h-10 w-10 text-green-400" />
              <h3 className="mb-2 text-2xl font-bold">Editor Uploads Video</h3>
              <p className="text-gray-300">
                Your editor uploads the final video, title, and thumbnail
                directly to your secure workspace, NOT to YouTube.
              </p>
            </div>
          </div>
          <div className="relative">
            <span
              className="absolute -left-10 -top-10 -z-0 text-9xl font-extrabold text-purple-600/40"
              aria-hidden="true"
            >
              3
            </span>
            <div className="relative z-10 -skew-y-2 transform rounded-lg border-l-4 border-purple-500 bg-gray-900 p-8 shadow-2xl transition-all duration-300 hover:skew-y-0 hover:scale-105">
              <FaSearch className="mb-4 h-10 w-10 text-purple-400" />
              <h3 className="mb-2 text-2xl font-bold">Owner Gets Notified</h3>
              <p className="text-gray-300">
                You receive a notification to review the submission. Watch the
                video and check all the metadata, all in one place.
              </p>
            </div>
          </div>
          <div className="relative">
            <span
              className="absolute -right-10 -top-10 -z-0 text-9xl font-extrabold text-red-600/40"
              aria-hidden="true"
            >
              4
            </span>
            <div className="relative z-10 skew-y-2 transform rounded-lg border-r-4 border-red-500 bg-gray-900 p-8 shadow-2xl transition-all duration-300 hover:skew-y-0 hover:scale-105">
              <FaCheck className="mb-4 h-10 w-10 text-red-400" />
              <h3 className="mb-2 text-2xl font-bold">Approve & Publish</h3>
              <p className="text-gray-300">
                Click 'Approve', and *then* our platform securely publishes the
                video to your YouTube channel. You have the final say.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
