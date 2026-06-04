import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatFcfa, PLA_CLUB_CAPACITY, PLA_CLUB_PLANS } from "@/lib/pla-program";
import { InviteButton } from "./InviteButton";

function getPlanInfo(onboardingData?: string | null) {
  try {
    const data = JSON.parse(onboardingData || "{}");
    const plan = PLA_CLUB_PLANS.find((item) => item.id === data.planId);
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
      where: { role: "STUDENT", registrationType: "CLUB", status: "WAITLIST" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.count({ where: { role: "STUDENT", registrationType: "CLUB", status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "STUDENT", registrationType: "CLUB", status: "PENDING" } }),
  ]);

  const reservedSeats = activeClubMembers + pendingClubMembers;
  const remainingSeats = Math.max(0, PLA_CLUB_CAPACITY - reservedSeats);

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard/admin"
            className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[var(--primary)] hover:underline"
          >
            Retour admin
          </Link>
          <p className="platform-eyebrow">English Club</p>
          <h2 className="platform-title text-[var(--foreground)]">Liste d'attente Club</h2>
          <p className="platform-subtitle max-w-2xl text-[var(--muted-foreground)]">
            Le Club accepte {PLA_CLUB_CAPACITY} membres maximum. Quand une place est disponible, l'admin invite le premier membre.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 text-center">
          <Metric label="Actifs" value={activeClubMembers} />
          <Metric label="Reservees" value={pendingClubMembers} tone="amber" withBorder />
          <Metric label="Libres" value={remainingSeats} tone="green" />
        </div>
      </header>

      {remainingSeats === 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm font-bold leading-6 text-amber-700 dark:text-amber-200">
          Le Club est complet. Le bouton d'invitation refusera automatiquement toute activation tant qu'aucune place n'est libre.
        </div>
      )}

      <section className="grid gap-4">
        {waitlistedStudents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
            <p className="text-sm font-bold text-[var(--muted-foreground)]">Aucun membre en liste d'attente pour le moment.</p>
          </div>
        ) : (
          waitlistedStudents.map((student, index) => {
            const plan = getPlanInfo(student.onboardingData);
            return (
              <article key={student.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-sm font-black text-[var(--primary)]">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[var(--foreground)]">{student.name || "Sans nom"}</h3>
                      <p className="mt-1 text-xs font-bold text-[var(--muted-foreground)]">{student.email}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Pill>{plan.planLabel}</Pill>
                        <Pill>{plan.planPrice}</Pill>
                        <Pill>{plan.level}</Pill>
                        <Pill>{plan.city}</Pill>
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

function Metric({ label, value, tone, withBorder }: { label: string; value: number; tone?: "amber" | "green"; withBorder?: boolean }) {
  const valueClass = tone === "amber" ? "text-amber-600 dark:text-amber-400" : tone === "green" ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--foreground)]";
  return (
    <div className={`px-3 ${withBorder ? "border-x border-[var(--border)]" : ""}`}>
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{label}</p>
      <p className={`mt-1 text-2xl font-black ${valueClass}`}>{value}</p>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
      {children}
    </span>
  );
}
