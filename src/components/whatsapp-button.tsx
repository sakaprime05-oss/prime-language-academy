"use client";

const WA_NUMBER = "2250161337864"; // +225 01 61 33 78 64
const WA_MESSAGE = encodeURIComponent("Bonjour ! Je souhaite avoir des informations sur Prime Language Academy 🎓");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export function WhatsAppButton() {
  return (
    <>
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Prime Language Academy sur WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(37,211,102,0.45), 0 0 0 0 rgba(37,211,102,0.4)",
          animation: "waPulse 2.5s ease-in-out infinite",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(37,211,102,0.6)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(37,211,102,0.45)";
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.83 6.5L4 29l7.7-1.81A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-13S22.627 3 16 3z"
            fill="white"
          />
          <path
            d="M16 5.2C10.587 5.2 6.2 9.587 6.2 15c0 2.18.686 4.2 1.856 5.856L7 25l4.256-1.04A10.76 10.76 0 0016 24.8c5.413 0 9.8-4.387 9.8-9.8S21.413 5.2 16 5.2z"
            fill="#25D366"
          />
          <path
            d="M21.04 18.16c-.28-.14-1.664-.82-1.92-.912-.256-.096-.44-.14-.628.14-.188.28-.72.912-.88 1.1-.164.184-.324.208-.604.07-.28-.14-1.18-.436-2.248-1.388-.832-.74-1.392-1.656-1.556-1.936-.164-.28-.016-.432.124-.572.126-.124.28-.324.42-.488.14-.164.188-.28.28-.468.096-.188.048-.352-.024-.492-.068-.14-.628-1.512-.86-2.072-.228-.548-.456-.472-.628-.48l-.536-.008c-.188 0-.492.068-.748.352-.256.284-.98.956-.98 2.332 0 1.376 1.004 2.704 1.14 2.892.14.188 1.968 3.004 4.768 4.212.668.288 1.188.46 1.596.588.668.212 1.276.184 1.756.112.536-.08 1.664-.68 1.896-1.34.236-.656.236-1.22.168-1.34-.072-.12-.252-.188-.532-.328z"
            fill="white"
          />
        </svg>

        {/* Tooltip */}
        <span style={{
          position: "absolute",
          right: 70,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(8,8,8,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(37,211,102,0.3)",
          color: "#F5F0E8",
          fontSize: 12,
          fontWeight: 600,
          padding: "8px 14px",
          borderRadius: 10,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
          className="wa-tooltip"
        >
          💬 Nous écrire sur WhatsApp
        </span>
      </a>

      <style>{`
        @keyframes waPulse {
          0%   { box-shadow: 0 4px 24px rgba(37,211,102,0.45), 0 0 0 0 rgba(37,211,102,0.4); }
          70%  { box-shadow: 0 4px 24px rgba(37,211,102,0.45), 0 0 0 14px rgba(37,211,102,0); }
          100% { box-shadow: 0 4px 24px rgba(37,211,102,0.45), 0 0 0 0 rgba(37,211,102,0); }
        }
        a:hover .wa-tooltip { opacity: 1 !important; }
      `}</style>
    </>
  );
}
