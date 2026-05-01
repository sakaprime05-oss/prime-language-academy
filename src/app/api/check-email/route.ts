import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || !email.includes("@")) {
        return NextResponse.json({ exists: false, valid: false });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            select: { id: true },
        });

        return NextResponse.json({ exists: !!user, valid: true });
    } catch {
        return NextResponse.json({ exists: false, valid: true });
    }
}
