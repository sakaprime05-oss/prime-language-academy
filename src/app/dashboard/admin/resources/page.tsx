import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAllTeachers, getTrainingDocs } from "@/app/actions/teacher-mgmt";
import { ResourceManagerClient } from "./ResourceManagerClient";

export default async function AdminResourcesPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/login");

  const [documents, teachers] = await Promise.all([getTrainingDocs(), getAllTeachers()]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin"
            className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[var(--primary)] hover:underline"
          >
            Retour a l'admin
          </Link>
          <p className="platform-eyebrow">Documents</p>
          <h2 className="platform-title text-[var(--foreground)]">Documents de Formation</h2>
          <p className="platform-subtitle text-[var(--muted-foreground)]">
            Partagez des ressources pedagogiques et restreignez l'acces si necessaire.
          </p>
        </div>
      </header>

      <ResourceManagerClient initialDocuments={documents as any[]} teachers={teachers as any[]} />
    </div>
  );
}
