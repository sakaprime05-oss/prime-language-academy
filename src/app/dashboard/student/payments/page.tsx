import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStudentPaymentStatus } from "@/app/actions/payments";
import Link from "next/link";
import PaymentForm from "./PaymentForm";

export default async function StudentPaymentsPage() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") redirect("/login");

    const paymentPlan = await getStudentPaymentStatus(session.user.id);

    if (!paymentPlan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                </div>
                <h2 className="text-2xl font-black text-[var(--foreground)]">Aucun paiement requis</h2>
                <p className="text-[var(--foreground)]/60 max-w-md mt-2">
                    Vous n'avez pas de plan de paiement actif. Si c'est une erreur, contactez le support.
                </p>
                <Link href="/dashboard/student" className="mt-8 text-primary font-bold hover:underline">
                    ← Retour au tableau de bord
                </Link>
            </div>
        );
    }

    const remaining = paymentPlan.totalAmount - paymentPlan.amountPaid;
    const halfAmount = paymentPlan.totalAmount / 2;
    const nextPaymentStage = paymentPlan.amountPaid <= 0 ? "Prise en Charge" : "Reservation";

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <header className="space-y-2">
                <Link href="/dashboard/student" className="text-xs font-black text-primary hover:underline flex items-center gap-1 mb-4 uppercase tracking-widest">
                    ← Retour
                </Link>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">Gestion des Paiements</h2>
                <p className="text-[var(--foreground)]/50 font-medium">Consultez votre solde et reglez la Prise en Charge puis la Reservation.</p>
            </header>


            <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className={`glass-card !p-5 border-primary/20 ${paymentPlan.amountPaid > 0 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-primary/[0.03]"}`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">1. Prise en Charge</p>
                    <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">{halfAmount.toLocaleString()} FCFA</h3>
                    <p className="mt-2 text-xs font-bold leading-6 text-[var(--foreground)]/55">
                        Donne acces a la documentation, aux conseils, a la plateforme et au suivi.
                    </p>
                </div>
                <div className={`glass-card !p-5 border-secondary/20 ${remaining <= 0 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-secondary/[0.03]"}`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">2. Reservation</p>
                    <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">{halfAmount.toLocaleString()} FCFA</h3>
                    <p className="mt-2 text-xs font-bold leading-6 text-[var(--foreground)]/55">
                        Confirme definitivement votre place dans la session et complete le solde.
                    </p>
                </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {/* Status Card */}
                <div className="glass-card !p-5 sm:!p-8 flex flex-col justify-between relative overflow-hidden h-fit">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16"></div>

                    <div className="relative z-10 space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.2em] mb-1">État du compte</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">{remaining.toLocaleString()} FCFA</h3>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${remaining === 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                    {remaining === 0 ? 'Réglé' : 'À régler'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[var(--foreground)]/5 text-sm font-bold">
                            <div className="flex justify-between">
                                <span className="opacity-40">Total Formation</span>
                                <span>{paymentPlan.totalAmount.toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-40">Total Versé</span>
                                <span className="text-emerald-500">{paymentPlan.amountPaid.toLocaleString()} FCFA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Card */}
                {remaining > 0 ? (
                    <PaymentForm planId={paymentPlan.id} maxAmount={remaining} stageLabel={nextPaymentStage} />
                ) : (
                    <div className="glass-card !p-6 sm:!p-10 flex flex-col items-center justify-center text-center space-y-4 border-emerald-500/20 bg-emerald-500/5">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                            <p className="text-lg font-black text-emerald-600">Tout est en règle !</p>
                            <p className="text-xs font-bold text-emerald-600/60 mt-1 uppercase tracking-widest">Profitez bien de vos cours d'anglais.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* History */}
            <section className="space-y-4">
                <h3 className="text-lg font-black text-[var(--foreground)] flex items-center gap-2 px-2">
                    <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Historique des transactions
                </h3>
                <div className="glass-card !p-0 overflow-hidden">
                    {paymentPlan.transactions.length === 0 ? (
                        <p className="p-5 sm:p-8 text-center text-xs font-bold text-[var(--foreground)]/30 uppercase tracking-[0.12em] sm:tracking-widest">Aucune transaction enregistrée</p>
                    ) : (
                        <div className="divide-y divide-[var(--foreground)]/5">
                            {paymentPlan.transactions.map((t: any) => (
                                <div key={t.id} className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-[var(--foreground)]/[0.02] transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : t.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[var(--foreground)]">{t.amount.toLocaleString()} FCFA</p>
                                            <p className="text-[10px] font-black uppercase text-[var(--foreground)]/30 tracking-widest">{t.method} • {new Date(t.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                        {t.status === 'COMPLETED' && (
                                            <Link 
                                                href={`/api/invoice/${t.id}`}
                                                target="_blank"
                                                download
                                                className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-[#21286E] hover:text-[#E7162A] hover:underline items-center gap-1 bg-[#21286E]/10 px-3 py-1.5 rounded-full transition-colors"
                                                title="Telecharger le recu PDF"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                <span>Recu PDF</span>
                                            </Link>
                                        )}
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : t.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {t.status === 'COMPLETED' ? 'Réussi' : t.status === 'PENDING' ? 'En attente' : 'Échoué'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
