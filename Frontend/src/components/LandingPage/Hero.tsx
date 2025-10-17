// import React, { useMemo } from 'react';

// // Define a palette of colors and clip-path values
// const shapeColors = ['bg-blue-600', 'bg-purple-600', 'bg-green-500', 'bg-indigo-500', 'bg-red-500'];
// const clipPaths = [
//   'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // Hexagon
//   'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)', // Star-like
//   'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)', // Spiky Star
//   'polygon(0% 0%, 100% 0%, 100% 100%)', // Triangle
//   'circle(50% at 50% 50%)', // Circle
//   'ellipse(50% 40% at 50% 50%)', // Ellipse
//   'polygon(0 0, 100% 0, 75% 100%, 25% 100%)', // Trapezoid
// ];

// const generateRandomShape = (index: number) => {
//   const size = Math.random() * (200 - 80) + 80; // Size between 80px and 200px
//   const top = Math.random() * 100; // 0-100%
//   const left = Math.random() * 100; // 0-100%
//   const rotation = Math.random() * 360; // 0-360 degrees
//   const skew = Math.random() * 30 - 15; // -15 to 15 degrees
//   const opacity = Math.random() * (0.4 - 0.1) + 0.1; // 0.1 to 0.4
//   const blur = Math.random() * 20 + 5; // 5px to 25px blur
//   const zIndex = Math.floor(Math.random() * 4) * 10 - 10; // -10, 0, 10, 20 (content will be z-30)

//   const isPolygon = Math.random() > 0.5; // Randomly choose between a clip-path or rounded shape
//   const shapeStyle = isPolygon
//     ? { clipPath: clipPaths[Math.floor(Math.random() * clipPaths.length)] }
//     : {
//         borderRadius: `${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% / ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}%`,
//       }; // Blobby shapes

//   return (
//     <div
//       key={index}
//       className={`absolute ${shapeColors[Math.floor(Math.random() * shapeColors.length)]} filter blur-[${blur}px]`}
//       style={{
//         width: `${size}px`,
//         height: `${size}px`,
//         top: `${top}%`,
//         left: `${left}%`,
//         opacity: opacity,
//         zIndex: zIndex,
//         transform: `translate(-50%, -50%) rotate(${rotation}deg) skew(${skew}deg, ${skew / 2}deg)`,
//         ...shapeStyle,
//       }}
//       aria-hidden="true"
//     />
//   );
// };

// const Hero: React.FC = () => {
//   // Generate shapes only once using useMemo for performance
//   const shapes = useMemo(() => {
//     const numShapes = Math.floor(Math.random() * (40 - 20 + 1)) + 20; // 20 to 30 shapes
//     return Array.from({ length: numShapes }).map((_, i) => generateRandomShape(i));
//   }, []);

//   return (
//     <div className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-gray-900 py-20 md:py-32">
//       {/* === THE CHAOS: Render all generated shapes === */}
//       {shapes}

//       {/* === THE CONTENT: Clear & Bold === */}
//       <div className="relative z-30 container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
//         <span className="font-semibold tracking-wider text-blue-400 uppercase">
//           The YouTube Control Panel
//         </span>

//         <h1 className="mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
//           Your Channel.
//           <br />
//           Your Rules.
//         </h1>

//         <p className="mx-auto mt-6 max-w-2xl text-2xl text-gray-200">
//           Never share your YouTube password again.
//         </p>

//         <p className="mx-auto mt-4 max-w-lg text-lg text-gray-300">
//           Manage your team, streamline uploads, and approve every video—all from one secure
//           platform.
//         </p>

//         <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
//           <a
//             href="/register"
//             className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/50"
//           >
//             Join Private Beta
//           </a>
//           <a
//             href="#how-it-works"
//             className="rounded-lg border border-gray-700 bg-gray-900/50 px-6 py-3 text-lg font-bold text-white backdrop-blur-md transition-colors hover:bg-gray-800"
//           >
//             Learn More
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

// src/components/Hero.tsx
import anime from "animejs/lib/anime.es.js"; // Import anime.js
import React, { useEffect, useMemo } from 'react';

