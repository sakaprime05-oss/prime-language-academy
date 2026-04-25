"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ParticlesBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate 40 random particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1, // 1px to 5px
    x: Math.random() * 100, // 0 to 100vw
    y: Math.random() * 100, // 0 to 100vh
    duration: Math.random() * 20 + 10, // 10s to 30s
    delay: Math.random() * -20 // start at different points in the animation
  }));

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            width: p.size,
            height: p.size,
            left: \`\${p.x}%\`,
            top: \`\${p.y}%\`,
          }}
          animate={{
            y: [0, -100, -200, -300],
            opacity: [0, 0.4, 0.4, 0],
            x: p.x % 2 === 0 ? [0, 30, -30, 0] : [0, -30, 30, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
