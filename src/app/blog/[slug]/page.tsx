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

  const articleUrl = `https://primelanguageacademy.com/blog/${slug}`;
  const description = article.content.replace(/<[^>]*>/g, '').substring(0, 160) + "...";

  return {
    title: `${article.title} | Prime Language Academy`,
    description: description,
    keywords: `anglais, Abidjan, Côte d'Ivoire, ${article.category}, Prime Language Academy`,
    openGraph: {
      title: article.title,
      description: description,
      url: articleUrl,
      type: "article",
      publishedTime: new Date(article.createdAt).toISOString(),
      authors: [article.author?.name || "Prime Language Academy"],
      images: [{ url: "https://primelanguageacademy.com/icon-512x512.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: description,
    }
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

          {article.coverImage && (
            <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-[#21286E]/10 ring-1 ring-[#21286E]/10">
              <Image 
                src={article.coverImage} 
                alt={article.title} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
          )}

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
              <div className="flex items-center gap-2">
                {/* Twitter */}
                <a 
                  href={`https://twitter.com/intent/tweet?url=https://primelanguageacademy.com/blog/${slug}&text=${encodeURIComponent(article.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                {/* LinkedIn */}
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=https://primelanguageacademy.com/blog/${slug}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                {/* Facebook */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://primelanguageacademy.com/blog/${slug}`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
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
