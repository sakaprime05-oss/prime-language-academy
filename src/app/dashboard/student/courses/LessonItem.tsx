"use client";

import { useState } from "react";
import { markLessonComplete } from "@/app/actions/student-progress";
import Link from "next/link";

interface LessonItemProps {
    lesson: any;
    isCompleted: boolean;
}

export default function LessonItem({ lesson, isCompleted: initialCompleted }: LessonItemProps) {
    const [completed, setCompleted] = useState(initialCompleted);
    const [loading, setLoading] = useState(false);
    const isPdf = lesson.type === "PDF";

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevenir la navigation si on clique sur le bouton
        if (completed) return;

        setLoading(true);
        try {
            await markLessonComplete(lesson.id);
            setCompleted(true);
        } catch (error) {
            alert("Erreur lors de la mise a jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link href={`/dashboard/student/courses/${lesson.id}`} className={`glass-card !p-4 flex items-center justify-between group hover:border-[var(--primary)]/30 transition-all ${completed ? 'opacity-80' : ''}`}>
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 mr-2">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors ${completed ? 'bg-green-500/20 text-green-500' : 'bg-[var(--surface-hover)] text-[var(--foreground)]/40'}`}>
                    {completed ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className={`font-bold text-sm truncate ${completed ? 'line-through text-[var(--foreground)]/40' : 'text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors'}`}>
                        {lesson.title}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest truncate text-[var(--foreground)]/30 group-hover:text-[var(--primary)]/70 transition-colors">
                        {isPdf ? "PDF - ouvrir / telecharger" : `${lesson.type} - voir le contenu`}
                    </p>
                </div>
            </div>

            {!completed && (
                <button
                    disabled={loading}
                    onClick={handleToggle}
                    className="text-[10px] font-bold bg-[var(--primary)]/10 z-10 text-[var(--primary)] px-4 py-2 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all active:scale-95"
                >
                    {loading ? "Chargement..." : "Terminer"}
                </button>
            )}
        </Link>
    );
}
