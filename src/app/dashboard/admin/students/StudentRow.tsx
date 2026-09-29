"use client";

import { useState } from "react";
import Link from "next/link";
import { assignStudentLevel, updateStudentStatus } from "@/app/actions/admin-students";

interface StudentRowProps {
  student: any;
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
    } catch {
      alert("Erreur lors de la mise a jour du statut");
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = async (newLevelId: string) => {
    setLoading(true);
    try {
      await assignStudentLevel(student.id, newLevelId);
      setLevelId(newLevelId);
    } catch {
      alert("Erreur lors de l'assignation du niveau");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: string) => {
    switch (value) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-600 dark:text-green-300";
      case "SUSPENDED":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";
      case "BLOCKED":
        return "bg-red-500/10 text-red-600 dark:text-red-300";
      case "WAITLIST":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
      case "PENDING":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-300";
      default:
        return "bg-[var(--muted)] text-[var(--muted-foreground)]";
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 transition-colors hover:border-[var(--primary)]/25 md:flex md:items-center md:justify-between md:gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--primary)]/10 text-base font-bold text-[var(--primary)]">
          {student.profilePhotoUrl ? (
            <img src={student.profilePhotoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            student.name?.[0] || student.email[0].toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <Link
            href={`/dashboard/admin/students/${student.id}`}
            className="font-bold text-[var(--foreground)] hover:text-[var(--primary)]"
          >
            {student.name || "Sans nom"}
          </Link>
          <p className="truncate text-xs text-[var(--muted-foreground)]">{student.email}</p>
          <p className="mt-1 text-[10px] font-bold text-[var(--muted-foreground)]">
            {student.phone || "Telephone manquant"} {student.commune ? `- ${student.commune}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0 md:justify-end">
        <div className={`status-badge ${getStatusColor(status)}`}>{status}</div>
        <div className="status-badge bg-[var(--muted)] text-[var(--muted-foreground)]">
          {student.registrationType === "CLUB" ? "Club" : "Formation"}
        </div>
        <div
          className={`status-badge ${
            student.profileComplete ? "bg-green-500/10 text-green-600 dark:text-green-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
          }`}
        >
          {student.profileComplete ? "Profil ok" : "Profil incomplet"}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Niveau:</span>
          <select
            disabled={loading}
            value={levelId}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs font-bold text-[var(--foreground)] outline-none"
          >
            <option value="">Non assigne</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href={`/dashboard/admin/students/${student.id}`}
            className="rounded-lg border border-[var(--primary)]/25 px-3 py-1.5 text-[10px] font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10"
          >
            Fiche
          </Link>
          {status === "ACTIVE" ? (
            <button
              disabled={loading}
              onClick={() => handleStatusChange("SUSPENDED")}
              className="rounded-lg border border-yellow-600/20 px-3 py-1.5 text-[10px] font-bold text-yellow-700 transition-colors hover:bg-yellow-500/10 dark:text-yellow-300"
            >
              Suspendre
            </button>
          ) : (
            <button
              disabled={loading}
              onClick={() => handleStatusChange("ACTIVE")}
              className="rounded-lg border border-green-600/20 px-3 py-1.5 text-[10px] font-bold text-green-700 transition-colors hover:bg-green-500/10 dark:text-green-300"
            >
              Activer
            </button>
          )}
          <button
            disabled={loading}
            onClick={() => handleStatusChange(status === "BLOCKED" ? "ACTIVE" : "BLOCKED")}
            className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-colors hover:bg-red-500/10 ${
              status === "BLOCKED"
                ? "border-green-600/20 text-green-700 dark:text-green-300"
                : "border-red-600/20 text-red-700 dark:text-red-300"
            }`}
          >
            {status === "BLOCKED" ? "Debloquer" : "Bloquer"}
          </button>
        </div>
      </div>
    </div>
  );
}
