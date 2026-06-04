import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAllTeachers, getTeacherSchedules } from "@/app/actions/teacher-mgmt";
import { prisma } from "@/lib/prisma";
import { CalendarManagerClient } from "./CalendarManagerClient";

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ teacher?: string }>;
}) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const teachers = await getAllTeachers();
  const allLevels = await prisma.level.findMany();
  const schedules = await getTeacherSchedules(params.teacher);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin/teachers"
            className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[var(--primary)] hover:underline"
          >
            Retour aux enseignants
          </Link>
          <p className="platform-eyebrow">Planning</p>
          <h2 className="platform-title text-[var(--foreground)]">Calendrier Pedagogique</h2>
          <p className="platform-subtitle text-[var(--muted-foreground)]">
            Creez des creneaux recurrents ou des evenements ponctuels.
          </p>
        </div>
      </header>

      <CalendarManagerClient
        initialSchedules={schedules as any[]}
        teachers={teachers as any[]}
        levels={allLevels}
        selectedTeacherId={params.teacher}
      />
    </div>
  );
}
