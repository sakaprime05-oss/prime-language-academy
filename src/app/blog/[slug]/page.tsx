import { PrimeLogo } from "@/components/logo";
import Link from "next/link";
import { getArticleBySlug } from "@/app/actions/articles";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { ParticlesBackground } from "@/components/particles";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-[#E7162A]/30 overflow-x-hidden relative">
      <ParticlesBackground />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
              <Image 
                src="/icon-512x512.png" 
                alt="PLA Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-extrabold tracking-tight text-xl text-slate-900 dark:text-white hidden sm:block">
              Prime Academy
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Link href="/blog" className="text-[#E7162A] hover:text-[#E7162A]/80 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour au Blog
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild className="bg-[#E7162A] hover:bg-[#E7162A]/90 text-slate-900 dark:text-white font-bold shadow-[0_0_15px_rgba(231,22,42,0.3)] hover:shadow-[0_0_25px_rgba(231,22,42,0.5)] transition-shadow">
              <Link href="/register">S'inscrire à l'Académie</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ARTICLE CONTENT */}
      <article className="pt-32 pb-24 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#21286E]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-12 relative z-10">
          
          <header className="space-y-6 text-center">
            <Badge variant="outline" className="border-[#21286E]/50 bg-[#21286E]/20 text-blue-300 px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-4">
              <BookOpen className="w-3 h-3 mr-2 inline" />
              {article.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-600 dark:text-slate-400">
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

          <div className="bg-white dark:bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-12 shadow-2xl">
            {/* The dangerouslySetInnerHTML is crucial to parse the HTML tags correctly */}
            <div 
              className="prose prose-invert prose-lg max-w-none text-slate-700 dark:text-slate-300 prose-headings:text-slate-900 dark:text-white prose-headings:font-black prose-a:text-[#E7162A] prose-strong:text-slate-900 dark:text-white leading-relaxed prose-p:mb-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8">
            <Button asChild variant="outline" className="rounded-xl border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-800 font-bold h-12 px-6">
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                D'autres articles
              </Link>
            </Button>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Partager</span>
              <Button size="icon" variant="ghost" className="rounded-full text-slate-500 dark:text-slate-600 dark:text-slate-400 hover:text-[#E7162A] hover:bg-slate-100 dark:bg-slate-800">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* CALL TO ACTION */}
      <section className="py-24 px-4 bg-[#21286E]/10 border-t border-[#21286E]/20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
           <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Prêt à transformer votre carrière avec <span className="text-[#E7162A]">l'Anglais ?</span>
           </h2>
           <p className="text-slate-500 dark:text-slate-600 dark:text-slate-400 text-lg font-medium">
              Rejoignez notre prochaine session et maîtrisez la méthode ISO+.
           </p>
           <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-[#E7162A] hover:bg-[#E7162A]/90 text-slate-900 dark:text-white font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(231,22,42,0.4)]">
              <Link href="/register">Commencer Maintenant</Link>
           </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-4 border-t border-slate-800 bg-[#060A14] text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-6">
          <div className="relative w-12 h-12 opacity-50 mx-auto">
             <Image src="/icon-512x512.png" alt="Logo PLA" fill className="object-contain" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-600">
            © {new Date().getFullYear()} Prime Language Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
