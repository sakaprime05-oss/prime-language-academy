"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitManualPayment } from "@/app/actions/payments";

export default function ManualPaymentForm({ transactionId }: { transactionId: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.append("transactionId", transactionId);

        try {
            const res = await submitManualPayment(formData);
            if (res.error) throw new Error(res.error);
            
            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard/student");
                router.refresh();
            }, 3000);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la soumission");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center p-6 bg-green-500/10 text-green-600 rounded-2xl border border-green-500/20">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="font-black text-lg mb-2">Reçu !</h3>
                <p className="text-xs font-bold">Votre paiement est en cours de vérification. Votre compte sera activé sous peu.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 px-1">Opérateur utilisé *</label>
                <select name="provider" required className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none font-bold">
                    <option value="ORANGE">Orange Money</option>
                    <option value="WAVE">Wave</option>
                    <option value="MTN">MTN Mobile Money</option>
                    <option value="OTHER">Autre</option>
                </select>
            </div>
            
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 px-1">Numéro d'envoi *</label>
                <input type="text" name="senderPhone" required placeholder="Ex: 07 07 07 07 07" className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none font-bold placeholder:opacity-50" />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 px-1">Référence (Optionnel)</label>
                <input type="text" name="proof" placeholder="ID de transaction / Notes" className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none font-bold placeholder:opacity-50" />
            </div>

            {error && <div className="text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-xl">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-4 disabled:opacity-50">
                {loading ? "Soumission..." : "J'ai bien effectué le paiement"}
            </button>
        </form>
    );
}
