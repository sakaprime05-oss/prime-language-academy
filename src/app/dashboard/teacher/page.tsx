import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAssignedLevels } from "@/app/actions/teacher-data";
import { getTeacherSchedules, getTrainingDocs } from "@/app/actions/teacher-mgmt";
import { TeacherDashboardClient } from "./TeacherDashboardClient";

export default async function TeacherDashboardPage() {
  const session = await auth();
  if (!session || (session.user?.role !== "TEACHER" && session.user?.role !== "ADMIN")) {
    redirect("/login");
  }

  const teacherId = session.user.id;

  const [levels, schedules, documents] = await Promise.all([
    getAssignedLevels(),
    getTeacherSchedules(teacherId),
    getTrainingDocs(teacherId),
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 pb-20 duration-700">
      <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--foreground)] shadow-[var(--glass-shadow)] md:p-12 md:text-left">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="max-w-xl space-y-4">
            <span className="inline-block rounded-full bg-[var(--primary)]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] shadow-sm">
              Interface académique · Espace Enseignant
            </span>
            <h1 className="text-3xl font-black leading-[1.1] tracking-tighter text-[var(--foreground)] md:text-5xl">
              Bonjour, <br />
              <span className="text-[var(--primary)]">{session.user.name || "Professeur"}</span>
            </h1>
            <p className="font-medium leading-relaxed text-[var(--muted-foreground)] md:text-lg">
              Consultez votre planning, gérez vos classes et accédez aux ressources de formation de l'académie.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
            <TeacherStat label="Classes" value={levels.length} />
            <TeacherStat label="Cours / Sem" value={(schedules as any[]).filter((schedule: any) => schedule.isRecurring).length} />
          </div>
        </div>
      </header>

      <TeacherDashboardClient levels={levels as any[]} schedules={schedules as any[]} documents={documents as any[]} />
    </div>
  );
}

function TeacherStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 text-center">
      <p className="text-3xl font-black text-[var(--foreground)]">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}
