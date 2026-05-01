import type { Metadata } from "next";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { siteConfig } from "@/lib/site-config";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: `${siteConfig.shortName} | Hub d'Excellence 2026`,
  description: siteConfig.description,
  manifest: "/manifest.json",
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 512, height: 512, alt: `${siteConfig.name} Logo` }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export const viewport = {
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.shortName} />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Theme script to prevent flash */}
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
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <WhatsAppButton />
          <PWAInstallPrompt />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
