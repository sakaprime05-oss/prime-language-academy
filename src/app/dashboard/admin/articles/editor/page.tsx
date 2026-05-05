import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getArticleById } from "@/app/actions/articles";
import EditorForm from "./EditorForm";

export const metadata = {
  title: "Éditeur d'Article | Prime Academy",
};

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await searchParams;
  const article = id ? await getArticleById(id) : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)]">{article ? "Modifier l'article" : "Créer un article"}</h1>
        <p className="text-[var(--foreground)]/50 text-sm font-medium">Prenez soin de la mise en page pour un rendu professionnel.</p>
      </div>

      <EditorForm article={article} />
    </div>
  );
}
