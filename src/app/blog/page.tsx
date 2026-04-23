import { PrimeLogo } from "@/components/logo";
import Link from "next/link";
import { getArticles } from "@/app/actions/articles";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const metadata = {
  title: "Blog & Articles | Prime Language Academy",
  description: "Découvrez nos articles, conseils et réflexions sur l'apprentissage de l'anglais et l'importance du bilinguisme.",
};

export default async function BlogPage() {
  const articles = await getArticles(true);

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[#E7162A]/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[#21286E]/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PrimeLogo className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#21286E]/70">
            <Link href="/#method" className="hover:text-[#E7162A] transition-colors">Méthode ISO+</Link>
            <Link href="/#pricing" className="hover:text-[#E7162A] transition-colors">Tarifs</Link>
            <Link href="/rendez-vous" className="hover:text-[#E7162A] transition-colors">Prendre RDV</Link>
            <Link href="/blog" className="text-[#E7162A] transition-colors">Le Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-black text-[#21286E]/70 hover:text-[#E7162A] transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="bg-[#E7162A] text-white font-bold py-2 px-5 rounded-xl hover:shadow-lg transition-all shadow-[#E7162A]/30 w-auto text-sm">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-40 pb-20 px-6 bg-[#21286E] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[800px] h-[800px] bg-[#E7162A]/10 blur-[150px] -top-40 -right-40 rounded-full" />
          <div className="absolute w-[600px] h-[600px] bg-blue-500/5 blur-[120px] bottom-0 left-0 rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
            <BookOpen className="w-3 h-3 text-[#E7162A]" />
            Hub de Connaissances
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight">
            Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7162A] to-orange-400">Blog</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/70 font-medium md:text-xl leading-relaxed">
            Conseils d'experts, réflexions sur le bilinguisme et actualités de la Prime Language Academy.
          </p>
        </div>
      </header>

      {/* ARTICLES LIST */}
      <section className="py-24 px-6 min-h-[40vh] bg-slate-50/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-12">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden border-[#21286E]/5 rounded-[2.5rem] shadow-xl shadow-[#21286E]/5 hover:shadow-2xl hover:shadow-[#21286E]/10 transition-all group bg-white">
              <CardHeader className="p-8 md:p-12 pb-4">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge className="bg-[#E7162A]/10 text-[#E7162A] hover:bg-[#E7162A]/20 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-xs font-bold text-[#21286E]/40 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      {article.author.name || "Équipe PLA"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(article.createdAt), "dd MMMM yyyy", { locale: fr })}
                    </span>
                  </div>
                </div>
                <Link href={`/blog/${article.slug}`}>
                  <h2 className="text-3xl md:text-4xl font-black text-[#21286E] leading-tight group-hover:text-[#E7162A] transition-colors cursor-pointer">
                    {article.title}
                  </h2>
                </Link>
              </CardHeader>
              <CardContent className="px-8 md:px-12 py-0">
                <p className="text-lg text-[#21286E]/60 font-medium leading-relaxed line-clamp-3">
                  {article.content.replace(/<[^>]*>/g, '').substring(0, 300)}...
                </p>
              </CardContent>
              <CardFooter className="p-8 md:p-12 pt-8">
                <Button asChild variant="ghost" className="p-0 hover:bg-transparent group/btn">
                  <Link href={`/blog/${article.slug}`} className="text-sm font-black text-[#E7162A] flex items-center gap-2 group-hover:gap-3 transition-all">
                    Lire la suite
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-[#21286E]/5">
              <BookOpen className="w-16 h-16 text-[#21286E]/10 mx-auto mb-6" />
              <p className="text-[#21286E]/40 font-black text-xl uppercase tracking-widest">Aucun article publié pour le moment.</p>
              <Button asChild variant="link" className="mt-4 text-[#E7162A] font-bold">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 border-t border-[#21286E]/10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-10">
            <PrimeLogo className="h-12 opacity-90" />
            <p className="max-w-md text-lg text-[#21286E]/60 font-semibold leading-relaxed">
              PRIME LANGUAGE ACADEMY : L'ingénierie absolue de votre succès anglophone. Parlez anglais, vivez des opportunités.<br />
            </p>
          </div>
          <div>
            <h4 className="font-black text-[#21286E] mb-8 uppercase text-xs tracking-[0.4em]">Navigation</h4>
            <ul className="space-y-6 text-sm text-[#21286E]/60 font-bold">
              <li><Link href="/" className="hover:text-[#E7162A] transition-colors">Accueil</Link></li>
              <li><Link href="/blog" className="hover:text-[#E7162A] transition-colors">Le Blog</Link></li>
              <li><Link href="/register" className="hover:text-[#E7162A] transition-colors">S'inscrire</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#21286E] mb-8 uppercase text-xs tracking-[0.4em]">Contact</h4>
            <ul className="space-y-6 text-sm text-[#21286E]/60 font-bold">
              <li>Abidjan, Côte d'Ivoire</li>
              <li><a href="mailto:info@primelanguageacademy.com" className="hover:text-[#E7162A] transition-colors">info@primelanguageacademy.com</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-[#21286E]/5 text-center text-[10px] font-black uppercase tracking-[0.5em] text-[#21286E]/30">
          © {new Date().getFullYear()} Prime Language Academy. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
