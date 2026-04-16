"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/actions/auth-reset";
import Link from "next/link";
import { PrimeLogo } from "@/components/logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const res = await requestPasswordReset(email);
        if (res.error) {
            setError(res.error);
        } else if (res.message) {
            setMessage(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
            <div className="w-full max-w-md space-y-8 bg-[var(--surface)] p-8 rounded-2xl border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
                <div className="flex justify-center mb-8">
                    <PrimeLogo className="h-12" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-center text-[var(--foreground)]">Mot de passe oublié</h2>
                    <p className="mt-2 text-center text-sm text-[var(--foreground)]/60">
                        Entrez votre email pour recevoir un lien de réinitialisation.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-lg text-sm text-center">
                            {message}
                        </div>
                    )}

                    {!message && (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]/80 mb-1">
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all text-[var(--foreground)] placeholder-[var(--foreground)]/30"
                                placeholder="vous@exemple.com"
                            />
                        </div>
                    )}

                    {!message ? (
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                        >
                            {loading ? "Envoi en cours..." : "Envoyer le lien"}
                        </button>
                    ) : (
                        <Link href="/login">
                            <button
                                type="button"
                                className="w-full py-3 px-4 bg-[var(--surface-hover)] hover:bg-[var(--glass-border)] text-[var(--foreground)] rounded-xl font-bold transition-colors mt-4"
                            >
                                Retour à la connexion
                            </button>
                        </Link>
                    )}
                </form>

                <div className="text-center mt-6">
                    <Link href="/login" className="text-sm font-bold text-[var(--primary)] hover:underline">
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}
