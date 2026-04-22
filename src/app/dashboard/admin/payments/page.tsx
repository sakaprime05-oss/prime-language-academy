import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminPaymentsClient from "./payments-client";

export default async function AdminPaymentsPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    // Fetch transactions requiring attention or recent ones
    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                { status: "VERIFYING" },
                { method: "MANUAL", status: "PENDING" },
                { status: "COMPLETED" },
            ]
        },
        include: {
            paymentPlan: {
                include: { student: true }
            }
        },
        orderBy: { date: "desc" },
        take: 50
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[var(--foreground)]">Vérification des Paiements</h1>
                    <p className="text-sm font-bold text-[var(--foreground)]/50 mt-1">Validez les paiements manuels Mobile Money.</p>
                </div>
            </div>

            <AdminPaymentsClient initialTransactions={transactions} />
        </div>
    );
}
