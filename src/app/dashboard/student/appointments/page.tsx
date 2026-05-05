import { getStudentAppointments } from "@/app/actions/appointments";
import { AppointmentForm } from "./appointment-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { requireInitialPayment } from "@/lib/student-payment-gate";

export default async function StudentAppointmentsPage() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") redirect("/login");
    await requireInitialPayment(session.user.id);

    const appointments = await getStudentAppointments();

    return (
        <div className="platform-page animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="platform-page-header">
                <p className="platform-eyebrow">Accompagnement</p>
                <h1 className="platform-title">Mes rendez-vous</h1>
                <p className="platform-subtitle">
                    Réservez un créneau pour discuter avec un administrateur.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Formulaire de réservation */}
                <div className="lg:col-span-1">
                    <div className="glass-card flex flex-col gap-5 !p-4 sm:!p-5">
                        <h2 className="flex items-center gap-3 text-lg font-bold">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-sm text-[#E7162A]">📅</span>
                            <span>Nouveau RDV</span>
                        </h2>
                        <AppointmentForm />
                    </div>
                </div>

                {/* Liste des rendez-vous */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {appointments.length === 0 ? (
                        <div className="glass-card flex min-h-[260px] flex-col items-center justify-center rounded-xl p-6 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--foreground)]/5">
                                <span className="text-2xl opacity-50">📭</span>
                            </div>
                            <p className="text-base font-bold text-[var(--foreground)]/55">Aucun rendez-vous pour le moment.</p>
                        </div>
                    ) : (
                        appointments.map((apt) => (
                            <div key={apt.id} className="mobile-list-row flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-[var(--foreground)] transition-colors group-hover:text-[#E7162A]">
                                        {new Date(apt.date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                    </h3>
                                    <p className="text-sm font-medium text-[var(--foreground)]/60 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                                        {new Date(apt.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - {new Date(apt.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                    <p className="mt-2 rounded-lg border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 p-3 text-sm text-[var(--foreground)]/55">
                                        Motif : {apt.reason || "Non spécifié"}
                                    </p>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 justify-between">
                                    <span className={`status-badge border
                                        ${apt.status === "PENDING" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                                            apt.status === "CONFIRMED" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                                apt.status === "CANCELLED" ? "bg-red-500/10 text-[#E7162A] border-red-500/20" :
                                                    "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                        }
                                    `}>
                                        {apt.status === "PENDING" ? "En attente" :
                                            apt.status === "CONFIRMED" ? "Confirmé" :
                                                apt.status === "CANCELLED" ? "Annulé" :
                                                    "Terminé"}
                                    </span>
                                    {apt.admin && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">👤</div>
                                            <span className="text-xs font-bold text-[var(--foreground)]/60">{apt.admin.name}</span>
                                        </div>
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
