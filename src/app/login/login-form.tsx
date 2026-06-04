"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("status");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        try {
          const statusRes = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
          const data = await statusRes.json();

          if (data.canResumePayment) {
            setError(
              "Votre paiement n'est pas encore confirme. Reprenez votre inscription avec le meme email et le meme mot de passe pour finaliser le paiement."
            );
          } else if (data.accountUnavailable) {
            setError("Votre compte est bloque. Contactez l'administration pour le reactiver.");
          } else {
            setError("Email ou mot de passe incorrect.");
          }
        } catch {
          setError("Email ou mot de passe incorrect.");
        }
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur de connexion est survenue.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert tone="error">{error}</Alert>}

      {paymentStatus === "payment_success" && (
        <Alert tone="success">Paiement recu. Vous pouvez maintenant vous connecter a votre espace.</Alert>
      )}

      {paymentStatus === "payment_pending" && (
        <Alert tone="warning">
          Paiement en cours de verification. Reessayez dans quelques instants ou contactez l'administration.
        </Alert>
      )}

      {paymentStatus === "payment_error" && (
        <Alert tone="error">
          La confirmation du paiement n'a pas pu etre verifiee. Contactez l'administration si le debit est confirme.
        </Alert>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="label-sm">Adresse email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="nom@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <label className="label-sm flex w-full items-center justify-between">
            <span>Mot de passe</span>
            <a href="/forgot-password" className="text-[var(--primary)] hover:underline normal-case tracking-normal">
              Oublie ?
            </a>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Votre mot de passe"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Verification...
          </span>
        ) : (
          "Acceder a mon espace"
        )}
      </button>
    </form>
  );
}

function Alert({ tone, children }: { tone: "error" | "success" | "warning"; children: React.ReactNode }) {
  const classes =
    tone === "success"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "warning"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

  return (
    <div className={`rounded-2xl border p-4 text-center text-xs font-bold animate-in fade-in slide-in-from-top-1 ${classes}`}>
      {children}
    </div>
  );
}
