"use client";

import { useState } from "react";
import { createPost } from "@/app/actions/forum";
import { useRouter } from "next/navigation";

export function CreatePostForm() {
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await createPost(formData);

        if (res.error) {
            alert(res.error);
        } else {
            setShowForm(false);
            e.currentTarget.reset();
            router.refresh();
        }
        setLoading(false);
    }

    if (!showForm) {
        return (
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Lancer une discussion
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-lg">Nouvelle Discussion</h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-[var(--foreground)]/50 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div>
                <input
                    name="title"
                    placeholder="Titre de votre sujet..."
                    required
                    className="w-full bg-[var(--foreground)]/5 border border-transparent focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-colors font-bold text-sm"
                />
            </div>
            <div>
                <textarea
                    name="content"
                    placeholder="Dites-nous tout..."
                    required
                    rows={4}
                    className="w-full bg-[var(--foreground)]/5 border border-transparent focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-colors text-sm resize-none"
                />
            </div>
            <div>
                <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                    className="block w-full text-xs font-bold text-[var(--foreground)]/55 file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--foreground)]/10 file:px-3 file:py-2 file:text-xs file:font-black file:text-[var(--foreground)]"
                />
            </div>
            <button type="submit" disabled={loading} className="btn-primary text-sm py-3">
                {loading ? "Publication..." : "Publier"}
            </button>
        </form>
    );
}

export function CreateCommentForm({ postId }: { postId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const { createComment } = await import("@/app/actions/forum");
        const formData = new FormData(e.currentTarget);
        const res = await createComment(postId, formData);

        if (res.error) {
            alert(res.error);
        } else {
            e.currentTarget.reset();
            router.refresh();
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
                name="content"
                placeholder="Écrire une réponse..."
                required
                className="flex-1 bg-[var(--foreground)]/5 border border-transparent focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
            />
            <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                className="max-w-full text-xs font-bold text-[var(--foreground)]/45 file:rounded-xl file:border-0 file:bg-[var(--foreground)]/10 file:px-3 file:py-3 file:text-xs file:font-black file:text-[var(--foreground)] sm:max-w-[180px]"
            />
            <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-6 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
                {loading ? "..." : "Répondre"}
            </button>
        </form>
    );
}
