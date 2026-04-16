import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllTeachers, assignLevelToTeacher, removeLevelFromTeacher } from "@/app/actions/teacher-mgmt";
import { prisma } from "@/lib/prisma";
import { TeacherManagerClient } from "./TeacherManagerClient";
import Link from "next/link";

export default async function AdminTeachersPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    const teachers = await getAllTeachers();
    const allLevels = await prisma.level.findMany();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/dashboard/admin" className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 mb-2">
                        ← Retour à l'admin
                    </Link>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">Gestion Enseignants</h2>
                    <p className="text-white/40 text-sm font-medium">Assignez les niveaux aux professeurs et gérez l'équipe pédagogique.</p>
                </div>
            </header>

            <TeacherManagerClient 
                initialTeachers={teachers as any[]} 
                allLevels={allLevels} 
            />
        </div>
    );
}
