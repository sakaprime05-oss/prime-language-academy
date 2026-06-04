import { getAdminAppointments, updateAppointmentStatus } from "@/app/actions/appointments";
import { auth } from "@/auth";

export default async function AdminAppointmentsPage() {
  const session = await auth();
  const adminId = session?.user?.id;
  const appointments = await getAdminAppointments();

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--primary)]">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-black text-[var(--foreground)]">
          Gestion des rendez-vous
        </h1>
        <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
          Acceptez et gérez les rendez-vous pris par les étudiants.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/45">
                {["Date & heure", "Étudiant", "Motif", "Statut", "Actions"].map((heading) => (
                  <th key={heading} className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center font-bold text-[var(--muted-foreground)]">
                    Aucun rendez-vous.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="transition-colors hover:bg-[var(--muted)]/30">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[var(--foreground)]">
                        {new Date(apt.date).toLocaleDateString("fr-FR")}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {new Date(apt.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[var(--foreground)]">{apt.student.name || "Étudiant"}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{apt.student.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-[200px] truncate text-sm font-medium text-[var(--muted-foreground)]">
                        {apt.reason || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider ${statusClass(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {apt.status === "PENDING" && (
                        <div className="flex items-center gap-2">
                          <form action={async () => {
                            "use server";
                            await updateAppointmentStatus(apt.id, "CONFIRMED", adminId);
                          }}>
                            <button className="rounded-lg bg-green-500/15 px-3 py-1.5 text-xs font-bold text-green-600 transition-colors hover:bg-green-500/25">
                              Accepter
                            </button>
                          </form>
                          <form action={async () => {
                            "use server";
                            await updateAppointmentStatus(apt.id, "CANCELLED");
                          }}>
                            <button className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-500/25">
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

function statusClass(status: string) {
  if (status === "PENDING") return "bg-yellow-500/10 text-yellow-600";
  if (status === "CONFIRMED") return "bg-green-500/10 text-green-600";
  if (status === "CANCELLED") return "bg-red-500/10 text-red-600";
  return "bg-blue-500/10 text-blue-600";
}
