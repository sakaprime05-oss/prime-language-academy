import { getAdminAppointments, updateAppointmentStatus } from "@/app/actions/appointments";
import { auth } from "@/auth";

export default async function AdminAppointmentsPage() {
    const session = await auth();
    const adminId = session?.user?.id;
    const appointments = await getAdminAppointments();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-white">
                    Gestion des Rendez-vous
                </h1>
                <p className="text-white/50 mt-2 font-medium">
                    Acceptez et gérez les rendez-vous pris par les étudiants.
                </p>
            </div>

            <div className="bg-[#12121e] rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Date & Heure</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Étudiant</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Motif</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Statut</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-white/40 font-bold">
                                        Aucun rendez-vous.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-white">
                                                {new Date(apt.date).toLocaleDateString("fr-FR")}
                                            </p>
                                            <p className="text-xs text-white/50">
                                                {new Date(apt.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-white">{apt.student.name || "Étudiant"}</p>
                                            <p className="text-xs text-white/50">{apt.student.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-white/70 truncate max-w-[200px]">
                                                {apt.reason || "-"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-block
                                                ${apt.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500" :
                                                    apt.status === "CONFIRMED" ? "bg-green-500/10 text-green-500" :
                                                        apt.status === "CANCELLED" ? "bg-red-500/10 text-red-500" :
                                                            "bg-blue-500/10 text-blue-500"
                                                }
                                            `}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {apt.status === "PENDING" && (
                                                <div className="flex items-center gap-2">
                                                    <form action={async () => {
                                                        "use server"
                                                        await updateAppointmentStatus(apt.id, "CONFIRMED", adminId);
                                                    }}>
                                                        <button className="px-3 py-1.5 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg text-xs font-bold transition-colors">
                                                            Accepter
                                                        </button>
                                                    </form>
                                                    <form action={async () => {
                                                        "use server"
                                                        await updateAppointmentStatus(apt.id, "CANCELLED");
                                                    }}>
                                                        <button className="px-3 py-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg text-xs font-bold transition-colors">
                                                            Refuser
                                                        </button>
                                                    </form>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
