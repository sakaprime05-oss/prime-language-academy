"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type State = "idle" | "walking" | "jumping" | "sleeping";

const SLEEP_DELAY = 7000;
const JUMP_SCROLL = 280;

export function OwlMascot({ size = 120 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pupilX, setPupilX] = useState(0);
  const [pupilY, setPupilY] = useState(0);
  const [blink, setBlink] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [posX, setPosX] = useState(6);
  const [flipped, setFlipped] = useState(false);
  const [legTick, setLegTick] = useState(0);
  const [jumpY, setJumpY] = useState(0);
  const [bobY, setBobY] = useState(0);
  const [tailAngle, setTailAngle] = useState(0);
  const [zOpacity, setZOpacity] = useState(0);

  const stateRef = useRef<State>("idle");
  const posXRef = useRef(6);
  const targetXRef = useRef(6);
  const lastScrollY = useRef(0);
  const sleepTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();

  const setS = (s: State) => { stateRef.current = s; setState(s); };

  // ── INACTIVITY SLEEP ───────────────────────────────────────────────
  const resetSleep = useCallback(() => {
    clearTimeout(sleepTimer.current);
    if (stateRef.current === "sleeping") setS("idle");
    sleepTimer.current = setTimeout(() => setS("sleeping"), SLEEP_DELAY);
  }, []);

  // ── MOUSE → EYE ────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      resetSleep();
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = Math.min(d, 400) / 400;
      setPupilX((dx / d) * 5 * f);
      setPupilY((dy / d) * 5 * f);
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, [resetSleep]);

  // ── SCROLL → WALK / JUMP ───────────────────────────────────────────
  useEffect(() => {
    let walkTimeout: ReturnType<typeof setTimeout>;
    let jumpTimeout: ReturnType<typeof setTimeout>;

    const h = () => {
      resetSleep();
      const cur = window.scrollY;
      const delta = cur - lastScrollY.current;
      lastScrollY.current = cur;

      const goDown = delta > 0;
      setFlipped(!goDown);

      if (Math.abs(delta) > JUMP_SCROLL && stateRef.current !== "jumping") {
        setS("jumping");
        clearTimeout(jumpTimeout);
        jumpTimeout = setTimeout(() => setS("idle"), 750);
      } else if (stateRef.current !== "jumping") {
        setS("walking");
        clearTimeout(walkTimeout);
        walkTimeout = setTimeout(() => setS("idle"), 700);
      }

      const maxS = document.documentElement.scrollHeight - window.innerHeight;
      const prog = maxS > 0 ? Math.max(0, Math.min(1, cur / maxS)) : 0;
      targetXRef.current = 5 + prog * 82;
    };
    window.addEventListener("scroll", h, { passive: true });
    resetSleep();
    return () => {
      window.removeEventListener("scroll", h);
      clearTimeout(walkTimeout);
      clearTimeout(jumpTimeout);
    };
  }, [resetSleep]);

  // ── ANIMATION LOOP ─────────────────────────────────────────────────
  useEffect(() => {
    let t = 0;
    let jumpT = 0;
    let sleeping = false;
    let zT = 0;

    const loop = () => {
      t += 0.07;
      const s = stateRef.current;
      sleeping = s === "sleeping";

      // Lerp X position
      const cur = posXRef.current;
      const target = targetXRef.current;
      const next = cur + (target - cur) * 0.055;
      if (Math.abs(next - cur) > 0.005) {
        posXRef.current = next;
        setPosX(next);
      }

      // Walk leg cycle
      if (s === "walking") setLegTick(t);

      // Gentle body bob when idle
      setBobY(s === "idle" ? Math.sin(t * 0.6) * 2.5 : 0);

      // Tail wag
      setTailAngle(sleeping ? 0 : Math.sin(t * (s === "walking" ? 2 : 0.7)) * (s === "walking" ? 18 : 8));

      // Jump arc
      if (s === "jumping") {
        jumpT += 0.15;
        setJumpY(-Math.sin(jumpT * Math.PI) * 38);
      } else {
        jumpT = 0;
        setJumpY(0);
      }

      // ZZZ float
      if (sleeping) {
        zT += 0.03;
        setZOpacity(0.5 + Math.sin(zT * 2) * 0.5);
      } else {
        zT = 0;
        setZOpacity(0);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  // ── RANDOM BLINK ──────────────────────────────────────────────────
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const cycle = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); cycle(); }, 110);
      }, 2000 + Math.random() * 4000);
    };
    cycle();
    return () => clearTimeout(t);
  }, []);

  // ── COMPUTED ──────────────────────────────────────────────────────
  const walk = state === "walking";
  const sleep = state === "sleeping";
  const jump = state === "jumping";
  const eyesClosed = sleep || blink;

  // Leg angles (4 legs, alternating pairs)
  const fl = walk ? Math.sin(legTick * Math.PI * 2) * 25 : 0;       // front-left
  const fr = walk ? Math.sin(legTick * Math.PI * 2 + Math.PI) * 25 : 0; // front-right
  const bl = walk ? Math.sin(legTick * Math.PI * 2 + Math.PI) * 25 : 0; // back-left
  const br = walk ? Math.sin(legTick * Math.PI * 2) * 25 : 0;       // back-right

  // Speed lines when walking
  const speedLines = walk && [16, 12, 8];

  const S = size / 140;

  return (
    <>
      <div
        ref={ref}
        style={{
          position: "fixed",
          bottom: sleep ? 2 : 14,
          left: `${posX}%`,
          zIndex: 8888,
          transform: `
            translateX(-50%)
            translateY(${jumpY + bobY}px)
            scaleX(${flipped ? -1 : 1})
            ${sleep ? "rotate(12deg)" : ""}
          `,
          transition: "bottom 0.4s ease, filter 0.5s ease",
          filter: sleep ? "brightness(0.65) saturate(0.5)" : "none",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* ── SPEED LINES ── */}
        {speedLines && (
          <div style={{ position: "absolute", right: "100%", top: "30%", display: "flex", flexDirection: "column", gap: 4, opacity: 0.55 }}>
            {speedLines.map((w, i) => (
              <div key={i} style={{ width: w, height: 2, background: "#D4AF37", borderRadius: 2 }} />
            ))}
          </div>
        )}

        {/* ── ZZZ ── */}
        {sleep && (
          <div style={{ position: "absolute", bottom: "75%", left: "55%", pointerEvents: "none" }}>
            {["z", "z", "Z"].map((c, i) => (
              <span key={i} style={{
                display: "block",
                fontFamily: "serif",
                fontWeight: 900,
                fontSize: (12 + i * 5) * S,
                color: "#D4AF37",
                opacity: zOpacity * (0.5 + i * 0.25),
                transform: `translateX(${i * 8 * S}px) translateY(${-i * 10 * S}px)`,
                lineHeight: 1,
              }}>{c}</span>
            ))}
          </div>
        )}

        {/* ── GOAT SVG ── */}
        <svg
          width={140 * S}
          height={120 * S}
          viewBox="0 0 140 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="g-body" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#D4904A" />
              <stop offset="50%" stopColor="#C07832" />
              <stop offset="100%" stopColor="#8B5020" />
            </radialGradient>
            <radialGradient id="g-belly" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8B070" />
              <stop offset="100%" stopColor="#C8884A" />
            </radialGradient>
            <radialGradient id="g-face" cx="45%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#DCA060" />
              <stop offset="100%" stopColor="#A86830" />
            </radialGradient>
            <radialGradient id="g-iris" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FFD040" />
              <stop offset="50%" stopColor="#C89010" />
              <stop offset="100%" stopColor="#7A5800" />
            </radialGradient>
            <filter id="g-shadow">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#00000055" />
            </filter>
          </defs>

          {/* ── GROUND SHADOW ── */}
          <ellipse
            cx="68" cy="116"
            rx={jump ? 18 : 36} ry={jump ? 2 : 5}
            fill="#000" opacity={jump ? 0.06 : 0.15}
          />

          {/* ── TAIL ── */}
          <g transform={`rotate(${tailAngle} 18 52)`} style={{ transformOrigin: "18px 52px" }}>
            <path d="M18 52 Q8 40 10 32 Q14 28 18 34 Q22 40 16 48Z" fill="#C07832" />
            <path d="M10 32 Q6 24 8 18" stroke="#C07832" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 18 Q6 12 10 10" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* ── BACK LEGS (behind body) ── */}
          {/* Back-right leg */}
          <g transform={`rotate(${br} 30 82)`} style={{ transformOrigin: "30px 82px" }}>
            <rect x="24" y="82" width="12" height="26" rx="5" fill="#A86830" />
            <ellipse cx="30" cy="109" rx="9" ry="5" fill="#5A3010" />
          </g>
          {/* Back-left leg (slightly offset) */}
          <g transform={`rotate(${bl} 38 82)`} style={{ transformOrigin: "38px 82px" }}>
            <rect x="32" y="82" width="12" height="26" rx="5" fill="#B87838" />
            <ellipse cx="38" cy="109" rx="9" ry="5" fill="#6A3818" />
          </g>

          {/* ── BODY ── */}
          <ellipse cx="68" cy="68" rx="46" ry="30" fill="url(#g-body)" filter="url(#g-shadow)" />

          {/* Belly shading */}
          <ellipse cx="68" cy="78" rx="32" ry="16" fill="url(#g-belly)" opacity="0.6" />

          {/* Body highlight */}
          <ellipse cx="60" cy="52" rx="22" ry="10" fill="#E8A858" opacity="0.3" />

          {/* ── FRONT LEGS (in front of body) ── */}
          {/* Front-left leg */}
          <g transform={`rotate(${fl} 90 82)`} style={{ transformOrigin: "90px 82px" }}>
            <rect x="84" y="82" width="12" height="28" rx="5" fill="#B87838" />
            <ellipse cx="90" cy="111" rx="9" ry="5" fill="#6A3818" />
          </g>
          {/* Front-right leg */}
          <g transform={`rotate(${fr} 100 82)`} style={{ transformOrigin: "100px 82px" }}>
            <rect x="94" y="82" width="12" height="28" rx="5" fill="#C88848" />
            <ellipse cx="100" cy="111" rx="9" ry="5" fill="#7A4828" />
          </g>

          {/* ── NECK ── */}
          <path d="M98 54 Q104 40 108 28 Q116 22 120 30 Q118 44 110 58Z" fill="url(#g-face)" />

          {/* ── HEAD (proud, tilted up) ── */}
          <ellipse cx="118" cy="24" rx="20" ry="18" fill="url(#g-face)" filter="url(#g-shadow)" />

          {/* Face highlight */}
          <ellipse cx="114" cy="18" rx="10" ry="7" fill="#E8B870" opacity="0.4" />

          {/* ── HORNS ── */}
          {/* Main horn */}
          <path d="M112 10 Q110 0 108 -4 Q114 -2 116 6 Q118 12 114 14Z" fill="#E8DEC0" />
          <path d="M110 1 Q108 -4 108 -6" stroke="#D4C8A0" strokeWidth="1.5" strokeLinecap="round" />
          {/* Small second horn */}
          <path d="M120 8 Q122 2 124 0 Q126 4 124 9 Q122 12 120 11Z" fill="#E8DEC0" />

          {/* ── EAR ── */}
          <path d="M100 16 Q94 8 92 14 Q92 22 100 22Z" fill="#C88040" />
          <path d="M100 17 Q95 11 94 15 Q94 20 100 21Z" fill="#E8A870" opacity="0.5" />

          {/* ── EYE (big & proud) ── */}
          <ellipse cx="120" cy="22" rx="8" ry="8" fill="white" />
          <ellipse cx="120" cy="22" rx="6.5" ry="6.5" fill="url(#g-iris)" />
          <ellipse cx="120" cy="22" rx="4.5" ry="4.5" fill="#8B6000" opacity="0.4" />
          {/* Pupil */}
          {eyesClosed ? (
            <path d="M113 22 Q117 18 120 22 Q123 18 127 22" stroke="#5A3A00" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <circle cx={120 + pupilX * 0.9} cy={22 + pupilY * 0.9} r="3" fill="#1A0800" />
          )}
          {!eyesClosed && (
            <circle cx={117 + pupilX * 0.5} cy={19 + pupilY * 0.5} r="1.8" fill="white" opacity="0.95" />
          )}
          <ellipse cx="120" cy="22" rx="8" ry="8" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.4" />

          {/* Pupil catch-light extra */}
          {!eyesClosed && (
            <circle cx={122 + pupilX * 0.3} cy={25 + pupilY * 0.3} r="0.9" fill="white" opacity="0.5" />
          )}

          {/* ── NOSE ── */}
          <ellipse cx="133" cy="26" rx="5" ry="4" fill="#C08060" />
          <ellipse cx="132" cy="27" rx="1.5" ry="1.2" fill="#8B5040" />
          <ellipse cx="135" cy="27" rx="1.5" ry="1.2" fill="#8B5040" />

          {/* ── MOUTH / SMUG SMILE ── */}
          <path d="M129 32 Q132 35 135 32" stroke="#9A6040" strokeWidth="1.3" strokeLinecap="round" fill="none" />

          {/* ── BEARD ── */}
          <path d="M128 34 Q126 42 125 46 Q128 48 131 44 Q132 40 130 34Z" fill="#C88848" />
          <path d="M126 36 Q124 42 124 46" stroke="#B07838" strokeWidth="1.2" strokeLinecap="round" />

          {/* ── SMUG EYEBROW (proud!) ── */}
          <path d="M114 15 Q118 12 124 14" stroke="#8B5820" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* ── JUMP DUST ── */}
          {jump && (
            <>
              <circle cx="40" cy="114" r="4" fill="#D4AF37" opacity="0.2" />
              <circle cx="60" cy="116" r="3" fill="#D4AF37" opacity="0.15" />
              <circle cx="28" cy="116" r="2" fill="#D4AF37" opacity="0.1" />
            </>
          )}
        </svg>
      </div>

      <style>{`
        @keyframes zFloat {
          0%   { opacity: 0; transform: translateY(0) scale(0.7); }
          30%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </>
  );
}
