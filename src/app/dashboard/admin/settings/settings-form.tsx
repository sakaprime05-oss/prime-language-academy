"use client";

import { useState } from "react";
import { updateSystemSettings } from "@/app/actions/system-settings";

interface SystemSettings {
  currentSessionName: string;
  currentSessionStart: string;
  currentSessionDuration: string;
  enableOnlineRegistration: boolean;
  enableCorporateRegistration: boolean;
}

export function SettingsForm({ initialSettings }: { initialSettings: SystemSettings }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const result = await updateSystemSettings(new FormData(e.currentTarget));

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <StatusMessage tone="error">{error}</StatusMessage>}
      {success && <StatusMessage tone="success">Parametres mis a jour avec succes.</StatusMessage>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Nom de la session">
          <input
            type="text"
            name="currentSessionName"
            defaultValue={initialSettings.currentSessionName}
            required
            className={fieldClassName}
            placeholder="Ex: Session de lancement : 11 juillet - 12 septembre 2026"
          />
        </Field>

        <Field label="Date de demarrage">
          <input
            type="text"
            name="currentSessionStart"
            defaultValue={initialSettings.currentSessionStart}
            required
            className={fieldClassName}
            placeholder="Ex: 2026-07-11"
          />
        </Field>

        <Field label="Duree du programme">
          <input
            type="text"
            name="currentSessionDuration"
            defaultValue={initialSettings.currentSessionDuration}
            required
            className={fieldClassName}
            placeholder="Ex: 2 mois / 8 semaines"
          />
        </Field>
      </div>

      <div className="space-y-4 border-t border-[var(--border)] pt-6">
        <h3 className="mb-4 text-sm font-bold text-[var(--foreground)]">Fonctionnalites & Inscriptions</h3>

        <ToggleRow
          name="enableOnlineRegistration"
          defaultChecked={initialSettings.enableOnlineRegistration}
          title="Activer les cours en ligne"
          description="Permettre l'inscription aux formations 100% en ligne."
        />

        <ToggleRow
          name="enableCorporateRegistration"
          defaultChecked={initialSettings.enableCorporateRegistration}
          title="Activer les formations entreprises (B2B)"
          description="Permettre aux entreprises de s'inscrire pour des formations sur-mesure."
        />
      </div>

      <div className="flex justify-end border-t border-[var(--border)] pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[var(--primary)] px-8 py-3 font-bold text-[var(--primary-foreground)] transition-all hover:bg-[var(--primary)]/90 disabled:opacity-50"
        >
          {loading ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </form>
  );
}

const fieldClassName =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none transition-colors focus:border-[var(--primary)]/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({
  name,
  defaultChecked,
  title,
  description,
}: {
  name: string;
  defaultChecked: boolean;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4 transition-colors hover:border-[var(--primary)]/25">
      <div className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" name={name} value="true" defaultChecked={defaultChecked} className="peer sr-only" />
        <div className="h-6 w-11 rounded-full bg-[var(--border)] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-[var(--border)] after:bg-[var(--background)] after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
      </div>
      <div>
        <span className="block text-sm font-bold text-[var(--foreground)]">{title}</span>
        <span className="text-xs text-[var(--muted-foreground)]">{description}</span>
      </div>
    </label>
  );
}

function StatusMessage({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  const classes =
    tone === "error"
      ? "border-red-500/20 bg-red-500/10 text-red-500"
      : "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400";

  return <div className={`rounded-xl border p-4 text-sm font-bold ${classes}`}>{children}</div>;
}
