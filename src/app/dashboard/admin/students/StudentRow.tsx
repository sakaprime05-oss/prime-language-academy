"use client";

import { useState } from "react";
import { updateStudentStatus, assignStudentLevel } from "@/app/actions/admin-students";
import Link from "next/link";

interface StudentRowProps {
    student: any; // User with level include
    levels: any[];
}

export default function StudentRow({ student, levels }: StudentRowProps) {
    const [status, setStatus] = useState(student.status);
    const [levelId, setLevelId] = useState(student.levelId || "");
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true);
        try {
            await updateStudentStatus(student.id, newStatus);
            setStatus(newStatus);
        } catch (error) {
            alert("Erreur lors de la mise à jour du statut");
        } finally {
            setLoading(false);
        }
    };

    const handleLevelChange = async (newLevelId: string) => {
        setLoading(true);
        try {
            await assignStudentLevel(student.id, newLevelId);
            setLevelId(newLevelId);
        } catch (error) {
            alert("Erreur lors de l'assignation du niveau");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case "ACTIVE": return "bg-green-500/10 text-green-600";
            case "SUSPENDED": return "bg-yellow-500/10 text-yellow-600";
            case "BLOCKED": return "bg-red-500/10 text-red-600";
            case "WAITLIST": return "bg-amber-500/10 text-amber-600";
            case "PENDING": return "bg-blue-500/10 text-blue-600";
            default: return "bg-gray-500/10 text-gray-600";
        }
    };

    return (
        <div className="glass-card hover:border-[var(--primary)]/30 transition-all group !p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 overflow-hidden rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-lg">
                    {student.profilePhotoUrl ? (
                        <img src={student.profilePhotoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        student.name?.[0] || student.email[0].toUpperCase()
                    )}
                </div>
                <div>
                    <Link href={`/dashboard/admin/students/${student.id}`} className="font-bold text-[var(--foreground)] hover:text-primary">
                        {student.name || "Sans Nom"}
                    </Link>
                    <p className="text-xs text-[var(--foreground)]/50">{student.email}</p>
                    <p className="mt-1 text-[10px] font-bold text-[var(--foreground)]/35">
                        {student.phone || "Telephone manquant"} {student.commune ? `- ${student.commune}` : ""}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* Status Badge */}
                <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(status)}`}>
                    {status}
                </div>
                <div className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-[var(--foreground)]/5 text-[var(--foreground)]/45">
                    {student.registrationType === "CLUB" ? "Club" : "Formation"}
                </div>
                <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${student.profileComplete ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {student.profileComplete ? "Profil ok" : "Profil incomplet"}
                </div>

                {/* Level Selection */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest">Niveau:</span>
                    <select
                        disabled={loading}
                        value={levelId}
                        onChange={(e) => handleLevelChange(e.target.value)}
                        className="bg-[var(--surface-hover)] border-none text-xs font-bold rounded-lg px-2 py-1 outline-none text-[var(--foreground)]"
                    >
                        <option value="">Non assigné</option>
                        {levels.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto md:ml-0">
                    <Link href={`/dashboard/admin/students/${student.id}`} className="text-[10px] font-bold text-primary border border-primary/20 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                        Fiche
                    </Link>
                    {status === "ACTIVE" ? (
                        <button
                            disabled={loading}
                            onClick={() => handleStatusChange("SUSPENDED")}
                            className="text-[10px] font-bold text-yellow-600 border border-yellow-600/20 hover:bg-yellow-500/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Suspendre
                        </button>
                    ) : (
                        <button
                            disabled={loading}
                            onClick={() => handleStatusChange("ACTIVE")}
                            className="text-[10px] font-bold text-green-600 border border-green-600/20 hover:bg-green-500/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Activer
                        </button>
                    )}
                    <button
                        disabled={loading}
                        onClick={() => handleStatusChange(status === "BLOCKED" ? "ACTIVE" : "BLOCKED")}
                        className={`text-[10px] font-bold ${status === "BLOCKED" ? "text-green-600 border-green-600/20" : "text-red-600 border-red-600/20"} border hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors`}
                    >
                        {status === "BLOCKED" ? "Débloquer" : "Bloquer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
