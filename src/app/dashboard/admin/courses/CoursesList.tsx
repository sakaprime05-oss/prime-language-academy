"use client";

import { useState } from "react";
import { LevelModal, ModuleModal, LessonModal } from "./AdminContentModals";
import { deleteLevel, deleteModule, deleteLesson } from "@/app/actions/admin-content";

interface CoursesListProps {
    levels: any[]; // Replace with proper type from Prisma if possible
}

export default function CoursesList({ levels }: CoursesListProps) {
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

    const handleDeleteLevel = async (id: string, name: string) => {
        if (confirm(`Voulez-vous vraiment supprimer le niveau "${name}" ? Cela supprimera tous ses modules et leçons.`)) {
            try {
                await deleteLevel(id);
            } catch (error) {
                alert("Erreur lors de la suppression du niveau");
            }
        }
    };

    const handleDeleteModule = async (id: string, title: string) => {
        if (confirm(`Supprimer le module "${title}" ?`)) {
            try {
                await deleteModule(id);
            } catch (error) {
                alert("Erreur lors de la suppression du module");
            }
        }
    };

    const handleDeleteLesson = async (id: string, title: string) => {
        if (confirm(`Supprimer la leçon "${title}" ?`)) {
            try {
                await deleteLesson(id);
            } catch (error) {
                alert("Erreur lors de la suppression de la leçon");
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">Gestion du Contenu</h2>
                    <p className="text-[var(--foreground)]/60 text-sm">Organisez les niveaux, modules et leçons.</p>
                </div>
                <button
                    onClick={() => setIsLevelModalOpen(true)}
                    className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 text-sm font-bold rounded-xl hover:opacity-80 transition-opacity"
                >
                    + Nouveau Niveau
                </button>
            </header>

            {levels.length === 0 ? (
                <div className="glass-card text-center py-12">
                    <p className="text-[var(--foreground)]/50 mb-4">Aucun niveau défini pour le moment.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {levels.map((level) => (
                        <div key={level.id} className="glass-card !p-0 overflow-hidden border-l-4 border-l-[var(--primary)]">
                            <div className="p-5 border-b border-black/5 dark:border-white/5 bg-[var(--surface-hover)]/30 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-[var(--foreground)]">{level.name}</h3>
                                    <p className="text-xs text-[var(--foreground)]/60">{level.price.toLocaleString('fr-FR')} FCFA</p>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <button
                                        onClick={() => setActiveLevelId(level.id)}
                                        className="text-xs font-bold text-[var(--primary)] hover:underline"
                                    >
                                        Ajouter Module
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLevel(level.id, level.name)}
                                        className="text-xs font-bold text-red-500 hover:underline"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 space-y-4">
                                {level.modules.length === 0 ? (
                                    <p className="text-xs text-[var(--foreground)]/40 italic">Aucun module dans ce niveau.</p>
                                ) : (
                                    level.modules.map((module: any) => (
                                        <div key={module.id} className="ml-4 border-l-2 border-[var(--primary)]/20 pl-4 py-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-bold text-sm text-[var(--foreground)]/80">
                                                        {module.order > 0 ? `Mod. ${module.order} : ` : ""}{module.title}
                                                    </h4>
                                                    <button
                                                        onClick={() => handleDeleteModule(module.id, module.title)}
                                                        className="text-[10px] text-red-500 hover:text-red-700 opacity-50 hover:opacity-100"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => setActiveModuleId(module.id)}
                                                    className="text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded hover:bg-green-500/20 transition-colors"
                                                >
                                                    + Leçon
                                                </button>
                                            </div>

                                            <div className="space-y-2 mt-2">
                                                {module.lessons.map((lesson: any) => (
                                                    <div key={lesson.id} className="flex items-center justify-between text-xs text-[var(--foreground)]/60 bg-[var(--surface-hover)] p-2 rounded-lg group hover:bg-[var(--surface-hover)]/80">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 bg-[var(--primary)]/10 text-[var(--primary)] rounded flex items-center justify-center font-bold">
                                                                {lesson.type === 'VIDEO' ? '▶' : '📄'}
                                                            </span>
                                                            <a href={`/dashboard/student/courses/${lesson.id}`} className="hover:text-[var(--primary)] hover:underline transition-colors">
                                                                {lesson.title}
                                                            </a>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <a
                                                                href={`/dashboard/student/courses/${lesson.id}`}
                                                                className="text-[10px] text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                                            >
                                                                Aperçu
                                                            </a>
                                                            <button
                                                                onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                                                className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <LevelModal
                isOpen={isLevelModalOpen}
                onClose={() => setIsLevelModalOpen(false)}
            />
            {activeLevelId && (
                <ModuleModal
                    isOpen={!!activeLevelId}
                    onClose={() => setActiveLevelId(null)}
                    levelId={activeLevelId}
                />
            )}
            {activeModuleId && (
                <LessonModal
                    isOpen={!!activeModuleId}
                    onClose={() => setActiveModuleId(null)}
                    moduleId={activeModuleId}
                />
            )}
        </div>
    );
}
