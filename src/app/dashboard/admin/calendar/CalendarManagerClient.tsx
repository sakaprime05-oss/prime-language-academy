"use client";

import { useState } from "react";
import { createSchedule, deleteSchedule } from "@/app/actions/teacher-mgmt";
import { useRouter } from "next/navigation";

export function CalendarManagerClient({ initialSchedules, teachers, levels, selectedTeacherId }: { 
    initialSchedules: any[], 
    teachers: any[], 
    levels: any[], 
    selectedTeacherId?: string 
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [teacherId, setTeacherId] = useState(selectedTeacherId || (teachers[0]?.id || ""));
    const [dayOfWeek, setDayOfWeek] = useState("Lundi");
    const [levelId, setLevelId] = useState(levels[0]?.id || "");
    const [startTime, setStartTime] = useState("18:00");
    const [endTime, setEndTime] = useState("20:00");
    const [type, setType] = useState("COURS");
    const [location, setLocation] = useState("Centre 1");
    const [isRecurring, setIsRecurring] = useState(true);
    const [specificDate, setSpecificDate] = useState("");
    const [notes, setNotes] = useState("");

    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await createSchedule({
                teacherId,
                levelId: type === "COURS" ? levelId : undefined,
                dayOfWeek: isRecurring ? dayOfWeek : getDayFromDate(specificDate),
                startTime,
                endTime,
                type,
                location,
                isRecurring,
                specificDate: isRecurring ? undefined : specificDate,
                notes: notes || undefined,
            });
            setNotes("");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce créneau ?")) return;
        await deleteSchedule(id);
        router.refresh();
    };

    // Extract day name from a date string like "2026-05-14"
    function getDayFromDate(dateStr: string): string {
        if (!dateStr) return "Lundi";
        const date = new Date(dateStr + "T00:00:00");
        const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        return dayNames[date.getDay()] || "Lundi";
    }

    function formatDate(dateStr: string): string {
        if (!dateStr) return "";
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    }

    const recurringSchedules = initialSchedules.filter(s => s.isRecurring);
    const specificSchedules = initialSchedules.filter(s => !s.isRecurring);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
                <form onSubmit={handleAdd} className="glass-card sticky top-24 space-y-5 border-white/5 bg-white/[0.02]">
                    <h3 className="font-bold text-lg text-white mb-2">Ajouter un créneau</h3>
                    
                    {error && <p className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

                    {/* Mode Toggle */}
                    <div className="flex gap-2 p-1 bg-black/30 rounded-xl">
                        <button 
                            type="button"
                            onClick={() => setIsRecurring(true)}
                            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isRecurring ? 'bg-red-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            🔁 Récurrent
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsRecurring(false)}
                            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!isRecurring ? 'bg-red-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            📅 Date Précise
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Enseignant</label>
                            <select 
                                value={teacherId} 
                                onChange={(e) => setTeacherId(e.target.value)} 
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                required
                            >
                                {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name || t.email}</option>)}
                            </select>
                        </div>

                        {isRecurring ? (
                            <div className="space-y-1.5 animate-in fade-in duration-300">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Jour de la semaine</label>
                                <select 
                                    value={dayOfWeek} 
                                    onChange={(e) => setDayOfWeek(e.target.value)} 
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                >
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        ) : (
                            <div className="space-y-1.5 animate-in fade-in duration-300">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Date précise</label>
                                <input 
                                    type="date" 
                                    value={specificDate} 
                                    onChange={(e) => setSpecificDate(e.target.value)} 
                                    required
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Type</label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value)} 
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                            >
                                <option value="COURS">Cours Classique</option>
                                <option value="CLUB">English Club</option>
                            </select>
                        </div>

                        {type === "COURS" && (
                            <div className="space-y-1.5 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Niveau</label>
                                <select 
                                    value={levelId} 
                                    onChange={(e) => setLevelId(e.target.value)} 
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                >
                                    {levels.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Début</label>
                                <input 
                                    type="time" 
                                    value={startTime} 
                                    onChange={(e) => setStartTime(e.target.value)} 
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Fin</label>
                                <input 
                                    type="time" 
                                    value={endTime} 
                                    onChange={(e) => setEndTime(e.target.value)} 
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Lieu / Centre</label>
                            <input 
                                type="text" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                                placeholder="Ex: Centre 1, Plateau"
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Notes (Optionnel)</label>
                            <input 
                                type="text" 
                                value={notes} 
                                onChange={(e) => setNotes(e.target.value)} 
                                placeholder="Ex: Examen, Révision..."
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                    >
                        {loading ? "Chargement..." : isRecurring ? "+ Ajouter un cours récurrent" : "+ Ajouter un événement ponctuel"}
                    </button>
                </form>
            </div>

            {/* Display Section */}
            <div className="lg:col-span-2 space-y-10">
                {/* Teacher Filter */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => router.push('/dashboard/admin/calendar')}
                        className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all whitespace-nowrap ${!selectedTeacherId ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:text-white'}`}
                    >
                        Tous
                    </button>
                    {teachers.map((t: any) => (
                        <button 
                            key={t.id}
                            onClick={() => router.push(`/dashboard/admin/calendar?teacher=${t.id}`)}
                            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all whitespace-nowrap ${selectedTeacherId === t.id ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-transparent border-white/5 text-white/40 hover:text-white'}`}
                        >
                            {t.name?.split(' ')[0] || t.email.split('@')[0]}
                        </button>
                    ))}
                </div>

                {/* Recurring Weekly Grid */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.15em] flex items-center gap-2">
                        <span className="w-6 h-6 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center text-[10px]">🔁</span>
                        Planning Hebdomadaire Récurrent
                    </h3>
                    <div className="space-y-6">
                        {days.map(day => {
                            const daySchedules = recurringSchedules.filter((s: any) => s.dayOfWeek === day);
                            return (
                                <div key={day} className="space-y-3">
                                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{day}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {daySchedules.map((schedule: any) => (
                                            <ScheduleCard key={schedule.id} schedule={schedule} onDelete={handleDelete} />
                                        ))}
                                        {daySchedules.length === 0 && (
                                            <div className="md:col-span-2 py-3 px-5 border border-dashed border-white/5 rounded-xl text-[9px] font-bold text-white/10 uppercase tracking-widest">
                                                Aucun cours
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
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.15em] flex items-center gap-2">
                            <span className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center text-[10px]">📅</span>
                            Événements Ponctuels
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {specificSchedules.map((schedule: any) => (
                                <div key={schedule.id} className="glass-card flex items-center justify-between border-orange-500/10 hover:border-orange-500/30 group transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-black text-xs">
                                            📅
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-white">
                                                {formatDate(schedule.specificDate)} — {schedule.startTime} – {schedule.endTime}
                                            </p>
                                            <p className="text-[10px] font-medium text-white/40">
                                                {schedule.type === 'CLUB' ? 'English Club' : schedule.level?.name} • {schedule.teacher.name}
                                            </p>
                                            {schedule.notes && <p className="text-[9px] text-orange-400/60 italic mt-0.5">{schedule.notes}</p>}
                                            <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mt-0.5">{schedule.location}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(schedule.id)}
                                        className="text-white/10 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ScheduleCard({ schedule, onDelete }: { schedule: any, onDelete: (id: string) => void }) {
    return (
        <div className="glass-card flex items-center justify-between border-white/5 hover:bg-white/[0.03] group transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${schedule.type === 'CLUB' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {schedule.type === 'CLUB' ? '🗣️' : '📖'}
                </div>
                <div>
                    <p className="font-bold text-xs text-white">
                        {schedule.startTime} – {schedule.endTime}
                    </p>
                    <p className="text-[10px] font-medium text-white/40">
                        {schedule.type === 'CLUB' ? 'English Club' : schedule.level?.name} • {schedule.teacher.name}
                    </p>
                    {schedule.notes && <p className="text-[9px] text-white/30 italic mt-0.5">{schedule.notes}</p>}
                    <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mt-0.5">
                        {schedule.location}
                    </p>
                </div>
            </div>
            <button 
                onClick={() => onDelete(schedule.id)}
                className="text-white/10 hover:text-red-500 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </div>
    );
}
