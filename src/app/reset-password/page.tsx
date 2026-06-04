"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/actions/auth-reset";
import { PrimeLogo } from "@/components/logo";
import ThemeToggle from "@/components/ThemeToggle";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="mb-4 text-red-600 dark:text-red-400">Lien de reinitialisation invalide ou manquant.</p>
        <Link href="/forgot-password" className="font-bold text-[var(--primary)] hover:underline">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres.");
      setLoading(false);
      return;
    }

    const res = await resetPassword(token, password);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-black text-[var(--foreground)]">Mot de passe modifie</h2>
        <p className="mb-6 text-[var(--muted-foreground)]">Vous allez etre redirige vers la page de connexion.</p>
        <Link href="/login" className="text-sm font-bold text-[var(--primary)] hover:underline">
          Aller a la connexion
        </Link>
      </div>
    );
  }

  return (
    <>
      <div>
        <h2 className="text-center text-2xl font-black text-[var(--foreground)]">Nouveau mot de passe</h2>
        <p className="mt-2 text-center text-sm leading-6 text-[var(--muted-foreground)]">
          Choisissez un nouveau mot de passe de 8 caracteres minimum.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-600 dark:text-red-400">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-[var(--foreground)]/80">Nouveau mot de passe</label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="8 caracteres minimum"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-[var(--foreground)]/80">Confirmer le mot de passe</label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="8 caracteres minimum"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Enregistrement..." : "Modifier le mot de passe"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4 text-[var(--foreground)]">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5 dark:shadow-black/30 sm:p-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="mb-8 flex justify-center">
          <PrimeLogo className="h-12" />
        </div>

        <Suspense fallback={<div className="p-4 text-center text-[var(--muted-foreground)]">Chargement...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
