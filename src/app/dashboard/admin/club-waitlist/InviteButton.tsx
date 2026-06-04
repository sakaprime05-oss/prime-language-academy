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
        className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary)]/90 disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Envoi..." : "Liberer une place"}
      </button>
      {message && <p className="max-w-xs text-[11px] font-bold leading-5 text-[var(--muted-foreground)]">{message}</p>}
    </div>
  );
}
