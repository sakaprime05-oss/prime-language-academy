"use client";

import { useState } from "react";
import { createAppointment } from "@/app/actions/appointments";

export function AppointmentForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const dateStr = formData.get("date") as string;
        const timeStr = formData.get("time") as string;
        const reason = formData.get("reason") as string;

        if (!dateStr || !timeStr) {
            setError("Veuillez sélectionner une date et une heure.");
            setLoading(false);
            return;
        }

        try {
            // Création des objets Date
            const [year, month, day] = dateStr.split("-").map(Number);
            const [hours, minutes] = timeStr.split(":").map(Number);

            const startTime = new Date(year, month - 1, day, hours, minutes);
            // On ajoute 30 minutes pour la fin du RV
            const endTime = new Date(startTime.getTime() + 30 * 60000);
            
            const appointmentDate = new Date(year, month - 1, day);

            await createAppointment({
                date: appointmentDate,
                startTime,
                endTime,
                reason
            });

            setSuccess(true);
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            setError("Une erreur est survenue lors de la réservation.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-sm font-bold animate-in fade-in zoom-in">
                    Votre demande de rendez-vous a été envoyée !
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold animate-in fade-in zoom-in">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-bold text-[var(--foreground)]/70">
                    Date souhaitée
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-[var(--surface-hover)] border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="time" className="text-sm font-bold text-[var(--foreground)]/70">
                    Heure (créneaux de 30 min)
                </label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    step="1800"
                    className="w-full bg-[var(--surface-hover)] border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="reason" className="text-sm font-bold text-[var(--foreground)]/70">
                    Motif du rendez-vous
                </label>
                <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    placeholder="De quoi souhaitez-vous discuter ?"
                    className="w-full bg-[var(--surface-hover)] border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-gradient-to-r from-primary to-secondary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                {loading ? "Réservation en cours..." : "Confirmer la réservation"}
            </button>
        </form>
    );
}
