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
                    prisma.transaction.count({ where: { status: "PENDING" } }),
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
                    take: 10,
                    orderBy: { createdAt: "desc" },
                    select: {
                        name: true,
                        email: true,
                        createdAt: true,
                        role: true,
                        status: true,
                        registrationType: true
                    }
                });
                return NextResponse.json({ users });
            }

            case "get_lapsed_registrations": {
                // Étudiants inscrits il y a plus de 24h mais sans transaction COMPLETED
                const yesterday = new Date();
                yesterday.setHours(yesterday.getHours() - 24);

                const users = await prisma.user.findMany({
                    where: {
                        role: "STUDENT",
                        createdAt: { lt: yesterday },
                        paymentPlans: {
                            none: {
                                transactions: {
                                    some: { status: "COMPLETED" }
                                }
                            }
                        }
                    },
                    select: { name: true, email: true, createdAt: true, registrationType: true }
                });
                return NextResponse.json({ users });
            }

            case "analyze_data": {
                const [users, pendingPayments, recentArticles, distribution] = await Promise.all([
                    prisma.user.findMany({
                        take: 10,
                        orderBy: { createdAt: "desc" },
                        select: { name: true, email: true, role: true, createdAt: true, status: true }
                    }),
                    prisma.transaction.findMany({
                        where: { status: "PENDING" },
                        include: { paymentPlan: { include: { student: { select: { name: true, email: true } } } } }
                    }),
                    prisma.article.findMany({
                        take: 5,
                        orderBy: { createdAt: "desc" },
                        select: { title: true, slug: true }
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
                            student: p.paymentPlan?.student?.name || "Inconnu",
                            email: p.paymentPlan?.student?.email,
                            amount: p.amount,
                            date: p.date,
                            ref: p.referenceId
                        })),
                        content: recentArticles,
                        distribution
                    }
                });
            }

            case "toggle_user_status": {
                const { email, action } = params; // action: "BLOCK" or "ACTIVATE"
                const newStatus = action === "BLOCK" ? "BLOCKED" : "ACTIVE";
                
                const user = await prisma.user.update({
                    where: { email },
                    data: { status: newStatus },
                });
                return NextResponse.json({ success: true, user: { name: user.name, status: user.status } });
            }

            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
