"use client";

import { useEffect, useState } from "react";
import { MonitorSmartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallMode = "android" | "ios" | "mobile";

export function InstallAppButton({ className = "" }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [mode, setMode] = useState<InstallMode>("mobile");
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const mobileSurface = isMobileInstallSurface();
    setIsAvailable(mobileSurface);
    if (!mobileSurface) return;

    const userAgent = window.navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(userAgent);

    setMode(isIOS ? "ios" : isAndroid ? "android" : "mobile");

    const handler = (event: Event) => {
      if (!isMobileInstallSurface()) return;
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const resizeHandler = () => {
      const stillMobile = isMobileInstallSurface();
      setIsAvailable(stillMobile);
      if (!stillMobile) setShowGuide(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }

    setShowGuide(true);
  };

  if (!isAvailable) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#E7162A]/25 px-5 py-2.5 text-sm font-bold text-[#E7162A] transition hover:bg-[#E7162A]/10 ${className}`}
      >
        <MonitorSmartphone size={16} aria-hidden="true" />
        Raccourci mobile
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 px-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl border border-[#E7162A]/15 bg-[var(--background)] p-5 text-[var(--foreground)] shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E7162A] text-white">
                  <MonitorSmartphone size={22} />
                </div>
                <div>
                  <h2 className="text-base font-black">Raccourci mobile optionnel</h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--foreground)]/55">
                    Pratique si vous suivez souvent vos cours depuis ce telephone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-full p-2 text-[var(--foreground)]/45 hover:bg-[#E7162A]/10 hover:text-[#E7162A]"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {getInstallSteps(mode).map((step, index) => (
                <div key={step} className="flex gap-3 rounded-2xl border border-[#E7162A]/10 bg-white/[0.03] p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7162A] text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-[var(--foreground)]/70">{step}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 min-h-11 w-full rounded-2xl bg-[#E7162A] px-4 py-3 text-sm font-black uppercase tracking-widest text-white"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function isMobileInstallSurface() {
  if (typeof window === "undefined") return false;

  const mobileUserAgent = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(
    window.navigator.userAgent
  );
  const narrowMobileViewport = window.matchMedia("(max-width: 820px)").matches;
  const touchSmallScreen = narrowMobileViewport && window.matchMedia("(pointer: coarse)").matches;

  return narrowMobileViewport && (mobileUserAgent || touchSmallScreen);
}

function getInstallSteps(mode: InstallMode) {
  if (mode === "ios") {
    return [
      "Ouvrez ce site dans le navigateur du téléphone.",
      "Touchez le bouton de partage en bas de l'écran.",
      "Choisissez Ajouter à l'écran d'accueil.",
      "Validez avec Ajouter.",
    ];
  }

  if (mode === "android") {
    return [
      "Ouvrez ce site dans le navigateur du téléphone.",
      "Touchez le menu du navigateur.",
      "Choisissez Ajouter à l'écran d'accueil si l'option apparait.",
      "Validez seulement si ce raccourci vous sera utile.",
    ];
  }

  return [
    "Sur ce telephone, ouvrez le menu du navigateur.",
    "Choisissez Ajouter à l'écran d'accueil si l'option apparait.",
    "Gardez ce raccourci uniquement si vous l'utilisez souvent.",
  ];
}
