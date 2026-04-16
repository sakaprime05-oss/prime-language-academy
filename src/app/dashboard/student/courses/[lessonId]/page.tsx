import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LessonContentVideo from "./LessonContentVideo";
import LessonContentPdf from "./LessonContentPdf";

export default async function LessonPage(props: { params: Promise<{ lessonId: string }> }) {
    const params = await props.params;
    const session = await auth();
    // La vérification de rôle STUDENT est déjà assurée par src/app/dashboard/student/layout.tsx
    if (!session) redirect("/login");

    const lesson = await prisma.lesson.findUnique({
        where: { id: params.lessonId },
        include: {
            module: {
                include: { level: true }
            }
        }
    });

    if (!lesson) redirect("/dashboard/student/courses");

    const progress = await prisma.progress.findUnique({
        where: {
            userId_lessonId: {
                userId: session.user.id,
                lessonId: lesson.id
            }
        }
    });
    const isCompleted = progress?.completed ?? false;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <header>
                <Link href="/dashboard/student/courses" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-2">
                    ← Retour au programme
                </Link>
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--foreground)]/50 font-bold">
                        {lesson.module.level.name} • Module {lesson.module.order + 1}
                    </span>
                    <h2 className="text-3xl font-extrabold text-[var(--foreground)]">{lesson.title}</h2>
                </div>
            </header>

            <div className="w-full rounded-3xl overflow-hidden glass-card !p-0 border border-[var(--primary)]/20 shadow-xl bg-black/40">
                {lesson.type === "VIDEO" && <LessonContentVideo url={lesson.contentUrl} />}
                {lesson.type === "PDF" && <LessonContentPdf url={lesson.contentUrl} />}
                {lesson.type === "QUIZ" && (
                    <div className="p-10 text-center">
                        <h3 className="text-xl font-bold mb-4">Quiz Interactif</h3>
                        <p className="text-[var(--foreground)]/60">Contenu du quiz à venir.</p>
                    </div>
                )}
                {!lesson.contentUrl && lesson.type !== "QUIZ" && (
                    <div className="p-10 text-center text-[var(--foreground)]/50">
                        Aucun contenu uploadé pour cette leçon.
                    </div>
                )}
            </div>

            <div className="glass-card flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 text-center sm:text-left">
                <div>
                    <h4 className="font-bold text-lg">Avez-vous terminé cette leçon ?</h4>
                    <p className="text-sm text-[var(--foreground)]/60 mt-1">Marquez-la comme terminée pour suivre votre progression.</p>
                </div>
                <Link href="/dashboard/student/courses" className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                    {isCompleted ? "✓ Déjà terminée" : "Continuer"}
                </Link>
            </div>
        </div>
    );
}
