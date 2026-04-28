import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const apiKey = req.headers.get("x-api-key");
        if (apiKey !== process.env.ADMIN_BOT_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { action, params } = body;

        switch (action) {
            case "get_stats": {
                const [totalStudents, totalClub, pendingPayments, totalArticles] = await Promise.all([
                    prisma.user.count({ where: { role: "STUDENT" } }),
                    prisma.user.count({ where: { registrationType: "CLUB" } }),
                    prisma.payment.count({ where: { status: "PENDING" } }),
                    prisma.article.count(),
                ]);

                return NextResponse.json({
                    stats: {
                        students: totalStudents,
                        club_members: totalClub,
                        pending_payments: pendingPayments,
                        articles: totalArticles
                    }
                });
            }

            case "get_recent_registrations": {
                const users = await prisma.user.findMany({
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    select: {
                        name: true,
                        email: true,
                        createdAt: true,
                        role: true,
                        isActive: true
                    }
                });
                return NextResponse.json({ users });
            }

            case "analyze_data": {
                // Cette action donne une vue d'ensemble complète à l'IA pour analyse
                const [users, pendingPayments, recentArticles, stats] = await Promise.all([
                    prisma.user.findMany({
                        take: 20,
                        orderBy: { createdAt: "desc" },
                        select: { name: true, email: true, role: true, createdAt: true, isActive: true }
                    }),
                    prisma.payment.findMany({
                        where: { status: "PENDING" },
                        include: { user: { select: { name: true, email: true } } }
                    }),
                    prisma.article.findMany({
                        take: 5,
                        orderBy: { createdAt: "desc" },
                        select: { title: true, views: true }
                    }),
                    prisma.user.groupBy({
                        by: ['role'],
                        _count: { _all: true }
                    })
                ]);

                return NextResponse.json({
                    summary: {
                        recent_users: users,
                        pending_payments: pendingPayments.map(p => ({
                            student: p.user.name,
                            amount: p.amount,
                            date: p.createdAt
                        })),
                        content_performance: recentArticles,
                        distribution: stats
                    }
                });
            }

            case "toggle_user_status": {
                const { email, active } = params;
                const user = await prisma.user.update({
                    where: { email },
                    data: { isActive: active },
                });
                return NextResponse.json({ success: true, user: { name: user.name, isActive: user.isActive } });
            }

            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
