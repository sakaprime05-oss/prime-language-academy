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
        getTrainingDocs(teacherId)  // Pass teacherId for access-control filtering
    ]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="relative overflow-hidden rounded-3xl glass-card border-teal-500/20 p-8 md:p-12 text-center md:text-left bg-gradient-to-br from-teal-500/5 to-transparent">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:justify-between">
                    <div className="space-y-4 max-w-xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                            Interface Académique — Espace Enseignant
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.1]">
                            Bonjour, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">
                                {session.user.name || "Professeur"}
                            </span>
                        </h1>
                        <p className="text-white/80 font-medium md:text-lg leading-relaxed">
                            Consultez votre planning, gérez vos classes et accédez aux ressources de formation de l'académie.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="glass-card !p-6 border-white/5 bg-white/[0.02] text-center">
                            <p className="text-3xl font-black text-white">{levels.length}</p>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Classes</p>
                        </div>
                        <div className="glass-card !p-6 border-white/5 bg-white/[0.02] text-center">
                            <p className="text-3xl font-black text-white">
                                {(schedules as any[]).filter((s: any) => s.isRecurring).length}
                            </p>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Cours / Sem</p>
                        </div>
                    </div>
                </div>
            </header>

            <TeacherDashboardClient 
                levels={levels as any[]} 
                schedules={schedules as any[]} 
                documents={documents as any[]} 
            />
        </div>
    );
}
