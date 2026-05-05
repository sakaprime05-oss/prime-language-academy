"use client";

import { useMemo, useState } from "react";
import { approveTransaction, rejectTransaction } from "@/app/actions/payments";
import { useRouter } from "next/navigation";
import { paymentMethodLabel } from "@/lib/payment-methods";

type Student = {
    name: string | null;
    email: string;
    registrationType?: string | null;
};

type PaymentPlan = {
    totalAmount: number;
    amountPaid: number;
    status: string;
    student: Student;
};

type Transaction = {
    id: string;
    amount: number;
    method: string;
    referenceId: string | null;
    provider: string | null;
    failureReason: string | null;
    status: string;
    date: Date | string;
    senderPhone: string | null;
    proof: string | null;
    paymentPlan: PaymentPlan | null;
};

const filters = [
    { key: "ALL", label: "Tous" },
    { key: "VERIFYING", label: "À vérifier" },
    { key: "PENDING", label: "En attente" },
    { key: "COMPLETED", label: "Validés" },
    { key: "FAILED", label: "Rejetés" },
];

function money(value: number) {
    return `${Math.round(value).toLocaleString("fr-FR")} FCFA`;
}

function formatDate(value: Date | string) {
    return new Date(value).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function statusLabel(status: string) {
    if (status === "VERIFYING") return "À vérifier";
    if (status === "COMPLETED") return "Validé";
    if (status === "FAILED") return "Rejeté";
    if (status === "PENDING") return "En attente";
    return status;
}

function statusClass(status: string) {
    if (status === "VERIFYING") return "border-amber-400/25 bg-amber-400/10 text-amber-200";
    if (status === "COMPLETED") return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
    if (status === "FAILED") return "border-red-400/25 bg-red-400/10 text-red-300";
    return "border-white/15 bg-white/5 text-white/55";
}

function providerDot(provider: string | null) {
    const label = paymentMethodLabel(provider).toLowerCase();
    if (label.includes("wave")) return "bg-sky-400";
    if (label.includes("mobile")) return "bg-orange-400";
    if (label.includes("carte")) return "bg-emerald-400";
    if (label.includes("manuel")) return "bg-yellow-300";
    return "bg-white/35";
}

export default function AdminPaymentsClient({ initialTransactions }: { initialTransactions: Transaction[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const router = useRouter();

    const stats = useMemo(() => {
        const verifying = initialTransactions.filter((tx) => tx.status === "VERIFYING").length;
        const pending = initialTransactions.filter((tx) => tx.status === "PENDING").length;
        const completedAmount = initialTransactions
            .filter((tx) => tx.status === "COMPLETED")
            .reduce((sum, tx) => sum + tx.amount, 0);
        const failed = initialTransactions.filter((tx) => tx.status === "FAILED").length;
        return { verifying, pending, completedAmount, failed };
    }, [initialTransactions]);

    const transactions = useMemo(() => {
        if (activeFilter === "ALL") return initialTransactions;
        return initialTransactions.filter((tx) => tx.status === activeFilter);
    }, [activeFilter, initialTransactions]);

    const handleApprove = async (id: string) => {
        if (!confirm("Confirmer la réception de ce paiement ? Le compte de l'étudiant sera activé.")) return;
        setLoadingId(id);
        const res = await approveTransaction(id);
        if (res.error) alert(res.error);
        setLoadingId(null);
        router.refresh();
    };

    const handleReject = async (id: string) => {
        const reason = prompt("Raison du rejet ? Exemple : paiement non reçu");
        if (!reason) return;
        setLoadingId(id);
        const res = await rejectTransaction(id, reason);
        if (res.error) alert(res.error);
        setLoadingId(null);
        router.refresh();
    };

    return (
        <div className="space-y-5">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="À vérifier" value={stats.verifying.toString()} tone="text-amber-300" />
                <StatCard label="En attente" value={stats.pending.toString()} tone="text-white" />
                <StatCard label="Déjà encaissé" value={money(stats.completedAmount)} tone="text-emerald-300" />
                <StatCard label="Rejetés" value={stats.failed.toString()} tone="text-red-300" />
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#10101a] shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-black text-white">Transactions récentes</h2>
                        <p className="mt-1 text-xs font-semibold text-white/40">
                            Les paiements à vérifier affichent les actions de validation.
                        </p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                type="button"
                                onClick={() => setActiveFilter(filter.key)}
                                className={`shrink-0 rounded-xl border px-3 py-2 text-[11px] font-black uppercase tracking-widest transition-colors ${
                                    activeFilter === filter.key
                                        ? "border-red-400/40 bg-red-500/15 text-red-200"
                                        : "border-white/10 bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-3 p-3 lg:hidden">
                    {transactions.length === 0 ? (
                        <EmptyState />
                    ) : (
                        transactions.map((tx) => (
                            <PaymentCard
                                key={tx.id}
                                tx={tx}
                                loadingId={loadingId}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ))
                    )}
                </div>

                <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[980px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4">Étudiant</th>
                                <th className="px-5 py-4">Paiement</th>
                                <th className="px-5 py-4">Montant</th>
                                <th className="px-5 py-4">Statut</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12">
                                        <EmptyState />
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <PaymentRow
                                        key={tx.id}
                                        tx={tx}
                                        loadingId={loadingId}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">{label}</p>
            <p className={`mt-3 text-2xl font-black tracking-tight ${tone}`}>{value}</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
            <p className="text-sm font-bold text-white/55">Aucune transaction dans cette vue.</p>
        </div>
    );
}

function PaymentRow({
    tx,
    loadingId,
    onApprove,
    onReject,
}: {
    tx: Transaction;
    loadingId: string | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}) {
    return (
        <tr className="transition-colors hover:bg-white/[0.025]">
            <td className="whitespace-nowrap px-5 py-5 font-bold text-white/55">{formatDate(tx.date)}</td>
            <td className="px-5 py-5">
                <StudentBlock tx={tx} />
            </td>
            <td className="px-5 py-5">
                <PaymentDetails tx={tx} />
            </td>
            <td className="whitespace-nowrap px-5 py-5 text-base font-black text-white">{money(tx.amount)}</td>
            <td className="px-5 py-5">
                <StatusBadge status={tx.status} />
            </td>
            <td className="px-5 py-5 text-right">
                <PaymentActions tx={tx} loadingId={loadingId} onApprove={onApprove} onReject={onReject} />
            </td>
        </tr>
    );
}

function PaymentCard({
    tx,
    loadingId,
    onApprove,
    onReject,
}: {
    tx: Transaction;
    loadingId: string | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}) {
    return (
        <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-start justify-between gap-3">
                <StudentBlock tx={tx} />
                <StatusBadge status={tx.status} />
            </div>
            <div className="mt-4 grid gap-3 rounded-xl bg-black/20 p-3">
                <PaymentDetails tx={tx} />
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-xs font-bold text-white/40">{formatDate(tx.date)}</span>
                    <span className="text-lg font-black text-white">{money(tx.amount)}</span>
                </div>
            </div>
            <div className="mt-4">
                <PaymentActions tx={tx} loadingId={loadingId} onApprove={onApprove} onReject={onReject} fullWidth />
            </div>
        </article>
    );
}

function StudentBlock({ tx }: { tx: Transaction }) {
    const student = tx.paymentPlan?.student;

    return (
        <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">{student?.name || "Étudiant sans nom"}</p>
            <p className="mt-1 truncate text-xs font-semibold text-white/40">{student?.email || "Email non renseigné"}</p>
            <p className="mt-2 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white/35">
                {student?.registrationType === "CLUB" ? "Club" : "Formation"}
            </p>
        </div>
    );
}

function PaymentDetails({ tx }: { tx: Transaction }) {
    const proofIsUpload = Boolean(tx.proof?.startsWith("/uploads/"));
    const provider = paymentMethodLabel(tx.provider || tx.method);

    return (
        <div className="min-w-0 space-y-1.5">
            <p className="flex items-center gap-2 text-sm font-black text-white">
                <span className={`h-2.5 w-2.5 rounded-full ${providerDot(provider)}`} />
                {provider}
            </p>
            <p className="text-xs font-semibold text-white/45">Expéditeur : {tx.senderPhone || "-"}</p>
            {proofIsUpload ? (
                <a
                    href={tx.proof || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-xs font-black text-sky-300 hover:text-sky-200 hover:underline"
                >
                    Voir la capture reçue
                </a>
            ) : (
                <p className="truncate text-xs font-semibold text-white/35">
                    Reçu : {tx.id ? `PLA-${tx.id.slice(0, 8).toUpperCase()}` : "-"}
                </p>
            )}
            {tx.failureReason && <p className="text-xs font-semibold text-red-300/80">{tx.failureReason}</p>}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${statusClass(status)}`}>
            {statusLabel(status)}
        </span>
    );
}

function PaymentActions({
    tx,
    loadingId,
    onApprove,
    onReject,
    fullWidth,
}: {
    tx: Transaction;
    loadingId: string | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    fullWidth?: boolean;
}) {
    if (tx.status !== "VERIFYING") {
        return <span className="text-xs font-bold text-white/25">-</span>;
    }

    const disabled = loadingId === tx.id;

    return (
        <div className={`flex gap-2 ${fullWidth ? "w-full" : "justify-end"}`}>
            <button
                type="button"
                onClick={() => onReject(tx.id)}
                disabled={disabled}
                className={`${fullWidth ? "flex-1" : ""} rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-2 text-xs font-black text-red-200 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50`}
            >
                Rejeter
            </button>
            <button
                type="button"
                onClick={() => onApprove(tx.id)}
                disabled={disabled}
                className={`${fullWidth ? "flex-1" : ""} rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/15 transition-colors hover:bg-emerald-400 disabled:opacity-50`}
            >
                Valider
            </button>
        </div>
    );
}
