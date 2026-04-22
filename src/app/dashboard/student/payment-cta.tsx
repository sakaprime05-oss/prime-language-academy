"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentCTAProps {
    amount: number;
    studentId: string;
    planId: string;
}

export default function PaymentCTA({ amount, studentId, planId }: PaymentCTAProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        setLoading(true);
        // Redirection vers le paiement manuel
        router.push("/dashboard/student/payments/manual");
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors mt-2 text-center shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Redirection..." : "Effectuer mon paiement (Wave/Orange/MTN)"}
            </button>
        </div>
    );
}
