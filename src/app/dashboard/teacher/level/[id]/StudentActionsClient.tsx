"use client";

import { useState } from "react";
import { markAttendance, submitGrade } from "@/app/actions/teacher-class";

export function StudentActionsClient({
  studentId,
  studentName,
  levelId,
  schedules,
}: {
  studentId: string;
  studentName: string;
  levelId: string;
  schedules: any[];
}) {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isGradeOpen, setIsGradeOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
  const [attendanceNote, setAttendanceNote] = useState("");
  const [score, setScore] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await markAttendance({
        studentId,
        scheduleId: selectedSchedule,
        date: attendanceDate,
        status: attendanceStatus,
        note: attendanceNote,
      });
      setIsAttendanceOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement de l'appel");
    }
    setIsSubmitting(false);
  };

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitGrade({
        studentId,
        levelId,
        score: score ? parseFloat(score) : undefined,
        category,
        feedback,
        date: new Date().toISOString().split("T")[0],
      });
      setIsGradeOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement de la note");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="mt-4 flex items-center gap-2 md:mt-0">
        <button
          type="button"
          onClick={() => setIsAttendanceOpen(true)}
          className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-teal-600 transition-all hover:bg-teal-500/20 dark:text-teal-400"
        >
          Faire l'appel
        </button>
        <button
          type="button"
          onClick={() => setIsGradeOpen(true)}
          className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-orange-600 transition-all hover:bg-orange-500/20 dark:text-orange-400"
        >
          Noter & Feedback
        </button>
      </div>

      {isAttendanceOpen && (
        <Modal title={`Appel : ${studentName}`} subtitle="Enregistrement des presences" onClose={() => setIsAttendanceOpen(false)}>
          <form onSubmit={handleAttendance} className="space-y-4">
            <Field label="Creneau / Cours">
              <select className={fieldClassName} value={selectedSchedule} onChange={(e) => setSelectedSchedule(e.target.value)} required>
                <option value="">Selectionner un cours...</option>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.dayOfWeek} {schedule.startTime}-{schedule.endTime} ({schedule.type})
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                <input
                  type="date"
                  className={fieldClassName}
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  required
                />
              </Field>
              <Field label="Statut">
                <select className={fieldClassName} value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)}>
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">En retard</option>
                  <option value="EXCUSED">Excuse</option>
                </select>
              </Field>
            </div>

            <Field label="Note">
              <textarea
                className={`${fieldClassName} min-h-[80px]`}
                placeholder="Raison du retard, observation particuliere..."
                value={attendanceNote}
                onChange={(e) => setAttendanceNote(e.target.value)}
              />
            </Field>

            <div className="flex gap-3 pt-4">
              <SecondaryButton onClick={() => setIsAttendanceOpen(false)}>Annuler</SecondaryButton>
              <SubmitButton disabled={isSubmitting} tone="teal">
                Confirmer
              </SubmitButton>
            </div>
          </form>
        </Modal>
      )}

      {isGradeOpen && (
        <Modal title={`Note & Feedback : ${studentName}`} subtitle="Evaluation des competences" onClose={() => setIsGradeOpen(false)}>
          <form onSubmit={handleGrade} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Note (/10 ou /20)">
                <input
                  type="number"
                  step="0.5"
                  className={fieldClassName}
                  placeholder="Ex: 15"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </Field>
              <Field label="Categorie">
                <select className={fieldClassName} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="GENERAL">General</option>
                  <option value="SPEAKING">Speaking (Oral)</option>
                  <option value="LISTENING">Listening (Ecoute)</option>
                  <option value="GRAMMAR">Grammar (Grammaire)</option>
                  <option value="EXERCICE">Exercice Maison</option>
                </select>
              </Field>
            </div>

            <Field label="Feedback pedagogique">
              <textarea
                className={`${fieldClassName} min-h-[120px]`}
                placeholder="Excellente participation, mais attention a la prononciation..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </Field>

            <div className="flex gap-3 pt-4">
              <SecondaryButton onClick={() => setIsGradeOpen(false)}>Annuler</SecondaryButton>
              <SubmitButton disabled={isSubmitting} tone="orange">
                Soumettre
              </SubmitButton>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

const fieldClassName =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--primary)]/50";

function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-in zoom-in-95 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="mb-2 text-xl font-black text-[var(--foreground)]">{title}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[var(--muted)] px-3 py-2 text-xs font-black text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            aria-label="Fermer"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-xl bg-[var(--muted)] py-3 text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
    >
      {children}
    </button>
  );
}

function SubmitButton({ children, disabled, tone }: { children: React.ReactNode; disabled: boolean; tone: "teal" | "orange" }) {
  const toneClass = tone === "teal" ? "bg-teal-500 hover:bg-teal-600" : "bg-orange-500 hover:bg-orange-600";
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`flex-1 rounded-xl py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors disabled:opacity-50 ${toneClass}`}
    >
      {children}
    </button>
  );
}
