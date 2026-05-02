import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
        const count = await prisma.user.count();
        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error("Database diagnostic failed:", error);
        return NextResponse.json({ success: false, error: "Database diagnostic failed" }, { status: 500 });
    }
}
