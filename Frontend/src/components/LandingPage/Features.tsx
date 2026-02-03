import React from "react";
import { FaBriefcase, FaClipboardCheck, FaShieldAlt } from "react-icons/fa";

const Features: React.FC = () => {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="bg-gray-900 py-20 sm:py-28"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase text-blue-400">
            YouTube Team Collaboration Features
          </span>
          <h2
            id="features-heading"
            className="mt-2 text-3xl font-bold md:text-4xl"
          >
            Secure YouTube Channel Management
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Without Sharing Passwords
            </span>
          </h2>
        </div>
        <div className="mt-20 space-y-20 md:mt-28 md:space-y-28">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-5">
            <div className="text-center md:col-span-2 md:text-left">
              <h3 className="text-6xl font-extrabold text-blue-300">SECURE.</h3>
              <h4 className="text-5xl font-bold text-gray-400">ROLE-BASED.</h4>
              <h5 className="text-4xl font-medium text-gray-600">ACCESS.</h5>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-blue-400">
                  <FaShieldAlt className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-bold">
                    Stop Sharing Your Password, Period.
                  </h3>
                  <p className="text-lg text-gray-300">
                    This is the core of your security. Instead of giving out
                    your main YouTube password, assign granular roles like
                    'Editor', 'Manager', or 'Viewer' to your team. You decide
                    *exactly* who can do what, and nothing more.
                  </p>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-5">
            <div className="md:order-last md:col-span-3">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-green-400">
                  <FaClipboardCheck className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-bold">
                    Your Video, Your Final Say.
                  </h3>
                  <p className="text-lg text-gray-300">
                    Your editor uploads a video. You get a notification. You
                    review the title, thumbnail, and video right on our
                    platform. Only when you click **'Approve'** does it
                    *actually* get published. No mistakes, no stress.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center md:col-span-2 md:text-right">
              <h3 className="text-6xl font-extrabold text-green-300">
                UPLOAD.
              </h3>
              <h4 className="text-5xl font-bold text-gray-400">REVIEW.</h4>
              <h5 className="text-4xl font-medium text-gray-600">APPROVE.</h5>
            </div>
          </div>{" "}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-5">
            <div className="text-center md:col-span-2 md:text-left">
              <h3 className="text-6xl font-extrabold text-purple-300">ONE</h3>
              <h4 className="text-5xl font-bold text-gray-400">DASHBOARD.</h4>
              <h5 className="text-4xl font-medium text-gray-600">
                ALL CHANNELS.
              </h5>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-purple-400">
                  <FaBriefcase className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-bold">
                    Conquer Your Content Empire
                  </h3>
                  <p className="text-lg text-gray-300">
                    Running a main channel, a vlog, and a podcast? No problem.
                    Create a separate, secure workspace for each. Every
                    workspace has its own team, its own permissions, and its own
                    upload queue.
                  </p>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
    </section>
  );
};

export default Features;
