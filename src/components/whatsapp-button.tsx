"use client";

import { usePathname } from "next/navigation";

const WA_NUMBER = "2250161337864";
const WA_MESSAGE = encodeURIComponent("Bonjour ! Je souhaite avoir des informations sur Prime Language Academy.");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const HIDDEN_PREFIXES = ["/contact", "/login", "/register", "/register-club", "/forgot-password", "/reset-password", "/dashboard"];

export function WhatsAppButton() {
  const pathname = usePathname();
  const shouldHide = HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (shouldHide) return null;

  return (
    <>
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Prime Language Academy sur WhatsApp"
        className="wa-float"
      >
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <span className="wa-tooltip">Nous écrire sur WhatsApp</span>
      </a>

      <style>{`
        .wa-float {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 60;
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: linear-gradient(135deg, #25D366, #128C7E);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(37,211,102,0.38), 0 0 0 0 rgba(37,211,102,0.3);
          text-decoration: none;
          animation: waPulse 2.5s ease-in-out infinite;
        }

        .wa-tooltip {
          display: none;
        }

        @media (min-width: 640px) {
          .wa-float {
            right: 28px;
            bottom: 28px;
            width: 60px;
            height: 60px;
            transition: transform 0.2s, box-shadow 0.2s;
          }

          .wa-float:hover {
            transform: scale(1.12);
            box-shadow: 0 8px 32px rgba(37,211,102,0.6);
          }

          .wa-tooltip {
            position: absolute;
            right: 70px;
            top: 50%;
            transform: translateY(-50%);
            display: block;
            white-space: nowrap;
            border-radius: 10px;
            border: 1px solid rgba(37,211,102,0.3);
            background: rgba(8,8,8,0.92);
            color: #F5F0E8;
            font-size: 12px;
            font-weight: 600;
            padding: 8px 14px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
          }

          .wa-float:hover .wa-tooltip {
            opacity: 1;
          }
        }

        @keyframes waPulse {
          0%   { box-shadow: 0 4px 24px rgba(37,211,102,0.38), 0 0 0 0 rgba(37,211,102,0.3); }
          70%  { box-shadow: 0 4px 24px rgba(37,211,102,0.38), 0 0 0 12px rgba(37,211,102,0); }
          100% { box-shadow: 0 4px 24px rgba(37,211,102,0.38), 0 0 0 0 rgba(37,211,102,0); }
        }
      `}</style>
    </>
  );
}
