import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        console.log("PawaPay Callback received:", payload);

        const { depositId, status, rejectionReason } = payload;

        if (!depositId || !status) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const transaction = await prisma.transaction.findUnique({
            where: { referenceId: depositId }
        });

        if (!transaction) {
            console.error("Transaction not found for depositId:", depositId);
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Mapping PawaPay status to our internal status
        let newStatus = "PENDING";
        if (status === "COMPLETED") newStatus = "COMPLETED";
        if (status === "FAILED" || status === "REJECTED") newStatus = "FAILED";

        // Update Transaction
        const updatedTransaction = await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                status: newStatus,
                failureReason: rejectionReason || null
            }
        });

        // If completed, update the PaymentPlan
        if (newStatus === "COMPLETED") {
            const plan = await prisma.paymentPlan.findUnique({
                where: { id: transaction.planId }
            });

            if (plan) {
                const newAmountPaid = plan.amountPaid + transaction.amount;
                const newPlanStatus = newAmountPaid >= plan.totalAmount ? "PAID" : "PARTIAL";

                await prisma.paymentPlan.update({
                    where: { id: plan.id },
                    data: {
                        amountPaid: newAmountPaid,
                        status: newPlanStatus
                    }
                });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
