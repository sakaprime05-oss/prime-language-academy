"use client";

import { useState } from "react";
import { submitQuizAttempt } from "@/app/actions/quizzes";

export default function StudentQuizList({ quizzes, studentId }: { quizzes: any[], studentId: string }) {
    const [activeQuiz, setActiveQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ score: number } | null>(null);

    const startQuiz = (quiz: any) => {
        setActiveQuiz(quiz);
        setAnswers({});
        setResult(null);
    };

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        if (!activeQuiz) return;
        setIsSubmitting(true);
        try {
            const res = await submitQuizAttempt({
                quizId: activeQuiz.id,
                answers,
            });
            setResult({ score: res.score });
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la soumission du quiz.");
        }
        setIsSubmitting(false);
    };

    if (activeQuiz) {
        return (
            <div className="glass-card animate-in fade-in zoom-in-95 duration-300">
                <div className="mb-6 flex justify-between items-center bg-[var(--surface-hover)] p-4 rounded-2xl">
                    <div>
                        <h3 className="text-xl font-black text-[var(--foreground)]">{activeQuiz.title}</h3>
                        <p className="text-xs font-bold text-[var(--foreground)]/40 uppercase tracking-widest">{activeQuiz.category}</p>
                    </div>
                    {!result && (
                        <button 
                            onClick={() => setActiveQuiz(null)}
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                {result ? (
                    <div className="text-center py-10 space-y-6">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black mx-auto shadow-2xl ${result.score >= 80 ? 'bg-green-500/10 text-green-500' : result.score >= 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                            {Math.round(result.score)}%
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-[var(--foreground)]">Quiz Terminé !</h4>
                            <p className="text-[var(--foreground)]/50 font-medium">Vous avez obtenu {Math.round(result.score)}% de bonnes réponses.</p>
                        </div>
                        <button 
                            onClick={() => setActiveQuiz(null)}
                            className="btn-primary max-w-xs mx-auto"
                        >
                            Retourner à la liste
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {activeQuiz.questions.map((q: any, i: number) => (
                            <div key={q.id} className="space-y-4">
                                <div className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-black text-sm flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    <p className="font-bold text-[var(--foreground)] text-lg h-12 flex items-center">{q.question}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                    {['A', 'B', 'C', 'D'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleAnswer(q.id, opt)}
                                            className={`p-4 rounded-2xl text-left font-bold transition-all border-2 ${answers[q.id] === opt 
                                                ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]' 
                                                : 'bg-[var(--surface-hover)] border-transparent text-[var(--foreground)]/60 hover:border-[var(--foreground)]/10'}`}
                                        >
                                            <span className="inline-block w-6 text-xs opacity-40">{opt}.</span> {q[`option${opt}`]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting || Object.keys(answers).length < activeQuiz.questions.length}
                            className="btn-primary mt-10 disabled:opacity-50"
                        >
                            {isSubmitting ? "Envoi..." : "Terminer le quiz"}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--glass-border)] pb-4">
                <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                <h3 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight">Quiz & Exercices</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-[var(--surface-hover)] rounded-3xl">
                        <p className="font-bold text-[var(--foreground)]/40 uppercase tracking-widest text-[10px]">Aucun quiz disponible pour le moment</p>
                    </div>
                ) : quizzes.map((quiz) => (
                    <div key={quiz.id} className="glass-card hover:scale-[1.03] active:scale-95 transition-all group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[var(--accent)]/10 transition-colors pointer-events-none"></div>
                        
                        <div className="mb-6">
                            <span className="text-[10px] font-black bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                                {quiz.category}
                            </span>
                            <h4 className="font-black text-lg text-[var(--foreground)] line-clamp-2 min-h-[3.5rem]">{quiz.title}</h4>
                            <p className="text-[10px] font-bold text-[var(--foreground)]/40 mt-1 uppercase tracking-widest">
                                {quiz.questions?.length || 0} Questions • {quiz.timeLimit ? `${quiz.timeLimit} min` : 'Pas de limite'}
                            </p>
                        </div>

                        <button 
                            onClick={() => startQuiz(quiz)}
                            className="w-full py-4 rounded-2xl bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-[0.2em] text-xs hover:bg-[var(--accent)] hover:text-white transition-all shadow-xl shadow-[var(--foreground)]/10"
                        >
                            Démarrer
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
