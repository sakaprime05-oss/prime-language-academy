"use client";

import { useState } from "react";
import { initiatePayment } from "@/app/actions/payments";

export default function PaymentForm({ planId, maxAmount }: { planId: string, maxAmount: number }) {
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
        } else {
            setSuccess(res.message || "Paiement initié !");
            e.currentTarget.reset();
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-6 p-8 border-primary/20 bg-primary/[0.02]">
            <div className="space-y-1">
                <h3 className="text-xl font-black text-[var(--foreground)]">Payer maintenant</h3>
                <p className="text-xs font-medium text-[var(--foreground)]/50">Effectuez un versement sécurisé via Mobile Money.</p>
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
                        Opérateur Mobile Money
                    </label>
                    <select
                        name="provider"
                        required
                        className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl px-5 py-4 font-black text-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="ORANGE_CIV">Orange Money</option>
                        <option value="MTN_CIV">MTN MoMo</option>
                        <option value="MOOV_CIV">Moov Money</option>
                        <option value="WAVE_CIV">Wave</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 px-1">
                        Montant à verser (FCFA)
                    </label>
                    <input
                        name="amount"
                        type="number"
                        defaultValue={maxAmount}
                        max={maxAmount}
                        min={100}
                        required
                        className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl px-5 py-4 font-black text-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 px-1">
                        Numéro Mobile Money
                    </label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[var(--foreground)]/30 text-lg">+225</span>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="0102030405"
                            required
                            pattern="[0-9]{10}"
                            className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl pl-16 pr-5 py-4 font-black text-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all tracking-widest"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !!success}
                className="btn-primary w-full py-5 text-lg shadow-xl shadow-primary/20"
            >
                {loading ? "Traitement..." : `Payer via Mobile Money`}
            </button>

            <div className="flex justify-center items-center gap-6 opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Orange_logo.svg" alt="Orange" className="h-5 grayscale hover:grayscale-0 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" alt="MTN" className="h-5 grayscale hover:grayscale-0 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/fr/4/49/Wave_Mobile_Money.svg" alt="Wave" className="h-5 grayscale hover:grayscale-0 transition-all" />
            </div>
        </form>
    );
}
