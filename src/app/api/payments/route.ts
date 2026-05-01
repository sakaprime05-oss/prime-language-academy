import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * PayTech payment token request endpoint
 * Used by the PayTech Web SDK (OPEN_IN_POPUP mode)
 * The frontend SDK calls this URL which then calls PayTech and returns the token
 */
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "STUDENT") {
            return NextResponse.json({ error: "Non autorise" }, { status: 401 });
        }

        const body = await req.json();
        const { planId, amount, studentName, studentEmail, targetPayment, phone } = body;
        const requestedAmount = Number(amount);

        if (!planId || !Number.isFinite(requestedAmount) || requestedAmount <= 0) {
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        const apiKey = process.env.PAYTECH_API_KEY;
        const apiSecret = process.env.PAYTECH_API_SECRET;
        const env = process.env.PAYTECH_ENV || "test";
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        if (!apiKey || !apiSecret) {
            return NextResponse.json({ error: "Configuration paiement manquante" }, { status: 500 });
        }

        const plan = await prisma.paymentPlan.findFirst({
            where: {
                id: planId,
                studentId: session.user.id,
            },
            include: { student: true },
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan de paiement introuvable" }, { status: 404 });
        }

        const remaining = Math.max(0, plan.totalAmount - plan.amountPaid);
        if (remaining <= 0) {
            return NextResponse.json({ error: "Ce plan est deja regle" }, { status: 400 });
        }

        const safeAmount = Math.min(requestedAmount, remaining);

        const refCommand = `PRIME-${planId}-${Date.now()}`;

        // Create pending transaction
        const transaction = await prisma.transaction.create({
            data: {
                planId,
                amount: safeAmount,
                method: "PAYTECH",
                status: "PENDING",
                referenceId: refCommand,
            }
        });

        const customField = JSON.stringify({
            transactionId: transaction.id,
            planId,
            email: plan.student.email,
        });

        const paymentBody: Record<string, string> = {
            item_name: "Frais de scolarité - Prime Language Academy",
            item_price: String(Math.round(safeAmount)),
            currency: "XOF",
            ref_command: refCommand,
            command_name: `Paiement scolarité - ${studentName || "Étudiant"}`,
            env,
            ipn_url: `${baseUrl}/api/payments/paytech/ipn`,
            success_url: `${baseUrl}/dashboard/student/payments?status=success`,
            cancel_url: `${baseUrl}/dashboard/student/payments?status=cancel`,
            custom_field: customField,
        };

        if (targetPayment) {
            paymentBody.target_payment = targetPayment;
        }

        const paytechResponse = await fetch("https://paytech.sn/api/payment/request-payment", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "API_KEY": apiKey,
                "API_SECRET": apiSecret,
            },
            body: JSON.stringify(paymentBody),
        });

        const data = await paytechResponse.json();

        if (data.success !== 1) {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: "FAILED", failureReason: data.message || "PayTech API Error" }
            });
            return NextResponse.json({ success: 0, message: data.message || "Erreur PayTech" }, { status: 400 });
        }

        // Return PayTech token/redirect_url to the client
        return NextResponse.json({
            success: 1,
            token: data.token,
            redirect_url: data.redirect_url,
            redirectUrl: data.redirectUrl || data.redirect_url,
            transactionId: transaction.id,
        });

    } catch (error) {
        console.error("PayTech request-payment error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
