import { getSystemSettings } from "@/app/actions/system-settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <p className="platform-eyebrow">Configuration</p>
        <h1 className="platform-title text-[var(--foreground)]">Parametres Systeme</h1>
        <p className="platform-subtitle text-[var(--muted-foreground)]">
          Gerez la configuration globale de la plateforme et les dates de session.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">Configuration de la cohorte actuelle</h2>
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
