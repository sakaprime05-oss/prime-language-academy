import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatePostForm } from "./ForumClient";
import { requireInitialPayment } from "@/lib/student-payment-gate";

export default async function ForumPage() {
    const session = await auth();
    if (!session) redirect("/login");
    await requireInitialPayment(session.user.id);

    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: { select: { name: true, role: true } },
            _count: { select: { comments: true } }
        }
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Forum Étudiant</h2>
                    <p className="text-[var(--foreground)]/50 font-medium">Échangez, posez vos questions et entraidez-vous !</p>
                </div>
                <div className="w-full md:w-auto">
                    <CreatePostForm />
                </div>
            </header>

            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="glass-card text-center py-16 opacity-50">
                        <svg className="w-12 h-12 mx-auto mb-4 text-[var(--foreground)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                        <p className="font-bold">Aucune discussion pour le moment.</p>
                        <p className="text-sm">Soyez le premier à lancer un sujet !</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <Link key={post.id} href={`/dashboard/student/forum/${post.id}`} className="glass-card flex flex-col md:flex-row gap-4 p-5 hover:border-primary/50 transition-colors group block">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-black text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                {post.author.name?.[0] || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-black text-[var(--foreground)] mb-1 group-hover:text-primary transition-colors">{post.title}</h3>
                                <p className="text-sm text-[var(--foreground)]/60 line-clamp-1 mb-2">{post.content}</p>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
                                    <span className="text-primary">{post.author.name}</span>
                                    <span>•</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-start md:self-center bg-[var(--foreground)]/5 px-4 py-2 rounded-xl text-primary font-bold text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                {post._count.comments}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
