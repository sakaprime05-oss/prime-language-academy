"use client";

import { useState } from "react";
import Link from "next/link";

export function TeacherDashboardClient({
  levels,
  schedules,
  documents,
}: {
  levels: any[];
  schedules: any[];
  documents: any[];
}) {
  const [activeTab, setActiveTab] = useState("calendar");
  const daysWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const recurringSchedules = schedules.filter((schedule) => schedule.isRecurring);
  const specificSchedules = schedules
    .filter((schedule) => !schedule.isRecurring)
    .sort((a, b) => (a.specificDate || "").localeCompare(b.specificDate || ""));

  function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3 overflow-x-auto border-b border-[var(--border)] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          { key: "calendar", label: "Mon planning", count: schedules.length },
          { key: "classes", label: "Mes classes", count: levels.length },
          { key: "resources", label: "Ressources", count: documents.length },
        ].map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em] transition-all ${
                active
                  ? "border-[var(--primary)]/45 bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-[9px]">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {activeTab === "calendar" && (
        <section className="animate-in fade-in slide-in-from-left-4 space-y-12 duration-500">
          <div className="space-y-6">
            <SectionTitle label="Planning hebdomadaire" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {daysWeek.map((day) => {
                const daySchedules = recurringSchedules.filter((schedule: any) => schedule.dayOfWeek === day);
                return (
                  <div key={day} className="space-y-3">
                    <h4 className="flex items-center justify-center gap-1.5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      <span className={`h-1.5 w-1.5 rounded-full ${daySchedules.length > 0 ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`} />
                      {day}
                    </h4>
                    <div className="space-y-3">
                      {daySchedules.map((item: any) => (
                        <ScheduleCard key={item.id} item={item} />
                      ))}
                      {daySchedules.length === 0 && (
                        <div className="flex h-20 items-center justify-center rounded-2xl border border-dashed border-[var(--border)]">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Libre</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {specificSchedules.length > 0 && (
            <div className="space-y-6">
              <SectionTitle label="Événements ponctuels" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {specificSchedules.map((item: any) => (
                  <ScheduleCard key={item.id} item={item} dateLabel={formatDate(item.specificDate)} tone="orange" />
                ))}
              </div>
            </div>
          )}

          {schedules.length === 0 && (
            <EmptyState title="Aucun cours programmé" subtitle="Contactez votre administrateur pour la planification." />
          )}
        </section>
      )}

      {activeTab === "classes" && (
        <section className="animate-in fade-in slide-in-from-right-4 grid grid-cols-1 gap-6 duration-500 md:grid-cols-2 lg:grid-cols-3">
          {levels.map((level: any) => (
            <Link key={level.id} href={`/dashboard/teacher/level/${level.id}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-[var(--foreground)] transition-all hover:border-[var(--primary)]/35 hover:shadow-[var(--glass-shadow)]">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-xl font-black text-[var(--primary)] transition-transform group-hover:scale-110">
                  {level.name[0]}
                </div>
                <div className="rounded-full bg-[var(--muted)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                  {level._count?.students || 0} élèves
                </div>
              </div>
              <h3 className="mb-2 text-xl font-black leading-tight tracking-tight">{level.name}</h3>
              <p className="line-clamp-2 text-xs font-medium leading-relaxed text-[var(--muted-foreground)]">
                {level.description || "Aucune description pour ce niveau."}
              </p>
              <div className="mt-8 border-t border-[var(--border)] pt-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">Voir progression</span>
              </div>
            </Link>
          ))}
          {levels.length === 0 && (
            <div className="col-span-full">
              <EmptyState title="Aucune classe assignée" />
            </div>
          )}
        </section>
      )}

      {activeTab === "resources" && (
        <section className="animate-in zoom-in-95 grid grid-cols-1 gap-6 duration-500 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc: any) => (
            <div key={doc.id} className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)] transition-all hover:border-[var(--primary)]/35">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] transition-transform group-hover:rotate-3">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <span className="mb-2 inline-block rounded border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[var(--primary)]">
                    {doc.category}
                  </span>
                  <h4 className="text-sm font-bold leading-snug">{doc.title}</h4>
                  <p className="mt-1 line-clamp-2 text-[10px] text-[var(--muted-foreground)]">{doc.description}</p>
                </div>
              </div>
              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 w-full rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] transition-all hover:bg-[var(--primary)]/15">
                Ouvrir / Télécharger
              </a>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="col-span-full">
              <EmptyState title="Aucune ressource disponible" subtitle="Les ressources partagées par l'administration apparaîtront ici." />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-[var(--foreground)]">
      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--primary)]/15 text-[10px] text-[var(--primary)]" />
      {label}
    </h3>
  );
}

function ScheduleCard({ item, dateLabel, tone = "primary" }: { item: any; dateLabel?: string; tone?: "primary" | "orange" }) {
  const color = tone === "orange" ? "text-orange-500 border-orange-500/20 bg-orange-500/10" : "text-[var(--primary)] border-[var(--primary)]/20 bg-[var(--primary)]/10";
  return (
    <div className={`rounded-2xl border p-4 transition-all ${color}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded bg-current/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
          {dateLabel || (item.type === "CLUB" ? "Club" : "Cours")}
        </span>
      </div>
      <p className="text-sm font-black text-[var(--foreground)]">{item.startTime} - {item.endTime}</p>
      <p className="mt-1 truncate text-xs font-bold text-[var(--foreground)]">{item.level?.name || "English Club"}</p>
      {item.notes && <p className="mt-2 rounded-lg bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--muted-foreground)]">{item.notes}</p>}
      <p className="mt-1.5 inline-block rounded-md bg-[var(--background)] p-1 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{item.location}</p>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] py-16 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{title}</p>
      {subtitle && <p className="mt-2 text-xs font-medium text-[var(--muted-foreground)]">{subtitle}</p>}
    </div>
  );
}
