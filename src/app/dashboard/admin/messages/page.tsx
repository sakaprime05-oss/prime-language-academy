import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MessagingClient } from "@/components/messaging-client";

export default async function AdminMessagesPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 max-w-5xl mx-auto">
            <header className="flex flex-col gap-2">
                <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Messagerie Globale</h2>
                <p className="text-[var(--foreground)]/50 font-medium">Échangez avec n'importe quel élève ou professeur.</p>
            </header>

            <MessagingClient currentUserId={session.user.id!} />
        </div>
    );
}
