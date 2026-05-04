import { prisma } from "@/lib/prisma";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase().trim();
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";

    if (!email || !email.includes("@")) {
        return NextResponse.json({ exists: false, valid: false });
    }

    const limitedByIp = rateLimit(rateLimitKey("check-email-ip", ip), 30, 15 * 60 * 1000);
    const limitedByEmail = rateLimit(rateLimitKey("check-email-address", email), 6, 15 * 60 * 1000);
    if (!limitedByIp.ok || !limitedByEmail.ok) {
        return NextResponse.json({ error: "Trop de tentatives. Veuillez patienter quelques minutes." }, { status: 429 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, status: true },
        });

        return NextResponse.json({
            exists: !!user,
            valid: true,
            canResumePayment: user?.status === "PENDING",
            accountUnavailable: user?.status === "SUSPENDED" || user?.status === "BLOCKED",
        });
    } catch {
        return NextResponse.json({ exists: false, valid: true });
    }
}
