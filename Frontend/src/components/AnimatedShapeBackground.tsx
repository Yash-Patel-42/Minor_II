import { createTimer, random } from 'animejs';
import { useEffect, useMemo, useRef, type PropsWithChildren } from 'react';
import type { IShapeState } from '../types/RandomShapeType';

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
const generateRandomShape = (index: number, minSize: number, maxSize: number) => {
  const size = Math.random() * (maxSize - minSize) + minSize;
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
type Props = PropsWithChildren<{
  className?: string;
  minSize?: number;
  maxSize?: number;
  minCount?: number;
  maxCount?: number;
}>;
export const AnimatedShapeBackground: React.FC<Props> = ({
  children,
  className,
  minSize = 80,
  maxSize = 200,
  minCount = 20,
  maxCount = 30,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapes = useMemo(() => {
    const numShapes = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    return Array.from({ length: numShapes }).map((_, i) =>
      generateRandomShape(i, minSize, maxSize)
    );
  }, [minSize, maxSize, minCount, maxCount]);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const $shapes = container.querySelectorAll('.hero-shape');
    const shapesState: IShapeState[] = [];
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
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className || ''}`}>
      {shapes}
      {children}
    </div>
  );
};
export default AnimatedShapeBackground;
