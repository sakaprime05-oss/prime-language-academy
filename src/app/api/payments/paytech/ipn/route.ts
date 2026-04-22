import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInvoiceEmail, sendAdminNotificationEmail } from "@/lib/email";
import crypto from "crypto";

/**
 * PayTech IPN (Instant Payment Notification) handler
 * PayTech sends a POST request to this URL after each payment event
 *
 * Security: Verified using HMAC-SHA256 (recommended) or SHA256 key hash fallback
 */
export async function POST(req: Request) {
    try {
        // PayTech sends application/x-www-form-urlencoded by default
        let payload: Record<string, string> = {};

        const contentType = req.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            payload = await req.json();
        } else {
            const text = await req.text();
            const params = new URLSearchParams(text);
            params.forEach((value, key) => { payload[key] = value; });
        }

        console.log("PayTech IPN received:", payload);

        const {
            type_event,
            custom_field,
            ref_command,
            item_price,
            final_item_price,
            payment_method,
            client_phone,
            api_key_sha256,
            api_secret_sha256,
            hmac_compute,
        } = payload;

        const myApiKey = process.env.PAYTECH_API_KEY!;
        const myApiSecret = process.env.PAYTECH_API_SECRET!;

        // ─── Security verification ─────────────────────────────────────────────
        let isAuthentic = false;

        if (hmac_compute) {
            // Method 1: HMAC-SHA256 (recommended)
            const price = final_item_price || item_price;
            const message = `${price}|${ref_command}|${myApiKey}`;
            const expectedHmac = crypto
                .createHmac("sha256", myApiSecret)
                .update(message)
                .digest("hex");
            isAuthentic = expectedHmac === hmac_compute;
            if (!isAuthentic) {
                console.error("PayTech IPN: HMAC verification failed");
            }
        } else {
            // Method 2: SHA256 key hash fallback
            const expectedKeyHash = crypto.createHash("sha256").update(myApiKey).digest("hex");
            const expectedSecretHash = crypto.createHash("sha256").update(myApiSecret).digest("hex");
            isAuthentic = expectedKeyHash === api_key_sha256 && expectedSecretHash === api_secret_sha256;
            if (!isAuthentic) {
                console.error("PayTech IPN: SHA256 key verification failed");
            }
        }

        if (!isAuthentic) {
            return new Response("IPN KO - NOT FROM PAYTECH", { status: 403 });
        }

        // ─── Parse custom_field (Base64 encoded JSON) ──────────────────────────
        let customData: Record<string, string> = {};
        try {
            // PayTech encodes custom_field as Base64
            const decoded = Buffer.from(custom_field || "", "base64").toString("utf-8");
            customData = JSON.parse(decoded);
        } catch {
            // Fallback: try plain JSON
            try {
                customData = JSON.parse(custom_field || "{}");
            } catch {
                console.warn("PayTech IPN: could not parse custom_field:", custom_field);
            }
        }

        const { transactionId, planId } = customData;

        // ─── Find the transaction ──────────────────────────────────────────────
        const transaction = await prisma.transaction.findFirst({
            where: {
                OR: [
                    { referenceId: ref_command },
                    ...(transactionId ? [{ id: transactionId }] : []),
                ]
            },
            include: {
                paymentPlan: {
                    include: { student: true }
                }
            }
        });

        if (!transaction) {
            console.error("PayTech IPN: Transaction not found for ref_command:", ref_command);
            // Return 200 to avoid PayTech retrying indefinitely
            return new Response("IPN OK - Transaction not found", { status: 200 });
        }

        // ─── Process the payment event ─────────────────────────────────────────
        if (type_event === "sale_complete") {
            const plan = transaction.paymentPlan;
            const student = plan.student;
            const isFirstPayment = plan.amountPaid === 0;
            const finalAmount = parseFloat(final_item_price || item_price || "0");
            const newAmountPaid = plan.amountPaid + transaction.amount;
            const newPlanStatus = newAmountPaid >= plan.totalAmount ? "PAID" : "PARTIAL";

            // Update transaction
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: "COMPLETED",
                    provider: payment_method || "PAYTECH",
                }
            });

            // Update payment plan
            await prisma.paymentPlan.update({
                where: { id: plan.id },
                data: {
                    amountPaid: newAmountPaid,
                    status: newPlanStatus,
                }
            });

            // Re-activate student if they were blocked
            await prisma.user.update({
                where: { id: plan.studentId },
                data: { status: "ACTIVE" }
            });

            // Send invoice and notify admin on first successful payment
            if (isFirstPayment) {
                if (student.email) {
                    await sendInvoiceEmail(
                        student.email,
                        student.name || "Étudiant",
                        transaction.amount,
                        transaction.id
                    );
                }
                
                await sendAdminNotificationEmail(
                    student.name || "Étudiant Inconnu",
                    transaction.amount,
                    transaction.id
                );
            }

            console.log(`✅ PayTech payment confirmed: ${ref_command}, method: ${payment_method}, amount: ${finalAmount} XOF`);

        } else if (type_event === "sale_canceled") {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: "FAILED",
                    failureReason: "Paiement annulé par l'utilisateur",
                }
            });

            console.log(`❌ PayTech payment canceled: ${ref_command}`);

        } else {
            console.log(`PayTech IPN event (unhandled): ${type_event}`);
        }

        return new Response("IPN OK", { status: 200 });

    } catch (error) {
        console.error("PayTech IPN error:", error);
        // Return 200 to avoid PayTech retry loops on server errors
        return new Response("IPN ERROR", { status: 200 });
    }
}
