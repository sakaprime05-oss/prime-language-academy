import { NextResponse } from "next/server";
import { completePaystackTransaction } from "@/lib/paystack-registration";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference") || url.searchParams.get("trxref");
  const next = url.searchParams.get("next");
  const configuredBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  const baseUrl =
    configuredBaseUrl && /^https:\/\/(www\.)?primelangageacademy\.com$/.test(configuredBaseUrl.replace(/\/$/, ""))
      ? configuredBaseUrl.replace(/\/$/, "")
      : "https://primelangageacademy.com";

  const successPath = next && next.startsWith("/") && !next.startsWith("//") ? next : "/login?status=payment_success";
  const pendingPath = successPath.startsWith("/dashboard")
    ? successPath.replace("status=success", "status=pending")
    : "/login?status=payment_pending";
  const errorPath = successPath.startsWith("/dashboard")
    ? successPath.replace("status=success", "status=error")
    : "/login?status=payment_error";

  if (!reference) {
    return NextResponse.redirect(`${baseUrl}${errorPath}`);
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Payment callback: missing server configuration");
    return NextResponse.redirect(`${baseUrl}${errorPath}`);
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
      console.error("Payment callback verification failed:", payload.message || payload);
      return NextResponse.redirect(`${baseUrl}${pendingPath}`);
    }

    const result = await completePaystackTransaction(payload.data);

    if (!result.ok) {
      console.error("Payment callback processing failed:", result.reason);
      return NextResponse.redirect(`${baseUrl}${errorPath}`);
    }

    return NextResponse.redirect(`${baseUrl}${successPath}`);
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(`${baseUrl}${pendingPath}`);
  }
}
