import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getArticles, deleteArticle } from "@/app/actions/articles";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#21286E] tracking-tight">Gestion du Blog</h1>
          <p className="text-[#21286E]/50 font-medium">Créez, modifiez et gérez les articles publiés sur le portail public.</p>
        </div>
        <Button asChild className="bg-[#21286E] hover:bg-[#21286E]/90 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-[#21286E]/20">
          <Link href="/dashboard/admin/articles/editor" className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Créer un article
          </Link>
        </Button>
      </div>

      <Card className="border-[#21286E]/5 rounded-3xl shadow-xl shadow-[#21286E]/5 overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#21286E]/5 bg-slate-50/50">
                  <th className="p-5 font-black text-[#21286E]/40 uppercase tracking-widest text-[10px]">Article</th>
                  <th className="p-5 font-black text-[#21286E]/40 uppercase tracking-widest text-[10px]">Catégorie</th>
                  <th className="p-5 font-black text-[#21286E]/40 uppercase tracking-widest text-[10px]">Statut</th>
                  <th className="p-5 font-black text-[#21286E]/40 uppercase tracking-widest text-[10px]">Auteur</th>
                  <th className="p-5 font-black text-[#21286E]/40 uppercase tracking-widest text-[10px]">Date</th>
                  <th className="p-5 text-right font-black text-[#21286E]/40 uppercase tracking-widest text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21286E]/5">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#21286E]/5 flex items-center justify-center text-[#21286E]/40">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-[#21286E] block max-w-[200px] truncate">{article.title}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <Badge variant="outline" className="bg-[#21286E]/5 border-none text-[#21286E]/70 font-bold px-3 py-1 rounded-full text-[10px] uppercase">
                        {article.category}
                      </Badge>
                    </td>
                    <td className="p-5">
                      {article.published ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none text-[10px] font-black uppercase rounded-full px-3 py-1">Publié</Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none text-[10px] font-black uppercase rounded-full px-3 py-1">Brouillon</Badge>
                      )}
                    </td>
                    <td className="p-5 text-[#21286E]/60 font-medium">{article.author.name || "Admin"}</td>
                    <td className="p-5 text-[#21286E]/60 font-medium">
                      {format(new Date(article.createdAt), "dd/MM/yyyy", { locale: fr })}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="icon" variant="ghost" className="rounded-xl text-[#21286E]/40 hover:text-[#21286E] hover:bg-[#21286E]/5">
                          <Link href={`/blog/${article.slug}`} target="_blank" title="Voir l'article">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button asChild size="icon" variant="ghost" className="rounded-xl text-[#21286E]/40 hover:text-[#21286E] hover:bg-[#21286E]/5">
                          <Link href={`/dashboard/admin/articles/editor?id=${article.id}`} title="Modifier">
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <form action={handleDelete}>
                          <input type="hidden" name="id" value={article.id} />
                          <Button 
                            type="submit" 
                            size="icon" 
                            variant="ghost" 
                            className="rounded-xl text-[#21286E]/40 hover:text-red-500 hover:bg-red-50"
                            title="Supprimer"
                            onClick={(e) => { if(!confirm("Voulez-vous supprimer cet article ?")) e.preventDefault(); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-[#21286E]/30 font-medium">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>Aucun article trouvé dans votre base de données.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