// Define a palette of colors and clip-path values (same as before)
const shapeColors = ['bg-blue-600', 'bg-purple-600', 'bg-green-500', 'bg-indigo-500', 'bg-red-500'];
const clipPaths = [
  'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', // Hexagon
  'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)', // Star-like
  'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)', // Spiky Star
  'polygon(0% 0%, 100% 0%, 100% 100%)', // Triangle
  'circle(50% at 50% 50%)', // Circle
  'ellipse(50% 40% at 50% 50%)', // Ellipse
  'polygon(0 0, 100% 0, 75% 100%, 25% 100%)', // Trapezoid
];

const generateRandomShape = (index: number) => {
  const size = Math.random() * (200 - 80) + 80;
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const opacity = Math.random() * (0.4 - 0.1) + 0.1;
  const blur = Math.random() * 20 + 5;
  const zIndex = Math.floor(Math.random() * 4) * 10 - 10;

  const isPolygon = Math.random() > 0.5;
  const shapeStyle = isPolygon
    ? { clipPath: clipPaths[Math.floor(Math.random() * clipPaths.length)] }
    : {
        borderRadius: `${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% / ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}%`,
      };

  return (
    <div
      key={index}
      // Add the 'hero-shape' class here for anime.js to target
      className={`hero-shape absolute ${shapeColors[Math.floor(Math.random() * shapeColors.length)]} filter blur-[${blur}px]`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        opacity: opacity,
        zIndex: zIndex,
        // We remove transform from here. Anime.js will set it.
        ...shapeStyle,
      }}
      aria-hidden="true"
    />
  );
};

const Hero: React.FC = () => {
  // Generate shapes only once (same as before)
  const shapes = useMemo(() => {
    const numShapes = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
    return Array.from({ length: numShapes }).map((_, i) => generateRandomShape(i));
  }, []);

  // === NEW: useEffect for Animation ===
  useEffect(() => {
    // Only run if shapes have been generated
    if (shapes.length === 0) return;

    // This is where the magic happens
    anime({
      targets: '.hero-shape', // Target all shapes

      // Animate translation (X and Y) using keyframes for a random path
      translateX: [
        { value: () => anime.random(-100, 100), duration: 10000 },
        { value: () => anime.random(-100, 100), duration: 10000 },
        { value: () => anime.random(-100, 100), duration: 10000 },
        { value: 0, duration: 10000 }, // Drift back towards original position
      ],
      translateY: [
        { value: () => anime.random(-100, 100), duration: 10000 },
        { value: () => anime.random(-100, 100), duration: 10000 },
        { value: () => anime.random(-100, 100), duration: 10000 },
        { value: 0, duration: 10000 },
      ],

      // Animate rotation and skew
      rotate: [
        { value: () => anime.random(0, 360), duration: 15000 },
        { value: () => anime.random(0, 360), duration: 15000 },
      ],
      skew: [
        { value: () => anime.random(-10, 10), duration: 15000 },
        { value: () => anime.random(-10, 10), duration: 15000 },
      ],

      // Animation properties
      loop: true, // Loop forever
      direction: 'alternate', // Go back and forth smoothly
      easing: 'easeInOutSine', // A very smooth easing
      delay: anime.stagger(200), // Stagger start time of each shape
    });
  }, [shapes]); // Run this effect when the 'shapes' array is populated

  return (
    <div className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-gray-900 py-20 md:py-32">
      {/* === THE CHAOS: Render all generated shapes === */}
      {shapes}

      {/* === THE CONTENT: Clear & Bold (same as before) === */}
      <div className="relative z-30 container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="font-semibold tracking-wider text-blue-400 uppercase">
          The YouTube Control Panel
        </span>

        <h1 className="mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
          Your Channel.
          <br />
          Your Rules.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-2xl text-gray-200">
          Never share your YouTube password again.
        </p>

        <p className="mx-auto mt-4 max-w-lg text-lg text-gray-300">
          Manage your team, streamline uploads, and approve every video—all from one secure
          platform.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/50"
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
    </div>
  );
};

export default Hero;
