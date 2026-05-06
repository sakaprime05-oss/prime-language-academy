"use client";

import { useEffect, useState } from "react";
import { Download, MonitorSmartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallMode = "android" | "ios" | "desktop";

export function InstallAppButton({ className = "" }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [mode, setMode] = useState<InstallMode>("desktop");

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(userAgent);

    setMode(isIOS ? "ios" : isAndroid ? "android" : "desktop");

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
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

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#E7162A]/40 px-6 py-3 text-sm font-black uppercase tracking-widest text-[#E7162A] transition hover:bg-[#E7162A]/10 ${className}`}
      >
        <Download size={16} aria-hidden="true" />
        Installer l'app gratuite
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
                  <h2 className="text-base font-black">Installer sans store</h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--foreground)]/55">
                    Ajoutez la plateforme PLA directement sur votre écran d'accueil.
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
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
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
      "Choisissez Installer l'application ou Ajouter à l'écran d'accueil.",
      "Validez l'installation.",
    ];
  }

  return [
    "Ouvrez ce site dans votre navigateur.",
    "Cliquez sur l'icône Installer dans la barre d'adresse ou dans le menu.",
    "Validez pour ouvrir la plateforme comme une application.",
  ];
}
