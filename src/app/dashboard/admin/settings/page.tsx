import { getSystemSettings } from "@/app/actions/system-settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
    const settings = await getSystemSettings();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <header>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                    Paramètres Système
                </h1>
                <p className="text-white/50 mt-2 font-medium text-sm">
                    Gérez la configuration globale de la plateforme, les dates de sessions, etc.
                </p>
            </header>

            <div className="bg-[#1a1a2e] border border-white/5 rounded-3xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6">Configuration de la Cohorte Actuelle</h2>
                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    );
}
