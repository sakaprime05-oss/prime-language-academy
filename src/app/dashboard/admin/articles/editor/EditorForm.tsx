"use client";

import { useState } from "react";
import { saveArticle } from "@/app/actions/articles";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditorForm({ article }: { article?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await saveArticle(formData);

    if (res.success) {
      router.push("/dashboard/admin/articles");
    } else {
      setError(res.error || "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 text-sm font-bold rounded-xl border border-red-500/20">
          {error}
        </div>
      )}

      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Titre</label>
          <input
            type="text"
            name="title"
            defaultValue={article?.title || ""}
            required
            className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-medium text-[var(--foreground)]"
            placeholder="Ex: Pourquoi apprendre l'anglais ?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Slug (Optionnel)</label>
            <input
              type="text"
              name="slug"
              defaultValue={article?.slug || ""}
              className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-medium text-[var(--foreground)]"
              placeholder="Ex: pourquoi-apprendre-anglais"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Catégorie</label>
            <input
              type="text"
              name="category"
              defaultValue={article?.category || "Général"}
              required
              className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-medium text-[var(--foreground)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Contenu (HTML ou Markdown simple)</label>
          <textarea
            name="content"
            defaultValue={article?.content || ""}
            required
            rows={15}
            className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-medium text-[var(--foreground)] resize-y whitespace-pre-wrap"
            placeholder="Écrivez le contenu de votre article ici..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={article?.published || false}
            id="published"
            className="w-5 h-5 accent-primary"
          />
          <label htmlFor="published" className="text-sm font-bold text-[var(--foreground)] cursor-pointer">
            Publier cet article directement
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/dashboard/admin/articles" className="px-6 py-3 rounded-xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 transition-colors">
          Annuler
        </Link>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "Enregistrement..." : (article ? "Mettre à jour l'article" : "Créer l'article")}
        </button>
      </div>
    </form>
  );
}
