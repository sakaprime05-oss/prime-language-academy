import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const PAYSTACK_IPS = ['52.31.139.75', '52.49.173.169', '52.214.14.220'];

export async function POST(req: Request) {
    try {
        // 1. IP Whitelisting (Securing webhook from overload/hackers)
        const forwardedFor = req.headers.get("x-forwarded-for");
        const realIp = req.headers.get("x-real-ip");
        // Get the actual client IP (Vercel uses x-forwarded-for)
        const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || "");

        if (process.env.NODE_ENV === "production") {
            if (!PAYSTACK_IPS.includes(clientIp)) {
                console.warn(`Blocked unauthorized webhook attempt from IP: ${clientIp}`);
                return NextResponse.json({ error: "Unauthorized IP" }, { status: 403 });
            }
        }

        const body = await req.text();
        const signature = req.headers.get("x-paystack-signature");
        const secret = process.env.PAYSTACK_SECRET_KEY;

        if (!secret) {
            console.error("Paystack secret missing");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        // 2. Validate signature
        const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
        if (hash !== signature) {
            console.warn(`Invalid signature from IP: ${clientIp}`);
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const event = JSON.parse(body);

        if (event.event === "charge.success") {
            const data = event.data;
            const refCommand = data.reference;
            const paymentMethod = data.channel;

            const transaction = await prisma.transaction.findFirst({
                where: { referenceId: refCommand },
                include: {
                    paymentPlan: { include: { student: true } }
                }
            });

            if (!transaction) {
                console.error("Transaction not found for ref:", refCommand);
                return NextResponse.json({ success: true }); // Return 200 to stop retries
            }

            const completed = await prisma.transaction.updateMany({
                where: { id: transaction.id, status: { not: "COMPLETED" } },
                data: {
                    status: "COMPLETED",
                    provider: `PAYSTACK (${paymentMethod})`
                }
            });

            if (completed.count === 0) {
                return NextResponse.json({ success: true });
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
                        status: newPlanStatus
                    }
                }),
                prisma.user.update({
                    where: { id: student.id },
                    data: { status: "ACTIVE" }
                })
            ]);

            // Notify via Email
            const { sendInvoiceEmail, sendAdminNotificationEmail } = await import("@/lib/email");
            if (isFirstPayment && student.email) {
                await sendInvoiceEmail(student.email, student.name || "Étudiant", transaction.amount, transaction.id).catch(console.error);
            }
            await sendAdminNotificationEmail(student.name || "Étudiant Inconnu", transaction.amount, transaction.id).catch(console.error);

            // Notify via Telegram
            const { notifyTelegram } = await import("@/lib/notify");
            await notifyTelegram("payment_proof", {
                name: student.name || "Étudiant Inconnu",
                email: student.email,
                amount: transaction.amount,
                provider: `PAYSTACK (${paymentMethod})`,
                phone: "Via Paystack"
            }).catch(console.error);
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Paystack Webhook error:", e);
        return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
    }
}
