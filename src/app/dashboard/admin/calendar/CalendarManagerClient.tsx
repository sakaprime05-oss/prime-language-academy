"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSchedule, deleteSchedule } from "@/app/actions/teacher-mgmt";

export function CalendarManagerClient({
  initialSchedules,
  teachers,
  levels,
  selectedTeacherId,
}: {
  initialSchedules: any[];
  teachers: any[];
  levels: any[];
  selectedTeacherId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teacherId, setTeacherId] = useState(selectedTeacherId || teachers[0]?.id || "");
  const [dayOfWeek, setDayOfWeek] = useState("Lundi");
  const [levelId, setLevelId] = useState(levels[0]?.id || "");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("20:00");
  const [type, setType] = useState("COURS");
  const [location, setLocation] = useState("Centre 1");
  const [isRecurring, setIsRecurring] = useState(true);
  const [specificDate, setSpecificDate] = useState("");
  const [notes, setNotes] = useState("");

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createSchedule({
        teacherId,
        levelId: type === "COURS" ? levelId : undefined,
        dayOfWeek: isRecurring ? dayOfWeek : getDayFromDate(specificDate),
        startTime,
        endTime,
        type,
        location,
        isRecurring,
        specificDate: isRecurring ? undefined : specificDate,
        notes: notes || undefined,
      });
      setNotes("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce creneau ?")) return;
    await deleteSchedule(id);
    router.refresh();
  };

  function getDayFromDate(dateStr: string): string {
    if (!dateStr) return "Lundi";
    const date = new Date(`${dateStr}T00:00:00`);
    const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return dayNames[date.getDay()] || "Lundi";
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }

  const recurringSchedules = initialSchedules.filter((schedule) => schedule.isRecurring);
  const specificSchedules = initialSchedules.filter((schedule) => !schedule.isRecurring);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <form
          onSubmit={handleAdd}
          className="sticky top-24 space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
        >
          <h3 className="text-lg font-black text-[var(--foreground)]">Ajouter un creneau</h3>

          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-xs font-bold text-red-500">
              {error}
            </p>
          )}

          <div className="flex gap-2 rounded-xl bg-[var(--muted)] p-1">
            <ModeButton active={isRecurring} onClick={() => setIsRecurring(true)}>
              Recurrent
            </ModeButton>
            <ModeButton active={!isRecurring} onClick={() => setIsRecurring(false)}>
              Date precise
            </ModeButton>
          </div>

          <div className="space-y-4">
            <Field label="Enseignant">
              <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className={fieldClassName} required>
                {teachers.map((teacher: any) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name || teacher.email}
                  </option>
                ))}
              </select>
            </Field>

            {isRecurring ? (
              <Field label="Jour de la semaine">
                <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className={fieldClassName}>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </Field>
            ) : (
              <Field label="Date precise">
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  required
                  className={fieldClassName}
                />
              </Field>
            )}

            <Field label="Type">
              <select value={type} onChange={(e) => setType(e.target.value)} className={fieldClassName}>
                <option value="COURS">Cours classique</option>
                <option value="CLUB">English Club</option>
              </select>
            </Field>

            {type === "COURS" && (
              <Field label="Niveau">
                <select value={levelId} onChange={(e) => setLevelId(e.target.value)} className={fieldClassName}>
                  {levels.map((level: any) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Debut">
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={fieldClassName} />
              </Field>
              <Field label="Fin">
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={fieldClassName} />
              </Field>
            </div>

            <Field label="Lieu / Centre">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Centre 1, Plateau"
                className={fieldClassName}
              />
            </Field>

            <Field label="Notes">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Examen, revision..."
                className={fieldClassName}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--primary)] py-4 text-sm font-bold text-[var(--primary-foreground)] shadow-lg shadow-red-500/20 transition-all hover:bg-[var(--primary)]/90 disabled:opacity-50"
          >
            {loading ? "Chargement..." : isRecurring ? "Ajouter un cours recurrent" : "Ajouter un evenement ponctuel"}
          </button>
        </form>
      </div>

      <div className="space-y-10 lg:col-span-2">
        <div className="no-scrollbar flex items-center gap-3 overflow-x-auto border-b border-[var(--border)] pb-4">
          <FilterButton active={!selectedTeacherId} onClick={() => router.push("/dashboard/admin/calendar")}>
            Tous
          </FilterButton>
          {teachers.map((teacher: any) => (
            <FilterButton
              key={teacher.id}
              active={selectedTeacherId === teacher.id}
              onClick={() => router.push(`/dashboard/admin/calendar?teacher=${teacher.id}`)}
            >
              {teacher.name?.split(" ")[0] || teacher.email.split("@")[0]}
            </FilterButton>
          ))}
        </div>

        <section className="space-y-6">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-[var(--foreground)]">
            Planning hebdomadaire recurrent
          </h3>
          <div className="space-y-6">
            {days.map((day) => {
              const daySchedules = recurringSchedules.filter((schedule: any) => schedule.dayOfWeek === day);
              return (
                <div key={day} className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    {day}
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {daySchedules.map((schedule: any) => (
                      <ScheduleCard key={schedule.id} schedule={schedule} onDelete={handleDelete} />
                    ))}
                    {daySchedules.length === 0 && (
                      <div className="rounded-xl border border-dashed border-[var(--border)] px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] md:col-span-2">
                        Aucun cours
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {specificSchedules.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--foreground)]">Evenements ponctuels</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {specificSchedules.map((schedule: any) => (
                <ScheduleCard key={schedule.id} schedule={schedule} onDelete={handleDelete} formatDate={formatDate} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const fieldClassName =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--primary)]/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{label}</label>
      {children}
    </div>
  );
}

function ModeButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
        active
          ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
        active
          ? "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]"
          : "border-[var(--border)] bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function ScheduleCard({
  schedule,
  onDelete,
  formatDate,
}: {
  schedule: any;
  onDelete: (id: string) => void;
  formatDate?: (date: string) => string;
}) {
  const isClub = schedule.type === "CLUB";
  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:border-[var(--primary)]/30">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black ${
            isClub ? "bg-emerald-500/10 text-emerald-500" : "bg-[var(--primary)]/10 text-[var(--primary)]"
          }`}
        >
          {isClub ? "EC" : "CO"}
        </div>
        <div>
          <p className="text-xs font-black text-[var(--foreground)]">
            {formatDate && schedule.specificDate ? `${formatDate(schedule.specificDate)} - ` : ""}
            {schedule.startTime} - {schedule.endTime}
          </p>
          <p className="text-[10px] font-medium text-[var(--muted-foreground)]">
            {isClub ? "English Club" : schedule.level?.name} - {schedule.teacher.name}
          </p>
          {schedule.notes && <p className="mt-0.5 text-[9px] italic text-[var(--muted-foreground)]">{schedule.notes}</p>}
          <p className="mt-0.5 text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
            {schedule.location}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDelete(schedule.id)}
        className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500"
        aria-label="Supprimer le creneau"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </article>
  );
}
