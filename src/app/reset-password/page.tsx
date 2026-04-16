"use client";

import { useState, Suspense } from "react";
import { resetPassword } from "@/app/actions/auth-reset";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PrimeLogo } from "@/components/logo";

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
                <p className="text-red-500 mb-4">Lien de réinitialisation invalide ou manquant.</p>
                <Link href="/forgot-password" className="text-[var(--primary)] font-bold hover:underline">
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

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            setLoading(false);
            return;
        }

        const res = await resetPassword(token, password);
        if (res.error) {
            setError(res.error);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Mot de passe modifié !</h2>
                <p className="text-[var(--foreground)]/60 mb-6">Vous allez être redirigé vers la page de connexion.</p>
                <Link href="/login" className="text-sm font-bold text-[var(--primary)] hover:underline">
                    Aller à la connexion
                </Link>
            </div>
        );
    }

    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-center text-[var(--foreground)]">Nouveau mot de passe</h2>
                <p className="mt-2 text-center text-sm text-[var(--foreground)]/60">
                    Veuillez choisir votre nouveau mot de passe.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)]/80 mb-1">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all text-[var(--foreground)] placeholder-[var(--foreground)]/30"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)]/80 mb-1">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all text-[var(--foreground)] placeholder-[var(--foreground)]/30"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                    {loading ? "Enregistrement..." : "Modifier le mot de passe"}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
            <div className="w-full max-w-md space-y-8 bg-[var(--surface)] p-8 rounded-2xl border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
                <div className="flex justify-center mb-8">
                    <PrimeLogo className="h-12" />
                </div>
                
                <Suspense fallback={<div className="text-center p-4">Chargement...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
