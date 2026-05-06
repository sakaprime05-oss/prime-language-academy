import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, BookOpen, Calendar, Clock, PenLine, User } from "lucide-react";
import { getArticles } from "@/app/actions/articles";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { articleImage, articleTitle, categoryLabel, editorialSummary, readingTime } from "@/lib/blog-presentation";

export const metadata = {
  title: "Blog | Prime Language Academy",
  description:
    "Analyses, conseils et methodes pour progresser en anglais avec plus de clarte, de discipline et de confiance.",
  keywords:
    "cours anglais Abidjan, apprendre anglais Cote d'Ivoire, anglais professionnel, English Club Abidjan, Prime Language Academy",
  openGraph: {
    title: "Blog | Prime Language Academy",
    description: "Conseils et analyses pour apprendre l'anglais avec methode.",
    url: `${siteConfig.url}/blog`,
    siteName: "Prime Language Academy",
    images: [{ url: siteConfig.ogImage }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Prime Language Academy",
    description: "Le journal editorial de Prime Language Academy.",
  },
};

export default async function BlogPage() {
  const articles = await getArticles(true);
  const [featuredArticle, ...otherArticles] = articles;

  return (
    <main className="min-h-screen bg-[#fff8f7] text-[#291715] dark:bg-[#0f1113] dark:text-[#f5f0e8]">
      <nav className="sticky top-0 z-50 border-b border-[#291715]/10 bg-[#fff8f7]/90 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1113]/88">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-white p-1.5 shadow-sm">
              <Image src="/icon-512x512.png" alt="Prime Language Academy" fill sizes="40px" className="object-contain p-1.5" priority />
            </span>
            <span className="hidden text-sm font-black uppercase leading-4 tracking-[0.16em] sm:block">
              Prime Language<br />Academy
            </span>
          </Link>

          <div className="hidden items-center gap-6 text-xs font-black uppercase tracking-[0.14em] text-[#291715]/55 dark:text-white/55 md:flex">
            <Link href="/" className="transition hover:text-[#E7162A]">Accueil</Link>
            <Link href="/programme" className="transition hover:text-[#E7162A]">Programme</Link>
            <Link href="/blog" className="text-[#E7162A]">Blog</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-xl bg-[#E7162A] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#c71123]">
              S'inscrire
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <section className="border-b border-[#291715]/10 px-4 py-12 dark:border-white/10 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-end">
          <div className="space-y-5">
            <Badge className="rounded-full border border-[#E7162A]/25 bg-[#E7162A]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#E7162A]">
              Journal PLA
            </Badge>
            <h1 className="max-w-3xl font-[var(--font-lexend)] text-4xl font-black leading-[1.02] tracking-normal sm:text-6xl">
              Des articles utiles, clairs et directement applicables.
            </h1>
            <p className="max-w-2xl text-base font-medium leading-8 text-[#291715]/62 dark:text-white/62">
              Le blog rassemble nos conseils de terrain sur l'anglais, la discipline d'apprentissage, l'oral et les opportunites professionnelles.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#291715]/10 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="p-3">
              <p className="text-2xl font-black text-[#E7162A]">{articles.length}</p>
              <p className="mt-1 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-[#291715]/45 dark:text-white/45">articles</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-black text-[#E7162A]">3</p>
              <p className="mt-1 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-[#291715]/45 dark:text-white/45">axes</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-black text-[#E7162A]">5 min</p>
              <p className="mt-1 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-[#291715]/45 dark:text-white/45">lecture</p>
            </div>
          </div>
        </div>
      </section>

      {featuredArticle ? (
        <section className="px-4 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="group grid overflow-hidden rounded-2xl border border-[#291715]/10 bg-white shadow-sm transition hover:border-[#E7162A]/35 dark:border-white/10 dark:bg-white/[0.04] lg:grid-cols-[1.08fr_0.92fr]"
            >
              <div className="relative min-h-[320px] overflow-hidden lg:min-h-[460px]">
                <Image
                  src={articleImage(featuredArticle)}
                  alt={articleTitle(featuredArticle)}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                <div className="absolute left-5 top-5">
                  <Badge className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#291715]">
                    A la une
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-10 p-6 sm:p-8 lg:p-10">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#291715]/45 dark:text-white/45">
                    <span className="inline-flex items-center gap-1.5">
                      <PenLine className="h-3.5 w-3.5 text-[#E7162A]" />
                      {categoryLabel(featuredArticle.category)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#E7162A]" />
                      {readingTime(featuredArticle)} min
                    </span>
                  </div>
                  <h2 className="font-[var(--font-lexend)] text-3xl font-black leading-tight tracking-normal sm:text-5xl">
                    {articleTitle(featuredArticle)}
                  </h2>
                  <p className="text-sm font-medium leading-7 text-[#291715]/62 dark:text-white/62 sm:text-base">
                    {editorialSummary(featuredArticle, 230)}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#E7162A]">
                  Lire l'analyse
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="px-4 py-20">
          <div className="mx-auto max-w-2xl rounded-2xl border border-[#291715]/10 bg-white p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#E7162A]" />
            <h2 className="text-2xl font-black">Aucun article publie pour le moment.</h2>
            <p className="mt-3 text-sm font-medium text-[#291715]/55 dark:text-white/55">
              Le journal PLA sera bientot alimente avec des conseils et analyses utiles.
            </p>
          </div>
        </section>
      )}

      {otherArticles.length > 0 && (
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E7162A]">Dernieres publications</p>
                <h2 className="mt-2 text-2xl font-black">A lire ensuite</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {otherArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#291715]/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#E7162A]/35 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={articleImage(article)}
                      alt={articleTitle(article)}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute left-4 top-4">
                      <Badge className="rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#291715]">
                        {categoryLabel(article.category)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#291715]/42 dark:text-white/42">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#E7162A]" />
                        {format(new Date(article.createdAt), "dd MMM yyyy", { locale: fr })}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#E7162A]" />
                        {readingTime(article)} min
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-xl font-black leading-tight transition group-hover:text-[#E7162A]">
                      {articleTitle(article)}
                    </h3>
                    <p className="line-clamp-3 text-sm font-medium leading-6 text-[#291715]/58 dark:text-white/58">
                      {editorialSummary(article)}
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#E7162A]">
                      Lire
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#291715]/10 bg-[#24110f] px-4 py-16 text-white dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E7162A]">Passer a l'action</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight">Transformez la lecture en progression concrete.</h2>
          </div>
          <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-xl bg-[#E7162A] px-6 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#c71123]">
            Rejoindre la formation
          </Link>
        </div>
      </section>
    </main>
  );
}
