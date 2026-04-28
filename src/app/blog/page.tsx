import { PrimeLogo } from "@/components/logo";
import Link from "next/link";
import { getArticles } from "@/app/actions/articles";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { ParticlesBackground } from "@/components/particles";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "Blog & Articles | Prime Language Academy",
  description: "Découvrez nos articles, conseils et réflexions sur l'apprentissage de l'anglais et l'importance du bilinguisme.",
  keywords: "cours d'anglais Abidjan, English Club Côte d'Ivoire, apprendre l'anglais Abidjan, centre linguistique, formation anglais pro",
  openGraph: {
    title: "Blog | Prime Language Academy",
    description: "Conseils et astuces pour maîtriser l'anglais en Côte d'Ivoire.",
    url: "https://primelanguageacademy.com/blog",
    siteName: "Prime Language Academy",
    images: [{ url: "https://primelanguageacademy.com/icon-512x512.png" }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Prime Language Academy",
    description: "Le meilleur blog pour apprendre l'anglais à Abidjan.",
  }
};

export default async function BlogPage() {
  const articles = await getArticles(true);

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
            <Link href="/" className="hover:text-slate-900 dark:text-white transition-colors">Retour à l'Accueil</Link>
            <Link href="/blog" className="text-[#E7162A] font-bold transition-colors">Le Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white hidden sm:block">
              Connexion
            </Link>
            <Button asChild className="bg-[#E7162A] hover:bg-[#E7162A]/90 text-slate-900 dark:text-white font-bold shadow-[0_0_15px_rgba(231,22,42,0.3)] hover:shadow-[0_0_25px_rgba(231,22,42,0.5)] transition-shadow">
              <Link href="/register">S'inscrire</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-40 pb-20 px-4 bg-slate-50 dark:bg-slate-950 overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#21286E]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E7162A]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <Badge variant="outline" className="border-[#E7162A]/50 bg-[#E7162A]/10 text-[#E7162A] px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(231,22,42,0.2)]">
            Hub de Connaissances
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
            Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7162A] to-orange-500">Blog</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-600 dark:text-slate-400 md:text-lg leading-relaxed max-w-2xl mx-auto">
            Conseils d'experts, réflexions sur le bilinguisme et actualités de la Prime Language Academy. Lisez, apprenez, et passez à l'action.
          </p>
        </div>
      </header>

      {/* ARTICLES LIST */}
      <section className="py-16 px-4 min-h-[40vh] relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="bg-white dark:bg-slate-900 border-slate-800 hover:border-[#E7162A]/50 transition-all group overflow-hidden shadow-lg shadow-black/20 hover:shadow-[0_0_30px_rgba(231,22,42,0.15)] flex flex-col">
              {article.coverImage && (
                <div className="relative w-full h-56 overflow-hidden">
                  <Image 
                    src={article.coverImage} 
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#21286E]/90 text-white border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">
                      {article.category}
                    </Badge>
                  </div>
                </div>
              )}
              <CardHeader className={`p-6 md:p-8 pb-2 ${article.coverImage ? 'pt-6' : ''}`}>
                {!article.coverImage && (
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <Badge className="bg-[#21286E]/40 text-blue-300 hover:bg-[#21286E]/50 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {article.category}
                    </Badge>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      {article.author.name || "Équipe PLA"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(article.createdAt), "dd MMMM yyyy", { locale: fr })}
                    </span>
                  </div>
                <Link href={`/blog/${article.slug}`}>
                  <CardTitle className="text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover:text-[#E7162A] transition-colors leading-tight line-clamp-2">
                    {article.title}
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent className="px-6 md:px-8 py-4 flex-1">
                <p className="text-slate-500 dark:text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                  {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
              </CardContent>
              <CardFooter className="px-6 md:px-8 py-6 pt-2">
                <Button asChild variant="ghost" className="p-0 hover:bg-transparent group/btn text-[#E7162A] font-bold flex items-center gap-2 transition-all">
                  <Link href={`/blog/${article.slug}`}>
                    Lire la suite
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-800 rounded-2xl">
              <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-600 dark:text-slate-400 font-bold text-lg uppercase tracking-widest">Aucun article publié pour le moment.</p>
              <Button asChild variant="link" className="mt-4 text-[#E7162A] font-bold">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-4 border-t border-slate-800 relative overflow-hidden bg-[#060A14]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#21286E]/10 blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-8 text-center relative z-10">
          <div className="relative w-16 h-16 mx-auto opacity-50">
            <Image src="/icon-512x512.png" alt="Logo PLA" fill className="object-contain" />
          </div>
          <div>
            <div className="font-black text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-2">
              PRIME LANGUAGE ACADEMY
            </div>
            <div className="text-slate-500 dark:text-slate-600 text-sm font-medium">
              © {new Date().getFullYear()} Prime Language Academy. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
