import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getArticles, deleteArticle } from "@/app/actions/articles";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Gestion du Blog | Prime Academy",
};

export default async function AdminArticlesPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const articles = await getArticles();

  async function handleDelete(data: FormData) {
    "use server";
    const id = data.get("id") as string;
    await deleteArticle(id);
    revalidatePath("/dashboard/admin/articles");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Blog & Articles</h1>
          <p className="text-[var(--foreground)]/50 text-sm font-medium">Gérez le contenu publié sur le blog public.</p>
        </div>
        <Link href="/dashboard/admin/articles/editor" className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Créer un article
        </Link>
      </div>

      <div className="bg-[var(--foreground)]/[0.02] border border-[var(--foreground)]/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--foreground)]/5 bg-[var(--foreground)]/[0.02]">
              <th className="p-4 font-bold text-[var(--foreground)]/50 uppercase tracking-wider text-[10px]">Titre</th>
              <th className="p-4 font-bold text-[var(--foreground)]/50 uppercase tracking-wider text-[10px]">Catégorie</th>
              <th className="p-4 font-bold text-[var(--foreground)]/50 uppercase tracking-wider text-[10px]">Statut</th>
              <th className="p-4 font-bold text-[var(--foreground)]/50 uppercase tracking-wider text-[10px]">Auteur</th>
              <th className="p-4 font-bold text-[var(--foreground)]/50 uppercase tracking-wider text-[10px]">Date</th>
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--foreground)]/5">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-[var(--foreground)]/[0.02] transition-colors">
                <td className="p-4 font-bold text-[var(--foreground)]">{article.title}</td>
                <td className="p-4 text-[var(--foreground)]/60 text-xs font-bold bg-primary/10 rounded-full inline-block mt-3 ml-4">{article.category}</td>
                <td className="p-4">
                  {article.published ? (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full">Publié</span>
                  ) : (
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full">Brouillon</span>
                  )}
                </td>
                <td className="p-4 text-[var(--foreground)]/60">{article.author.name || "Admin"}</td>
                <td className="p-4 text-[var(--foreground)]/60">{new Date(article.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="p-4 text-right flex items-center justify-end gap-3">
                  <Link href={\`/dashboard/admin/articles/editor?id=\${article.id}\`} className="hover:text-primary transition-colors text-[var(--foreground)]/50" title="Modifier">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </Link>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={article.id} />
                    <button type="submit" className="hover:text-red-500 transition-colors text-[var(--foreground)]/50" title="Supprimer" onClick={(e) => { if(!confirm("Voulez-vous supprimer cet article ?")) e.preventDefault(); }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[var(--foreground)]/40 font-medium">
                  Aucun article trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
