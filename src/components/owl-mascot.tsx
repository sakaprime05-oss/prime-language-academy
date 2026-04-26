"use client";

import { useEffect, useRef, useState } from "react";

export function OwlMascot({ size = 100 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [bob, setBob] = useState(0);

  // Eye tracking
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = Math.min(d, 500) / 500;
      setPupil({ x: (dx / d) * 6 * f, y: (dy / d) * 6 * f });
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Random blink
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const cycle = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); cycle(); }, 110);
      }, 1800 + Math.random() * 3500);
    };
    cycle();
    return () => clearTimeout(t);
  }, []);

  // Gentle float
  useEffect(() => {
    let frame: number;
    let tick = 0;
    const loop = () => {
      tick += 0.02;
      setBob(Math.sin(tick) * 5);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const S = size / 100;
  const px = pupil.x;
  const py = pupil.y;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 8888,
        transform: `translateY(${bob}px)`,
        pointerEvents: "none",
        userSelect: "none",
        filter: "drop-shadow(0 8px 20px rgba(212,175,55,0.3))",
      }}
    >
      <svg
        width={100 * S}
        height={108 * S}
        viewBox="0 0 100 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="hf" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E0A060" />
            <stop offset="60%" stopColor="#C07838" />
            <stop offset="100%" stopColor="#8B5020" />
          </radialGradient>
          <radialGradient id="hi" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFD040" />
            <stop offset="50%" stopColor="#C89010" />
            <stop offset="100%" stopColor="#7A5200" />
          </radialGradient>
          <radialGradient id="hn" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#D49070" />
            <stop offset="100%" stopColor="#A06040" />
          </radialGradient>
          <filter id="hs">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#00000040" />
          </filter>
          <filter id="hg">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Horns */}
        <path d="M32 26 Q26 10 22 2 Q30 6 34 18 Q36 24 34 28Z" fill="#EEE4C0"/>
        <path d="M24 4 Q22 0 22 -2" stroke="#D4C8A0" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M68 26 Q74 10 78 2 Q70 6 66 18 Q64 24 66 28Z" fill="#EEE4C0"/>
        <path d="M76 4 Q78 0 78 -2" stroke="#D4C8A0" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Ears */}
        <path d="M18 42 Q6 34 4 44 Q4 56 18 52 Q24 48 22 42Z" fill="#C07838"/>
        <path d="M18 43 Q8 37 6 44 Q6 53 18 50" fill="#E8A870" opacity="0.5"/>
        <path d="M82 42 Q94 34 96 44 Q96 56 82 52 Q76 48 78 42Z" fill="#C07838"/>
        <path d="M82 43 Q92 37 94 44 Q94 53 82 50" fill="#E8A870" opacity="0.5"/>

        {/* Head */}
        <ellipse cx="50" cy="54" rx="42" ry="40" fill="url(#hf)" filter="url(#hs)"/>

        {/* Face highlight */}
        <ellipse cx="42" cy="40" rx="20" ry="12" fill="#E8B870" opacity="0.28"/>

        {/* Muzzle */}
        <ellipse cx="50" cy="72" rx="18" ry="14" fill="url(#hn)" opacity="0.85"/>
        <ellipse cx="50" cy="74" rx="12" ry="9" fill="#D4A080" opacity="0.5"/>

        {/* Nostrils */}
        <ellipse cx="45" cy="74" rx="3" ry="2.5" fill="#7A3820"/>
        <ellipse cx="55" cy="74" rx="3" ry="2.5" fill="#7A3820"/>

        {/* Smug mouth */}
        <path d="M43 84 Q50 89 57 84" stroke="#9A6040" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

        {/* Beard */}
        <path d="M42 88 Q46 100 50 104 Q54 100 58 88" fill="#C07838" opacity="0.9"/>
        <path d="M44 90 Q48 100 50 103 Q52 100 56 90" fill="#D4904A" opacity="0.5"/>

        {/* Smug eyebrow (left — visible side) */}
        <path d="M24 36 Q32 31 40 33" stroke="#7A4818" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <path d="M60 33 Q68 31 76 36" stroke="#7A4818" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

        {/* ── LEFT EYE ── */}
        <ellipse cx="32" cy="46" rx="13" ry="13" fill="white" filter="url(#hg)"/>
        <ellipse cx="32" cy="46" rx="11" ry="11" fill="url(#hi)"/>
        <ellipse cx="32" cy="46" rx="7.5" ry="7.5" fill="#8B6000" opacity="0.35"/>
        {blink
          ? <path d="M20 46 Q26 40 32 46 Q38 40 44 46" stroke="#5A3000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          : <circle cx={32 + px} cy={46 + py} r="4.5" fill="#120600"/>
        }
        {!blink && <>
          <circle cx={28.5 + px * 0.5} cy={42.5 + py * 0.5} r="2.2" fill="white" opacity="0.95"/>
          <circle cx={34 + px * 0.3} cy={49 + py * 0.3} r="1" fill="white" opacity="0.5"/>
        </>}
        <ellipse cx="32" cy="46" rx="13" ry="13" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.4"/>

        {/* ── RIGHT EYE ── */}
        <ellipse cx="68" cy="46" rx="13" ry="13" fill="white" filter="url(#hg)"/>
        <ellipse cx="68" cy="46" rx="11" ry="11" fill="url(#hi)"/>
        <ellipse cx="68" cy="46" rx="7.5" ry="7.5" fill="#8B6000" opacity="0.35"/>
        {blink
          ? <path d="M56 46 Q62 40 68 46 Q74 40 80 46" stroke="#5A3000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          : <circle cx={68 + px} cy={46 + py} r="4.5" fill="#120600"/>
        }
        {!blink && <>
          <circle cx={64.5 + px * 0.5} cy={42.5 + py * 0.5} r="2.2" fill="white" opacity="0.95"/>
          <circle cx={70 + px * 0.3} cy={49 + py * 0.3} r="1" fill="white" opacity="0.5"/>
        </>}
        <ellipse cx="68" cy="46" rx="13" ry="13" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.4"/>

        {/* Gold ring around neck base */}
        <path d="M14 80 Q50 90 86 80" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      </svg>
    </div>
  );
}
