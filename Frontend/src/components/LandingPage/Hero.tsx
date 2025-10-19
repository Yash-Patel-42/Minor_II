import type React from 'react';
import AnimatedShapeBackground from '../AnimatedShapeBackground';

const Hero: React.FC = () => {
  return (
    <AnimatedShapeBackground className="flex min-h-[91vh] w-full items-center justify-center overflow-hidden bg-gray-900 py-5">
      <div className="relative z-30 container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span className="font-mono text-sm tracking-widest text-cyan-400 uppercase shadow-cyan-400/50 [text-shadow:_0_0_8px_var(--tw-shadow-color)]">
          // AI-POWERED UPLOAD PROTOCOL: ENGAGED //
        </span>
        <h1 className="mt-6 text-5xl font-extrabold text-white sm:text-7xl lg:text-8xl">
          Empower Your
          <span className="ml-4 font-serif text-purple-400 italic">Editor</span>
          ,
          <br />
          Secure Your
          <span className="ml-4 font-serif text-cyan-400 italic">Empire</span>.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-200">
          The AI-powered approval gate that lets your team submit videos.
          <br />
          <span className="font-bold text-white">You just say yes or no.</span>
        </p>
        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/register"
            className="rounded-lg bg-purple-600 px-6 py-3 text-lg font-bold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/50"
          >
            Join Private Beta
          </a>
          <a
            href="#how-it-works"
            className="rounded-lg border border-gray-700 bg-gray-900/50 px-6 py-3 text-lg font-bold text-white backdrop-blur-md transition-colors hover:bg-gray-800"
          >
            Learn More
          </a>
        </div>
      </div>
    </AnimatedShapeBackground>
  );
};
export default Hero;
