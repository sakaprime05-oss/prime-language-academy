import { prisma } from "@/lib/prisma";
import { sendAdminNotificationEmail, sendInvoiceEmail } from "@/lib/email";
import { notifyTelegram } from "@/lib/notify";

type PaystackTransactionData = {
  reference?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  channel?: string;
};

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

  const expectedAmount = Math.round(transaction.amount);
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

  const completed = await prisma.transaction.updateMany({
    where: { id: transaction.id, status: { not: "COMPLETED" } },
    data: {
      status: "COMPLETED",
      provider: `PAYSTACK (${data.channel || "unknown"})`,
    },
  });

  if (completed.count === 0) {
    return { ok: true, reason: "Transaction deja traitee." };
  }

  const plan = transaction.paymentPlan;
  const student = plan.student;
  const isFirstPayment = plan.amountPaid === 0;
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

  if (isFirstPayment && student.email) {
    await sendInvoiceEmail(student.email, student.name || "Etudiant", transaction.amount, transaction.id).catch(
      console.error
    );
  }

  await sendAdminNotificationEmail(student.name || "Etudiant inconnu", transaction.amount, transaction.id).catch(
    console.error
  );

  await notifyTelegram("payment_proof", {
    name: student.name || "Etudiant inconnu",
    email: student.email,
    amount: transaction.amount,
    provider: `PAYSTACK (${data.channel || "unknown"})`,
    phone: "Via Paystack",
  }).catch(console.error);

  return { ok: true, reason: "Paiement confirme." };
}
