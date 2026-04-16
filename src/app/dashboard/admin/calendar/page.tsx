import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTeacherSchedules, getAllTeachers } from "@/app/actions/teacher-mgmt";
import { prisma } from "@/lib/prisma";
import { CalendarManagerClient } from "./CalendarManagerClient";
import Link from "next/link";

export default async function AdminCalendarPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ teacher?: string }>
}) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    const params = await searchParams;
    const teachers = await getAllTeachers();
    const allLevels = await prisma.level.findMany();
    const schedules = await getTeacherSchedules(params.teacher);

    const selectedTeacherId = params.teacher;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/dashboard/admin/teachers" className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 mb-2">
                        ← Retour aux enseignants
                    </Link>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">Calendrier Pédagogique</h2>
                    <p className="text-white/40 text-sm font-medium">Créez des créneaux récurrents ou des événements ponctuels.</p>
                </div>
            </header>

            <CalendarManagerClient 
                initialSchedules={schedules as any[]} 
                teachers={teachers as any[]}
                levels={allLevels}
                selectedTeacherId={selectedTeacherId}
            />
        </div>
    );
}
