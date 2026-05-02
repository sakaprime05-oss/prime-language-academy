import { NextResponse } from "next/server";
import { completePaystackTransaction } from "@/lib/paystack-registration";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference") || url.searchParams.get("trxref");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || url.origin;

  if (!reference) {
    return NextResponse.redirect(`${baseUrl}/login?status=payment_error`);
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Paystack callback: missing server key");
    return NextResponse.redirect(`${baseUrl}/login?status=payment_error`);
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    });
    const payload = await response.json();

    if (!payload.status || !payload.data) {
      console.error("Paystack callback verification failed:", payload.message || payload);
      return NextResponse.redirect(`${baseUrl}/login?status=payment_pending`);
    }

    const result = await completePaystackTransaction(payload.data);

    if (!result.ok) {
      console.error("Paystack callback processing failed:", result.reason);
      return NextResponse.redirect(`${baseUrl}/login?status=payment_pending`);
    }

    return NextResponse.redirect(`${baseUrl}/login?status=payment_success`);
  } catch (error) {
    console.error("Paystack callback error:", error);
    return NextResponse.redirect(`${baseUrl}/login?status=payment_pending`);
  }
}
