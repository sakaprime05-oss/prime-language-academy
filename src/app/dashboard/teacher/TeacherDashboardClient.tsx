"use client";

import { useState } from "react";
import Link from "next/link";

export function TeacherDashboardClient({ levels, schedules, documents }: { 
    levels: any[], 
    schedules: any[], 
    documents: any[] 
}) {
    const [activeTab, setActiveTab] = useState("calendar");
    const daysWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    const recurringSchedules = schedules.filter(s => s.isRecurring);
    const specificSchedules = schedules.filter(s => !s.isRecurring).sort((a, b) => 
        (a.specificDate || "").localeCompare(b.specificDate || "")
    );

    function formatDate(dateStr: string): string {
        if (!dateStr) return "";
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
    }

    return (
        <div className="space-y-12">
            {/* Tab Navigation */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
                {[
                    { key: "calendar", label: "📅 Mon Planning", count: schedules.length },
                    { key: "classes", label: "📚 Mes Classes", count: levels.length },
                    { key: "resources", label: "📄 Ressources", count: documents.length },
                ].map(tab => (
                    <button 
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`text-xs font-black uppercase tracking-[0.15em] px-5 py-2.5 rounded-full transition-all border whitespace-nowrap ${activeTab === tab.key ? 'bg-teal-500/15 border-teal-500/50 text-teal-300' : 'text-white/60 border-transparent hover:text-white'}`}
                    >
                        {tab.label}
                        <span className={`ml-2 text-[9px] ${activeTab === tab.key ? 'text-teal-400' : 'text-white/40'}`}>
                            ({tab.count})
                        </span>
                    </button>
                ))}
            </div>

            {/* =========== Calendar View =========== */}
            {activeTab === "calendar" && (
                <section className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                    {/* Weekly Recurring */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-white/80 uppercase tracking-[0.15em] flex items-center gap-2">
                            <span className="w-6 h-6 bg-teal-500/30 text-teal-300 rounded-lg flex items-center justify-center text-[10px]">🔁</span>
                            Planning Hebdomadaire
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {daysWeek.map((day) => {
                                const daySchedules = recurringSchedules.filter((s: any) => s.dayOfWeek === day);
                                return (
                                    <div key={day} className="space-y-3">
                                        <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] text-center flex items-center justify-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${daySchedules.length > 0 ? 'bg-teal-400' : 'bg-white/20'}`}></span>
                                            {day}
                                        </h4>
                                        <div className="space-y-3">
                                            {daySchedules.map((item: any) => (
                                                <div key={item.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-all">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${item.type === 'CLUB' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'}`}>
                                                            {item.type === 'CLUB' ? '🗣️ Club' : '📖 Cours'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-black text-white">{item.startTime} – {item.endTime}</p>
                                                    <p className="text-xs font-bold text-white mt-1 truncate">{item.level?.name || "English Club"}</p>
                                                    {item.notes && <p className="text-xs text-teal-300 italic mt-1 font-bold">{item.notes}</p>}
                                                    <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mt-1.5 bg-white/5 p-1 rounded-md inline-block">{item.location}</p>
                                                </div>
                                            ))}
                                            {daySchedules.length === 0 && (
                                                <div className="h-20 border border-dashed border-white/5 rounded-2xl flex items-center justify-center">
                                                    <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">—</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Specific Date Events */}
                    {specificSchedules.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-white/60 uppercase tracking-[0.15em] flex items-center gap-2">
                                <span className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center text-[10px]">📌</span>
                                Événements Ponctuels
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {specificSchedules.map((item: any) => (
                                    <div key={item.id} className="p-5 rounded-2xl bg-orange-500/[0.03] border border-orange-500/10 hover:border-orange-500/30 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded">
                                                📅 {formatDate(item.specificDate)}
                                            </span>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${item.type === 'CLUB' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/20 text-teal-400'}`}>
                                                {item.type}
                                            </span>
                                        </div>
                                        <p className="text-base font-black text-white">{item.startTime} – {item.endTime}</p>
                                        <p className="text-sm text-white font-bold bg-white/5 px-2 py-1 rounded mt-1 inline-block">{item.level?.name || "English Club"}</p>
                                        {item.notes && <p className="text-sm text-orange-200 mt-2 bg-orange-500/30 px-3 py-2 rounded-lg border border-orange-500/30 shadow-inner">{item.notes}</p>}
                                        <p className="text-xs font-black uppercase text-white/80 tracking-widest mt-2">{item.location}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {schedules.length === 0 && (
                        <div className="py-16 text-center glass-card border-dashed border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Aucun cours programmé</p>
                            <p className="text-xs text-white/40 mt-2 font-medium">Contactez votre administrateur pour la planification.</p>
                        </div>
                    )}
                </section>
            )}

            {/* =========== Classes View =========== */}
            {activeTab === "classes" && (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    {levels.map((level: any) => (
                        <Link 
                            key={level.id}
                            href={`/dashboard/teacher/level/${level.id}`}
                            className="glass-card hover:border-teal-500/30 transition-all group p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                                    {level.name[0]}
                                </div>
                                <div className="text-[10px] font-black bg-white/[0.1] text-white/80 px-3 py-1 rounded-full uppercase tracking-widest">
                                    {level._count?.students || 0} Élèves
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-white mb-2 leading-tight tracking-tight">{level.name}</h3>
                            <p className="text-xs text-white/80 font-medium line-clamp-2 leading-relaxed">
                                {level.description || "Aucune description pour ce niveau."}
                            </p>
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Voir Progression →</span>
                            </div>
                        </Link>
                    ))}
                    {levels.length === 0 && (
                        <div className="col-span-full py-16 text-center glass-card border-dashed border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Aucune classe assignée</p>
                        </div>
                    )}
                </section>
            )}

            {/* =========== Resources View =========== */}
            {activeTab === "resources" && (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
                    {documents.map((doc: any) => (
                        <div key={doc.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-teal-500/30 transition-all group flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 text-teal-400 flex items-center justify-center group-hover:rotate-6 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-teal-300 bg-teal-500/20 px-2.5 py-1 rounded border border-teal-500/30 inline-block mb-2">
                                        {doc.category}
                                    </span>
                                    <h4 className="font-bold text-white text-sm leading-snug">{doc.title}</h4>
                                    <p className="text-[10px] text-white/70 mt-1 line-clamp-2">{doc.description}</p>
                                </div>
                            </div>
                            <a 
                                href={doc.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-6 w-full py-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 font-bold text-[10px] uppercase tracking-widest text-center transition-all border border-teal-500/20"
                            >
                                Ouvrir / Télécharger
                            </a>
                        </div>
                    ))}
                    {documents.length === 0 && (
                        <div className="col-span-full py-16 text-center glass-card border-dashed border-white/20">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Aucune ressource disponible</p>
                            <p className="text-xs text-white/40 mt-2 font-medium">Les ressources partagées par l'administration apparaîtront ici.</p>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
