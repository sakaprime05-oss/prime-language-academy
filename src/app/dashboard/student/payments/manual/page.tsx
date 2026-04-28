import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ManualPaymentForm from "./manual-form";
import { WAVE_LINKS } from "@/lib/wave-config";
import { Smartphone, ExternalLink } from "lucide-react";

export default async function ManualPaymentPage() {
    const session = await auth();
    if (!session || !session.user) {
        redirect("/login");
    }

    const userId = session.user.id;

    // Find the latest PENDING transaction for this user
    const pendingTransaction = await prisma.transaction.findFirst({
        where: {
            paymentPlan: { studentId: userId },
            status: "PENDING",
            method: "MANUAL",
        },
        include: {
            paymentPlan: {
                include: {
                    student: true
                }
            }
        },
        orderBy: { date: "desc" },
    });

    // Identify the plan to get the correct Wave link
    let planId = "default";
    try {
        const onboardingData = JSON.parse(pendingTransaction?.paymentPlan?.student?.onboardingData || "{}");
        planId = onboardingData.planId || "default";
    } catch (e) {}

    const waveLink = WAVE_LINKS[planId] || WAVE_LINKS["default"];

    if (!pendingTransaction) {
        // Obtenir le vrai statut du compte
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.status === "ACTIVE") {
             redirect("/dashboard/student");
        }
        return (
             <div className="p-8 text-center bg-amber-500/10 text-amber-600 rounded-2xl max-w-lg mx-auto mt-20">
                 Aucun paiement en attente. Si vous avez déjà payé, veuillez patienter que l'administration valide votre compte.
             </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-[var(--foreground)]">Finalisez votre inscription</h1>
                <p className="text-sm font-bold text-[var(--foreground)]/50 mt-2">Effectuez votre paiement via Mobile Money pour activer votre accès.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-[#21286E] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16"></div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Montant à régler</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">{pendingTransaction.amount.toLocaleString()}</span>
                            <span className="text-sm font-bold opacity-60">FCFA</span>
                        </div>
                        <p className="text-xs font-medium opacity-40 mt-4 uppercase tracking-widest">Frais de scolarité • Prime Academy</p>
                    </div>

                    <div className="bg-[#1dcaff]/10 p-8 rounded-[2rem] border border-[#1dcaff]/20 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#1dcaff] rounded-xl flex items-center justify-center shadow-lg shadow-[#1dcaff]/20">
                                    <Smartphone className="text-white w-6 h-6" />
                                </div>
                                <h2 className="font-black text-[#1dcaff] text-lg">Paiement Wave</h2>
                            </div>
                            <span className="px-2 py-1 bg-[#1dcaff]/20 text-[#1dcaff] text-[8px] font-black uppercase tracking-tighter rounded">Recommandé</span>
                        </div>
                        
                        <p className="text-xs font-bold text-[var(--foreground)]/60 leading-relaxed">
                            Cliquez sur le bouton ci-dessous pour ouvrir votre application Wave et valider le paiement.
                        </p>

                        <a 
                            href={waveLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-[#1dcaff] hover:bg-[#19b5e6] text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-[#1dcaff]/25 active:scale-95 group"
                        >
                            Ouvrir Wave
                            <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>

                    <div className="p-6 rounded-2xl border border-[var(--foreground)]/5 bg-[var(--foreground)]/[0.02]">
                        <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-widest mb-2">Autre moyen</p>
                        <p className="text-sm font-bold text-[var(--foreground)]/80 italic">Orange Money : +225 01 61 33 78 64</p>
                    </div>
                </div>

                <div className="glass-card p-8 border-white/20 flex flex-col h-full">
                    <div className="mb-6">
                        <h2 className="text-lg font-black text-[var(--foreground)]">Je confirme mon dépôt</h2>
                        <p className="text-xs font-medium text-[var(--foreground)]/50 mt-1">
                            Une fois le transfert effectué, saisissez la référence ou le numéro d'expédition pour validation.
                        </p>
                    </div>
                    <ManualPaymentForm transactionId={pendingTransaction.id} />
                </div>
            </div>
        </div>
    );
}
