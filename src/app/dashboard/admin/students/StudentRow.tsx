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
            case "ACTIVE": return "bg-green-500/10 text-green-300";
            case "SUSPENDED": return "bg-yellow-500/10 text-yellow-300";
            case "BLOCKED": return "bg-red-500/10 text-red-300";
            case "WAITLIST": return "bg-amber-500/10 text-amber-300";
            case "PENDING": return "bg-blue-500/10 text-blue-300";
            default: return "bg-gray-500/10 text-gray-300";
        }
    };

    return (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-red-500/25 md:flex md:items-center md:justify-between md:gap-4">
            <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-red-500/10 text-base font-bold text-red-300">
                    {student.profilePhotoUrl ? (
                        <img src={student.profilePhotoUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        student.name?.[0] || student.email[0].toUpperCase()
                    )}
                </div>
                <div>
                    <Link href={`/dashboard/admin/students/${student.id}`} className="font-bold text-white hover:text-red-300">
                        {student.name || "Sans Nom"}
                    </Link>
                    <p className="text-xs text-white/45">{student.email}</p>
                    <p className="mt-1 text-[10px] font-bold text-white/30">
                        {student.phone || "Telephone manquant"} {student.commune ? `- ${student.commune}` : ""}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0 md:justify-end">
                {/* Status Badge */}
                <div className={`status-badge ${getStatusColor(status)}`}>
                    {status}
                </div>
                <div className="status-badge bg-white/5 text-white/45">
                    {student.registrationType === "CLUB" ? "Club" : "Formation"}
                </div>
                <div className={`status-badge ${student.profileComplete ? "bg-green-500/10 text-green-300" : "bg-amber-500/10 text-amber-300"}`}>
                    {student.profileComplete ? "Profil ok" : "Profil incomplet"}
                </div>

                {/* Level Selection */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest">Niveau:</span>
                    <select
                        disabled={loading}
                        value={levelId}
                        onChange={(e) => handleLevelChange(e.target.value)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-bold text-white outline-none"
                    >
                        <option value="">Non assigné</option>
                        {levels.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="ml-auto flex items-center gap-2 md:ml-0">
                    <Link href={`/dashboard/admin/students/${student.id}`} className="rounded-lg border border-red-500/25 px-3 py-1.5 text-[10px] font-bold text-red-300 transition-colors hover:bg-red-500/10">
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
