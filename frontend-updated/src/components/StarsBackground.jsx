import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";


function generateBoxShadow(count, spread) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * spread);
    const y = Math.floor(Math.random() * spread);
    shadows.push(`${x}px ${y}px #FFF`);
  }
  return shadows.join(", ");
}

function useStarLayer(count, spread) {

  const shadow = useRef(generateBoxShadow(count, spread));
  return shadow.current;
}

export default function StarsBackground({
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = "#fff",
  pointerEvents = true,
  className = "",
  children,
  ...props
}) {
  const containerRef = useRef(null);

  // Raw mouse position (updated instantly on mousemove)...
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);

  const smallX = useTransform(springX, (v) => v * factor * 0.5);
  const smallY = useTransform(springY, (v) => v * factor * 0.5);
  const mediumX = useTransform(springX, (v) => v * factor);
  const mediumY = useTransform(springY, (v) => v * factor);
  const largeX = useTransform(springX, (v) => v * factor * 1.5);
  const largeY = useTransform(springY, (v) => v * factor * 1.5);

  useEffect(() => {
    function handleMouseMove(e) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const smallStars = useStarLayer(700, 2000);
  const mediumStars = useStarLayer(200, 2000);
  const largeStars = useStarLayer(100, 2000);

  const smallDuration = `${speed * 3}s`;
  const mediumDuration = `${speed * 2}s`;
  const largeDuration = `${speed}s`;

  return (
    <div
      ref={containerRef}
      className={`stars-background ${className}`}
      style={{
        "--star-color": starColor,
        pointerEvents: pointerEvents ? "auto" : "none",
      }}
      {...props}
    >
      <motion.div className="stars-parallax" style={{ x: smallX, y: smallY }}>
        <div
          className="stars-layer stars-layer--small"
          style={{ "--star-shadow": smallStars, animationDuration: smallDuration }}
        />
      </motion.div>
      <motion.div className="stars-parallax" style={{ x: mediumX, y: mediumY }}>
        <div
          className="stars-layer stars-layer--medium"
          style={{ "--star-shadow": mediumStars, animationDuration: mediumDuration }}
        />
      </motion.div>
      <motion.div className="stars-parallax" style={{ x: largeX, y: largeY }}>
        <div
          className="stars-layer stars-layer--large"
          style={{ "--star-shadow": largeStars, animationDuration: largeDuration }}
        />
      </motion.div>
      {children}
    </div>
  );
}

export { generateBoxShadow };
