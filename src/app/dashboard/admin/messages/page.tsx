import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MessagingClient } from "@/components/messaging-client";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-7xl space-y-5 pb-10 duration-700">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--primary)]">
            Administration
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--foreground)]">
            Messagerie interne
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--muted-foreground)]">
            Retrouvez les échanges avec les élèves et les professeurs dans une interface lisible, rapide et adaptée au thème choisi.
          </p>
        </div>
      </header>

      <MessagingClient currentUserId={session.user.id!} />
    </div>
  );
}
