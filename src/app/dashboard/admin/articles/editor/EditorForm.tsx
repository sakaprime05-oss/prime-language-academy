"use client";

import { useState } from "react";
import { saveArticle } from "@/app/actions/articles";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Globe, ImageIcon, Tag, Type } from "lucide-react";

export default function EditorForm({ article }: { article?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Si la checkbox n'est pas cochée, elle n'est pas envoyée dans FormData
    // On s'assure d'envoyer false si non cochée pour Prisma
    if (!formData.get("published")) {
        formData.append("published", "false");
    }

    const res = await saveArticle(formData);

    if (res.success) {
      toast.success(article ? "Article mis à jour !" : "Article créé avec succès !");
      router.push("/dashboard/admin/articles");
      router.refresh();
    } else {
      toast.error(res.error || "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-20">
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
                <Link href="/dashboard/admin/articles">
                    <ArrowLeft className="w-5 h-5 text-[#21286E]" />
                </Link>
            </Button>
            <div>
                <h1 className="text-xl font-black text-[#21286E]">
                    {article ? "Modifier l'article" : "Nouvel article"}
                </h1>
                <p className="text-xs font-medium text-[#21286E]/50">
                    {article ? `ID: ${article.id}` : "Remplissez les champs ci-dessous"}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-xl border-[#21286E]/10">
                <Link href="/dashboard/admin/articles">Annuler</Link>
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#E7162A] hover:bg-[#E7162A]/90 text-white rounded-xl px-8 font-bold shadow-lg shadow-[#E7162A]/20">
                {loading ? "Enregistrement..." : article ? "Mettre à jour" : "Publier"}
            </Button>
        </div>
      </div>

      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-[#21286E]/5 rounded-3xl shadow-xl shadow-[#21286E]/5 overflow-hidden bg-white">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#21286E]/50 mb-2">
                <Type className="w-3 h-3" />
                Titre de l'article
              </label>
              <Input
                name="title"
                defaultValue={article?.title || ""}
                required
                className="h-14 text-lg font-bold border-[#21286E]/10 rounded-2xl focus-visible:ring-[#E7162A]"
                placeholder="Ex: 5 raisons d'apprendre l'anglais en 2026"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#21286E]/50 mb-2">
                  <Globe className="w-3 h-3" />
                  Slug (URL personnalisée)
                </label>
                <Input
                  name="slug"
                  defaultValue={article?.slug || ""}
                  className="h-12 font-medium border-[#21286E]/10 rounded-xl focus-visible:ring-[#E7162A]"
                  placeholder="Ex: pourquoi-apprendre-anglais"
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#21286E]/50 mb-2">
                  <Tag className="w-3 h-3" />
                  Catégorie
                </label>
                <Input
                  name="category"
                  defaultValue={article?.category || "Général"}
                  required
                  className="h-12 font-medium border-[#21286E]/10 rounded-xl focus-visible:ring-[#E7162A]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#21286E]/50 mb-2">
                <ImageIcon className="w-3 h-3" />
                Image de couverture
              </label>
              <Input
                name="coverImage"
                defaultValue={article?.coverImage || ""}
                className="h-12 font-medium border-[#21286E]/10 rounded-xl focus-visible:ring-[#E7162A]"
                placeholder="URL d'une image professionnelle, ex: https://images.unsplash.com/..."
              />
              <p className="text-xs font-medium leading-5 text-[#21286E]/45">
                Laissez vide si vous voulez que le site choisisse automatiquement un visuel editorial adapte.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#21286E]/50 mb-2">
                Contenu de l'article
              </label>
              <Textarea
                name="content"
                defaultValue={article?.content || ""}
                required
                rows={15}
                className="min-h-[400px] text-base font-medium border-[#21286E]/10 rounded-2xl p-6 focus-visible:ring-[#E7162A] resize-y leading-relaxed"
                placeholder="Rédigez votre article ici. Le Markdown simple est supporté."
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-[#21286E]/5">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked={article?.published || false}
                id="published"
                className="w-5 h-5 accent-[#E7162A] rounded-md cursor-pointer"
              />
              <label htmlFor="published" className="text-sm font-bold text-[#21286E] cursor-pointer">
                Rendre cet article visible publiquement sur le blog
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
