import React from "react";
import { FaGoogle, FaShieldAlt, FaYoutube } from "react-icons/fa";

const AboutTubix: React.FC = () => {
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-20"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* What is Tubix */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            What is{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Tubix
            </span>
            ?
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
            <strong className="text-white">Tubix</strong> is an AI-powered
            YouTube content management platform that enables teams to
            collaborate on video uploads with secure approval workflows. We
            solve the critical problem of giving your video editors YouTube
            access without sharing your channel password.
          </p>
        </div>

        {/* Why Google Sign-In */}
        <div className="mb-16 grid gap-12 md:grid-cols-2">
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 backdrop-blur-sm transition-all hover:border-purple-500/50">
            <div className="mb-4 flex items-center gap-3">
              <FaGoogle className="h-8 w-8 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">
                Why Google Sign-In?
              </h3>
            </div>
            <p className="leading-relaxed text-gray-300">
              Tubix uses Google OAuth to securely connect to your YouTube
              channel. This industry-standard authentication ensures that:
            </p>
            <ul className="mt-4 space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <FaShieldAlt className="mt-1 h-4 w-4 flex-shrink-0 text-green-400" />
                <span>
                  Your password is <strong>never</strong> shared with anyone
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaShieldAlt className="mt-1 h-4 w-4 flex-shrink-0 text-green-400" />
                <span>
                  You can revoke access anytime from your Google account
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FaShieldAlt className="mt-1 h-4 w-4 flex-shrink-0 text-green-400" />
                <span>All connections are encrypted and secure</span>
              </li>
            </ul>
          </div>

          {/* What Data We Access */}
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 backdrop-blur-sm transition-all hover:border-cyan-500/50">
            <div className="mb-4 flex items-center gap-3">
              <FaYoutube className="h-8 w-8 text-red-500" />
              <h3 className="text-2xl font-bold text-white">
                What Data We Access
              </h3>
            </div>
            <p className="leading-relaxed text-gray-300">
              Tubix only requests the minimal permissions needed to function:
            </p>
            <ul className="mt-4 space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>
                  <strong>Upload videos</strong> to your YouTube channel
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>
                  <strong>View channel information</strong> (name, subscriber
                  count)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>
                  <strong>Manage video metadata</strong> (titles, descriptions,
                  thumbnails)
                </span>
              </li>
              <li className="mt-4 text-sm text-gray-400">
                We <strong>never</strong> access your personal emails, contacts,
                or unrelated Google data.
              </li>
            </ul>
          </div>
        </div>

        {/* Trust & Security */}
        <div className="text-center">
          <p className="text-gray-400">
            🔒 Your data security is our top priority. We comply with Google's
            OAuth policies and never store your YouTube credentials.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutTubix;
