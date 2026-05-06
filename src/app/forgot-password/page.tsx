"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth-reset";
import { PrimeLogo } from "@/components/logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [resultCode, setResultCode] = useState("");

    const whatsappLink = useMemo(() => {
        const text = email.trim()
            ? `Bonjour Prime Language Academy, je n'arrive pas à récupérer mon compte avec cet email : ${email.trim()}`
            : "Bonjour Prime Language Academy, j'ai oublié l'email utilisé pour mon inscription et je veux récupérer mon compte.";
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
            <div className="w-full max-w-md space-y-7 bg-[var(--surface)] p-8 rounded-2xl border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
                <div className="flex justify-center">
                    <PrimeLogo className="h-12" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-center text-[var(--foreground)]">Récupération du compte</h2>
                    <p className="mt-2 text-center text-sm text-[var(--foreground)]/60">
                        Entrez l'email utilisé à l'inscription. Le site vous dira si le compte est retrouvé et enverra un lien valable 1 heure.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="space-y-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
                            <p className="font-bold">{error}</p>
                            {resultCode === "not_found" && (
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/register" className="rounded-lg bg-red-500 px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                                        Créer un compte
                                    </Link>
                                    <a href={whatsappLink} target="_blank" rel="noreferrer" className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-black uppercase tracking-widest">
                                        J'ai oublié mon email
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
                        <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600">
                            <p className="font-bold">{message}</p>
                            <p className="text-xs leading-5 text-[var(--foreground)]/60">
                                Vérifiez aussi les spams, promotions ou courriers indésirables. Si rien n'arrive après quelques minutes, contactez l'administration.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/login" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
                                    Retour connexion
                                </Link>
                                {resultCode === "pending_sent" && (
                                    <Link href="/register" className="rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-black uppercase tracking-widest text-emerald-700">
                                        Reprendre paiement
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                        {loading ? "Vérification..." : "Vérifier et envoyer le lien"}
                    </button>
                </form>

                <div className="flex flex-wrap justify-center gap-4 text-center text-sm">
                    <Link href="/login" className="font-bold text-[var(--primary)] hover:underline">
                        Retour à la connexion
                    </Link>
                    <a href={whatsappLink} target="_blank" rel="noreferrer" className="font-bold text-[var(--foreground)]/60 hover:text-[var(--primary)] hover:underline">
                        Email oublié ?
                    </a>
                </div>
            </div>
        </div>
    );
}
