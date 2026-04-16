"use client";

import { useState } from "react";
import { createTrainingDoc, deleteTrainingDoc, updateDocAccess } from "@/app/actions/teacher-mgmt";
import { useRouter } from "next/navigation";

const categories: Record<string, string> = {
    "GENERAL": "Général",
    "GRAMMAR": "Grammaire",
    "VOCABULARY": "Vocabulaire",
    "PRONUNCIATION": "Prononciation"
};

export function ResourceManagerClient({ initialDocuments, teachers }: { initialDocuments: any[], teachers: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("GENERAL");
    const [file, setFile] = useState<File | null>(null);
    const [isRestricted, setIsRestricted] = useState(false);
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);

    // For viewing/editing access of existing docs
    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [editRestricted, setEditRestricted] = useState(false);
    const [editTeacherIds, setEditTeacherIds] = useState<string[]>([]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return setError("Veuillez choisir un fichier.");
        
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (uploadData.error) throw new Error(uploadData.error);

            await createTrainingDoc({
                title,
                description,
                fileUrl: uploadData.url,
                category,
                isRestricted,
                allowedTeacherIds: isRestricted ? selectedTeacherIds : [],
            });

            setTitle("");
            setDescription("");
            setFile(null);
            setIsRestricted(false);
            setSelectedTeacherIds([]);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce document ?")) return;
        await deleteTrainingDoc(id);
        router.refresh();
    };

    const openAccessEditor = (doc: any) => {
        setEditingDocId(doc.id);
        setEditRestricted(doc.isRestricted);
        setEditTeacherIds(doc.allowedTeachers?.map((t: any) => t.id) || []);
    };

    const saveAccessChanges = async () => {
        if (!editingDocId) return;
        await updateDocAccess(editingDocId, editRestricted, editTeacherIds);
        setEditingDocId(null);
        router.refresh();
    };

    const toggleTeacher = (id: string, list: string[], setList: (v: string[]) => void) => {
        setList(list.includes(id) ? list.filter(t => t !== id) : [...list, id]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
                <form onSubmit={handleUpload} className="glass-card sticky top-24 space-y-5 border-white/5 bg-white/[0.02]">
                    <h3 className="font-bold text-lg text-white mb-2">Partager une ressource</h3>
                    
                    {error && <p className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Titre du document</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Ex: Manuel de grammaire A1"
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Catégorie</label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                            >
                                {Object.entries(categories).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Description (Optionnel)</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows={2}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Fichier (PDF, Docx, Image)</label>
                            <div className="relative">
                                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="w-full bg-black/40 border border-dashed border-white/10 rounded-xl px-4 py-6 flex flex-col items-center justify-center cursor-pointer hover:border-red-500/30 transition-all text-white/40">
                                    <svg className="w-5 h-5 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{file ? file.name : "Choisir un fichier"}</span>
                                </label>
                            </div>
                        </div>

                        {/* Access Control */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Accès restreint</label>
                                <button 
                                    type="button"
                                    onClick={() => setIsRestricted(!isRestricted)}
                                    className={`w-10 h-5 rounded-full transition-all duration-300 ${isRestricted ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${isRestricted ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                                </button>
                            </div>

                            {isRestricted && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-[9px] font-medium text-white/20">Seuls les profs sélectionnés verront ce document :</p>
                                    <div className="flex flex-wrap gap-2">
                                        {teachers.map((t: any) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => toggleTeacher(t.id, selectedTeacherIds, setSelectedTeacherIds)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${selectedTeacherIds.includes(t.id) ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                                            >
                                                {selectedTeacherIds.includes(t.id) ? '✓ ' : ''}{t.name || t.email}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                    >
                        {loading ? "Chargement..." : "Publier la ressource"}
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
                {/* Access Editor Modal */}
                {editingDocId && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingDocId(null)}>
                        <div className="bg-[#12121e] border border-white/10 rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-black text-white">Modifier l'accès</h3>
                            
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-white/50">Restreindre l'accès</label>
                                <button 
                                    type="button"
                                    onClick={() => setEditRestricted(!editRestricted)}
                                    className={`w-10 h-5 rounded-full transition-all duration-300 ${editRestricted ? 'bg-red-500' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${editRestricted ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                                </button>
                            </div>

                            {editRestricted && (
                                <div className="space-y-3 animate-in fade-in duration-200">
                                    <p className="text-[10px] text-white/30">Visible uniquement pour :</p>
                                    <div className="flex flex-wrap gap-2">
                                        {teachers.map((t: any) => (
                                            <button
                                                key={t.id}
                                                onClick={() => toggleTeacher(t.id, editTeacherIds, setEditTeacherIds)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${editTeacherIds.includes(t.id) ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                                            >
                                                {editTeacherIds.includes(t.id) ? '✓ ' : ''}{t.name || t.email}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!editRestricted && (
                                <p className="text-xs text-emerald-400/80 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                    ✓ Tous les enseignants auront accès à ce document.
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => setEditingDocId(null)} className="flex-1 py-3 border border-white/10 text-white/50 rounded-xl text-xs font-bold hover:bg-white/5 transition-colors">
                                    Annuler
                                </button>
                                <button onClick={saveAccessChanges} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {initialDocuments.map((doc: any) => (
                        <div key={doc.id} className="glass-card hover:bg-white/[0.03] border-white/5 transition-all group p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 text-red-400 flex items-center justify-center font-black">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-red-500/60 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">
                                                {categories[doc.category] || doc.category}
                                            </span>
                                            {doc.isRestricted ? (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-orange-400/60 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">
                                                    🔒 Restreint ({doc.allowedTeachers?.length || 0})
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                                                    🌐 Tous les profs
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-extrabold text-white text-lg tracking-tight leading-snug">{doc.title}</h4>
                                        <p className="text-xs text-white/40 mt-1 line-clamp-2">{doc.description || "Aucun détail supplémentaire."}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(doc.id)}
                                    className="text-white/10 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <a 
                                    href={doc.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest text-center transition-all border border-white/5"
                                >
                                    Voir
                                </a>
                                <button 
                                    onClick={() => openAccessEditor(doc)}
                                    className="flex-1 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl text-[10px] uppercase tracking-widest text-center transition-all border border-red-500/20"
                                >
                                    Gérer l'accès
                                </button>
                            </div>
                        </div>
                    ))}
                    {initialDocuments.length === 0 && (
                        <div className="col-span-full py-16 text-center glass-card border-dashed border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Aucun document partagé</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
