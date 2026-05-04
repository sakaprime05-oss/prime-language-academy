import { auth } from "@/auth";
import { deleteComment, deletePost } from "@/app/actions/forum";
import { parseForumContent } from "@/lib/forum-content";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function removePost(formData: FormData) {
  "use server";
  await deletePost(String(formData.get("postId") || ""));
}

async function removeComment(formData: FormData) {
  "use server";
  await deleteComment(String(formData.get("commentId") || ""));
}

export default async function AdminForumPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/login");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true, role: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, email: true, role: true } } },
      },
    },
  });

  const reportedPosts = posts.filter((post) => (parseForumContent(post.content).reportedBy || []).length > 0).length;
  const reportedComments = posts.flatMap((post) => post.comments).filter((comment) => (parseForumContent(comment.content).reportedBy || []).length > 0).length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Link href="/dashboard/admin" className="mb-2 flex items-center gap-1 text-xs font-bold text-red-400 hover:underline">
            Retour admin
          </Link>
          <h2 className="text-3xl font-black tracking-tight text-white">Moderation forum</h2>
          <p className="mt-2 text-sm font-medium text-white/45">Surveillez les discussions, les images et les signalements etudiants.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Sujets" value={posts.length} />
          <Stat label="Sujets signales" value={reportedPosts} />
          <Stat label="Reponses signalees" value={reportedComments} />
        </div>
      </header>

      <div className="space-y-5">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-10 text-center text-white/45">
            Aucun sujet pour le moment.
          </div>
        ) : (
          posts.map((post) => {
            const content = parseForumContent(post.content);
            const reports = content.reportedBy?.length || 0;
            return (
              <article key={post.id} className="rounded-2xl border border-white/5 bg-[#12121e] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-white">{post.title}</h3>
                      {reports > 0 && <Badge>{reports} signalement(s)</Badge>}
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">{content.text}</p>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-white/30">
                      {post.author.name || post.author.email} - {new Date(post.createdAt).toLocaleString("fr-FR")}
                    </p>
                    {content.imageUrl && (
                      <a href={content.imageUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-xl border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:border-white/25">
                        Voir image
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/student/forum/${post.id}`} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/60 hover:border-white/30">
                      Ouvrir
                    </Link>
                    <form action={removePost}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button type="submit" className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-300 hover:bg-red-500/20">
                        Supprimer
                      </button>
                    </form>
                  </div>
                </div>

                {post.comments.length > 0 && (
                  <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
                    {post.comments.map((comment) => {
                      const commentContent = parseForumContent(comment.content);
                      const commentReports = commentContent.reportedBy?.length || 0;
                      return (
                        <div key={comment.id} className="rounded-xl bg-white/[0.03] p-3">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-black text-white/70">{comment.author.name || comment.author.email}</p>
                                {commentReports > 0 && <Badge>{commentReports} signalement(s)</Badge>}
                              </div>
                              <p className="mt-1 text-sm leading-6 text-white/55">{commentContent.text}</p>
                            </div>
                            <form action={removeComment}>
                              <input type="hidden" name="commentId" value={comment.id} />
                              <button type="submit" className="rounded-lg border border-red-500/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-300 hover:bg-red-500/10">
                                Supprimer
                              </button>
                            </form>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-4 py-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-300">{children}</span>;
}
