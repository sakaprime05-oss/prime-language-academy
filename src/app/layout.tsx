import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { OwlMascot } from "@/components/owl-mascot";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prime Academy | Hub d'Excellence 2026",
  description: "Système de gestion pédagogique haute performance pour Prime Language Academy. Parlez anglais. Vivez des opportunités.",
  manifest: "/manifest.json",
  themeColor: "#E7162A",
  openGraph: {
    title: "Prime Language Academy",
    description: "Parlez anglais. Vivez des opportunités. Rejoignez le centre linguistique de référence en Côte d'Ivoire.",
    url: "https://primelanguageacademy.com",
    siteName: "Prime Language Academy",
    images: [
      {
        url: "https://primelanguageacademy.com/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Prime Language Academy Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Language Academy",
    description: "Parlez anglais. Vivez des opportunités.",
    images: ["https://primelanguageacademy.com/icon-512x512.png"],
  },
};

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* === iOS PWA Meta Tags === */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Prime Academy" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
        {/* Apple splash screens */}
        <meta name="apple-mobile-web-app-orientations" content="portrait" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem("theme");
                  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  const theme = savedTheme || systemTheme;
                  if (theme === "dark") document.documentElement.classList.add("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          {children}
          <WhatsAppButton />
          <OwlMascot size={120} className="hidden sm:block" />
          <PWAInstallPrompt />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) {
                      console.log('✅ Service Worker enregistré:', reg.scope);
                    })
                    .catch(function(err) {
                      console.log('❌ Erreur Service Worker:', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
