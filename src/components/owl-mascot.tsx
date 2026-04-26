"use client";
import { useEffect, useRef, useState } from "react";

export function OwlMascot({ size = 200 }: { size?: number }) {
  const goatRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [bobY, setBobY] = useState(0);
  const [wiggle, setWiggle] = useState(0);

  // Track mouse → move pupils
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!goatRef.current) return;
      const r = goatRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxDist = 300;
      const factor = Math.min(dist, maxDist) / maxDist;
      const maxPupil = 7;
      setPupil({
        x: (dx / dist) * maxPupil * factor,
        y: (dy / dist) * maxPupil * factor,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
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

  // Gentle float bob
  useEffect(() => {
    let frame: number;
    let tick = 0;
    const loop = () => {
      tick += 0.016;
      setBobY(Math.sin(tick) * 8);
      setWiggle(Math.sin(tick * 1.3) * 2);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const px = pupil.x;
  const py = pupil.y;
  const scale = size / 220;

  return (
    <div
      ref={goatRef}
      style={{
        display: "inline-block",
        transform: `translateY(${bobY}px)`,
        transition: "transform 0.05s linear",
        userSelect: "none",
      }}
    >
      <svg
        width={220 * scale}
        height={260 * scale}
        viewBox="0 0 220 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bodyG" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#E8E0D0" />
            <stop offset="100%" stopColor="#C8BCA8" />
          </radialGradient>
          <radialGradient id="faceG" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#F5EFE4" />
            <stop offset="100%" stopColor="#D8CCBC" />
          </radialGradient>
          <radialGradient id="irisL" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#F0C040" />
            <stop offset="40%" stopColor="#D4940A" />
            <stop offset="100%" stopColor="#8B5E00" />
          </radialGradient>
          <radialGradient id="irisR" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#F0C040" />
            <stop offset="40%" stopColor="#D4940A" />
            <stop offset="100%" stopColor="#8B5E00" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000040" />
          </filter>
          <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── SHADOW ── */}
        <ellipse cx="110" cy="254" rx="55" ry="7" fill="#000" opacity="0.15" />

        {/* ── BODY ── */}
        <ellipse cx="110" cy="185" rx="52" ry="60" fill="url(#bodyG)" filter="url(#softShadow)" />

        {/* Body shading */}
        <ellipse cx="110" cy="195" rx="35" ry="42" fill="#F5EFE4" opacity="0.5" />

        {/* ── LEGS ── */}
        {/* Front legs */}
        <rect x="80" y="228" width="14" height="28" rx="7" fill="#C8BCA8" />
        <rect x="126" y="228" width="14" height="28" rx="7" fill="#C8BCA8" />
        {/* Hooves */}
        <rect x="79" y="248" width="16" height="10" rx="5" fill="#3A3028" />
        <rect x="125" y="248" width="16" height="10" rx="5" fill="#3A3028" />

        {/* ── NECK ── */}
        <path d="M90 148 Q88 128 95 118 Q110 108 125 118 Q132 128 130 148Z" fill="url(#faceG)" />

        {/* ── HEAD ── */}
        {/* Main head */}
        <ellipse cx="110" cy="95" rx="50" ry="46" fill="url(#faceG)" filter="url(#softShadow)" />

        {/* ── HORNS ── */}
        {/* Left horn */}
        <path
          d="M80 58 Q68 30 62 14 Q72 20 78 38 Q82 48 83 56Z"
          fill="#D4AF37"
          style={{ transform: `rotate(${wiggle * 0.5}deg)`, transformOrigin: "80px 58px" }}
        />
        <path d="M79 55 Q70 32 66 18" stroke="#A08828" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right horn */}
        <path
          d="M140 58 Q152 30 158 14 Q148 20 142 38 Q138 48 137 56Z"
          fill="#D4AF37"
          style={{ transform: `rotate(${-wiggle * 0.5}deg)`, transformOrigin: "140px 58px" }}
        />
        <path d="M141 55 Q150 32 154 18" stroke="#A08828" strokeWidth="1.5" strokeLinecap="round" />

        {/* ── EARS ── */}
        {/* Left ear — floppy */}
        <path
          d="M64 80 Q40 72 36 90 Q38 108 60 100 Q68 95 68 86Z"
          fill="#D8CCBC"
          style={{ transform: `rotate(${wiggle}deg)`, transformOrigin: "64px 85px" }}
        />
        <path d="M62 82 Q44 76 41 90 Q43 104 58 98" fill="#E8C4B8" opacity="0.7" />
        {/* Right ear — floppy */}
        <path
          d="M156 80 Q180 72 184 90 Q182 108 160 100 Q152 95 152 86Z"
          fill="#D8CCBC"
          style={{ transform: `rotate(${-wiggle}deg)`, transformOrigin: "156px 85px" }}
        />
        <path d="M158 82 Q176 76 179 90 Q177 104 162 98" fill="#E8C4B8" opacity="0.7" />

        {/* ── FACE MARKINGS ── */}
        <ellipse cx="110" cy="105" rx="28" ry="22" fill="#F5EFE4" opacity="0.6" />

        {/* ── LEFT EYE (BIG) ── */}
        {/* Outer glow ring */}
        <circle cx="84" cy="85" r="24" fill="#D4AF37" opacity="0.1" filter="url(#eyeGlow)" />
        {/* White sclera */}
        <ellipse cx="84" cy="85" rx="20" ry="19" fill="white" />
        {/* Iris */}
        <ellipse cx="84" cy="85" rx="16" ry="15" fill="url(#irisL)" />
        {/* Iris detail ring */}
        <ellipse cx="84" cy="85" rx="12" ry="11" fill="#B87800" opacity="0.4" />
        {/* Rectangular goat pupil */}
        {blink ? (
          <ellipse cx="84" cy="85" rx="18" ry="2" fill="#1A0A00" />
        ) : (
          <rect
            x={84 + px - 4}
            y={85 + py - 8}
            width="8"
            height="16"
            rx="3"
            fill="#1A0A00"
          />
        )}
        {/* Highlights */}
        {!blink && (
          <>
            <circle cx={79 + px * 0.4} cy={80 + py * 0.4} r="3.5" fill="white" opacity="0.95" />
            <circle cx={86 + px * 0.25} cy={89 + py * 0.25} r="1.5" fill="white" opacity="0.55" />
          </>
        )}
        {/* Eye border */}
        <ellipse cx="84" cy="85" rx="20" ry="19" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.4" />

        {/* ── RIGHT EYE (BIG) ── */}
        <circle cx="136" cy="85" r="24" fill="#D4AF37" opacity="0.1" filter="url(#eyeGlow)" />
        <ellipse cx="136" cy="85" rx="20" ry="19" fill="white" />
        <ellipse cx="136" cy="85" rx="16" ry="15" fill="url(#irisR)" />
        <ellipse cx="136" cy="85" rx="12" ry="11" fill="#B87800" opacity="0.4" />
        {blink ? (
          <ellipse cx="136" cy="85" rx="18" ry="2" fill="#1A0A00" />
        ) : (
          <rect
            x={136 + px - 4}
            y={85 + py - 8}
            width="8"
            height="16"
            rx="3"
            fill="#1A0A00"
          />
        )}
        {!blink && (
          <>
            <circle cx={131 + px * 0.4} cy={80 + py * 0.4} r="3.5" fill="white" opacity="0.95" />
            <circle cx={138 + px * 0.25} cy={89 + py * 0.25} r="1.5" fill="white" opacity="0.55" />
          </>
        )}
        <ellipse cx="136" cy="85" rx="20" ry="19" fill="none" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.4" />

        {/* ── NOSE ── */}
        <ellipse cx="110" cy="115" rx="12" ry="9" fill="#D4A8A0" />
        <ellipse cx="110" cy="115" rx="9" ry="6" fill="#C89090" opacity="0.6" />
        {/* Nostrils */}
        <ellipse cx="106" cy="116" rx="2.5" ry="2" fill="#8B5050" />
        <ellipse cx="114" cy="116" rx="2.5" ry="2" fill="#8B5050" />

        {/* ── MOUTH ── */}
        <path d="M103 124 Q110 130 117 124" stroke="#A07070" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* ── BEARD ── */}
        <path
          d="M102 130 Q106 148 110 152 Q114 148 118 130"
          fill="#C8BCA8"
          style={{ transform: `rotate(${wiggle * 0.8}deg)`, transformOrigin: "110px 135px" }}
        />
        <path
          d="M105 132 Q108 146 110 149 Q112 146 115 132"
          fill="#D8CCBC"
          opacity="0.7"
          style={{ transform: `rotate(${wiggle * 0.8}deg)`, transformOrigin: "110px 135px" }}
        />

        {/* ── GOLD ACCENT COLLAR ── */}
        <path d="M80 155 Q110 162 140 155" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M80 158 Q110 165 140 158" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.25" />
        {/* Collar gem */}
        <polygon points="110,158 106,164 110,170 114,164" fill="#D4AF37" opacity="0.8" />

        {/* ── TAIL ── */}
        <path
          d="M158 168 Q172 158 175 168 Q172 178 160 175Z"
          fill="#D8CCBC"
          style={{ transform: `rotate(${wiggle * 2}deg)`, transformOrigin: "162px 168px" }}
        />
      </svg>

      {/* Sparkles */}
      <div style={{ position: "absolute", top: -6, right: -8, width: 7, height: 7, borderRadius: "50%", background: "#D4AF37", opacity: 0.7, animation: "goatPing 3s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: 30, left: -10, width: 5, height: 5, borderRadius: "50%", background: "#D4AF37", opacity: 0.4, animation: "goatPing 2.8s ease-in-out 1.4s infinite" }} />
      <div style={{ position: "absolute", bottom: 30, right: -6, width: 4, height: 4, borderRadius: "50%", background: "#F0D060", opacity: 0.5, animation: "goatPing 3.5s ease-in-out 0.7s infinite" }} />

      <style>{`
        @keyframes goatPing {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
