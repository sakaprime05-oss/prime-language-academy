import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, Share2, User } from "lucide-react";
import { getArticleBySlug } from "@/app/actions/articles";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { siteConfig } from "@/lib/site-config";
import { articleImage, articleTitle, categoryLabel, editorialSummary, readingTime } from "@/lib/blog-presentation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article non trouve | Prime Language Academy" };

  const title = articleTitle(article);
  const articleUrl = `${siteConfig.url}/blog/${slug}`;
  const description = editorialSummary(article, 160);

  return {
    title: `${title} | Prime Language Academy`,
    description,
    keywords: `anglais, Abidjan, Cote d'Ivoire, ${article.category}, Prime Language Academy`,
    openGraph: {
      title,
      description,
      url: articleUrl,
      type: "article",
      publishedTime: new Date(article.createdAt).toISOString(),
      authors: [article.author?.name || "Prime Language Academy"],
      images: [{ url: articleImage(article) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [articleImage(article)],
    },
  };
}

export default async function SingleArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const title = articleTitle(article);
  const safeContent = sanitizeHtml(article.content);
  const articleUrl = `${siteConfig.url}/blog/${slug}`;
  const image = articleImage(article);

  return (
    <main className="min-h-screen bg-[#fff8f7] text-[#291715] dark:bg-[#0f1113] dark:text-[#f5f0e8]">
      <nav className="sticky top-0 z-50 border-b border-[#291715]/10 bg-[#fff8f7]/90 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1113]/88">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#291715]/60 transition hover:text-[#E7162A] dark:text-white/60">
            <ArrowLeft className="h-4 w-4" />
            Blog
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/register" className="hidden h-10 items-center justify-center rounded-xl bg-[#E7162A] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#c71123] sm:inline-flex">
              S'inscrire
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <article>
        <header className="border-b border-[#291715]/10 px-4 py-10 dark:border-white/10 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="space-y-6">
              <Badge className="rounded-full border border-[#E7162A]/25 bg-[#E7162A]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#E7162A]">
                <BookOpen className="mr-2 inline h-3.5 w-3.5" />
                {categoryLabel(article.category)}
              </Badge>
              <h1 className="font-[var(--font-lexend)] text-4xl font-black leading-[1.03] tracking-normal sm:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base font-medium leading-8 text-[#291715]/64 dark:text-white/64">
                {editorialSummary(article, 240)}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-black uppercase tracking-[0.12em] text-[#291715]/46 dark:text-white/46">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#E7162A]" />
                  {article.author?.name || "Equipe PLA"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#E7162A]" />
                  {format(new Date(article.createdAt), "dd MMMM yyyy", { locale: fr })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#E7162A]" />
                  {readingTime(article)} min de lecture
                </span>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#291715]/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
              <Image src={image} alt={title} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
          </div>
        </header>

        <section className="px-4 py-10 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[240px_minmax(0,760px)_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4 rounded-2xl border border-[#291715]/10 bg-white/70 p-5 text-sm font-medium leading-6 text-[#291715]/58 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/58">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E7162A]">A retenir</p>
                <p>{editorialSummary(article, 150)}</p>
              </div>
            </aside>

            <div className="rounded-2xl border border-[#291715]/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8 md:p-10">
              <div
                className="blog-article-content"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#291715]/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#291715]/45 dark:text-white/45">
                  <Share2 className="h-4 w-4 text-[#E7162A]" />
                  Partager
                </div>
                <div className="mt-4 grid gap-2">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[#291715]/10 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:border-[#E7162A]/40 hover:text-[#E7162A] dark:border-white/10"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[#291715]/10 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:border-[#E7162A]/40 hover:text-[#E7162A] dark:border-white/10"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </article>

      <section className="border-t border-[#291715]/10 bg-[#24110f] px-4 py-14 text-white dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E7162A]">Prochaine etape</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight">Passez de la lecture a la pratique guidee.</h2>
          </div>
          <Link href="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#E7162A] px-6 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#c71123]">
            Rejoindre la formation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
