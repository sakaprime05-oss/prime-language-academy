"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const particles = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  size: seededRandom(i + 1) * 4 + 1,
  x: seededRandom(i + 101) * 100,
  y: seededRandom(i + 201) * 100,
  duration: seededRandom(i + 301) * 20 + 10,
  delay: seededRandom(i + 401) * -20,
}));

export function ParticlesBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
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
