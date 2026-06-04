"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth-reset";
import { PrimeLogo } from "@/components/logo";
import ThemeToggle from "@/components/ThemeToggle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resultCode, setResultCode] = useState("");

  const whatsappLink = useMemo(() => {
    const text = email.trim()
      ? `Bonjour Prime Language Academy, je n'arrive pas a recuperer mon compte avec cet email : ${email.trim()}`
      : "Bonjour Prime Language Academy, j'ai oublie l'email utilise pour mon inscription et je veux recuperer mon compte.";
    return `https://wa.me/2250161337864?text=${encodeURIComponent(text)}`;
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setResultCode("");

    const res = await requestPasswordReset(email);
    if (res.error) {
      setError(res.error);
      setResultCode(res.code || "");
    } else if (res.message) {
      setMessage(res.message);
      setResultCode(res.code || "");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4 text-[var(--foreground)]">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5 dark:shadow-black/30 sm:p-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="mb-7 flex justify-center">
          <PrimeLogo className="h-12" />
        </div>
        <div>
          <h2 className="text-center text-2xl font-black text-[var(--foreground)]">Recuperation du compte</h2>
          <p className="mt-2 text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Entrez l'email utilise a l'inscription. Si le compte existe, un lien valable 1 heure sera envoye.
          </p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="space-y-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
              <p className="font-bold">{error}</p>
              {resultCode === "not_found" && (
                <div className="flex flex-wrap gap-2">
                  <Link href="/register" className="rounded-lg bg-red-500 px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                    Creer un compte
                  </Link>
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-black uppercase tracking-widest">
                    J'ai oublie mon email
                  </a>
                </div>
              )}
              {resultCode === "email_failed" && (
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex rounded-lg border border-red-500/30 px-3 py-2 text-xs font-black uppercase tracking-widest">
                  Contacter l'administration
                </a>
              )}
            </div>
          )}

          {message && (
            <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
              <p className="font-bold">{message}</p>
              <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                Verifiez aussi les spams ou promotions. Si rien n'arrive apres quelques minutes, contactez l'administration.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/login" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                  Retour connexion
                </Link>
                {resultCode === "pending_sent" && (
                  <Link href="/register" className="rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                    Reprendre paiement
                  </Link>
                )}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-bold text-[var(--foreground)]/80">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="vous@exemple.com"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Verification..." : "Verifier et envoyer le lien"}
          </button>
        </form>

        <div className="mt-7 flex flex-wrap justify-center gap-4 text-center text-sm">
          <Link href="/login" className="font-bold text-[var(--primary)] hover:underline">
            Retour a la connexion
          </Link>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:underline">
            Email oublie ?
          </a>
        </div>
      </div>
    </main>
  );
}
