"use client";

import { useState } from "react";
import { markAttendance, submitGrade } from "@/app/actions/teacher-class";

export function StudentActionsClient({ 
    studentId, 
    studentName, 
    levelId, 
    schedules 
}: { 
    studentId: string, 
    studentName: string, 
    levelId: string, 
    schedules: any[] 
}) {
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
    const [isGradeOpen, setIsGradeOpen] = useState(false);
    
    // Attendance State
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
    const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
    const [attendanceNote, setAttendanceNote] = useState("");
    
    // Grade State
    const [score, setScore] = useState("");
    const [category, setCategory] = useState("GENERAL");
    const [feedback, setFeedback] = useState("");
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await markAttendance({
                studentId,
                scheduleId: selectedSchedule,
                date: attendanceDate,
                status: attendanceStatus,
                note: attendanceNote,
            });
            setIsAttendanceOpen(false);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement de l'appel");
        }
        setIsSubmitting(false);
    };

    const handleGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submitGrade({
                studentId,
                levelId,
                score: score ? parseFloat(score) : undefined,
                category,
                feedback,
                date: new Date().toISOString().split("T")[0],
            });
            setIsGradeOpen(false);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement de la note");
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
                <button 
                    onClick={() => setIsAttendanceOpen(true)}
                    className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition-all border border-teal-500/20"
                >
                    Faire l'appel
                </button>
                <button 
                    onClick={() => setIsGradeOpen(true)}
                    className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg hover:bg-orange-500/20 transition-all border border-orange-500/20"
                >
                    Noter & Feedback
                </button>
            </div>

            {/* Modal Appel */}
            {isAttendanceOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#101820] border border-white/10 rounded-3xl p-6 w-full max-w-md animate-in zoom-in-95">
                        <h3 className="text-xl font-black text-white mb-2">Appel : {studentName}</h3>
                        <p className="text-xs font-bold text-white/50 mb-6 uppercase tracking-widest">Enregistrement des présences</p>

                        <form onSubmit={handleAttendance} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Créneau / Cours</label>
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50"
                                    value={selectedSchedule}
                                    onChange={e => setSelectedSchedule(e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionner un cours...</option>
                                    {schedules.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.dayOfWeek} {s.startTime}-{s.endTime} ({s.type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50"
                                        value={attendanceDate}
                                        onChange={e => setAttendanceDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Statut</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50"
                                        value={attendanceStatus}
                                        onChange={e => setAttendanceStatus(e.target.value)}
                                    >
                                        <option value="PRESENT">Présent</option>
                                        <option value="ABSENT">Absent</option>
                                        <option value="LATE">En retard</option>
                                        <option value="EXCUSED">Excusé</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Note (Optionnel)</label>
                                <textarea 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50 min-h-[80px]"
                                    placeholder="Raison du retard, observation particulière..."
                                    value={attendanceNote}
                                    onChange={e => setAttendanceNote(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsAttendanceOpen(false)} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl">Annuler</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white bg-teal-500 hover:bg-teal-600 transition-colors rounded-xl disabled:opacity-50">Confirmer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Grade/Feedback */}
            {isGradeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#101820] border border-white/10 rounded-3xl p-6 w-full max-w-md animate-in zoom-in-95">
                        <h3 className="text-xl font-black text-white mb-2">Note & Feedback : {studentName}</h3>
                        <p className="text-xs font-bold text-white/50 mb-6 uppercase tracking-widest">Évaluation des compétences</p>

                        <form onSubmit={handleGrade} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Note (/10 ou /20)</label>
                                    <input 
                                        type="number" 
                                        step="0.5"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500/50"
                                        placeholder="Ex: 15"
                                        value={score}
                                        onChange={e => setScore(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Catégorie</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500/50"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        <option value="GENERAL">Général</option>
                                        <option value="SPEAKING">Speaking (Oral)</option>
                                        <option value="LISTENING">Listening (Écoute)</option>
                                        <option value="GRAMMAR">Grammar (Grammaire)</option>
                                        <option value="EXERCICE">Exercice Maison</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 block">Feedback Pédagogique</label>
                                <textarea 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500/50 min-h-[120px]"
                                    placeholder="Excellente participation, mais attention à la prononciation du 'th'..."
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsGradeOpen(false)} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl">Annuler</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl disabled:opacity-50">Soumettre</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
