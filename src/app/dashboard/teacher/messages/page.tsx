import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MessagingClient } from "@/components/messaging-client";

export default async function TeacherMessagesPage() {
  const session = await auth();
  if (!session || session.user?.role !== "TEACHER") {
    redirect("/login");
  }

  return (
    <div className="animate-in fade-in mx-auto max-w-5xl space-y-6 pb-12 duration-500">
      <header className="mb-8">
        <Link href="/dashboard/teacher" className="mb-2 flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline">
          ← Retour au tableau de bord
        </Link>
        <h2 className="text-3xl font-extrabold text-[var(--foreground)]">Messagerie</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Échangez avec vos étudiants.</p>
      </header>

      <MessagingClient currentUserId={session.user.id!} />
    </div>
  );
}
