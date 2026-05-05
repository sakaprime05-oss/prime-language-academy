import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStudentPaymentStatus } from "@/app/actions/payments";
import Link from "next/link";
import PaymentForm from "./PaymentForm";
import { SupportLink } from "@/components/support-link";
import { paymentMethodLabel } from "@/lib/payment-methods";

export default async function StudentPaymentsPage({ searchParams }: { searchParams?: Promise<{ locked?: string }> }) {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") redirect("/login");
    const params = await searchParams;

    const paymentPlan = await getStudentPaymentStatus(session.user.id);

    if (!paymentPlan) {
        return (
            <div className="glass-card flex min-h-[50vh] flex-col items-center justify-center rounded-xl p-5 text-center sm:p-6">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                </div>
                <h2 className="text-2xl font-black text-[var(--foreground)]">Aucun paiement requis</h2>
                <p className="text-[var(--foreground)]/60 max-w-md mt-2">
                    Vous n'avez pas de plan de paiement actif. Si c'est une erreur, contactez le support.
                </p>
                <Link href="/dashboard/student" className="mt-8 text-sm font-black text-primary hover:underline">
                    ← Retour au tableau de bord
                </Link>
            </div>
        );
    }

    const remaining = paymentPlan.totalAmount - paymentPlan.amountPaid;
    const halfAmount = paymentPlan.totalAmount / 2;
    const nextPaymentStage = paymentPlan.amountPaid <= 0 ? "Prise en charge" : "Réservation";

    return (
        <div className="platform-page animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="platform-page-header">
                <Link href="/dashboard/student" className="mb-3 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-primary hover:underline">
                    ← Retour
                </Link>
                <p className="platform-eyebrow">Paiement formation</p>
                <h2 className="platform-title">Solde et reçus</h2>
                <p className="platform-subtitle">Consultez votre solde et réglez la Prise en charge puis la Réservation.</p>
                <SupportLink context="payment" className="mt-3" />
            </header>

            {params?.locked === "1" && (
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-4 text-sm font-bold leading-6 text-amber-700 dark:text-amber-400">
                    Votre compte est créé, mais l'espace cours reste verrouillé jusqu'à la confirmation de la Prise en charge.
                </div>
            )}

            <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className={`glass-card !p-4 sm:!p-5 border-primary/20 ${paymentPlan.amountPaid > 0 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-primary/[0.03]"}`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">1. Prise en charge</p>
                    <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">{halfAmount.toLocaleString()} FCFA</h3>
                    <p className="mt-2 text-xs font-bold leading-6 text-[var(--foreground)]/55">
                        Donne accès à la documentation, aux conseils, à la plateforme et au suivi.
                    </p>
                </div>
                <div className={`glass-card !p-4 sm:!p-5 border-secondary/20 ${remaining <= 0 ? "bg-emerald-500/5 border-emerald-500/20" : "bg-secondary/[0.03]"}`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/60">2. Réservation</p>
                    <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">{halfAmount.toLocaleString()} FCFA</h3>
                    <p className="mt-2 text-xs font-bold leading-6 text-[var(--foreground)]/55">
                        Confirme définitivement votre place dans la session et complète le solde.
                    </p>
                </div>
            </section>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-6">
                {/* Status Card */}
                <div className="glass-card relative flex h-fit flex-col justify-between overflow-hidden !p-4 sm:!p-6">
                    <div className="relative z-10 space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-[var(--foreground)]/40 uppercase tracking-[0.2em] mb-1">État du compte</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">{remaining.toLocaleString()} FCFA</h3>
                                <span className={`status-badge ${remaining === 0 ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'}`}>
                                    {remaining === 0 ? 'Réglé' : 'À régler'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-[var(--foreground)]/10 pt-4 text-sm font-bold">
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
                    <div className="glass-card flex flex-col items-center justify-center space-y-4 border-emerald-500/20 bg-emerald-500/5 !p-6 text-center sm:!p-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
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
                                <div key={t.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-[var(--foreground)]/[0.02] sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex gap-4 items-center">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : t.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[var(--foreground)]">{t.amount.toLocaleString()} FCFA</p>
                                            <p className="text-[10px] font-black uppercase text-[var(--foreground)]/30 tracking-widest">{paymentMethodLabel(t.provider || t.method)} - {new Date(t.date).toLocaleDateString("fr-FR")}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                        {t.status === 'COMPLETED' && (
                                            <Link 
                                                href={`/api/invoice/${t.id}`}
                                                target="_blank"
                                                download
                                                className="hidden items-center gap-1 rounded border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary/15 hover:underline sm:flex"
                                                title="Télécharger le reçu PDF"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                <span>Reçu PDF</span>
                                            </Link>
                                        )}
                                        <span className={`status-badge ${t.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' : t.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
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
