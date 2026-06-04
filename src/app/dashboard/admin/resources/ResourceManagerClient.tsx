"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrainingDoc, deleteTrainingDoc, updateDocAccess } from "@/app/actions/teacher-mgmt";

const categories: Record<string, string> = {
  GENERAL: "General",
  GRAMMAR: "Grammaire",
  VOCABULARY: "Vocabulaire",
  PRONUNCIATION: "Prononciation",
};

export function ResourceManagerClient({ initialDocuments, teachers }: { initialDocuments: any[]; teachers: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [file, setFile] = useState<File | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editRestricted, setEditRestricted] = useState(false);
  const [editTeacherIds, setEditTeacherIds] = useState<string[]>([]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Veuillez choisir un fichier.");

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (uploadData.error) throw new Error(uploadData.error);

      await createTrainingDoc({
        title,
        description,
        fileUrl: uploadData.url,
        category,
        isRestricted,
        allowedTeacherIds: isRestricted ? selectedTeacherIds : [],
      });

      setTitle("");
      setDescription("");
      setFile(null);
      setIsRestricted(false);
      setSelectedTeacherIds([]);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce document ?")) return;
    await deleteTrainingDoc(id);
    router.refresh();
  };

  const openAccessEditor = (doc: any) => {
    setEditingDocId(doc.id);
    setEditRestricted(doc.isRestricted);
    setEditTeacherIds(doc.allowedTeachers?.map((teacher: any) => teacher.id) || []);
  };

  const saveAccessChanges = async () => {
    if (!editingDocId) return;
    await updateDocAccess(editingDocId, editRestricted, editTeacherIds);
    setEditingDocId(null);
    router.refresh();
  };

  const toggleTeacher = (id: string, list: string[], setList: (value: string[]) => void) => {
    setList(list.includes(id) ? list.filter((teacherId) => teacherId !== id) : [...list, id]);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <form
          onSubmit={handleUpload}
          className="sticky top-24 space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
        >
          <h3 className="text-lg font-black text-[var(--foreground)]">Partager une ressource</h3>

          {error && <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-xs font-bold text-red-500">{error}</p>}

          <div className="space-y-4">
            <Field label="Titre du document">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Manuel de grammaire A1"
                className={fieldClassName}
                required
              />
            </Field>

            <Field label="Categorie">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClassName}>
                {Object.entries(categories).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className={`${fieldClassName} resize-none`}
              />
            </Field>

            <Field label="Fichier">
              <div className="relative">
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] px-4 py-6 text-[var(--muted-foreground)] transition-all hover:border-[var(--primary)]/30"
                >
                  <svg className="mb-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{file ? file.name : "Choisir un fichier"}</span>
                </label>
              </div>
            </Field>

            <div className="space-y-4 border-t border-[var(--border)] pt-4">
              <AccessToggle active={isRestricted} onToggle={() => setIsRestricted(!isRestricted)} label="Acces restreint" />

              {isRestricted && (
                <TeacherPicker
                  teachers={teachers}
                  selectedIds={selectedTeacherIds}
                  onToggle={(id) => toggleTeacher(id, selectedTeacherIds, setSelectedTeacherIds)}
                  helper="Seuls les profs selectionnes verront ce document."
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--primary)] py-4 text-sm font-bold text-[var(--primary-foreground)] shadow-lg shadow-red-500/20 transition-all hover:bg-[var(--primary)]/90 disabled:opacity-50"
          >
            {loading ? "Chargement..." : "Publier la ressource"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        {editingDocId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setEditingDocId(null)}>
            <div
              className="w-full max-w-md space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="text-lg font-black text-[var(--foreground)]">Modifier l'acces</h3>
              <AccessToggle active={editRestricted} onToggle={() => setEditRestricted(!editRestricted)} label="Restreindre l'acces" />

              {editRestricted ? (
                <TeacherPicker
                  teachers={teachers}
                  selectedIds={editTeacherIds}
                  onToggle={(id) => toggleTeacher(id, editTeacherIds, setEditTeacherIds)}
                  helper="Visible uniquement pour :"
                />
              ) : (
                <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                  Tous les enseignants auront acces a ce document.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDocId(null)}
                  className="flex-1 rounded-xl border border-[var(--border)] py-3 text-xs font-bold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={saveAccessChanges}
                  className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-xs font-bold text-[var(--primary-foreground)] shadow-lg shadow-red-500/20 transition-colors hover:bg-[var(--primary)]/90"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {initialDocuments.map((doc: any) => (
            <article
              key={doc.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all hover:border-[var(--primary)]/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 font-black text-[var(--primary)]">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Tag>{categories[doc.category] || doc.category}</Tag>
                      <Tag tone={doc.isRestricted ? "orange" : "green"}>
                        {doc.isRestricted ? `Restreint (${doc.allowedTeachers?.length || 0})` : "Tous les profs"}
                      </Tag>
                    </div>
                    <h4 className="text-lg font-extrabold leading-snug tracking-tight text-[var(--foreground)]">{doc.title}</h4>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">
                      {doc.description || "Aucun detail supplementaire."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  className="ml-2 flex-shrink-0 rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500"
                  aria-label="Supprimer le document"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] transition-all hover:border-[var(--primary)]/30"
                >
                  Voir
                </a>
                <button
                  type="button"
                  onClick={() => openAccessEditor(doc)}
                  className="flex-1 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] transition-all hover:bg-[var(--primary)]/15"
                >
                  Gerer l'acces
                </button>
              </div>
            </article>
          ))}

          {initialDocuments.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] py-16 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Aucun document partage</p>
            </div>
          )}
        </div>
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

function AccessToggle({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        className={`h-5 w-10 rounded-full transition-all duration-300 ${active ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
        aria-pressed={active}
      >
        <div className={`h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${active ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function TeacherPicker({
  teachers,
  selectedIds,
  onToggle,
  helper,
}: {
  teachers: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  helper: string;
}) {
  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <p className="text-[9px] font-medium text-[var(--muted-foreground)]">{helper}</p>
      <div className="flex flex-wrap gap-2">
        {teachers.map((teacher: any) => {
          const selected = selectedIds.includes(teacher.id);
          return (
            <button
              key={teacher.id}
              type="button"
              onClick={() => onToggle(teacher.id)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold transition-all ${
                selected
                  ? "border-[var(--primary)]/40 bg-[var(--primary)]/15 text-[var(--primary)]"
                  : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {selected ? "OK " : ""}
              {teacher.name || teacher.email}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Tag({ children, tone = "red" }: { children: React.ReactNode; tone?: "red" | "orange" | "green" }) {
  const classes =
    tone === "green"
      ? "border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "orange"
        ? "border-orange-500/15 bg-orange-500/10 text-orange-600 dark:text-orange-400"
        : "border-[var(--primary)]/15 bg-[var(--primary)]/10 text-[var(--primary)]";

  return <span className={`rounded border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${classes}`}>{children}</span>;
}
