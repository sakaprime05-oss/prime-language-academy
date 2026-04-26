import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { OwlMascot } from "@/components/owl-mascot";

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
  themeColor: "#D4AF37",
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
          <OwlMascot size={120} />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
