import React from "react";
import { FaChartLine, FaFire, FaLightbulb, FaUsers } from "react-icons/fa";

const AiFeatures: React.FC = () => {
  return (
    <section id="ai" aria-labelledby="ai-features-heading" className="py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase text-blue-400">
            AI-Powered YouTube Tools
          </span>
          <h2
            id="ai-features-heading"
            className="mt-2 text-3xl font-bold md:text-4xl"
          >
            AI YouTube Title & Description Generator
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Stop guessing. Our AI tools help you create SEO-optimized titles,
            descriptions, and discover trending tags for maximum YouTube
            visibility.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Card 1*/}
          <div className="rounded-lg border border-blue-700 bg-gradient-to-br from-blue-900/50 to-gray-900 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
            <FaLightbulb className="mb-4 h-10 w-10 text-blue-300" />
            <h3 className="text-2xl font-bold">
              AI Title & Description Generator
            </h3>
            <p className="mt-2 text-gray-300">
              Hook your audience instantly. Get dozens of click-worthy titles
              and SEO-optimized descriptions tailored to your video's content.
            </p>
          </div>

          {/* Card 2*/}
          <div className="rounded-lg border border-green-700 bg-gradient-to-br from-green-900/50 to-gray-900 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
            <FaFire className="mb-4 h-10 w-10 text-green-300" />
            <h3 className="text-2xl font-bold">Smart Tag & Trend Hunter</h3>
            <p className="mt-2 text-gray-300">
              Maximize your reach. Our AI scans the YouTube landscape to
              discover trending topics and high-traffic tags for your niche.
            </p>
          </div>

          {/* Card 3*/}
          <div className="rounded-lg border border-purple-700 bg-gradient-to-br from-purple-900/50 to-gray-900 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <FaUsers className="mb-4 h-10 w-10 text-purple-300" />
            <h3 className="text-2xl font-bold">Team Performance Metrics</h3>
            <p className="mt-2 text-gray-300">
              Understand your workflow. Track your team's productivity, see
              upload frequencies, and monitor approval times per member.
            </p>
          </div>

          {/* Card 4*/}
          <div className="rounded-lg border border-yellow-700 bg-gradient-to-br from-yellow-900/50 to-gray-900 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20">
            <FaChartLine className="mb-4 h-10 w-10 text-yellow-300" />
            <h3 className="text-2xl font-bold">Deep Channel Analytics</h3>
            <p className="mt-2 text-gray-300">
              Go beyond YouTube Studio. Get aggregated reports across all your
              workspaces and see what content formats are *really* driving
              growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiFeatures;
