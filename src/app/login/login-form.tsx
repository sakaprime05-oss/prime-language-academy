"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                setError("Identifiants incorrects ou compte inactif.");
                setLoading(false);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Une erreur de connexion est survenue.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl text-center animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black px-1 text-[var(--foreground)]/70 uppercase tracking-[0.2em]">
                        Adresse Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl px-5 py-4 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent focus:outline-none transition-all placeholder:text-[var(--foreground)]/50"
                        placeholder="nom@exemple.com"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black px-1 text-[var(--foreground)]/70 uppercase tracking-[0.2em] flex justify-between">
                        <span>Mot de passe</span>
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl px-5 py-4 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent focus:outline-none transition-all placeholder:text-[var(--foreground)]/50"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="btn-primary"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Vérification...
                    </span>
                ) : (
                    "Accéder à mon espace"
                )}
            </button>
        </form>
    );
}
