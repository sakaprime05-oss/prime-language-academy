"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Globe, ImageIcon, Tag, Type } from "lucide-react";
import { saveArticle } from "@/app/actions/articles";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EditorForm({ article }: { article?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (!formData.get("published")) {
      formData.append("published", "false");
    }

    const res = await saveArticle(formData);

    if (res.success) {
      toast.success(article ? "Article mis a jour." : "Article cree avec succes.");
      router.push("/dashboard/admin/articles");
      router.refresh();
    } else {
      toast.error(res.error || "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--background)]/90 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full text-[var(--foreground)]">
            <Link href="/dashboard/admin/articles" aria-label="Retour aux articles">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-black text-[var(--foreground)]">
              {article ? "Modifier l'article" : "Nouvel article"}
            </h1>
            <p className="text-xs font-medium text-[var(--muted-foreground)]">
              {article ? `ID: ${article.id}` : "Preparez un article clair et pret a publier"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl border-[var(--border)]">
            <Link href="/dashboard/admin/articles">Annuler</Link>
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[var(--primary)] px-8 font-bold text-[var(--primary-foreground)] shadow-lg shadow-red-500/20 hover:bg-[var(--primary)]/90"
          >
            {loading ? "Enregistrement..." : article ? "Mettre a jour" : "Publier"}
          </Button>
        </div>
      </div>

      {article && <input type="hidden" name="id" value={article.id} />}

      <Card className="overflow-hidden rounded-2xl border-[var(--border)] bg-[var(--card)] shadow-sm">
        <CardContent className="space-y-8 p-6 md:p-8">
          <FieldLabel icon={<Type className="h-3 w-3" />}>Titre de l'article</FieldLabel>
          <Input
            name="title"
            defaultValue={article?.title || ""}
            required
            className="h-14 rounded-2xl border-[var(--border)] bg-[var(--background)] text-lg font-bold text-[var(--foreground)] focus-visible:ring-[var(--primary)]"
            placeholder="Ex: 5 raisons d'apprendre l'anglais en 2026"
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <FieldLabel icon={<Globe className="h-3 w-3" />}>Slug URL</FieldLabel>
              <Input
                name="slug"
                defaultValue={article?.slug || ""}
                className="h-12 rounded-xl border-[var(--border)] bg-[var(--background)] font-medium text-[var(--foreground)] focus-visible:ring-[var(--primary)]"
                placeholder="Ex: pourquoi-apprendre-anglais"
              />
            </div>
            <div className="space-y-4">
              <FieldLabel icon={<Tag className="h-3 w-3" />}>Categorie</FieldLabel>
              <Input
                name="category"
                defaultValue={article?.category || "General"}
                required
                className="h-12 rounded-xl border-[var(--border)] bg-[var(--background)] font-medium text-[var(--foreground)] focus-visible:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <FieldLabel icon={<ImageIcon className="h-3 w-3" />}>Image de couverture</FieldLabel>
            <Input
              name="coverImage"
              defaultValue={article?.coverImage || ""}
              className="h-12 rounded-xl border-[var(--border)] bg-[var(--background)] font-medium text-[var(--foreground)] focus-visible:ring-[var(--primary)]"
              placeholder="URL d'une image professionnelle"
            />
            <p className="text-xs font-medium leading-5 text-[var(--muted-foreground)]">
              Laissez vide pour utiliser automatiquement un visuel editorial adapte.
            </p>
          </div>

          <div className="space-y-4">
            <FieldLabel>Contenu de l'article</FieldLabel>
            <Textarea
              name="content"
              defaultValue={article?.content || ""}
              required
              rows={15}
              className="min-h-[400px] resize-y rounded-2xl border-[var(--border)] bg-[var(--background)] p-6 text-base font-medium leading-relaxed text-[var(--foreground)] focus-visible:ring-[var(--primary)]"
              placeholder="Redigez votre article ici. Le Markdown simple est supporte."
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
            <input
              type="checkbox"
              name="published"
              value="true"
              defaultChecked={article?.published || false}
              id="published"
              className="h-5 w-5 cursor-pointer rounded-md accent-[var(--primary)]"
            />
            <label htmlFor="published" className="cursor-pointer text-sm font-bold text-[var(--foreground)]">
              Rendre cet article visible publiquement sur le blog
            </label>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function FieldLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted-foreground)]">
      {icon}
      {children}
    </label>
  );
}
