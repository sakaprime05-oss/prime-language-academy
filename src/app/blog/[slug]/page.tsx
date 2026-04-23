import { PrimeLogo } from "@/components/logo";
import Link from "next/link";
import { getArticleBySlug } from "@/app/actions/articles";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article non trouvé | Prime Language Academy" };
  return {
    title: `${article.title} | Prime Language Academy`,
  };
}

export default async function SingleArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white selection:bg-[#E7162A]/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#21286E]/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PrimeLogo className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#21286E]/70">
            <Link href="/blog" className="text-[#E7162A] hover:opacity-80 transition-opacity flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour au Blog
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild className="bg-[#E7162A] text-white font-bold py-2 px-6 rounded-xl hover:shadow-lg transition-all shadow-[#E7162A]/30">
              <Link href="/register">S'inscrire à l'Académie</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ARTICLE CONTENT */}
      <article className="pt-40 pb-24 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <header className="space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E7162A]/5 border border-[#E7162A]/10 text-[#E7162A] text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <BookOpen className="w-3 h-3" />
              {article.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#21286E] tracking-tight leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-[#21286E]/40">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#E7162A]" />
                Par {article.author?.name || "Équipe PLA"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#E7162A]" />
                {format(new Date(article.createdAt), "dd MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </header>

          <div className="relative aspect-video w-full rounded-[3rem] overflow-hidden border border-[#21286E]/5 shadow-2xl shadow-[#21286E]/10 bg-slate-100">
             {/* Article Image Placeholder or real one if exists */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#21286E] to-[#E7162A] opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <PrimeLogo className="h-20 opacity-10" />
             </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none text-[#21286E]/80 prose-headings:text-[#21286E] prose-headings:font-black prose-a:text-[#E7162A] prose-strong:text-[#21286E] whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>

          <div className="pt-16 border-t border-[#21286E]/5 mt-16 flex flex-col sm:flex-row items-center justify-between gap-8">
            <Button asChild variant="outline" className="rounded-2xl border-[#21286E]/10 text-[#21286E] font-bold h-14 px-8">
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                D'autres articles
              </Link>
            </Button>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#21286E]/30">Partager</span>
              <Button size="icon" variant="ghost" className="rounded-full text-[#21286E]/60 hover:text-[#E7162A]">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* CALL TO ACTION */}
      <section className="py-24 px-6 bg-[#21286E] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
           <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Prêt à transformer votre carrière avec <span className="text-[#E7162A]">l'Anglais ?</span>
           </h2>
           <p className="text-white/60 text-lg font-medium">
              Rejoignez notre prochaine session et maîtrisez la méthode ISO+.
           </p>
           <Button asChild className="h-16 px-12 rounded-2xl bg-[#E7162A] text-white font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#E7162A]/40">
              <Link href="/register">Commencer Maintenant</Link>
           </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-8 text-center">
          <PrimeLogo className="h-10 opacity-30 grayscale" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#21286E]/20">
            © {new Date().getFullYear()} Prime Language Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
