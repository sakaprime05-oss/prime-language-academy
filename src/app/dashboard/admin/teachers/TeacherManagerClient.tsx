"use client";

import { useState } from "react";
import Link from "next/link";
import { assignLevelToTeacher, removeLevelFromTeacher } from "@/app/actions/teacher-mgmt";
import { User, Level } from "@prisma/client";

interface TeacherWithLevels extends User {
    assignedLevels: Level[];
    _count: { schedules: number };
}

export function TeacherManagerClient({ initialTeachers, allLevels }: { 
    initialTeachers: TeacherWithLevels[], 
    allLevels: Level[] 
}) {
    const [teachers, setTeachers] = useState(initialTeachers);

    const handleAssign = async (teacherId: string, levelId: string) => {
        await assignLevelToTeacher(teacherId, levelId);
        // Optimistic UI or simple refresh
        const newTeachers = teachers.map(t => {
            if (t.id === teacherId) {
                const level = allLevels.find(l => l.id === levelId);
                if (level && !t.assignedLevels.find(al => al.id === levelId)) {
                    return { ...t, assignedLevels: [...t.assignedLevels, level] };
                }
            }
            return t;
        });
        setTeachers(newTeachers);
    };

    const handleRemove = async (teacherId: string, levelId: string) => {
        await removeLevelFromTeacher(teacherId, levelId);
        const newTeachers = teachers.map(t => {
            if (t.id === teacherId) {
                return { ...t, assignedLevels: t.assignedLevels.filter(l => l.id !== levelId) };
            }
            return t;
        });
        setTeachers(newTeachers);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachers.map((teacher) => (
                <div key={teacher.id} className="glass-card hover:bg-white/[0.02] border-white/5 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-black text-xl">
                            {teacher.name?.[0] || teacher.email[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{teacher.name || "Enseignant Sans Nom"}</h3>
                            <p className="text-xs text-white/40">{teacher.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Niveaux Assignés</p>
                            <div className="flex flex-wrap gap-2">
                                {teacher.assignedLevels.map(level => (
                                    <span key={level.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-[10px] font-bold border border-red-500/20 group">
                                        {level.name}
                                        <button 
                                            onClick={() => handleRemove(teacher.id, level.id)} 
                                            className="hover:text-white transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </span>
                                ))}
                                {teacher.assignedLevels.length === 0 && <p className="text-xs text-white/20 italic">Aucun niveau assigné.</p>}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Ajouter un niveau</p>
                            <div className="flex flex-wrap gap-2">
                                {allLevels
                                    .filter(l => !teacher.assignedLevels.find(al => al.id === l.id))
                                    .map(level => (
                                        <button
                                            key={level.id}
                                            onClick={() => handleAssign(teacher.id, level.id)}
                                            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full text-[10px] font-bold border border-white/5 transition-all"
                                        >
                                            + {level.name}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                        <Link 
                            href={`/dashboard/admin/calendar?teacher=${teacher.id}`} 
                            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs text-center transition-all shadow-lg shadow-red-500/20"
                        >
                            Gérer son Calendrier
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
