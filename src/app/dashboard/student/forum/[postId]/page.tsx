import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateCommentForm } from "../ForumClient";
import { requireInitialPayment } from "@/lib/student-payment-gate";
import { parseForumContent } from "@/lib/forum-content";

export default async function PostPage(props: { params: Promise<{ postId: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session) redirect("/login");
  await requireInitialPayment(session.user.id);

  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: {
      author: { select: { name: true, role: true } },
      comments: {
        include: { author: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) redirect("/dashboard/student/forum");
  const postContent = parseForumContent(post.content);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <Link href="/dashboard/student/forum" className="mb-4 flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline">
          Retour au forum
        </Link>
        <div className="glass-card space-y-4 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-black text-primary">
              {post.author.name?.[0] || "?"}
            </div>
            <div>
              <p className="text-sm font-bold">
                {post.author.name || "Etudiant"}
                <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
                  {post.author.role === "TEACHER" ? "Professeur" : "Etudiant"}
                </span>
              </p>
              <p className="text-xs text-[var(--foreground)]/40">{new Date(post.createdAt).toLocaleString("fr-FR")}</p>
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-[var(--foreground)]">{post.title}</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-[var(--foreground)]/80">{postContent.text}</p>
          {postContent.imageUrl && (
            <div className="overflow-hidden rounded-3xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
              <img src={postContent.imageUrl} alt="" className="max-h-[520px] w-full object-cover" />
            </div>
          )}
        </div>
      </header>

      <div className="space-y-6">
        <h3 className="text-lg font-black">Reponses ({post.comments.length})</h3>

        <div className="space-y-4">
          {post.comments.map((comment) => {
            const content = parseForumContent(comment.content);
            return (
              <div key={comment.id} className={`flex gap-4 rounded-2xl p-4 shadow-sm ${comment.author.role === "TEACHER" ? "border border-primary/20 bg-primary/5" : "border border-[var(--foreground)]/5 bg-[var(--surface)]"}`}>
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${comment.author.role === "TEACHER" ? "bg-primary text-white" : "bg-[var(--foreground)]/10 text-[var(--foreground)]/60"}`}>
                  {comment.author.name?.[0] || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-sm font-bold">
                    {comment.author.name || "Etudiant"}
                    {comment.author.role === "TEACHER" && <span className="ml-2 rounded bg-primary/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary">Pro</span>}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]/80">{content.text}</p>
                  {content.imageUrl && (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
                      <img src={content.imageUrl} alt="" className="max-h-80 w-full object-cover" />
                    </div>
                  )}
                  <p className="mt-2 text-[10px] font-bold text-[var(--foreground)]/30">{new Date(comment.createdAt).toLocaleString("fr-FR")}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 left-0 right-0 mt-8 border-t border-[var(--foreground)]/5 bg-[var(--background)]/80 p-4 backdrop-blur-3xl md:relative md:border-none md:bg-transparent md:p-0">
          <CreateCommentForm postId={post.id} />
        </div>
      </div>
    </div>
  );
}
