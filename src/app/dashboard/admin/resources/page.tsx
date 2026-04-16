import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTrainingDocs, getAllTeachers } from "@/app/actions/teacher-mgmt";
import { ResourceManagerClient } from "./ResourceManagerClient";
import Link from "next/link";

export default async function AdminResourcesPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    const [documents, teachers] = await Promise.all([
        getTrainingDocs(),
        getAllTeachers()
    ]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/dashboard/admin" className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 mb-2">
                        ← Retour à l'admin
                    </Link>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">Documents de Formation</h2>
                    <p className="text-white/40 text-sm font-medium">Partagez des ressources pédagogiques. Par défaut, tous les profs y ont accès. Vous pouvez restreindre l'accès.</p>
                </div>
            </header>

            <ResourceManagerClient initialDocuments={documents as any[]} teachers={teachers as any[]} />
        </div>
    );
}
