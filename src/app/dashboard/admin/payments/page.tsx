import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTransactions, getPaymentStats } from "@/app/actions/admin-payments";
import Link from "next/link";

export default async function AdminPaymentsPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    const transactions = await getTransactions();
    const stats = await getPaymentStats();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-green-500/10 text-green-600";
            case "PENDING": return "bg-yellow-500/10 text-yellow-600";
            case "FAILED": return "bg-red-500/10 text-red-600";
            default: return "bg-gray-500/10 text-gray-600";
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <header className="mb-8">
                <Link href="/dashboard/admin" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-2">
                    ← Retour à l'admin
                </Link>
                <h2 className="text-3xl font-extrabold text-[var(--foreground)]">Suivi des Paiements</h2>
                <p className="text-[var(--foreground)]/60 text-sm">Gestion des revenus et historique des transactions Pawapay.</p>
            </header>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card !p-5">
                    <p className="text-[10px] font-bold text-[var(--foreground)]/50 uppercase tracking-widest mb-2">Revenu Total</p>
                    <p className="text-3xl font-black text-green-600">{stats.totalRevenue.toLocaleString('fr-FR')} F</p>
                </div>
                <div className="glass-card !p-5">
                    <p className="text-[10px] font-bold text-[var(--foreground)]/50 uppercase tracking-widest mb-2">En Attente</p>
                    <p className="text-3xl font-black text-yellow-600">{stats.pendingRevenue.toLocaleString('fr-FR')} F</p>
                </div>
                <div className="glass-card !p-5 border-red-500/20">
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">Retards (Plans)</p>
                    <p className="text-3xl font-black text-red-600">{stats.overdueCount}</p>
                </div>
            </section>

            {/* Transactions List */}
            <div className="space-y-4">
                <h3 className="font-bold text-xl text-[var(--foreground)]">Dernières Transactions</h3>
                {transactions.length === 0 ? (
                    <div className="glass-card text-center py-12">
                        <p className="text-[var(--foreground)]/50">Aucune transaction enregistrée.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx: any) => (
                            <div key={tx.id} className="glass-card hover:border-[var(--primary)]/30 transition-all !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
                                        {tx.method[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--foreground)] text-sm">
                                            {tx.paymentPlan?.student?.name || "Étudiant inconnu"}
                                        </p>
                                        <p className="text-[10px] text-[var(--foreground)]/50 font-mono">Ref: {tx.referenceId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6">
                                    <div className="text-right">
                                        <p className="font-black text-[var(--foreground)] text-sm">{tx.amount.toLocaleString('fr-FR')} F</p>
                                        <p className="text-[10px] text-[var(--foreground)]/40">{new Date(tx.date).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <div className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter ${getStatusColor(tx.status)}`}>
                                        {tx.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
