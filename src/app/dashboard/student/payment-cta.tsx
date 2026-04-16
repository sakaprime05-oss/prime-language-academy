"use client";

import { useState } from "react";

interface PaymentCTAProps {
    amount: number;
    studentId: string;
    planId: string;
}

export default function PaymentCTA({ amount, studentId, planId }: PaymentCTAProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async () => {
        setLoading(true);
        setError("");
        try {
            // API d'initiation Pawapay (MOCK)
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId, planId, amount, phone: "2250102030405" })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Dans la réalité, on redirigerait vers l'URL Pawapay ou on ouvrirait un widget
            alert("Demande Pawapay envoyée sur votre téléphone. Veuillez valider avec votre code secret Mobile Money.");

            // Pour la démo, on simule le webhook qui s'appelle en arrière-plan après 5 secondes
            setTimeout(async () => {
                await fetch("/api/webhooks/pawapay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ referenceId: data.transactionId, status: "COMPLETED" }) // Ici, transactionId = referenceId dans notre mock MVP
                });
                window.location.reload(); // Rafraîchir pour voir le nouveau statut
            }, 5000);

        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors mt-2 text-center shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Vérification..." : "Payer maintenant via Pawapay"}
            </button>
            {error && <p className="text-xs text-red-500 font-bold bg-white/50 px-2 py-1 rounded inline-block">{error}</p>}
        </div>
    );
}
