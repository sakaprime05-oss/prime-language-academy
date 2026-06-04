import Link from "next/link";
import type { ReactNode } from "react";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BookOpen, Edit, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { deleteArticle, getArticles } from "@/app/actions/articles";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--primary)]">Blog</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--foreground)]">Gestion du blog</h1>
          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            Créez, modifiez et gérez les articles publiés sur le portail public.
          </p>
        </div>
        <Link href="/dashboard/admin/articles/editor" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:brightness-110">
          <Plus className="h-5 w-5" />
          Créer un article
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/45">
                {["Article", "Catégorie", "Statut", "Auteur", "Date", "Actions"].map((heading) => (
                  <th key={heading} className={`${heading === "Actions" ? "text-right" : ""} p-5 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]`}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {articles.map((article) => (
                <tr key={article.id} className="group transition-colors hover:bg-[var(--muted)]/30">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="block max-w-[220px] truncate font-bold text-[var(--foreground)]">{article.title}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <Badge variant="outline" className="rounded-full border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-[10px] font-bold uppercase text-[var(--muted-foreground)]">
                      {article.category}
                    </Badge>
                  </td>
                  <td className="p-5">
                    {article.published ? (
                      <Badge className="rounded-full border-none bg-green-500/10 px-3 py-1 text-[10px] font-black uppercase text-green-600 hover:bg-green-500/20">Publié</Badge>
                    ) : (
                      <Badge className="rounded-full border-none bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase text-amber-600 hover:bg-amber-500/20">Brouillon</Badge>
                    )}
                  </td>
                  <td className="p-5 font-medium text-[var(--muted-foreground)]">{article.author.name || "Admin"}</td>
                  <td className="p-5 font-medium text-[var(--muted-foreground)]">
                    {format(new Date(article.createdAt), "dd/MM/yyyy", { locale: fr })}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <IconLink href={`/blog/${article.slug}`} title="Voir l'article">
                        <Eye className="h-4 w-4" />
                      </IconLink>
                      <IconLink href={`/dashboard/admin/articles/editor?id=${article.id}`} title="Modifier">
                        <Edit className="h-4 w-4" />
                      </IconLink>
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={article.id} />
                        <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition hover:bg-red-500/10 hover:text-red-500" title="Supprimer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center font-medium text-[var(--muted-foreground)]">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-25" />
                    <p>Aucun article trouvé dans votre base de données.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IconLink({ href, title, children }: { href: string; title: string; children: ReactNode }) {
  return (
    <Link href={href} target={href.startsWith("/blog") ? "_blank" : undefined} title={title} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]">
      {children}
    </Link>
  );
}
