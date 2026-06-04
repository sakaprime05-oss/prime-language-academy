import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAllTeachers } from "@/app/actions/teacher-mgmt";
import { prisma } from "@/lib/prisma";
import { TeacherManagerClient } from "./TeacherManagerClient";

export default async function AdminTeachersPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/login");

  const teachers = await getAllTeachers();
  const allLevels = await prisma.level.findMany();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin"
            className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[var(--primary)] hover:underline"
          >
            Retour a l'admin
          </Link>
          <p className="platform-eyebrow">Equipe pedagogique</p>
          <h2 className="platform-title text-[var(--foreground)]">Gestion Enseignants</h2>
          <p className="platform-subtitle text-[var(--muted-foreground)]">
            Assignez les niveaux aux professeurs et gardez une equipe lisible.
          </p>
        </div>
      </header>

      <TeacherManagerClient initialTeachers={teachers as any[]} allLevels={allLevels} />
    </div>
  );
}
