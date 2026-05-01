"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  testSections,
  TOTAL_TEST_POINTS,
  scoreMCQ,
  scoreShortAnswer,
  scoreAudioRecording,
  scoreWrittenExpression,
  getRecommendedLevel,
} from "./test-data";
import type { Question } from "./test-data";
import AudioPlayer from "./AudioPlayer";
import AudioRecorder from "./AudioRecorder";
import { evaluateTranscriptAction } from "@/app/actions/ai-grader";

type Answers = Record<number, string>;
type AudioData = Record<number, { blob: Blob; duration: number; transcript: string }>;

export default function PlacementTest() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [audioData, setAudioData] = useState<AudioData>({});
  const [testComplete, setTestComplete] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  const section = testSections[currentSection];
  const isLastSection = currentSection === testSections.length - 1;
  const isFirstSection = currentSection === 0;

  const handleAnswer = useCallback((questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleAudioRecording = useCallback(
    (questionId: number, blob: Blob, durationSec: number, transcript: string) => {
      setAudioData((prev) => ({ ...prev, [questionId]: { blob, duration: durationSec, transcript } }));
    },
    []
  );

  const [isCalculating, setIsCalculating] = useState(false);

  const calculateScores = useCallback(async () => {
    setIsCalculating(true);
    let total = 0;
    const scores: Record<string, number> = {};

    for (const sec of testSections) {
      let sectionScore = 0;

      for (const q of sec.questions) {
        if (q.points === 0) continue; // Info questions

        if (q.type === "mcq") {
          sectionScore += scoreMCQ(answers[q.id] || "", q);
        } else if (q.type === "short") {
          sectionScore += scoreShortAnswer(answers[q.id] || "", q);
        } else if (q.type === "audio-record") {
          const audio = audioData[q.id];
          const transcript = audio?.transcript || "";
          
          // Try AI Evaluation
          const aiScore = await evaluateTranscriptAction(transcript, q.question, q.points);
          
          if (aiScore !== null) {
            sectionScore += aiScore;
          } else {
            // Fallback to heuristic
            sectionScore += scoreAudioRecording(audio?.duration || 0, q.points, transcript);
          }
        } else if (q.type === "long-text") {
          const text = answers[q.id] || "";
          
          // Try AI Evaluation for long text too
          const aiScore = await evaluateTranscriptAction(text, q.question, q.points);
          
          if (aiScore !== null) {
            sectionScore += aiScore;
          } else {
            sectionScore += scoreWrittenExpression(text, q.points);
          }
        }
      }

      scores[sec.id] = sectionScore;
      total += sectionScore;
    }

    setTotalScore(total);
    setSectionScores(scores);
    setTestComplete(true);
    setIsCalculating(false);
  }, [answers, audioData]);

  useEffect(() => {
    if (testComplete || currentSection === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          calculateScores();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testComplete, currentSection, calculateScores]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNext = () => {
    // Validate that all questions in the current section are answered
    for (const q of section.questions) {
      if (q.type === "audio-record") {
        if (!audioData[q.id] || audioData[q.id].duration === 0) {
          alert(`Veuillez enregistrer une réponse pour la question : "${q.questionFr || q.question}"`);
          return;
        }
      } else {
        if (!answers[q.id] || !answers[q.id].trim()) {
          alert(`Veuillez répondre à la question : "${q.questionFr || q.question}"`);
          return;
        }
      }
    }

    if (isLastSection) {
      calculateScores();
    } else {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstSection) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleUseLevel = (level: string) => {
    // Build the return URL with level pre-selected
    const plan = searchParams.get("plan") || "";
    const returnUrl = `/register?level=${encodeURIComponent(level)}${plan ? `&plan=${plan}` : ""}`;
    router.push(returnUrl);
  };

  // ============================================================
  // RESULTS SCREEN
  // ============================================================
  if (testComplete) {
    const recommendation = getRecommendedLevel(totalScore);
    const percentage = Math.round((totalScore / TOTAL_TEST_POINTS) * 100);

    const colorMap: Record<string, string> = {
      emerald: "emerald-500",
      amber: "amber-500",
      violet: "violet-500",
    };
    const color = colorMap[recommendation.color] || "primary";

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Score Summary */}
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            Test terminé
          </div>

          {/* Score Circle */}
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-[var(--foreground)]/5"
              />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 3.27} 327`}
                className={`text-${color}`}
                style={{ transition: "stroke-dasharray 1.5s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[var(--foreground)]">{totalScore}</span>
              <span className="text-xs font-bold text-[var(--foreground)]/40">/ {TOTAL_TEST_POINTS}</span>
            </div>
          </div>

          <h2 className="text-3xl font-black text-[var(--foreground)]">
            Niveau recommandé :{" "}
            <span className={`text-${color}`}>{recommendation.level}</span>
          </h2>
          <p className="max-w-md mx-auto text-sm text-[var(--foreground)]/60 font-medium leading-relaxed">
            {recommendation.description}
          </p>
        </div>

        {/* Section Breakdown */}
        <div className="space-y-3">
          <h3 className="font-black text-sm text-[var(--foreground)]/60 uppercase tracking-widest">Détail par section</h3>
          {testSections.filter((s) => s.totalPoints > 0).map((sec) => (
            <div key={sec.id} className="flex items-center justify-between p-3 bg-[var(--foreground)]/5 rounded-xl">
              <div className="flex items-center gap-2">
                <span>{sec.icon}</span>
                <span className="text-sm font-bold text-[var(--foreground)]">{sec.title}</span>
              </div>
              <div className="text-sm font-black">
                <span className="text-primary">{sectionScores[sec.id] || 0}</span>
                <span className="text-[var(--foreground)]/30"> / {sec.totalPoints}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            type="button"
            onClick={() => handleUseLevel(recommendation.level)}
            className="btn-primary w-full"
          >
            ✓ Utiliser ce niveau ({recommendation.level}) et continuer l'inscription
          </button>

          {/* Let user override */}
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--foreground)]/30 mb-3">
              Ou choisir un autre niveau
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {["Débutant", "Intermédiaire", "Avancé"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleUseLevel(lvl)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    lvl === recommendation.level
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-[var(--foreground)]/5 text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/10"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-[var(--foreground)]/5">
               <button
                type="button"
                onClick={() => router.push("/")}
                className="text-xs font-bold text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors underline underline-offset-4"
              >
                Quitter et retourner à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // CALCULATING SCREEN
  // ============================================================
  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center animate-pulse">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-[var(--foreground)]">Analyse de vos réponses...</h3>
          <p className="text-sm text-[var(--foreground)]/50 font-medium">Notre intelligence artificielle évalue votre niveau d'anglais.</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // TEST IN PROGRESS
  // ============================================================
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
          <span>Section {currentSection + 1} / {testSections.length}</span>
          <div className="flex items-center gap-4">
            {currentSection > 0 && (
              <span className={`px-2 py-1 rounded-md font-bold text-xs ${timeLeft < 180 ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                ⏱ {formatTime(timeLeft)}
              </span>
            )}
            <span>{section.icon} {section.title}</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-[var(--foreground)]/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${((currentSection + 1) / testSections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-black text-[var(--foreground)] flex items-center gap-2">
          {section.icon} {section.title}
          {section.totalPoints > 0 && (
            <span className="text-xs font-bold text-[var(--foreground)]/30">({section.totalPoints} pts)</span>
          )}
        </h2>
        {section.description && (
          <p className="text-sm text-[var(--foreground)]/60 font-medium">{section.description}</p>
        )}
      </div>

      {/* Reading Passage */}
      {section.readingPassage && (
        <div className="p-5 bg-primary/5 border border-primary/15 rounded-2xl">
          <p className="text-sm font-medium leading-relaxed text-[var(--foreground)]/80 italic">
            &ldquo;{section.readingPassage}&rdquo;
          </p>
        </div>
      )}

      {/* Audio Player for Listening */}
      {section.audioText && (
        <AudioPlayer text={section.audioText} />
      )}

      {/* Questions */}
      <div className="space-y-6">
        {section.questions.map((q, qIndex) => (
          <QuestionCard
            key={q.id}
            question={q}
            questionIndex={qIndex}
            answer={answers[q.id] || ""}
            onAnswer={handleAnswer}
            audioData={audioData[q.id]}
            onAudioRecording={handleAudioRecording}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t border-[var(--foreground)]/5">
        {!isFirstSection && (
          <button
            type="button"
            onClick={handlePrev}
            className="px-6 py-4 rounded-xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all"
          >
            ← Précédent
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary flex-1"
        >
          {isLastSection ? "Voir mes résultats →" : "Section suivante →"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// QUESTION CARD COMPONENT
// ============================================================
interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  answer: string;
  onAnswer: (questionId: number, value: string) => void;
  audioData?: { blob: Blob; duration: number; transcript: string };
  onAudioRecording: (questionId: number, blob: Blob, durationSec: number, transcript: string) => void;
}

function QuestionCard({ question, questionIndex, answer, onAnswer, audioData, onAudioRecording }: QuestionCardProps) {
  const q = question;

  return (
    <div className="space-y-3 p-4 bg-[var(--foreground)]/[0.02] rounded-2xl border border-[var(--foreground)]/5">
      {/* Question text */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-[var(--foreground)]/30 uppercase tracking-widest">
            Q{q.id}
          </span>
          {q.points > 0 && (
            <span className="text-[9px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
              {q.points} pt{q.points > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-[var(--foreground)]">{q.question}</p>
        {q.questionFr && (
          <p className="text-xs text-[var(--foreground)]/40 italic">{q.questionFr}</p>
        )}
      </div>

      {/* MCQ Options */}
      {q.type === "mcq" && q.options && (
        <div className="grid grid-cols-1 gap-2">
          {q.options.map((option) => (
            <label
              key={option}
              className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                answer === option
                  ? "bg-primary/10 border-primary text-[var(--foreground)]"
                  : "bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20"
              }`}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value={option}
                checked={answer === option}
                onChange={() => onAnswer(q.id, option)}
                className="accent-primary"
              />
              <span className="font-medium">{option}</span>
            </label>
          ))}
        </div>
      )}

      {/* Short Answer */}
      {q.type === "short" && q.points > 0 && (
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          placeholder="Votre réponse en anglais..."
          className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-medium"
        />
      )}

      {/* Short Answer (info only, no scoring) */}
      {q.type === "short" && q.points === 0 && (
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          placeholder={q.id === 1 ? "Ex: Jean Dupont" : "Ex: +225 01 XX XX XX XX"}
          className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-medium"
        />
      )}

      {/* Audio Recording */}
      {q.type === "audio-record" && (
        <AudioRecorder
          questionId={q.id}
          onRecordingComplete={onAudioRecording}
        />
      )}

      {/* Long Text */}
      {q.type === "long-text" && (
        <textarea
          value={answer}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          rows={5}
          placeholder="Write your answer in English..."
          className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none font-medium resize-none"
        />
      )}
    </div>
  );
}
