"use client";

import { useEffect, useState } from "react";
import { Smartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSAL_DAYS = 30;
const SOFT_PROMPT_DELAY_MS = 12000;
const DISMISS_KEY = "pwa-banner-dismissed";
const SESSION_SEEN_KEY = "pwa-install-soft-seen";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (!isMobileInstallSurface()) {
      setShowBanner(false);
      return;
    }

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

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < DISMISSAL_DAYS) return;
    }
    if (sessionStorage.getItem(SESSION_SEEN_KEY) === "1") return;

    let promptTimer: number | undefined;

    const showSoftBanner = () => {
      if (!isMobileInstallSurface() || sessionStorage.getItem(SESSION_SEEN_KEY) === "1") return;
      sessionStorage.setItem(SESSION_SEEN_KEY, "1");
      setShowBanner(true);
    };

    const resizeHandler = () => {
      if (!isMobileInstallSurface()) {
        if (promptTimer) window.clearTimeout(promptTimer);
        setShowBanner(false);
        setShowIOSGuide(false);
      }
    };

    const handler = (event: Event) => {
      if (!isMobileInstallSurface()) return;
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      if (promptTimer) window.clearTimeout(promptTimer);
      promptTimer = window.setTimeout(showSoftBanner, SOFT_PROMPT_DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("resize", resizeHandler);

    if (isIOSDevice) {
      promptTimer = window.setTimeout(showSoftBanner, SOFT_PROMPT_DELAY_MS);
      return () => {
        if (promptTimer) window.clearTimeout(promptTimer);
        window.removeEventListener("beforeinstallprompt", handler);
        window.removeEventListener("resize", resizeHandler);
      };
    }

    return () => {
      if (promptTimer) window.clearTimeout(promptTimer);
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("resize", resizeHandler);
    };
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
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      <div className="fixed bottom-4 left-3 right-3 z-[80] mx-auto max-w-sm animate-slide-up" role="status">
        <div className="relative rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)]/95 p-3 shadow-xl backdrop-blur-xl">

          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 rounded-full p-1 text-[var(--foreground)]/45 transition-colors hover:bg-[#E7162A]/10 hover:text-[#E7162A]"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7162A]/10 text-[#E7162A]">
              <Smartphone size={21} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[var(--foreground)]">Acces rapide sur mobile</h3>
              <p className="mt-0.5 text-xs leading-5 text-[var(--foreground)]/60">
                Optionnel : ajoutez un raccourci si vous utilisez souvent la plateforme sur ce telephone.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstall}
            className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E7162A]/25 bg-[#E7162A]/10 px-4 py-2 text-sm font-semibold text-[#E7162A] transition-all hover:bg-[#E7162A]/15 active:scale-[0.99]"
          >
            <Smartphone size={16} />
            {isIOS ? "Voir l'astuce" : "Ajouter si utile"}
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
              Raccourci sur iPhone / iPad
            </h3>

            <div className="space-y-3">
              <Step number={1} text="Depuis ce telephone, ouvrez ce site dans Safari." />
              <Step number={2} text='Appuyez sur le bouton "Partager".' />
              <Step number={3} text='Choisissez "Sur l’écran d’accueil" si vous voulez un raccourci.' />
              <Step number={4} text='Appuyez sur "Ajouter".' />
            </div>

            <button
              onClick={handleDismiss}
              className="mt-6 min-h-11 w-full rounded-xl bg-[#E7162A] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#c41222]"
            >
              Fermer
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

function isMobileInstallSurface() {
  if (typeof window === "undefined") return false;

  const mobileUserAgent = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(
    window.navigator.userAgent
  );
  const narrowMobileViewport = window.matchMedia("(max-width: 820px)").matches;
  const touchSmallScreen = narrowMobileViewport && window.matchMedia("(pointer: coarse)").matches;

  return narrowMobileViewport && (mobileUserAgent || touchSmallScreen);
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
