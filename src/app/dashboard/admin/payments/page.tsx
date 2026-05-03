import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminPaymentsClient from "./payments-client";

export default async function AdminPaymentsPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                { status: "VERIFYING" },
                { method: "MANUAL", status: "PENDING" },
                { status: "PENDING" },
                { status: "COMPLETED" },
                { status: "FAILED" },
            ],
        },
        include: {
            paymentPlan: {
                include: { student: true },
            },
        },
        orderBy: { date: "desc" },
        take: 80,
    });

    return (
        <div className="space-y-6 pb-10">
            <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-400/80">
                        Controle financier
                    </p>
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Paiements
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/45">
                        Suivez les paiements Paystack et verifiez les paiements manuels avant activation des comptes.
                    </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold text-white/45">
                    {transactions.length} transaction{transactions.length > 1 ? "s" : ""} recente{transactions.length > 1 ? "s" : ""}
                </div>
            </header>

            <AdminPaymentsClient initialTransactions={transactions} />
        </div>
    );
}
