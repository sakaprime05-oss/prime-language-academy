"use client";

import { updateStudentProfile } from "@/app/actions/student-profile";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProfileValues = {
  preferredName?: string;
  phone?: string;
  whatsapp?: string;
  commune?: string;
  learningGoal?: string;
  emergencyContact?: string;
  bio?: string;
  profilePhotoUrl?: string;
  birthDate?: string;
  availability?: string;
  estimatedLevel?: string;
  learningPreference?: string;
};

export function StudentProfileForm({ values }: { values: ProfileValues }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(values.profilePhotoUrl || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const result = await updateStudentProfile(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
    } else {
      setMessage("Profil mis a jour.");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-6 p-5 sm:p-8">
      {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-500">{error}</div>}
      {message && <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-500">{message}</div>}

      <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-start">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-3xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
            {preview ? (
              <img src={preview} alt="Photo de profil" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-center text-xs font-black uppercase tracking-widest text-[var(--foreground)]/35">
                Photo obligatoire
              </div>
            )}
          </div>
          <input
            type="file"
            name="profilePhoto"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="block w-full text-xs font-bold text-[var(--foreground)]/60 file:mr-3 file:rounded-xl file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-black file:text-white"
          />
          <p className="text-[11px] font-medium leading-5 text-[var(--foreground)]/45">
            JPG, PNG ou WebP. La photo est necessaire pour identifier les apprenants sur la plateforme.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom prefere">
            <input name="preferredName" defaultValue={values.preferredName || ""} className="input-field" placeholder="Ex: Mohamed" />
          </Field>
          <Field label="Telephone">
            <input name="phone" defaultValue={values.phone || ""} className="input-field" placeholder="+225..." />
          </Field>
          <Field label="WhatsApp">
            <input name="whatsapp" defaultValue={values.whatsapp || ""} className="input-field" placeholder="+225..." />
          </Field>
          <Field label="Commune">
            <input name="commune" defaultValue={values.commune || ""} className="input-field" placeholder="Cocody, Yopougon..." />
          </Field>
          <Field label="Date de naissance">
            <input type="date" name="birthDate" defaultValue={values.birthDate || ""} className="input-field" />
          </Field>
          <Field label="Niveau estime">
            <select name="estimatedLevel" defaultValue={values.estimatedLevel || ""} className="input-field">
              <option value="">A choisir</option>
              <option value="debutant">Debutant</option>
              <option value="intermediaire">Intermediaire</option>
              <option value="avance">Avance</option>
            </select>
          </Field>
          <Field label="Contact d'urgence">
            <input name="emergencyContact" defaultValue={values.emergencyContact || ""} className="input-field" placeholder="Nom + numero" />
          </Field>
          <Field label="Objectif principal">
            <input name="learningGoal" defaultValue={values.learningGoal || ""} className="input-field" placeholder="Parler en reunion, voyage..." />
          </Field>
          <Field label="Disponibilites">
            <input name="availability" defaultValue={values.availability || ""} className="input-field" placeholder="Soir, week-end, mardi/jeudi..." />
          </Field>
          <Field label="Preference">
            <select name="learningPreference" defaultValue={values.learningPreference || ""} className="input-field">
              <option value="">A choisir</option>
              <option value="pdf">PDF et exercices</option>
              <option value="oral">Pratique orale</option>
              <option value="mixte">Mixte</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Bio courte">
              <textarea name="bio" defaultValue={values.bio || ""} rows={4} className="input-field min-h-28 resize-none" placeholder="Quelques mots sur vous..." />
            </Field>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-8 py-4">
        {loading ? "Enregistrement..." : "Enregistrer mon profil"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="block px-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/45">{label}</span>
      {children}
    </label>
  );
}
