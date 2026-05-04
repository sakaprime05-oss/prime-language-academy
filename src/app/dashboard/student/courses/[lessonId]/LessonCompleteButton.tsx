"use client";

import { markLessonComplete } from "@/app/actions/student-progress";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LessonCompleteButton({ lessonId, isCompleted }: { lessonId: string; isCompleted: boolean }) {
  const [completed, setCompleted] = useState(isCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (completed) return;
    setLoading(true);
    try {
      await markLessonComplete(lessonId);
      setCompleted(true);
      router.refresh();
    } catch {
      alert("Impossible de mettre a jour votre progression.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading || completed} className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto disabled:opacity-60">
      {completed ? "Deja terminee" : loading ? "Validation..." : "Marquer comme terminee"}
    </button>
  );
}
