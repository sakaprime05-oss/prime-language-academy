"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    const dismissedAt = localStorage.getItem("pwa-banner-dismissed");
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (isIOSDevice) {
      const timer = window.setTimeout(() => setShowBanner(true), 3000);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    if (isIOS) setShowIOSGuide(true);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem("pwa-banner-dismissed", Date.now().toString());
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      <div className="fixed bottom-4 left-3 right-3 z-[80] mx-auto max-w-md animate-slide-up sm:bottom-6" role="alert">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#21286E] to-[#1a1f55] p-4 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-[#E7162A]/20 blur-2xl" />

          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E7162A] shadow-lg shadow-[#E7162A]/30 sm:h-14 sm:w-14">
              <Smartphone size={26} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white">Installer l'application</h3>
              <p className="mt-0.5 text-xs leading-5 text-white/70">
                Ouvrez Prime Academy directement depuis l'écran d'accueil.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstall}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#E7162A] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#E7162A]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#E7162A]/30 active:scale-[0.98]"
          >
            <Download size={16} />
            {isIOS ? "Comment installer" : "Installer maintenant"}
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <div
            className="w-full max-w-md animate-slide-up rounded-t-3xl bg-white p-6 dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />

            <h3 className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-white">
              Installer sur iPhone / iPad
            </h3>

            <div className="space-y-3">
              <Step number={1} text="Ouvrez ce site dans Safari." />
              <Step number={2} text='Appuyez sur le bouton "Partager".' />
              <Step number={3} text='Choisissez "Sur l’écran d’accueil".' />
              <Step number={4} text='Appuyez sur "Ajouter".' />
            </div>

            <button
              onClick={handleDismiss}
              className="mt-6 min-h-11 w-full rounded-xl bg-[#E7162A] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#c41222]"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7162A] text-xs font-bold text-white">
        {number}
      </div>
      <p className="text-sm leading-5 text-gray-700 dark:text-gray-300">{text}</p>
    </div>
  );
}
