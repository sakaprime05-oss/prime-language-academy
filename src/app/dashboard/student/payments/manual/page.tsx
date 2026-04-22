import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ManualPaymentForm from "./manual-form";

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
        orderBy: { date: "desc" },
    });

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

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-[var(--foreground)]/5 p-6 rounded-3xl border border-[var(--foreground)]/10">
                        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-4">Montant à régler</h2>
                        <div className="text-3xl font-black text-primary">
                            {pendingTransaction.amount.toLocaleString()} FCFA
                        </div>
                        <p className="text-xs font-bold text-[var(--foreground)]/50 mt-2">Frais de scolarité</p>
                    </div>

                    <div className="bg-orange-500/10 p-6 rounded-3xl border border-orange-500/20">
                        <h2 className="text-xs font-black uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Orange Money
                        </h2>
                        <p className="text-lg font-black text-[var(--foreground)]">+225 01 61 33 78 64</p>
                        <p className="text-xs font-bold text-[var(--foreground)]/50 mt-1">Prime Language Academy</p>
                    </div>
                </div>

                <div className="glass-card p-6 border-white/20">
                    <h2 className="font-black mb-4">Je confirme mon paiement</h2>
                    <ManualPaymentForm transactionId={pendingTransaction.id} />
                </div>
            </div>
        </div>
    );
}
