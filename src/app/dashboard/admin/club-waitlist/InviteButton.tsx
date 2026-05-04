"use client";

import { useState } from "react";
import { inviteClubWaitlistStudent } from "@/app/actions/admin-students";

export function InviteButton({ studentId }: { studentId: string }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleInvite() {
        setLoading(true);
        setMessage("");

        const result = await inviteClubWaitlistStudent(studentId);
        if (result?.error) {
            setMessage(result.error);
            setLoading(false);
            return;
        }

        setMessage("Invitation envoyee. Le membre peut maintenant finaliser son paiement en ligne.");
        setLoading(false);
    }

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={handleInvite}
                disabled={loading}
                className="w-full rounded-xl bg-red-500 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-red-600 disabled:opacity-50 sm:w-auto"
            >
                {loading ? "Envoi..." : "Liberer une place"}
            </button>
            {message && (
                <p className="max-w-xs text-[11px] font-bold leading-5 text-white/55">
                    {message}
                </p>
            )}
        </div>
    );
}
