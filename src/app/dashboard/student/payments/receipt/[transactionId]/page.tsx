import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PrintButton from "./PrintButton";

export default async function ReceiptPage({ params }: { params: { transactionId: string } }) {
    const session = await auth();
    if (!session || !session.user) redirect("/login");

    const transaction = await prisma.transaction.findUnique({
        where: { id: params.transactionId },
        include: {
            paymentPlan: {
                include: {
                    student: true
                }
            }
        }
    });

    if (!transaction || transaction.paymentPlan.studentId !== session.user.id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
                <p>Transaction introuvable ou non autorisée.</p>
            </div>
        );
    }

    if (transaction.status !== "COMPLETED") {
         return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
                <p>Le reçu n'est disponible que pour les transactions réussies.</p>
            </div>
        );
    }

    const { student } = transaction.paymentPlan;

    return (
        <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0 text-slate-800">
            <PrintButton />
            
            {/* A4 Paper Container */}
            <div className="max-w-[800px] mx-auto bg-white min-h-[1100px] p-16 shadow-2xl print:shadow-none print:p-0 print:m-0">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-emerald-600 tracking-tighter">PRIME</h1>
                        <p className="font-bold text-gray-400 tracking-[0.2em] uppercase text-xs mt-1">Language Academy</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-black text-gray-200 uppercase tracking-widest">Reçu</h2>
                        <p className="text-sm font-bold mt-2">N° {transaction.id.slice(0,8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Info block */}
                <div className="flex justify-between mt-12 mb-16">
                    <div>
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Émetteur</p>
                        <p className="font-black text-gray-800">Prime Language Academy</p>
                        <p className="text-sm text-emerald-600 font-bold mb-1">Parlez anglais. Vivez des opportunités.</p>
                        <p className="text-sm text-gray-500 max-w-xs">Angré 8e Tranche, Zone Bon Prix<br/>(à 120m en face du carrefour Pain du Quotidien)</p>
                        <p className="text-sm text-gray-500 mt-1">WhatsApp / Tel : +225 01 61 33 78 64</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black uppercase text-emerald-500 tracking-widest mb-2">Destinataire</p>
                        <p className="font-bold">{student.name || "Étudiant"}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                </div>

                {/* Details Table */}
                <div className="mb-16">
                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Détails du règlement</p>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="py-4 text-sm uppercase tracking-widest font-black text-gray-800">Description</th>
                                <th className="py-4 text-sm uppercase tracking-widest font-black text-gray-800">Méthode</th>
                                <th className="py-4 text-sm uppercase tracking-widest font-black text-gray-800 text-right">Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-6 text-gray-600 max-w-sm">
                                    <p className="font-bold text-gray-800">Frais de scolarité</p>
                                    <p className="text-sm opacity-80">Règlement des frais de cours d'anglais.</p>
                                </td>
                                <td className="py-6 font-medium text-gray-600">
                                    {transaction.method} {transaction.provider ? `(${transaction.provider})` : ''}
                                </td>
                                <td className="py-6 font-black text-right text-gray-800">
                                    {transaction.amount.toLocaleString()} FCFA
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Subtotal & Total */}
                <div className="flex justify-end border-t-2 border-gray-800 pt-6">
                    <div className="w-1/2">
                        <div className="flex justify-between py-2 text-gray-600">
                            <span>Sous-total</span>
                            <span>{transaction.amount.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between py-2 text-gray-600">
                            <span>Taxes (0%)</span>
                            <span>0 FCFA</span>
                        </div>
                        <div className="flex justify-between py-4 text-2xl font-black text-gray-800 border-t border-gray-200 mt-2">
                            <span>Total Payé</span>
                            <span>{transaction.amount.toLocaleString()} FCFA</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-32 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 font-medium">
                    <p>Merci pour votre confiance. La Prime Academy vous souhaite une excellente formation.</p>
                    <p className="mt-1">Ce reçu a été généré électroniquement et ne nécessite pas de signature.</p>
                </div>

            </div>
        </div>
    );
}
