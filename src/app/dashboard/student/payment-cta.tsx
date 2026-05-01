"use client";

import { useState } from "react";
import { initiatePayment } from "@/app/actions/payments";

interface PaymentCTAProps {
    amount: number;
    studentId: string;
    planId: string;
}

export default function PaymentCTA({ amount, studentId, planId }: PaymentCTAProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("planId", planId);
            formData.append("amount", amount.toString());
            
            const res = await initiatePayment(formData);
            if (res.redirectUrl) {
                window.location.href = res.redirectUrl;
            } else {
                alert("Erreur: " + (res.error || "Impossible d'initialiser le paiement"));
                setLoading(false);
            }
        } catch (e) {
            alert("Erreur de connexion");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary w-full mt-2"
            >
                {loading ? "Redirection sécurisée..." : "Payer par Mobile Money / Carte"}
            </button>
        </div>
    );
}
