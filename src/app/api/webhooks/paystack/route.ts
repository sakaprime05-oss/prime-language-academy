import { NextResponse } from "next/server";
import crypto from "crypto";
import { completePaystackTransaction } from "@/lib/paystack-registration";

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "";

    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error("Payment webhook configuration missing");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
    const expected = Buffer.from(hash);
    const received = Buffer.from(signature || "");
    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
      console.warn(`Invalid payment webhook signature from IP: ${clientIp || "unknown"}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const result = await completePaystackTransaction(event.data);
      if (!result.ok) {
        console.error("Payment webhook processing failed:", result.reason, { clientIp });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
