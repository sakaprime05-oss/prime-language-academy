import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminPaymentsClient from "./payments-client";

export default async function AdminPaymentsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/login");

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
          <p className="platform-eyebrow">Controle financier</p>
          <h1 className="platform-title text-[var(--foreground)]">Paiements</h1>
          <p className="platform-subtitle max-w-2xl text-[var(--muted-foreground)]">
            Suivez les paiements en ligne et verifiez les paiements manuels avant activation des comptes.
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-xs font-bold text-[var(--muted-foreground)]">
          {transactions.length} transaction{transactions.length > 1 ? "s" : ""} recente{transactions.length > 1 ? "s" : ""}
        </div>
      </header>

      <AdminPaymentsClient initialTransactions={transactions} />
    </div>
  );
}
