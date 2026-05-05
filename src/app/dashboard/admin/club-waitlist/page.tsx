import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PLA_CLUB_CAPACITY, PLA_PLANS, formatFcfa } from "@/lib/pla-program";
import { InviteButton } from "./InviteButton";

function getPlanInfo(onboardingData?: string | null) {
    try {
        const data = JSON.parse(onboardingData || "{}");
        const plan = PLA_PLANS.find((item) => item.id === data.planId);
        return {
            planLabel: plan?.label || "Club",
            planPrice: plan?.price ? formatFcfa(plan.price) : "A verifier",
            level: data.level || "Non renseigne",
            city: data.city || data.commune || "Non renseigne",
        };
    } catch {
        return {
            planLabel: "Club",
            planPrice: "A verifier",
            level: "Non renseigne",
            city: "Non renseigne",
        };
    }
}

export default async function ClubWaitlistPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    const [waitlistedStudents, activeClubMembers, pendingClubMembers] = await Promise.all([
        prisma.user.findMany({
            where: {
                role: "STUDENT",
                registrationType: "CLUB",
                status: "WAITLIST",
            },
            orderBy: { createdAt: "asc" },
        }),
        prisma.user.count({
            where: {
                role: "STUDENT",
                registrationType: "CLUB",
                status: "ACTIVE",
            },
        }),
        prisma.user.count({
            where: {
                role: "STUDENT",
                registrationType: "CLUB",
                status: "PENDING",
            },
        }),
    ]);

    const reservedSeats = activeClubMembers + pendingClubMembers;
    const remainingSeats = Math.max(0, PLA_CLUB_CAPACITY - reservedSeats);

    return (
        <div className="space-y-6 pb-12">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Link href="/dashboard/admin" className="mb-2 flex items-center gap-1 text-xs font-bold text-red-400 hover:underline">
                        Retour admin
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">English Club</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Liste d'attente Club</h2>
                    <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-white/50">
                        Le Club accepte {PLA_CLUB_CAPACITY} membres maximum. Quand une place est disponible, l'admin invite le premier membre et son paiement en ligne est créé côté serveur.
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-[#12121e] p-3 text-center">
                    <div className="px-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/35">Actifs</p>
                        <p className="mt-1 text-2xl font-black text-white">{activeClubMembers}</p>
                    </div>
                    <div className="border-x border-white/10 px-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/35">Reservees</p>
                        <p className="mt-1 text-2xl font-black text-amber-400">{pendingClubMembers}</p>
                    </div>
                    <div className="px-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/35">Libres</p>
                        <p className="mt-1 text-2xl font-black text-emerald-400">{remainingSeats}</p>
                    </div>
                </div>
            </header>

            {remainingSeats === 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-bold leading-6 text-amber-200">
                    Le Club est complet. Le bouton d'invitation refusera automatiquement toute activation tant qu'aucune place n'est libre.
                </div>
            )}

            <section className="grid gap-4">
                {waitlistedStudents.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#12121e] p-8 text-center">
                        <p className="text-sm font-bold text-white/45">Aucun membre en liste d'attente pour le moment.</p>
                    </div>
                ) : (
                    waitlistedStudents.map((student, index) => {
                        const plan = getPlanInfo(student.onboardingData);

                        return (
                            <article key={student.id} className="rounded-2xl border border-white/10 bg-[#12121e] p-4 shadow-xl shadow-black/10 sm:p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-sm font-black text-red-400">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-white">{student.name || "Sans nom"}</h3>
                                            <p className="mt-1 text-xs font-bold text-white/45">{student.email}</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/45">{plan.planLabel}</span>
                                                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/45">{plan.planPrice}</span>
                                                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/45">{plan.level}</span>
                                                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/45">{plan.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <InviteButton studentId={student.id} />
                                </div>
                            </article>
                        );
                    })
                )}
            </section>
        </div>
    );
}
