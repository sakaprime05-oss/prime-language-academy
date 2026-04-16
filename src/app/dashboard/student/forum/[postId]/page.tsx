import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateCommentForm } from "../ForumClient";

export default async function PostPage(props: { params: Promise<{ postId: string }> }) {
    const params = await props.params;
    const session = await auth();
    if (!session) redirect("/login");

    const post = await prisma.post.findUnique({
        where: { id: params.postId },
        include: {
            author: { select: { name: true, role: true } },
            comments: {
                include: { author: { select: { name: true, role: true } } },
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!post) redirect("/dashboard/student/forum");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            <header>
                <Link href="/dashboard/student/forum" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-4">
                    ← Retour au forum
                </Link>
                <div className="glass-card p-6 md:p-8 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                            {post.author.name?.[0] || "?"}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{post.author.name} <span className="text-[10px] uppercase font-black tracking-widest text-[var(--foreground)]/40 ml-2">{post.author.role === 'TEACHER' ? 'Professeur' : 'Étudiant'}</span></p>
                            <p className="text-xs text-[var(--foreground)]/40">{new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">{post.title}</h2>
                    <p className="text-[var(--foreground)]/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>
            </header>

            <div className="space-y-6">
                <h3 className="font-black text-lg flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    Réponses ({post.comments.length})
                </h3>

                <div className="space-y-4">
                    {post.comments.map(comment => (
                        <div key={comment.id} className={`p-4 rounded-2xl ${comment.author.role === 'TEACHER' ? 'bg-primary/5 border border-primary/20' : 'bg-[var(--surface)] border border-[var(--foreground)]/5'} shadow-sm flex gap-4`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${comment.author.role === 'TEACHER' ? 'bg-primary text-white' : 'bg-[var(--foreground)]/10 text-[var(--foreground)]/60'}`}>
                                {comment.author.name?.[0] || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm mb-1">
                                    {comment.author.name}
                                    {comment.author.role === 'TEACHER' && <span className="ml-2 text-[9px] font-black uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded">Pro</span>}
                                </p>
                                <p className="text-sm text-[var(--foreground)]/80 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                <p className="text-[10px] font-bold text-[var(--foreground)]/30 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 sticky bottom-0 left-0 right-0 p-4 bg-[var(--background)]/80 backdrop-blur-3xl border-t border-[var(--foreground)]/5 md:relative md:p-0 md:bg-transparent md:border-none">
                    <CreateCommentForm postId={post.id} />
                </div>
            </div>
        </div>
    );
}
