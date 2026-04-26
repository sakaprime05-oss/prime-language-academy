"use client";
import { useEffect, useRef, useState } from "react";

export function OwlMascot({ size = 200 }: { size?: number }) {
  const owlRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [bobY, setBobY] = useState(0);

  // Track mouse → move pupils
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!owlRef.current) return;
      const r = owlRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const max = 5.5;
      const factor = Math.min(dist, 260) / 260;
      setPupil({ x: (dx / dist || 0) * max * factor, y: (dy / dist || 0) * max * factor });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Random blink every 2-6s
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const cycle = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); cycle(); }, 130);
      }, 2200 + Math.random() * 3800);
    };
    cycle();
    return () => clearTimeout(t);
  }, []);

  // Gentle bob
  useEffect(() => {
    let frame: number;
    let tick = 0;
    const loop = () => { tick += 0.018; setBobY(Math.sin(tick) * 9); frame = requestAnimationFrame(loop); };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const px = pupil.x;
  const py = pupil.y;

  return (
    <div ref={owlRef} style={{ transform: `translateY(${bobY}px)`, display: "inline-block", transition: "transform 0.06s linear" }}>
      <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#252535"/>
            <stop offset="100%" stopColor="#0D0D18"/>
          </radialGradient>
          <radialGradient id="irisL" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E8B830"/>
            <stop offset="60%" stopColor="#B8880A"/>
            <stop offset="100%" stopColor="#7A5800"/>
          </radialGradient>
          <radialGradient id="irisR" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E8B830"/>
            <stop offset="60%" stopColor="#B8880A"/>
            <stop offset="100%" stopColor="#7A5800"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="eyeGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="100" cy="216" rx="52" ry="6" fill="#D4AF37" opacity="0.12"/>

        {/* Body */}
        <ellipse cx="100" cy="148" rx="56" ry="68" fill="url(#bodyGrad)"/>

        {/* Wings */}
        <path d="M44 108 Q12 128 16 178 Q40 162 52 144Z" fill="#181826" stroke="#D4AF37" strokeWidth="0.4" strokeOpacity="0.3"/>
        <path d="M156 108 Q188 128 184 178 Q160 162 148 144Z" fill="#181826" stroke="#D4AF37" strokeWidth="0.4" strokeOpacity="0.3"/>
        <path d="M44 118 Q18 138 20 165" stroke="#D4AF37" strokeWidth="0.7" strokeOpacity="0.25" strokeLinecap="round"/>
        <path d="M156 118 Q182 138 180 165" stroke="#D4AF37" strokeWidth="0.7" strokeOpacity="0.25" strokeLinecap="round"/>

        {/* Chest */}
        <ellipse cx="100" cy="163" rx="34" ry="46" fill="#F0EAD8" opacity="0.92"/>
        <ellipse cx="100" cy="163" rx="26" ry="36" fill="#E8E0CC" opacity="0.6"/>
        {/* feather lines */}
        {[0,1,2].map(i => (
          <path key={i} d={`M80 ${148 + i*12} Q100 ${144 + i*12} 120 ${148 + i*12}`} stroke="#C8BB9A" strokeWidth="0.8" strokeOpacity="0.5" fill="none"/>
        ))}

        {/* Head */}
        <ellipse cx="100" cy="80" rx="50" ry="48" fill="url(#bodyGrad)"/>

        {/* Ear tufts */}
        <polygon points="72,40 62,8 81,34" fill="#181826"/>
        <polygon points="128,40 138,8 119,34" fill="#181826"/>
        <polygon points="72,37 66,16 78,32" fill="#D4AF37" opacity="0.35"/>
        <polygon points="128,37 134,16 122,32" fill="#D4AF37" opacity="0.35"/>

        {/* Face disc */}
        <ellipse cx="100" cy="82" rx="44" ry="42" fill="#1E1E30" opacity="0.6"/>

        {/* Gold brow band */}
        <path d="M58 58 Q100 50 142 58" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>

        {/* ── LEFT EYE ── */}
        <circle cx="76" cy="80" r="21" fill="#D4AF37" opacity="0.12" filter="url(#eyeGlow)"/>
        <circle cx="76" cy="80" r="17.5" fill="#0A0A10"/>
        <circle cx="76" cy="80" r="15" fill="url(#irisL)"/>
        <circle cx="76" cy="80" r="11" fill="#7A5800" opacity="0.5"/>
        {blink
          ? <ellipse cx="76" cy="80" rx="14" ry="1.8" fill="#0A0A10"/>
          : <circle cx={76 + px} cy={80 + py} r="7.5" fill="#060608"/>
        }
        {!blink && <>
          <circle cx={72 + px * 0.45} cy={76 + py * 0.45} r="2.8" fill="white" opacity="0.95"/>
          <circle cx={78 + px * 0.3} cy={83 + py * 0.3} r="1.2" fill="white" opacity="0.5"/>
        </>}
        <circle cx="76" cy="80" r="17.5" fill="none" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.25"/>

        {/* ── RIGHT EYE ── */}
        <circle cx="124" cy="80" r="21" fill="#D4AF37" opacity="0.12" filter="url(#eyeGlow)"/>
        <circle cx="124" cy="80" r="17.5" fill="#0A0A10"/>
        <circle cx="124" cy="80" r="15" fill="url(#irisR)"/>
        <circle cx="124" cy="80" r="11" fill="#7A5800" opacity="0.5"/>
        {blink
          ? <ellipse cx="124" cy="80" rx="14" ry="1.8" fill="#0A0A10"/>
          : <circle cx={124 + px} cy={80 + py} r="7.5" fill="#060608"/>
        }
        {!blink && <>
          <circle cx={120 + px * 0.45} cy={76 + py * 0.45} r="2.8" fill="white" opacity="0.95"/>
          <circle cx={126 + px * 0.3} cy={83 + py * 0.3} r="1.2" fill="white" opacity="0.5"/>
        </>}
        <circle cx="124" cy="80" r="17.5" fill="none" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.25"/>

        {/* Beak */}
        <polygon points="100,94 91,108 109,108" fill="#C8960C"/>
        <polygon points="100,94 91,108 100,101" fill="#A07800" opacity="0.5"/>
        <line x1="91" y1="102" x2="109" y2="102" stroke="#906800" strokeWidth="0.8"/>

        {/* Gold trim lines */}
        <path d="M58 100 Q100 108 142 100" stroke="#D4AF37" strokeWidth="0.6" strokeOpacity="0.3" fill="none"/>

        {/* Feet */}
        {[-12, 12].map((ox, i) => (
          <g key={i} transform={`translate(${ox}, 0)`}>
            <rect x="96" y="210" width="7" height="5" rx="2.5" fill="#C8960C"/>
            <line x1="93" y1="212" x2="99" y2="212" stroke="#C8960C" strokeWidth="2" strokeLinecap="round"/>
            <line x1="99" y1="212" x2="105" y2="212" stroke="#C8960C" strokeWidth="2" strokeLinecap="round"/>
            <line x1="99" y1="210" x2="99" y2="204" stroke="#C8960C" strokeWidth="2" strokeLinecap="round"/>
          </g>
        ))}
      </svg>

      {/* Sparkle dots */}
      <div style={{ position:"absolute", top:-4, right:-6, width:6, height:6, borderRadius:"50%", background:"#D4AF37", opacity:0.7, animation:"ping 2.8s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", top:20, left:-8, width:4, height:4, borderRadius:"50%", background:"#D4AF37", opacity:0.4, animation:"ping 3.5s ease-in-out 1.2s infinite" }}/>

      <style>{`@keyframes ping { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.6);opacity:0} }`}</style>
    </div>
  );
}
