"use client";

import { useEffect, useRef, useState } from "react";

export function OwlMascot({ size = 100, className = "" }: { size?: number, className?: string }) {
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
        setTimeout(() => { setBlink(false); cycle(); }, 120);
      }, 2000 + Math.random() * 4000);
    };
    cycle();
    return () => clearTimeout(t);
  }, []);

  // Gentle float
  useEffect(() => {
    let frame: number;
    let tick = 0;
    const loop = () => {
      tick += 0.03;
      setBob(Math.sin(tick) * 4);
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
      className={className}
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 8888,
        transform: `translateY(${bob}px)`,
        pointerEvents: "none",
        userSelect: "none",
        filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.5))",
      }}
    >
      <svg
        width={100 * S}
        height={110 * S}
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2A2A" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E7162A" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#E7162A" stopOpacity="0.02" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── EAR TUFTS ── */}
        <path d="M25 25 L10 5 L35 20 Z" fill="#1A1A1A" stroke="#E7162A" strokeWidth="1" strokeLinejoin="round" />
        <path d="M75 25 L90 5 L65 20 Z" fill="#1A1A1A" stroke="#E7162A" strokeWidth="1" strokeLinejoin="round" />

        {/* ── MAIN BODY ── */}
        <path d="M50 20 C20 20 10 40 10 70 C10 100 25 105 50 105 C75 105 90 100 90 70 C90 40 80 20 50 20Z" fill="url(#bodyGrad)" stroke="#E7162A" strokeWidth="1.5" />

        {/* ── FACE HEART SHAPE ── */}
        <path d="M50 35 C35 35 25 45 25 60 C25 75 40 85 50 88 C60 85 75 75 75 60 C75 45 65 35 50 35Z" fill="url(#faceGrad)" />

        {/* ── EYES ── */}
        {/* Left Eye */}
        <circle cx="38" cy="58" r="14" fill="#1A1A1A" stroke="#E7162A" strokeWidth="0.5" />
        <circle cx="38" cy="58" r="10" fill="white" opacity="0.05" />
        {blink ? (
            <path d="M28 58 Q38 52 48 58" stroke="#E7162A" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
            <>
                <circle cx={38 + px} cy={58 + py} r="6" fill="#E7162A" filter="url(#glow)" />
                <circle cx={38 + px} cy={58 + py} r="3" fill="black" />
                <circle cx={36 + px} cy={56 + py} r="1.5" fill="white" opacity="0.8" />
            </>
        )}

        {/* Right Eye */}
        <circle cx="62" cy="58" r="14" fill="#1A1A1A" stroke="#E7162A" strokeWidth="0.5" />
        <circle cx="62" cy="58" r="10" fill="white" opacity="0.05" />
        {blink ? (
            <path d="M52 58 Q62 52 72 58" stroke="#E7162A" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
            <>
                <circle cx={62 + px} cy={58 + py} r="6" fill="#E7162A" filter="url(#glow)" />
                <circle cx={62 + px} cy={58 + py} r="3" fill="black" />
                <circle cx={60 + px} cy={56 + py} r="1.5" fill="white" opacity="0.8" />
            </>
        )}

        {/* ── BEAK ── */}
        <path d="M46 72 L50 82 L54 72 Z" fill="#E7162A" />
        <path d="M46 72 Q50 70 54 72" stroke="#B30012" strokeWidth="0.5" fill="none" />

        {/* ── WINGS (Subtle) ── */}
        <path d="M10 65 Q5 75 10 85" stroke="#E7162A" strokeWidth="1" strokeOpacity="0.3" fill="none" />
        <path d="M90 65 Q95 75 90 85" stroke="#E7162A" strokeWidth="1" strokeOpacity="0.3" fill="none" />

        {/* ── FEET ── */}
        <path d="M35 105 Q35 110 40 110" stroke="#E7162A" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 105 Q65 110 60 110" stroke="#E7162A" strokeWidth="2" strokeLinecap="round" />
        
      </svg>
    </div>
  );
}

