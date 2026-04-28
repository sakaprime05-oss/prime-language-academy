"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Check if user dismissed the banner before (respect for 7 days)
    const dismissedAt = localStorage.getItem("pwa-banner-dismissed");
    if (dismissedAt) {
      const daysSinceDismissed =
        (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    // For Android/Chrome — listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // For iOS — show a custom guide after a delay
    if (isIOSDevice) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => {
        clearTimeout(timer);
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
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem("pwa-banner-dismissed", Date.now().toString());
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      {/* Install Banner */}
      <div
        className="fixed bottom-20 left-4 right-4 z-[9999] mx-auto max-w-md animate-slide-up"
        role="alert"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#21286E] to-[#1a1f55] p-4 shadow-2xl backdrop-blur-xl">
          {/* Glow effect */}
          <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-[#E7162A]/20 blur-2xl" />

          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E7162A] shadow-lg shadow-[#E7162A]/30">
              <Smartphone size={28} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white">
                📲 Installer l&apos;application
              </h3>
              <p className="mt-0.5 text-xs text-white/70">
                Accédez à Prime Academy directement depuis votre écran d&apos;accueil
              </p>
            </div>
          </div>

          <button
            onClick={handleInstall}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E7162A] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#E7162A]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#E7162A]/30 active:scale-[0.98]"
          >
            <Download size={16} />
            {isIOS ? "Comment installer" : "Installer maintenant"}
          </button>
        </div>
      </div>

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <div
            className="w-full max-w-md animate-slide-up rounded-t-3xl bg-white p-6 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />

            <h3 className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-white">
              Installer sur iPhone / iPad
            </h3>

            <div className="space-y-4">
              <Step
                number={1}
                icon="🧭"
                text="Ouvrez ce site dans Safari"
              />
              <Step
                number={2}
                icon="📤"
                text='Appuyez sur le bouton "Partager" (carré avec flèche ↑)'
              />
              <Step
                number={3}
                icon="➕"
                text={`Faites défiler et appuyez sur "Sur l'écran d'accueil"`}
              />
              <Step
                number={4}
                icon="✅"
                text='Appuyez "Ajouter" et c&apos;est fait !'
              />
            </div>

            <button
              onClick={handleDismiss}
              className="mt-6 w-full rounded-xl bg-[#E7162A] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#c41222]"
            >
              J&apos;ai compris !
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

function Step({
  number,
  icon,
  text,
}: {
  number: number;
  icon: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7162A] text-xs font-bold text-white">
        {number}
      </div>
      <span className="text-lg">{icon}</span>
      <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
    </div>
  );
}
