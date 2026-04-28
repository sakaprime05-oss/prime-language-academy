"use client";

import { useState } from "react";
import { approveTransaction, rejectTransaction } from "@/app/actions/payments";
import { useRouter } from "next/navigation";

export default function AdminPaymentsClient({ initialTransactions }: { initialTransactions: any[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const handleApprove = async (id: string) => {
        if (!confirm("Confirmer la réception de ce paiement ? L'étudiant sera activé.")) return;
        setLoadingId(id);
        const res = await approveTransaction(id);
        if (res.error) alert(res.error);
        setLoadingId(null);
        router.refresh();
    };

    const handleReject = async (id: string) => {
        const reason = prompt("Raison du rejet ? (Ex: Paiement non reçu)");
        if (!reason) return;
        setLoadingId(id);
        const res = await rejectTransaction(id, reason);
        if (res.error) alert(res.error);
        setLoadingId(null);
        router.refresh();
    };

    return (
        <div className="bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--foreground)]/10 text-[var(--foreground)]/50 text-xs uppercase tracking-widest font-black">
                            <th className="p-4">Date</th>
                            <th className="p-4">Étudiant</th>
                            <th className="p-4">Détails Transfert</th>
                            <th className="p-4">Montant</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--foreground)]/5">
                        {initialTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-[var(--foreground)]/50 font-bold">
                                    Aucune transaction à afficher.
                                </td>
                            </tr>
                        ) : initialTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-[var(--foreground)]/5 transition-colors">
                                <td className="p-4 font-bold text-[var(--foreground)]/70">
                                    {new Date(tx.date).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-4">
                                    <div className="font-black text-[var(--foreground)]">{tx.paymentPlan?.student?.name}</div>
                                    <div className="text-xs font-bold text-[var(--foreground)]/50">{tx.paymentPlan?.student?.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="inline-flex items-center gap-1 font-bold text-[var(--foreground)]">
                                        <span className={`w-2 h-2 rounded-full ${tx.provider === 'ORANGE' ? 'bg-orange-500' : tx.provider === 'WAVE' ? 'bg-blue-500' : tx.provider === 'MTN' ? 'bg-yellow-400' : 'bg-gray-500'}`}></span>
                                        {tx.provider || "Non précisé"}
                                    </div>
                                    <div className="text-xs font-bold text-[var(--foreground)]/50 mt-1">Expéditeur: {tx.senderPhone || "-"}</div>
                                    <div className="text-xs text-[var(--foreground)]/40 mt-1">
                                        {tx.proof?.startsWith("/uploads/") ? (
                                            <a href={tx.proof} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#1dcaff] hover:underline font-bold">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                Voir le reçu Wave
                                            </a>
                                        ) : (
                                            `Réf: ${tx.proof || "-"}`
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-black text-primary">
                                    {tx.amount.toLocaleString()} FCFA
                                </td>
                                <td className="p-4">
                                    {tx.status === "VERIFYING" ? (
                                        <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20">À vérifier</span>
                                    ) : tx.status === "COMPLETED" ? (
                                        <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/20">Validé</span>
                                    ) : tx.status === "FAILED" ? (
                                        <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-red-500/20">Rejeté</span>
                                    ) : (
                                        <span className="bg-[var(--foreground)]/10 text-[var(--foreground)]/50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-[var(--foreground)]/20">En attente dépôt</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {tx.status === "VERIFYING" && (
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleReject(tx.id)}
                                                disabled={loadingId === tx.id}
                                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors disabled:opacity-50"
                                                title="Rejeter"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleApprove(tx.id)}
                                                disabled={loadingId === tx.id}
                                                className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-green-500/20"
                                                title="Approuver"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
