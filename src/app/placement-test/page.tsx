import Link from "next/link";
import { PrimeLogo } from "@/components/logo";
import { Suspense } from "react";
import PlacementTest from "./PlacementTest";

export const metadata = {
  title: "Test de Placement | Prime Language Academy",
  description:
    "Évaluez votre niveau d'anglais avec notre test de placement gratuit. Compréhension, grammaire, expression orale et écrite.",
};

export default function PlacementTestPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-[var(--background)] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="bg-blob w-[500px] h-[500px] bg-primary -top-20 -left-20 animate-float opacity-10"></div>
      <div
        className="bg-blob w-[400px] h-[400px] bg-secondary bottom-0 right-0 animate-float opacity-10"
        style={{ animationDelay: "-3s" }}
      ></div>

      {/* Header */}
      <nav className="w-full max-w-2xl flex items-center justify-between py-4 relative z-10">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <PrimeLogo className="h-8" />
        </Link>
        <Link
          href="/register"
          className="text-xs font-bold text-[var(--foreground)]/50 hover:text-primary transition-colors"
        >
          ← Retour à l'inscription
        </Link>
      </nav>

      {/* Main Card */}
      <div className="w-full max-w-2xl glass-card relative z-10 border-white/20 dark:border-white/10 shadow-2xl mt-4">
        {/* Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            Test Gratuit
          </div>
          <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            Test de Placement
          </h1>
          <p className="text-xs text-[var(--foreground)]/50 font-medium max-w-sm mx-auto">
            Ce test évalue votre niveau en anglais à travers la compréhension, la grammaire,
            l'écoute, l'expression orale et écrite. Durée estimée : 15–20 minutes.
          </p>
        </div>

        {/* Test Component */}
        <Suspense
          fallback={
            <div className="text-center py-16 opacity-50 animate-pulse">
              Chargement du test...
            </div>
          }
        >
          <PlacementTest />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-[var(--foreground)]/20">
          © {new Date().getFullYear()} Prime Language Academy
        </p>
      </div>
    </main>
  );
}
