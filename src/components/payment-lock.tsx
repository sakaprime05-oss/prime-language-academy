import Link from "next/link";
import { ArrowRight, Lock, Smartphone } from "lucide-react";

export function PaymentLock() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)] p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--primary)]/10 shadow-2xl shadow-red-500/20">
            <Lock className="h-10 w-10 text-[var(--primary)]" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 rounded-full border-4 border-[var(--background)] bg-amber-500 p-2 text-white animate-bounce">
            <Smartphone size={16} strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black leading-tight tracking-tight text-[var(--foreground)]">
            Acces en attente de <span className="text-[var(--primary)]">paiement</span>
          </h2>
          <p className="px-4 text-sm font-medium leading-relaxed text-[var(--muted-foreground)]">
            Pour acceder a vos cours et aux ressources de l'academie, vous devez d'abord finaliser votre paiement.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--primary)]">Etape suivante</p>
          <p className="text-sm font-bold text-[var(--foreground)]">
            Choisissez votre moyen de paiement, suivez les instructions, puis revenez a votre espace apres confirmation.
          </p>

          <Link
            href="/dashboard/student/payments"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-4 text-sm font-black text-[var(--primary-foreground)] shadow-lg shadow-red-500/25 transition-all active:scale-95"
          >
            Continuer le paiement
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Prime Language Academy</p>
      </div>
    </div>
  );
}
