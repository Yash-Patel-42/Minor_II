import { createTimer, random } from 'animejs';
import React, { useEffect, useMemo, useRef } from 'react';
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
      className={`hero-shape absolute ${shapeColors[Math.floor(Math.random() * shapeColors.length)]}`}
      data-opacity={opacity}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        opacity: opacity,
        zIndex: zIndex,
        filter: `blur(${blur}px)`,
        ...shapeStyle,
      }}
      aria-hidden="true"
    />
  );
};
interface ShapeState {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}
const Hero: React.FC = () => {
  const heroContainerRef = useRef<HTMLDivElement>(null);

  const shapes = useMemo(() => {
    const numShapes = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
    return Array.from({ length: numShapes }).map((_, i) => generateRandomShape(i));
  }, []);

  useEffect(() => {
    if (!heroContainerRef.current) return;
    const container = heroContainerRef.current;
    const $shapes = container.querySelectorAll('.hero-shape');
    const shapesState: ShapeState[] = [];
    let timer: { revert: () => void };
    const animationFrameId = requestAnimationFrame(() => {
      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
      $shapes.forEach((shapeEl) => {
        if (shapeEl instanceof HTMLElement) {
          const initialX = shapeEl.offsetLeft;
          const initialY = shapeEl.offsetTop;
          const { width, height } = shapeEl.getBoundingClientRect();

          const vx = random(0.2, 0.5) * (random(0, 1) > 0.5 ? 1 : -1);
          const vy = random(0.2, 0.5) * (random(0, 1) > 0.5 ? 1 : -1);

          shapeEl.style.top = '0px';
          shapeEl.style.left = '0px';
          shapeEl.style.transform = `translateX(${initialX}px) translateY(${initialY}px)`;

          shapesState.push({
            el: shapeEl,
            x: initialX,
            y: initialY,
            vx: vx,
            vy: vy,
            width: width,
            height: height,
          });
        }
      });
      const movementLoop = () => {
        shapesState.forEach((shape) => {
          shape.x += shape.vx;
          shape.y += shape.vy;
          if (shape.x + shape.width > containerWidth || shape.x < 0) {
            shape.vx *= -1;
          }
          if (shape.y + shape.height > containerHeight || shape.y < 0) {
            shape.vy *= -1;
          }
          shape.el.style.transform = `translateX(${shape.x}px) translateY(${shape.y}px)`;
        });
      };
      timer = createTimer({
        onUpdate: movementLoop,
        loop: true,
        autoplay: true,
      });
    });
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timer) {
        timer.revert();
      }
    };
  }, []);

  return (
    <div
      ref={heroContainerRef}
      className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-gray-900 py-20 md:py-32"
    >
      {shapes}{' '}
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
