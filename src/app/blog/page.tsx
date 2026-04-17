import { PrimeLogo } from "@/components/logo";
import Link from "next/link";
import { getArticles } from "@/app/actions/articles";

export const metadata = {
  title: "Blog & Articles | Prime Language Academy",
  description: "Découvrez nos articles, conseils et réflexions sur l'apprentissage de l'anglais et l'importance du bilinguisme.",
};

export default async function BlogPage() {
  const articles = await getArticles(true);

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-primary/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--foreground)]/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PrimeLogo className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[var(--foreground)]/50">
            <Link href="/#method" className="hover:text-primary transition-colors">Méthode ISO+</Link>
            <Link href="/#pricing" className="hover:text-primary transition-colors">Tarifs</Link>
            <Link href="/#location" className="hover:text-primary transition-colors">Localisation</Link>
            <Link href="/blog" className="text-primary transition-colors">Le Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-black text-[var(--foreground)]/60 hover:text-primary transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="btn-primary !py-2 !px-5 text-sm w-auto">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-40 pb-16 px-6 overflow-hidden">
        <div className="bg-blob w-[600px] h-[600px] bg-primary/10 top-[-200px] right-[-100px] animate-float"></div>
        <div className="bg-blob w-[400px] h-[400px] bg-secondary/10 bottom-[-100px] left-[-100px] animate-float" style={{ animationDelay: '-4s' }}></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Ressources & Réflexions
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] tracking-tighter leading-[0.9]">
            Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Blog</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[var(--foreground)]/50 font-medium md:text-lg">
            Découvrez nos articles autour de l'importance de l'anglais en Côte d'Ivoire, les méthodes d'apprentissage, et pourquoi vous devriez vous y mettre dès aujourd'hui.
          </p>
        </div>
      </header>

      {/* ARTICLES LIST */}
      <section className="py-12 px-6 min-h-[40vh]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-12">
          {articles.map((article) => (
            <article key={article.id} className="glass-card border-white/20 dark:border-white/5 p-8 md:p-12 space-y-6 group hover:border-primary/30 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                  {article.category}
                </span>
                <Link href={\`/blog/\${article.slug}\`}>
                  <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] leading-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-primary hover:to-secondary transition-colors cursor-pointer">
                    {article.title}
                  </h2>
                </Link>
                <div className="text-xs text-[var(--foreground)]/40 font-bold uppercase tracking-widest">
                  Par {article.author.name || "Équipe PLA"} • {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <div className="space-y-4 text-sm md:text-base text-[var(--foreground)]/70 font-medium leading-relaxed whitespace-pre-line line-clamp-4">
                {article.content}
              </div>
              <div className="pt-4">
                <Link href={\`/blog/\${article.slug}\`} className="text-sm font-black text-primary hover:text-secondary transition-colors inline-flex items-center gap-2">
                  Lire l'article complet <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
              </div>
            </article>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[var(--foreground)]/50 font-medium">Aucun article publié pour le moment. Revenez bientôt !</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-[var(--foreground)]/5 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <PrimeLogo className="h-10" />
            <p className="max-w-xs text-sm text-[var(--foreground)]/40 font-medium leading-relaxed">
              PRIME LANGUAGE ACADEMY : Parlez anglais. Vivez des opportunités.<br />
              Méthode ISO+ — pensée pour les francophones africains.
            </p>
          </div>
          <div>
            <h4 className="font-black text-[var(--foreground)] mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground)]/50 font-bold">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Le Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[var(--foreground)] mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground)]/50 font-bold">
              <li><a href="mailto:contact@prime.ci" className="hover:text-primary transition-colors">contact@prime.ci</a></li>
              <li><a href="tel:+2250161337864" className="hover:text-primary transition-colors">+225 01 61 33 78 64</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-[var(--foreground)]/5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/20">
          © {new Date().getFullYear()} Prime Language Academy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
