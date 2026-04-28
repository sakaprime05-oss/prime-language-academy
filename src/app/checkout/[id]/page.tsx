import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { WAVE_LINKS } from "@/lib/wave-config";
import { Smartphone, ExternalLink, CheckCircle } from "lucide-react";
import SimpleConfirmForm from "./simple-confirm-form";

export default async function CheckoutPage({ params }: { params: { id: string } }) {
    const transaction = await prisma.transaction.findUnique({
        where: { id: params.id },
        include: {
            paymentPlan: {
                include: { student: true }
            }
        }
    });

    if (!transaction) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fdfeff] dark:bg-[#080808] p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-black text-[#E7162A]">Transaction introuvable</h1>
                    <p className="text-[var(--foreground)]/60">Le lien de paiement est invalide ou expiré.</p>
                </div>
            </div>
        );
    }

    const student = transaction.paymentPlan.student;
    const isClub = student.registrationType === "CLUB";

    if (transaction.status === "COMPLETED" || transaction.status === "VERIFYING") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfeff] dark:bg-[#080808] p-4">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl font-black text-[#21286E] dark:text-white mb-2">Paiement en traitement</h1>
                <p className="text-center text-[var(--foreground)]/60 max-w-md">
                    Votre preuve de paiement a bien été reçue. L'administration procède à la vérification. 
                    Vous recevrez un email dès que votre compte {isClub ? "membre" : "étudiant"} sera activé.
                </p>
                <a href="/login" className="mt-8 btn-primary px-8">Aller à la connexion</a>
            </div>
        );
    }

    // Identify the plan to get the correct Wave link
    let planId = "default";
    try {
        const onboardingData = JSON.parse(transaction.paymentPlan.student.onboardingData || "{}");
        planId = onboardingData.planId || "default";
    } catch (e) {}

    const waveLink = WAVE_LINKS[planId] || WAVE_LINKS["default"];

    return (
        <div className="min-h-screen bg-[#fdfeff] dark:bg-[#080808] py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-block px-4 py-1.5 bg-[#E7162A]/10 text-[#E7162A] rounded-full text-xs font-black uppercase tracking-widest mb-2">
                        Dernière Étape
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#21286E] dark:text-white tracking-tight">
                        {isClub ? "Activez votre Membership Club" : "Validez votre inscription"}
                    </h1>
                    <p className="text-[var(--foreground)]/60 font-medium max-w-lg mx-auto">
                        {isClub 
                            ? "Félicitations ! Vous êtes à un clic de rejoindre le cercle privé du English Club. Finalisez votre adhésion ci-dessous."
                            : "Votre compte a été créé avec succès ! Effectuez votre paiement maintenant pour débloquer votre accès immédiat à la plateforme."}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-[#21286E] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16"></div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Montant à régler</h2>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">{transaction.amount.toLocaleString()}</span>
                                <span className="text-lg font-bold opacity-60">FCFA</span>
                            </div>
                            <p className="text-xs font-medium opacity-40 mt-4 uppercase tracking-widest">
                                {isClub ? "Adhésion English Club" : "Frais de scolarité"} • {student.name}
                            </p>
                        </div>

                        <div className="bg-[#1dcaff]/10 p-8 rounded-[2rem] border border-[#1dcaff]/20 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Smartphone size={80} />
                            </div>
                            
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#1dcaff] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1dcaff]/20">
                                        <Smartphone className="text-white w-6 h-6" />
                                    </div>
                                    <h2 className="font-black text-[#1dcaff] text-xl">Paiement Wave</h2>
                                </div>
                            </div>
                            
                            <p className="text-sm font-bold text-[var(--foreground)]/70 leading-relaxed relative z-10">
                                Cliquez sur le bouton ci-dessous pour ouvrir votre application Wave en toute sécurité et valider le transfert.
                            </p>

                            <a 
                                href={waveLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-[#1dcaff] hover:bg-[#19b5e6] text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-[#1dcaff]/25 active:scale-95 group relative z-10"
                            >
                                Payer avec Wave
                                <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111] p-8 rounded-[2rem] border border-[var(--foreground)]/10 shadow-2xl flex flex-col h-full relative">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="flex w-6 h-6 bg-[#E7162A] text-white rounded-full items-center justify-center text-xs font-black">2</span>
                                <h2 className="text-xl font-black text-[#21286E] dark:text-white">Confirmez votre dépôt</h2>
                            </div>
                            <p className="text-sm font-medium text-[var(--foreground)]/60 mt-2">
                                Une fois que vous avez effectué le paiement via le bouton Wave, cliquez ci-dessous pour confirmer.
                            </p>
                        </div>
                        
                        <div className="flex-1">
                            <SimpleConfirmForm transactionId={transaction.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
