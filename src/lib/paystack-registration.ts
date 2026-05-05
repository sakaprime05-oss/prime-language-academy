import { prisma } from "@/lib/prisma";
import { sendAccountActivatedEmail, sendAdminNotificationEmail, sendInvoiceEmail } from "@/lib/email";
import { notifyTelegram } from "@/lib/notify";
import { paymentProviderLabel } from "@/lib/payment-methods";

type PaystackTransactionData = {
  reference?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  channel?: string;
  metadata?: {
    preferredPaymentMethod?: string;
  };
};

function paystackAmount(amount: number) {
  return Math.round(amount * 100);
}

function paymentStageLabel(amountPaidBefore: number, amount: number, totalAmount: number) {
  if (amountPaidBefore <= 0 && amount >= totalAmount) return "Paiement total";
  if (amountPaidBefore <= 0) return "Prise en charge";
  if (amountPaidBefore + amount >= totalAmount) return "Réservation";
  return "Paiement partiel";
}

export async function completePaystackTransaction(data: PaystackTransactionData) {
  const refCommand = data.reference;

  if (!refCommand) {
    return { ok: false, reason: "Reference Paystack manquante." };
  }

  const transaction = await prisma.transaction.findFirst({
    where: { referenceId: refCommand },
    include: {
      paymentPlan: { include: { student: true } },
    },
  });

  if (!transaction) {
    return { ok: true, reason: "Transaction introuvable, evenement ignore." };
  }

  if (transaction.status === "COMPLETED") {
    return { ok: true, reason: "Transaction deja traitee." };
  }

  if (transaction.status !== "PENDING") {
    return { ok: true, reason: "Transaction inactive, evenement ignore." };
  }

  const expectedAmount = paystackAmount(transaction.amount);
  const receivedAmount = Number(data.amount);
  const receivedCurrency = String(data.currency || "").toUpperCase();
  const paymentStatus = String(data.status || "").toLowerCase();

  if (
    paymentStatus !== "success" ||
    !Number.isFinite(receivedAmount) ||
    Math.round(receivedAmount) !== expectedAmount ||
    receivedCurrency !== "XOF"
  ) {
    const failureReason = `Paystack mismatch: expected ${expectedAmount} XOF, received ${data.amount ?? "unknown"} ${
      data.currency ?? "unknown"
    } (${data.status ?? "unknown"})`;

    await prisma.transaction.updateMany({
      where: { id: transaction.id, status: { not: "COMPLETED" } },
      data: {
        status: "FAILED",
        failureReason,
      },
    });

    return { ok: false, reason: failureReason };
  }

  const providerLabel = paymentProviderLabel(data.metadata?.preferredPaymentMethod || transaction.method, data.channel);

  const completed = await prisma.transaction.updateMany({
    where: { id: transaction.id, status: { not: "COMPLETED" } },
    data: {
      status: "COMPLETED",
      provider: providerLabel,
    },
  });

  if (completed.count === 0) {
    return { ok: true, reason: "Transaction deja traitee." };
  }

  const plan = transaction.paymentPlan;
  const student = plan.student;
  const isFirstPayment = plan.amountPaid === 0;
  const stageLabel = paymentStageLabel(plan.amountPaid, transaction.amount, plan.totalAmount);
  const newAmountPaid = plan.amountPaid + transaction.amount;
  const newPlanStatus = newAmountPaid >= plan.totalAmount ? "PAID" : "PARTIAL";

  await prisma.$transaction([
    prisma.paymentPlan.update({
      where: { id: plan.id },
      data: {
        amountPaid: newAmountPaid,
        status: newPlanStatus,
      },
    }),
    prisma.user.update({
      where: { id: student.id },
      data: { status: "ACTIVE" },
    }),
  ]);

  if (student.email) {
    if (isFirstPayment) {
      await sendAccountActivatedEmail(student.email, student.name || "Etudiant").catch(console.error);
    }

    await sendInvoiceEmail(student.email, student.name || "Etudiant", transaction.amount, transaction.id, providerLabel, stageLabel).catch(console.error);
  }

  await sendAdminNotificationEmail(student.name || "Etudiant inconnu", transaction.amount, transaction.id, providerLabel).catch(
    console.error
  );

  await notifyTelegram("payment_proof", {
    name: student.name || "Etudiant inconnu",
    email: student.email,
    amount: transaction.amount,
    provider: providerLabel,
    phone: "Paiement en ligne confirme",
  }).catch(console.error);

  return { ok: true, reason: "Paiement confirme." };
}
