import Link from "next/link";
import { Smartphone, Lock, ArrowRight } from "lucide-react";

export function PaymentLock() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#fdfeff] dark:bg-[#080808] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-[#E7162A]/10 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-[#E7162A]/20">
            <Lock className="w-10 h-10 text-[#E7162A]" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-full border-4 border-[#fdfeff] dark:border-[#080808] animate-bounce">
            <Smartphone size={16} strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-[#21286E] dark:text-white tracking-tight leading-tight">
            Accès en attente de <span className="text-[#E7162A]">validation</span>
          </h2>
          <p className="text-[#21286E]/60 dark:text-white/40 text-sm font-medium leading-relaxed px-4">
            Pour accéder à vos cours et aux ressources de l'académie, vous devez d'abord régulariser votre inscription.
          </p>
        </div>

        <div className="glass-card bg-[#E7162A]/5 border-[#E7162A]/20 p-6 rounded-2xl space-y-4">
          <p className="text-xs font-black text-[#E7162A] uppercase tracking-widest">Étape suivante</p>
          <p className="text-sm font-bold text-[#21286E] dark:text-white/80">
            Effectuez votre paiement via Mobile Money et transmettez votre preuve de dépôt.
          </p>
          
          <Link 
            href="/dashboard/student/payments/manual" 
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#E7162A] hover:bg-[#c41222] text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-[#E7162A]/25 active:scale-95 group"
          >
            Instructions de Paiement
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <p className="text-[10px] font-bold text-[#21286E]/30 dark:text-white/20 uppercase tracking-[0.3em]">
          Prime Language Academy
        </p>
      </div>
    </div>
  );
}
