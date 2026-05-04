import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatePostForm } from "./ForumClient";
import { requireInitialPayment } from "@/lib/student-payment-gate";
import { parseForumContent } from "@/lib/forum-content";

const AUTO_HIDE_REPORTS = 3;

export default async function ForumPage() {
  const session = await auth();
  if (!session) redirect("/login");
  await requireInitialPayment(session.user.id);

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, role: true } },
      _count: { select: { comments: true } },
    },
  });

  const visiblePosts = posts.filter((post) => (parseForumContent(post.content).reportedBy || []).length < AUTO_HIDE_REPORTS);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Forum etudiant</h2>
          <p className="font-medium text-[var(--foreground)]/50">Discutez, partagez des images et entraidez-vous.</p>
        </div>
        <div className="w-full md:w-auto">
          <CreatePostForm />
        </div>
      </header>

      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
          <div className="glass-card py-16 text-center opacity-50">
            <p className="font-bold">Aucune discussion pour le moment.</p>
            <p className="text-sm">Soyez le premier a lancer un sujet !</p>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const content = parseForumContent(post.content);
            return (
              <Link key={post.id} href={`/dashboard/student/forum/${post.id}`} className="glass-card block space-y-4 p-5 transition-colors hover:border-primary/50">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 font-black text-primary">
                    {post.author.name?.[0] || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-black text-[var(--foreground)] transition-colors hover:text-primary">{post.title}</h3>
                    <p className="mb-2 line-clamp-2 text-sm text-[var(--foreground)]/60">{content.text}</p>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
                      <span className="text-primary">{post.author.name || "Etudiant"}</span>
                      <span>-</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  <div className="flex h-fit items-center gap-2 rounded-xl bg-[var(--foreground)]/5 px-4 py-2 text-sm font-bold text-primary">
                    {post._count.comments}
                  </div>
                </div>
                {content.imageUrl && (
                  <div className="overflow-hidden rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
                    <img src={content.imageUrl} alt="" className="max-h-72 w-full object-cover" />
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
