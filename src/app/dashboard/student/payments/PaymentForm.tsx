"use client";

import { useState } from "react";
import { initiatePayment } from "@/app/actions/payments";

const paymentMethods = [
    { id: "WAVE", name: "Wave", detail: "Rapide a Abidjan" },
    { id: "MOBILE_MONEY", name: "Mobile Money", detail: "Orange Money, MTN ou Moov" },
    { id: "CARD", name: "Carte bancaire", detail: "Visa ou Mastercard" },
];

export default function PaymentForm({ planId, maxAmount, stageLabel }: { planId: string; maxAmount: number; stageLabel: string }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("WAVE");
    const selectedPaymentMethod = paymentMethods.find((method) => method.id === paymentMethod) || paymentMethods[0];

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
            setSuccess(`Ouverture du paiement ${selectedPaymentMethod.name}...`);
            window.location.href = res.redirectUrl;
        }
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card !p-5 sm:!p-8 flex flex-col gap-5 sm:gap-6 border-primary/20 bg-primary/[0.02]">
            <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-[var(--foreground)]">{stageLabel}</h3>
                <p className="text-xs font-medium text-[var(--foreground)]/50">
                    Choisissez votre moyen de paiement. Le montant reste calcule automatiquement.
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
                        Moyen de paiement
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {paymentMethods.map((method) => (
                            <label key={method.id} className={`p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === method.id ? "bg-primary/10 border-primary text-primary" : "bg-[var(--foreground)]/5 border-[var(--foreground)]/10 text-[var(--foreground)]/70 hover:border-[var(--foreground)]/20"}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={() => setPaymentMethod(method.id)}
                                    className="sr-only"
                                />
                                <span className="block text-xs font-black">{method.name}</span>
                                <span className="mt-1 block text-[10px] font-bold opacity-60 leading-snug">{method.detail}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 px-1">
                        Montant a payer (FCFA)
                    </label>
                    <input name="amount" type="hidden" value={maxAmount} readOnly />
                    <div className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl px-5 py-4 font-black text-base sm:text-lg">
                        {maxAmount.toLocaleString()} FCFA
                    </div>
                    <p className="text-[11px] font-medium text-[var(--foreground)]/45 px-1">
                        Ce montant est calcule automatiquement depuis votre solde restant.
                    </p>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs font-bold text-[var(--foreground)]/70">
                    <div className="flex items-center justify-between gap-3">
                        <span>{stageLabel}</span>
                        <span>{maxAmount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-[var(--foreground)]/50">
                        <span>Moyen choisi</span>
                        <span>{selectedPaymentMethod.name}</span>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !!success}
                className="btn-primary w-full min-h-12 py-4 sm:py-5 text-sm sm:text-lg shadow-xl shadow-primary/20"
            >
                {loading ? "Traitement..." : `Payer avec ${selectedPaymentMethod.name}`}
            </button>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Orange_logo.svg" alt="Orange" className="h-5 grayscale hover:grayscale-0 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" alt="MTN" className="h-5 grayscale hover:grayscale-0 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/fr/4/49/Wave_Mobile_Money.svg" alt="Wave" className="h-5 grayscale hover:grayscale-0 transition-all" />
            </div>
        </form>
    );
}
