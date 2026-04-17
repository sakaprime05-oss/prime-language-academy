import { PrimeLogo } from "@/components/logo";
import Link from "next/link";
import { getArticleBySlug } from "@/app/actions/articles";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article non trouvé | Prime Language Academy" };
  return {
    title: \`\${article.title} | Prime Language Academy\`,
  };
}

export default async function SingleArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-primary/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--foreground)]/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PrimeLogo className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[var(--foreground)]/50">
            <Link href="/blog" className="text-primary hover:opacity-80 transition-opacity flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Retour au Blog
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/register" className="btn-primary !py-2 !px-5 text-sm w-auto">
              S'inscrire à l'Académie
            </Link>
          </div>
        </div>
      </nav>

      {/* ARTICLE CONTENT */}
      <article className="pt-40 pb-24 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <header className="space-y-6 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight leading-tight">
              {article.title}
            </h1>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/40 flex items-center justify-center gap-4">
              <span>Par {article.author?.name || "Équipe PLA"}</span>
              <span>•</span>
              <span>{new Date(article.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </header>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"></div>

          <div className="prose prose-invert prose-lg max-w-none text-[var(--foreground)]/80 prose-headings:text-[var(--foreground)] prose-a:text-primary whitespace-pre-wrap leading-loose">
            {article.content}
          </div>

          <div className="pt-12 border-t border-[var(--foreground)]/5 mt-12 flex justify-center">
            <Link href="/blog" className="px-8 py-4 rounded-2xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Voir d'autres articles
            </Link>
          </div>
        </div>
      </article>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-[var(--foreground)]/5 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4 text-center">
          <PrimeLogo className="h-10 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/20 pt-8">
            © {new Date().getFullYear()} Prime Language Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
