"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── ÉTATS DE LA MASCOTTE ──────────────────────────────────────────
type MascotState = "idle" | "walking-right" | "walking-left" | "jumping" | "sleeping";

const INACTIVITY_DELAY = 6000; // ms before sleeping
const WALK_SPEED = 0.18;       // % of viewport per scroll px
const JUMP_THRESHOLD = 300;    // px scroll delta to trigger jump

export function OwlMascot({ size = 130 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Eye tracking
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // Mascot behavior
  const [state, setState] = useState<MascotState>("idle");
  const [posX, setPosX] = useState(8); // % from left edge
  const [flipped, setFlipped] = useState(false);
  const [legPhase, setLegPhase] = useState(0); // walk cycle 0..1

  // Refs for scroll logic (avoid stale closures)
  const lastScrollY = useRef(0);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout>>();
  const walkRaf = useRef<number>();
  const stateRef = useRef<MascotState>("idle");
  const posXRef = useRef(8);
  const targetXRef = useRef(8);

  const setStateSynced = (s: MascotState) => {
    stateRef.current = s;
    setState(s);
  };

  // ── INACTIVITY → SLEEP ───────────────────────────────────────────
  const resetInactivity = useCallback(() => {
    clearTimeout(inactivityTimer.current);
    if (stateRef.current === "sleeping") {
      setStateSynced("idle");
    }
    inactivityTimer.current = setTimeout(() => {
      setStateSynced("sleeping");
    }, INACTIVITY_DELAY);
  }, []);

  // ── MOUSE → EYE TRACKING ─────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      resetInactivity();
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const factor = Math.min(dist, 350) / 350;
      setPupil({ x: (dx / dist) * 7 * factor, y: (dy / dist) * 7 * factor });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [resetInactivity]);

  // ── SCROLL → WALK / JUMP ─────────────────────────────────────────
  useEffect(() => {
    let jumpTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      resetInactivity();
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      // Determine direction
      const goingDown = delta > 0;
      setFlipped(!goingDown); // flip sprite when going up

      // Large jump = section jump animation
      if (Math.abs(delta) > JUMP_THRESHOLD) {
        setStateSynced("jumping");
        clearTimeout(jumpTimeout);
        jumpTimeout = setTimeout(() => {
          setStateSynced("idle");
        }, 700);
      } else if (stateRef.current !== "jumping") {
        setStateSynced(goingDown ? "walking-right" : "walking-left");
        clearTimeout(jumpTimeout);
        jumpTimeout = setTimeout(() => {
          setStateSynced("idle");
        }, 600);
      }

      // Move position (clamp 4%–88%)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentY / maxScroll : 0;
      const newX = 4 + progress * 84;
      targetXRef.current = newX;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    resetInactivity();
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(jumpTimeout);
    };
  }, [resetInactivity]);

  // ── SMOOTH X POSITION (lerp) ─────────────────────────────────────
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      const cur = posXRef.current;
      const target = targetXRef.current;
      const next = lerp(cur, target, 0.06);
      if (Math.abs(next - cur) > 0.01) {
        posXRef.current = next;
        setPosX(next);
      }
      walkRaf.current = requestAnimationFrame(animate);
    };
    walkRaf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(walkRaf.current!);
  }, []);

  // ── WALK LEG CYCLE ───────────────────────────────────────────────
  useEffect(() => {
    let frame: number;
    let t = 0;
    const loop = () => {
      t += 0.08;
      setLegPhase(t);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  // ── RANDOM BLINK ─────────────────────────────────────────────────
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const cycle = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); cycle(); }, 120);
      }, 2200 + Math.random() * 3500);
    };
    cycle();
    return () => clearTimeout(t);
  }, []);

  // ── COMPUTED VALUES ───────────────────────────────────────────────
  const isWalking = state === "walking-right" || state === "walking-left";
  const isSleeping = state === "sleeping";
  const isJumping = state === "jumping";

  // Leg swing angles (walk cycle)
  const legSwingFront = isWalking ? Math.sin(legPhase * Math.PI * 2) * 20 : 0;
  const legSwingBack  = isWalking ? Math.sin(legPhase * Math.PI * 2 + Math.PI) * 20 : 0;

  // Body bob (walking)
  const bodyBob = isWalking ? Math.abs(Math.sin(legPhase * Math.PI * 2)) * 4 : 0;

  // Jump Y offset
  const jumpY = isJumping ? -40 : 0;

  // Sleep lean angle
  const sleepAngle = isSleeping ? 35 : 0;

  // Eye behavior during sleep
  const eyesClosed = isSleeping;

  // Pupil (normal or sleepy)
  const px = eyesClosed ? 0 : pupil.x;
  const py = eyesClosed ? 2 : pupil.y;

  // Breathing when idle/sleeping
  const breathScale = isSleeping ? 1 : 1;

  const scale = size / 160;

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          bottom: 12,
          left: `${posX}%`,
          zIndex: 8888,
          transform: `
            translateX(-50%)
            translateY(${jumpY}px)
            rotate(${sleepAngle}deg)
            scaleX(${flipped ? -1 : 1})
          `,
          transition: isJumping
            ? "bottom 0.3s cubic-bezier(0.34,1.56,0.64,1), transform 0.2s"
            : "transform 0.3s ease, left 0.05s linear",
          transformOrigin: "bottom center",
          cursor: "default",
          userSelect: "none",
          pointerEvents: "none",
          filter: isSleeping ? "brightness(0.7) saturate(0.6)" : "none",
          transition2: "filter 0.6s ease",
        } as any}
      >
        <svg
          width={160 * scale}
          height={180 * scale}
          viewBox="0 0 160 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: `translateY(${-bodyBob}px)`,
            transition: "transform 0.06s linear",
          }}
        >
          <defs>
            <radialGradient id="mg-body" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#EEEAE0" />
              <stop offset="100%" stopColor="#C8BCAA" />
            </radialGradient>
            <radialGradient id="mg-face" cx="50%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#F5F0E6" />
              <stop offset="100%" stopColor="#DDD0BC" />
            </radialGradient>
            <radialGradient id="mg-iris" cx="38%" cy="32%" r="62%">
              <stop offset="0%" stopColor="#F8C830" />
              <stop offset="45%" stopColor="#D4940A" />
              <stop offset="100%" stopColor="#8B5E00" />
            </radialGradient>
          </defs>

          {/* ── SHADOW ── */}
          <ellipse cx="80" cy="175" rx={38 + bodyBob * 0.5} ry="5" fill="#000" opacity={isJumping ? 0.05 : 0.18} />

          {/* ── BACK LEGS ── */}
          <g transform={`rotate(${-legSwingBack} 54 142) translate(54 130)`}>
            <rect x="-6" y="0" width="12" height="30" rx="6" fill="#B8AC9A" />
            <rect x="-7" y="25" width="14" height="9" rx="4.5" fill="#2E2420" />
          </g>
          <g transform={`rotate(${legSwingBack} 106 142) translate(106 130)`}>
            <rect x="-6" y="0" width="12" height="30" rx="6" fill="#B8AC9A" />
            <rect x="-7" y="25" width="14" height="9" rx="4.5" fill="#2E2420" />
          </g>

          {/* ── BODY ── */}
          <ellipse cx="80" cy="115" rx="38" ry="44" fill="url(#mg-body)" />
          <ellipse cx="80" cy="122" rx="26" ry="32" fill="#F2EDE2" opacity="0.55" />

          {/* ── FRONT LEGS ── */}
          <g transform={`rotate(${legSwingFront} 58 115) translate(58 110)`}>
            <rect x="-5.5" y="0" width="11" height="28" rx="5.5" fill="#C8BCAA" />
            <rect x="-7" y="24" width="14" height="9" rx="4.5" fill="#2E2420" />
          </g>
          <g transform={`rotate(${-legSwingFront} 102 115) translate(102 110)`}>
            <rect x="-5.5" y="0" width="11" height="28" rx="5.5" fill="#C8BCAA" />
            <rect x="-7" y="24" width="14" height="9" rx="4.5" fill="#2E2420" />
          </g>

          {/* ── NECK ── */}
          <path d="M62 88 Q60 72 65 64 Q80 56 95 64 Q100 72 98 88Z" fill="url(#mg-face)" />

          {/* ── HEAD ── */}
          <ellipse cx="80" cy="52" rx="38" ry="36" fill="url(#mg-face)" />

          {/* ── EARS (floppy) ── */}
          <path d="M44 58 Q24 50 20 66 Q22 80 42 74 Q50 70 50 62Z" fill="#D0C4B2">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={isWalking ? `0 44 62;5 44 62;-5 44 62;0 44 62` : "0 44 62"}
              dur="0.5s"
              repeatCount={isWalking ? "indefinite" : "1"}
            />
          </path>
          <path d="M42 60 Q26 54 24 66 Q26 76 40 72" fill="#E8C0B4" opacity="0.7" />

          <path d="M116 58 Q136 50 140 66 Q138 80 118 74 Q110 70 110 62Z" fill="#D0C4B2">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={isWalking ? `0 116 62;-5 116 62;5 116 62;0 116 62` : "0 116 62"}
              dur="0.5s"
              repeatCount={isWalking ? "indefinite" : "1"}
            />
          </path>
          <path d="M118 60 Q134 54 136 66 Q134 76 120 72" fill="#E8C0B4" opacity="0.7" />

          {/* ── HORNS ── */}
          <path d="M56 28 Q46 10 40 2 Q50 8 54 22 Q57 30 57 34Z" fill="#D4AF37" />
          <path d="M104 28 Q114 10 120 2 Q110 8 106 22 Q103 30 103 34Z" fill="#D4AF37" />

          {/* ── FACE DISC ── */}
          <ellipse cx="80" cy="58" rx="28" ry="24" fill="#F8F2E8" opacity="0.45" />

          {/* ── LEFT EYE (BIG) ── */}
          <ellipse cx="62" cy="50" rx="17" ry="16" fill="white" />
          <ellipse cx="62" cy="50" rx="14" ry="13" fill="url(#mg-iris)" />
          <ellipse cx="62" cy="50" rx="10" ry="9" fill="#A07000" opacity="0.35" />
          {/* Pupil */}
          {(eyesClosed || blink) ? (
            <path d="M46 50 Q54 44 62 50 Q70 44 78 50" stroke="#5A3000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            <rect x={62 + px - 3.5} y={50 + py - 7} width="7" height="14" rx="3" fill="#1A0A00" />
          )}
          {!eyesClosed && !blink && (
            <>
              <circle cx={58 + px * 0.4} cy={46 + py * 0.4} r="3" fill="white" opacity="0.95" />
              <circle cx={64 + px * 0.25} cy={53 + py * 0.25} r="1.2" fill="white" opacity="0.5" />
            </>
          )}
          <ellipse cx="62" cy="50" rx="17" ry="16" fill="none" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.35" />

          {/* ── RIGHT EYE (BIG) ── */}
          <ellipse cx="98" cy="50" rx="17" ry="16" fill="white" />
          <ellipse cx="98" cy="50" rx="14" ry="13" fill="url(#mg-iris)" />
          <ellipse cx="98" cy="50" rx="10" ry="9" fill="#A07000" opacity="0.35" />
          {(eyesClosed || blink) ? (
            <path d="M82 50 Q90 44 98 50 Q106 44 114 50" stroke="#5A3000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            <rect x={98 + px - 3.5} y={50 + py - 7} width="7" height="14" rx="3" fill="#1A0A00" />
          )}
          {!eyesClosed && !blink && (
            <>
              <circle cx={94 + px * 0.4} cy={46 + py * 0.4} r="3" fill="white" opacity="0.95" />
              <circle cx={100 + px * 0.25} cy={53 + py * 0.25} r="1.2" fill="white" opacity="0.5" />
            </>
          )}
          <ellipse cx="98" cy="50" rx="17" ry="16" fill="none" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.35" />

          {/* ── NOSE ── */}
          <ellipse cx="80" cy="68" rx="9" ry="7" fill="#D4A8A0" />
          <ellipse cx="77" cy="69" rx="2" ry="1.8" fill="#8B5050" />
          <ellipse cx="83" cy="69" rx="2" ry="1.8" fill="#8B5050" />

          {/* ── MOUTH ── */}
          <path d={isSleeping
            ? "M74 76 Q80 72 86 76"
            : "M74 76 Q80 80 86 76"}
            stroke="#A07070" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* ── BEARD ── */}
          <path d="M74 80 Q78 95 80 98 Q82 95 86 80" fill="#C8BCA8" />

          {/* ── GOLD COLLAR ── */}
          <path d="M52 100 Q80 108 108 100" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <polygon points="80,100 76,106 80,112 84,106" fill="#D4AF37" opacity="0.85" />

          {/* ── SLEEP ZZZ ── */}
          {isSleeping && (
            <g>
              <text x="112" y="30" fontSize="14" fill="#D4AF37" opacity="0.9" fontWeight="bold" fontFamily="serif">z</text>
              <text x="122" y="18" fontSize="18" fill="#D4AF37" opacity="0.7" fontWeight="bold" fontFamily="serif">z</text>
              <text x="134" y="6"  fontSize="22" fill="#D4AF37" opacity="0.5" fontWeight="bold" fontFamily="serif">Z</text>
            </g>
          )}

          {/* ── JUMP EFFECT ── */}
          {isJumping && (
            <g>
              <ellipse cx="80" cy="170" rx="45" ry="6" fill="#D4AF37" opacity="0.08" />
              <path d="M55 155 L50 165 M65 158 L62 168 M95 158 L98 168 M105 155 L110 165" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            </g>
          )}
        </svg>

        {/* ── SPEED LINES (walking) ── */}
        {isWalking && (
          <div style={{
            position: "absolute",
            top: "35%",
            [flipped ? "right" : "left"]: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            opacity: 0.5,
          }}>
            {[28, 20, 14].map((w, i) => (
              <div key={i} style={{ width: w, height: 2, background: "#D4AF37", borderRadius: 2, opacity: 0.6 - i * 0.15 }} />
            ))}
          </div>
        )}
      </div>

      {/* ── GLOBAL ANIMATION STYLES ── */}
      <style>{`
        @keyframes mascotJumpBounce {
          0%   { transform: translateY(0px); }
          40%  { transform: translateY(-45px); }
          70%  { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes sleepZFloat {
          0%   { transform: translateY(0) scale(0.8); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(-28px) scale(1.1); opacity: 0; }
        }
      `}</style>
    </>
  );
}
