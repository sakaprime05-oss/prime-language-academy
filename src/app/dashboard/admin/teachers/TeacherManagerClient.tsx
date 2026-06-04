"use client";

import { useState } from "react";
import Link from "next/link";
import type { Level, User } from "@prisma/client";
import { assignLevelToTeacher, removeLevelFromTeacher } from "@/app/actions/teacher-mgmt";

interface TeacherWithLevels extends User {
  assignedLevels: Level[];
  _count: { schedules: number };
}

export function TeacherManagerClient({
  initialTeachers,
  allLevels,
}: {
  initialTeachers: TeacherWithLevels[];
  allLevels: Level[];
}) {
  const [teachers, setTeachers] = useState(initialTeachers);

  const handleAssign = async (teacherId: string, levelId: string) => {
    await assignLevelToTeacher(teacherId, levelId);
    setTeachers((current) =>
      current.map((teacher) => {
        if (teacher.id !== teacherId) return teacher;
        const level = allLevels.find((item) => item.id === levelId);
        if (!level || teacher.assignedLevels.some((item) => item.id === levelId)) return teacher;
        return { ...teacher, assignedLevels: [...teacher.assignedLevels, level] };
      })
    );
  };

  const handleRemove = async (teacherId: string, levelId: string) => {
    await removeLevelFromTeacher(teacherId, levelId);
    setTeachers((current) =>
      current.map((teacher) =>
        teacher.id === teacherId
          ? { ...teacher, assignedLevels: teacher.assignedLevels.filter((level) => level.id !== levelId) }
          : teacher
      )
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {teachers.map((teacher) => (
        <article
          key={teacher.id}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:border-[var(--primary)]/30"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-xl font-black text-[var(--primary)]">
              {teacher.name?.[0] || teacher.email[0]}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-bold text-[var(--foreground)]">{teacher.name || "Enseignant sans nom"}</h3>
              <p className="truncate text-xs text-[var(--muted-foreground)]">{teacher.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Niveaux assignes
              </p>
              <div className="flex flex-wrap gap-2">
                {teacher.assignedLevels.map((level) => (
                  <span
                    key={level.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-[10px] font-bold text-[var(--primary)]"
                  >
                    {level.name}
                    <button
                      type="button"
                      onClick={() => handleRemove(teacher.id, level.id)}
                      className="rounded-full p-0.5 text-[var(--primary)]/70 transition-colors hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]"
                      aria-label={`Retirer ${level.name}`}
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {teacher.assignedLevels.length === 0 && (
                  <p className="text-xs italic text-[var(--muted-foreground)]">Aucun niveau assigne.</p>
                )}
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                Ajouter un niveau
              </p>
              <div className="flex flex-wrap gap-2">
                {allLevels
                  .filter((level) => !teacher.assignedLevels.some((assigned) => assigned.id === level.id))
                  .map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => handleAssign(teacher.id, level.id)}
                      className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-[10px] font-bold text-[var(--muted-foreground)] transition-all hover:border-[var(--primary)]/30 hover:text-[var(--foreground)]"
                    >
                      + {level.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <Link
              href={`/dashboard/admin/calendar?teacher=${teacher.id}`}
              className="block rounded-xl bg-[var(--primary)] px-4 py-2.5 text-center text-xs font-bold text-[var(--primary-foreground)] shadow-lg shadow-red-500/20 transition-all hover:bg-[var(--primary)]/90"
            >
              Gerer son calendrier
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
