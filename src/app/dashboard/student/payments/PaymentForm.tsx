"use client";

import { useState } from "react";
import { initiatePayment } from "@/app/actions/payments";

export default function PaymentForm({ planId, maxAmount }: { planId: string; maxAmount: number }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.append("planId", planId);

        const res = await initiatePayment(formData);

        if (res.error) {
            setError(res.error);
            setLoading(false);
        } else if (res.redirectUrl) {
            setSuccess("Redirection vers Paystack...");
            window.location.href = res.redirectUrl;
        }
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card !p-5 sm:!p-8 flex flex-col gap-5 sm:gap-6 border-primary/20 bg-primary/[0.02]">
            <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-[var(--foreground)]">Payer maintenant</h3>
                <p className="text-xs font-medium text-[var(--foreground)]/50">
                    Effectuez un paiement sécurisé via Paystack (Mobile Money ou Carte).
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                    {success}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 px-1">
                        Montant à payer (FCFA)
                    </label>
                    <input name="amount" type="hidden" value={maxAmount} readOnly />
                    <div className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl px-5 py-4 font-black text-base sm:text-lg">
                        {maxAmount.toLocaleString()} FCFA
                    </div>
                    <p className="text-[11px] font-medium text-[var(--foreground)]/45 px-1">
                        Ce montant est calculé automatiquement depuis votre solde restant.
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !!success}
                className="btn-primary w-full min-h-12 py-4 sm:py-5 text-sm sm:text-lg shadow-xl shadow-primary/20"
            >
                {loading ? "Traitement..." : "Payer avec Paystack"}
            </button>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Orange_logo.svg" alt="Orange" className="h-5 grayscale hover:grayscale-0 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" alt="MTN" className="h-5 grayscale hover:grayscale-0 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/fr/4/49/Wave_Mobile_Money.svg" alt="Wave" className="h-5 grayscale hover:grayscale-0 transition-all" />
            </div>
        </form>
    );
}
