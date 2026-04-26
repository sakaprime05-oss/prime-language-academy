import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MessagingClient } from "@/components/messaging-client";
import Link from "next/link";

export default async function TeacherMessagesPage() {
    const session = await auth();
    if (!session || session.user?.role !== "TEACHER") {
        redirect("/login");
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto">
            <header className="mb-8">
                <Link href="/dashboard/teacher" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1 mb-2">
                    ← Retour au tableau de bord
                </Link>
                <h2 className="text-3xl font-extrabold text-white">Messagerie</h2>
                <p className="text-white/60 text-sm">Échangez avec vos étudiants.</p>
            </header>

            <MessagingClient currentUserId={session.user.id!} />
        </div>
    );
}
