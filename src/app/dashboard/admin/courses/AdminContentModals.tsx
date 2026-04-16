"use client";

import { useState } from "react";
import { createLevel, createModule, createLesson } from "@/app/actions/admin-content";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[var(--surface)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[var(--foreground)]">{title}</h3>
                    <button onClick={onClose} className="text-[var(--foreground)]/50 hover:text-[var(--foreground)] text-2xl">&times;</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const LevelModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createLevel({ name, price: parseFloat(price) });
            setName("");
            setPrice("");
            onClose();
        } catch (error) {
            alert("Erreur lors de la création du niveau");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nouveau Niveau">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Nom du Niveau</label>
                    <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                        placeholder="Ex: Debutant A1"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Prix (FCFA)</label>
                    <input
                        required
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                        placeholder="Ex: 50000"
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full btn-primary mt-4 disabled:opacity-50"
                >
                    {loading ? "Création..." : "Créer le Niveau"}
                </button>
            </form>
        </Modal>
    );
};

export const ModuleModal = ({ isOpen, onClose, levelId }: { isOpen: boolean; onClose: () => void; levelId: string }) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [order, setOrder] = useState("1");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createModule({ title, order: parseInt(order), levelId });
            setTitle("");
            setOrder("1");
            onClose();
        } catch (error) {
            alert("Erreur lors de la création du module");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nouveau Module">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Titre du Module</label>
                    <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                        placeholder="Ex: Les bases de la grammaire"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Ordre</label>
                    <input
                        required
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                        placeholder="Ex: 1"
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full btn-primary mt-4 disabled:opacity-50"
                >
                    {loading ? "Création..." : "Créer le Module"}
                </button>
            </form>
        </Modal>
    );
};

export const LessonModal = ({ isOpen, onClose, moduleId }: { isOpen: boolean; onClose: () => void; moduleId: string }) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("VIDEO");
    const [contentUrl, setContentUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [order, setOrder] = useState("1");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let finalUrl = contentUrl;

        try {
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error("Erreur lors de l'upload du fichier");
                }

                const data = await uploadRes.json();
                finalUrl = data.url;
            }

            await createLesson({ title, order: parseInt(order), moduleId, type, contentUrl: finalUrl });
            setTitle("");
            setContentUrl("");
            setFile(null);
            setOrder("1");
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la création de la leçon");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle Leçon">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Titre de la Leçon</label>
                    <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                        placeholder="Ex: Présent de l'indicatif"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none appearance-none"
                    >
                        <option value="VIDEO">Vidéo</option>
                        <option value="PDF">PDF</option>
                        <option value="QUIZ">Quiz</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Fichier à uploader (Optionnel si URL fournie)</label>
                    <input
                        type="file"
                        accept={type === "VIDEO" ? "video/*" : type === "PDF" ? "application/pdf" : "*/*"}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Ou URL externe (Lien YouTube, Dropbox...)</label>
                    <input
                        value={contentUrl}
                        onChange={(e) => setContentUrl(e.target.value)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                        placeholder="Lien externe de la vidéo ou du PDF"
                        disabled={!!file}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Ordre</label>
                    <input
                        required
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="w-full bg-[var(--surface-hover)] border-none rounded-2xl px-4 py-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                        placeholder="Ex: 1"
                    />
                </div>
                <button
                    disabled={loading || (!contentUrl && !file && type !== "QUIZ")}
                    className="w-full btn-primary mt-4 disabled:opacity-50"
                >
                    {loading ? "Création & Upload en cours..." : "Créer la Leçon"}
                </button>
            </form>
        </Modal>
    );
};
