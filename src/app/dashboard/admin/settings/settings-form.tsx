"use client";

import { useState } from "react";
import { updateSystemSettings } from "@/app/actions/system-settings";

interface SystemSettings {
    currentSessionName: string;
    currentSessionStart: string;
    currentSessionDuration: string;
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

        const formData = new FormData(e.currentTarget);

        const result = await updateSystemSettings(formData);

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
            {error && (
                <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-sm font-bold animate-in fade-in zoom-in">
                    Paramètres mis à jour avec succès.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
                        Nom de la Session
                    </label>
                    <input
                        type="text"
                        name="currentSessionName"
                        defaultValue={initialSettings.currentSessionName}
                        required
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                        placeholder="Ex: Avril - Juin 2026"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
                        Date de démarrage
                    </label>
                    <input
                        type="text"
                        name="currentSessionStart"
                        defaultValue={initialSettings.currentSessionStart}
                        required
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                        placeholder="Ex: 11 Avril 2026"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
                        Durée du programme
                    </label>
                    <input
                        type="text"
                        name="currentSessionDuration"
                        defaultValue={initialSettings.currentSessionDuration}
                        required
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                        placeholder="Ex: 2 Mois"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {loading ? "Sauvegarde..." : "Sauvegarder"}
                </button>
            </div>
        </form>
    );
}
