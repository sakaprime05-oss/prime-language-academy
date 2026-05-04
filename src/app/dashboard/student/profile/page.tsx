import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentProgressData } from "@/app/actions/student-progress";
import { parseStudentProfileData } from "@/lib/student-profile";
import { StudentProfileForm } from "./profile-form";

export default async function StudentProfilePage({ searchParams }: { searchParams?: Promise<{ complete?: string }> }) {
  const session = await auth();
  if (!session || session.user?.role !== "STUDENT") redirect("/login");
  const params = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      level: true,
      badges: { include: { badge: true } },
      gradesReceived: {
        include: { teacher: { select: { name: true } } },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const profile = parseStudentProfileData(user.onboardingData);
  const progressData = await getStudentProgressData(session.user.id);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Mon profil</h2>
        <p className="text-sm font-medium text-[var(--foreground)]/50">
          Ajoutez votre photo, vos contacts utiles et vos objectifs de progression.
        </p>
      </header>

      {params?.complete === "1" && !profile.profilePhotoUrl && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm font-bold leading-6 text-amber-600">
          Ajoutez votre photo de profil pour continuer vers la plateforme.
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <Stat label="Niveau" value={user.level?.name || "A definir"} />
        <Stat label="Progression" value={`${progressData.percentage}%`} />
        <Stat label="Lecons faites" value={`${progressData.completedLessons || 0}/${progressData.totalLessons || 0}`} />
        <Stat label="Statut" value={user.status === "ACTIVE" ? "Actif" : user.status} />
      </section>

      <StudentProfileForm values={profile} />

      {user.badges.length > 0 && (
        <section className="glass-card space-y-4 p-5 sm:p-8">
          <h3 className="text-lg font-black text-[var(--foreground)]">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((item) => (
              <div key={item.id} className="rounded-full border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 px-4 py-2 text-xs font-black text-[var(--foreground)]/70">
                <span className="mr-2">{item.badge.icon}</span>
                {item.badge.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {user.gradesReceived.length > 0 && (
        <section className="glass-card space-y-4 p-5 sm:p-8">
          <h3 className="text-lg font-black text-[var(--foreground)]">Evaluations et retours</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {user.gradesReceived.map((grade) => (
              <div key={grade.id} className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">{grade.category}</p>
                  {grade.score !== null && <p className="text-lg font-black text-primary">{grade.score}/100</p>}
                </div>
                {grade.feedback && <p className="mt-3 text-sm font-medium leading-6 text-[var(--foreground)]/75">{grade.feedback}</p>}
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/35">
                  {new Date(grade.date).toLocaleDateString("fr-FR")} - {grade.teacher.name || "Professeur"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card !p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40">{label}</p>
      <p className="mt-2 text-xl font-black text-[var(--foreground)]">{value}</p>
    </div>
  );
}
