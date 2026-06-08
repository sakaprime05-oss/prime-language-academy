"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ClipboardList, Download, FileText, PlayCircle } from "lucide-react";
import { markLessonComplete } from "@/app/actions/student-progress";

interface LessonItemProps {
    lesson: any;
    isCompleted: boolean;
}

export default function LessonItem({ lesson, isCompleted: initialCompleted }: LessonItemProps) {
    const [completed, setCompleted] = useState(initialCompleted);
    const [loading, setLoading] = useState(false);
    const isPdf = lesson.type === "PDF";
    const hasContent = Boolean(lesson.contentUrl) || lesson.type === "QUIZ";

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (completed) return;

        setLoading(true);
        try {
            await markLessonComplete(lesson.id);
            setCompleted(true);
        } catch {
            alert("Erreur lors de la mise a jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`glass-card group flex items-center justify-between gap-3 !p-4 transition-all hover:border-[var(--primary)]/30 ${completed ? "opacity-80" : ""}`}>
            <Link href={`/dashboard/student/courses/${lesson.id}`} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl transition-colors sm:h-11 sm:w-11 ${completed ? "bg-green-500/15 text-green-500" : isPdf ? "bg-red-500/10 text-red-500" : "bg-[var(--surface-hover)] text-[var(--foreground)]/45"}`}>
                    {completed ? (
                        <Check className="h-5 w-5" aria-hidden="true" />
                    ) : isPdf ? (
                        <FileText className="h-5 w-5" aria-hidden="true" />
                    ) : lesson.type === "QUIZ" ? (
                        <ClipboardList className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <PlayCircle className="h-5 w-5" aria-hidden="true" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className={`truncate text-sm font-bold ${completed ? "text-[var(--foreground)]/40 line-through" : "text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]"}`}>
                        {lesson.title}
                    </h4>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--foreground)]/5 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
                            {isPdf ? "PDF" : lesson.type}
                        </span>
                        <span className={`text-[10px] font-bold ${hasContent ? "text-[var(--foreground)]/45" : "text-amber-500"}`}>
                            {isPdf ? "ouvrir ou telecharger" : hasContent ? "voir le contenu" : "contenu a completer"}
                        </span>
                    </div>
                </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
                {isPdf && lesson.contentUrl && (
                    <a
                        href={lesson.contentUrl}
                        download
                        onClick={(event) => event.stopPropagation()}
                        className="hidden rounded-xl border border-[var(--foreground)]/10 p-2 text-[var(--foreground)]/45 transition-colors hover:border-[var(--primary)]/30 hover:text-[var(--primary)] sm:inline-flex"
                        aria-label={`Telecharger ${lesson.title}`}
                    >
                        <Download className="h-4 w-4" aria-hidden="true" />
                    </a>
                )}
                {!completed && (
                    <button
                        disabled={loading}
                        onClick={handleToggle}
                        className="z-10 rounded-xl bg-[var(--primary)]/10 px-4 py-2 text-[10px] font-bold text-[var(--primary)] transition-all hover:bg-[var(--primary)] hover:text-white active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "..." : "Terminer"}
                    </button>
                )}
            </div>
        </div>
    );
}
