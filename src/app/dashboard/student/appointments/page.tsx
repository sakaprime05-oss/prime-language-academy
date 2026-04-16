import { getStudentAppointments } from "@/app/actions/appointments";
import { AppointmentForm } from "./appointment-form";

export default async function StudentAppointmentsPage() {
    const appointments = await getStudentAppointments();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Mes Rendez-vous
                </h1>
                <p className="text-[var(--foreground)]/60 mt-2 font-medium">
                    Réservez un créneau pour discuter avec un administrateur.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulaire de réservation */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--surface)] p-6 rounded-3xl border border-white/10 dark:border-white/5 shadow-2xl flex flex-col gap-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span>Nouveau RDV</span>
                        </h2>
                        <AppointmentForm />
                    </div>
                </div>

                {/* Liste des rendez-vous */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {appointments.length === 0 ? (
                        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center min-h-[300px]">
                            <p className="text-[var(--foreground)]/50 font-bold">Aucun rendez-vous pour le moment.</p>
                        </div>
                    ) : (
                        appointments.map((apt) => (
                            <div key={apt.id} className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--foreground)]/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-[var(--foreground)]">{new Date(apt.date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h3>
                                    <p className="text-sm font-medium text-[var(--foreground)]/60">
                                        {new Date(apt.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - {new Date(apt.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                    <p className="text-xs text-[var(--foreground)]/50 mt-1">
                                        Motif : {apt.reason || "Non spécifié"}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                                        ${apt.status === "PENDING" ? "bg-yellow-500/20 text-yellow-500" :
                                            apt.status === "CONFIRMED" ? "bg-green-500/20 text-green-500" :
                                                apt.status === "CANCELLED" ? "bg-red-500/20 text-red-500" :
                                                    "bg-blue-500/20 text-blue-500"
                                        }
                                    `}>
                                        {apt.status === "PENDING" ? "En attente" :
                                            apt.status === "CONFIRMED" ? "Confirmé" :
                                                apt.status === "CANCELLED" ? "Annulé" :
                                                    "Terminé"}
                                    </span>
                                    {apt.admin && (
                                        <span className="text-xs font-bold text-[var(--foreground)]/40">Avec : {apt.admin.name}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
