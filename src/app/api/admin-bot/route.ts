import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail, sendInvoiceEmail, sendAccountActivatedEmail, sendEmail } from "@/lib/email";

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

            case "validate_payment": {
                const { email, amount } = params;
                const numericAmount = parseFloat(amount.toString().replace(/\s/g, ''));

                const student = await prisma.user.findUnique({
                    where: { email },
                    include: { paymentPlans: true }
                });

                if (!student) return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
                
                let plan = student.paymentPlans[0];
                
                // Si pas de plan, on en crée un par défaut pour le niveau 1 (exemple)
                if (!plan) {
                    const firstLevel = await prisma.level.findFirst();
                    plan = await prisma.paymentPlan.create({
                        data: {
                            studentId: student.id,
                            totalAmount: numericAmount, // On suppose que le montant payé est le total si on n'a rien
                            amountPaid: 0,
                            status: "PARTIAL"
                        }
                    });
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        planId: plan.id,
                        amount: numericAmount,
                        method: "MANUAL",
                        status: "COMPLETED",
                        referenceId: `BOT-VAL-${Date.now()}`
                    }
                });

                const newAmountPaid = plan.amountPaid + numericAmount;
                const newStatus = newAmountPaid >= plan.totalAmount ? "PAID" : "PARTIAL";

                await Promise.all([
                    prisma.paymentPlan.update({
                        where: { id: plan.id },
                        data: { amountPaid: newAmountPaid, status: newStatus }
                    }),
                    prisma.user.update({
                        where: { id: student.id },
                        data: { status: "ACTIVE" }
                    }),
                    sendAccountActivatedEmail(student.email, student.name || "Étudiant"),
                    sendInvoiceEmail(student.email, student.name || "Étudiant", numericAmount, transaction.id)
                ]);

                return NextResponse.json({ 
                    success: true, 
                    message: `Paiement de ${numericAmount} validé pour ${student.name}. Facture envoyée.` 
                });
            }

            case "send_welcome_messages": {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday.setHours(0, 0, 0, 0);
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const newStudents = await prisma.user.findMany({
                    where: {
                        role: "STUDENT",
                        createdAt: { gte: yesterday, lt: today }
                    }
                });

                for (const student of newStudents) {
                    await sendWelcomeEmail(student.email, student.name || "Étudiant", student.registrationType);
                }

                return NextResponse.json({ 
                    success: true, 
                    count: newStudents.length,
                    message: `${newStudents.length} messages de bienvenue envoyés.` 
                });
            }

            case "get_today_appointments": {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

                const appointments = await prisma.appointment.findMany({
                    where: {
                        date: { gte: startOfDay, lte: endOfDay }
                    },
                    include: { student: { select: { name: true } } },
                    orderBy: { startTime: "asc" }
                });

                return NextResponse.json({ appointments });
            }

            case "get_morning_report": {
                const last24h = new Date();
                last24h.setHours(last24h.getHours() - 24);

                const startOfToday = new Date();
                startOfToday.setHours(0, 0, 0, 0);
                const endOfToday = new Date();
                endOfToday.setHours(23, 59, 59, 999);

                const [newInscrits, pendingPayments, todayAppointments] = await Promise.all([
                    prisma.user.count({
                        where: { role: "STUDENT", createdAt: { gte: last24h } }
                    }),
                    prisma.transaction.count({
                        where: { status: "VERIFYING" }
                    }),
                    prisma.appointment.findMany({
                        where: { date: { gte: startOfToday, lte: endOfToday } },
                        include: { student: { select: { name: true } } },
                        orderBy: { startTime: "asc" }
                    })
                ]);

                return NextResponse.json({
                    report: {
                        new_students: newInscrits,
                        pending_validations: pendingPayments,
                        appointments_count: todayAppointments.length,
                        appointments_details: todayAppointments.map(a => ({
                            time: a.startTime,
                            student: a.student.name,
                            reason: a.reason
                        }))
                    }
                });
            }

            case "send_email": {
                const { to, subject, html, text } = params;
                if (!to || !subject) {
                    return NextResponse.json({ error: "Paramètres manquants: 'to' et 'subject' sont requis." }, { status: 400 });
                }
                await sendEmail({
                    to,
                    subject,
                    html: html || `<p>${text || subject}</p>`
                });
                return NextResponse.json({
                    success: true,
                    message: `E-mail envoyé avec succès à ${to}.`
                });
            }

            default:
                return NextResponse.json({ error: "Unknown action" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Admin Bot Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
