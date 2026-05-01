"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface AudioRecorderProps {
  questionId: number;
  onRecordingComplete: (questionId: number, blob: Blob, durationSec: number, transcript: string) => void;
}

export default function AudioRecorder({ questionId, onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (speechRecRef.current) {
        speechRecRef.current.stop();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000);
        setDuration(durationSec);
        setHasRecording(true);
        setIsRecording(false);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        onRecordingComplete(questionId, blob, durationSec, transcript);

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      startTimeRef.current = Date.now();
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setPermissionDenied(false);

      // Start Speech Recognition
      setTranscript("");
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRec) {
          const recognition = new SpeechRec();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US'; // We want them to speak English

          recognition.onresult = (event: any) => {
            let currentTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript;
            }
            setTranscript(currentTranscript);
          };

          recognition.onend = () => {
            setIsTranscribing(false);
          };

          recognition.start();
          speechRecRef.current = recognition;
          setIsTranscribing(true);
        }
      } catch (err) {
        console.warn("Speech recognition not supported or failed to start", err);
      }

      // Timer for visual feedback
      timerRef.current = setInterval(() => {
        setDuration(Math.round((Date.now() - startTimeRef.current) / 1000));
      }, 500);
    } catch {
      setPermissionDenied(true);
    }
  }, [questionId, onRecordingComplete, transcript]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (speechRecRef.current) {
      speechRecRef.current.stop();
    }
  }, []);

  const reRecord = useCallback(() => {
    setHasRecording(false);
    setDuration(0);
    setTranscript("");
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (permissionDenied) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-medium text-red-500 space-y-2">
        <p className="font-bold">⚠️ Accès au microphone refusé</p>
        <p>Veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur, puis réessayez.</p>
        <button
          type="button"
          onClick={() => setPermissionDenied(false)}
          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs hover:bg-red-500/20 transition-all"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Record / Stop button */}
        {!hasRecording && (
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
              isRecording
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
            }`}
          >
            {isRecording ? (
              <>
                <div className="w-3 h-3 rounded-sm bg-white" />
                Arrêter — {formatTime(duration)}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
                Enregistrer
              </>
            )}
          </button>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-widest text-red-500">Enregistrement en cours</span>
          </div>
        )}

        {/* Completed state */}
        {hasRecording && !isRecording && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Enregistré — {formatTime(duration)}
            </div>
            <button
              type="button"
              onClick={reRecord}
              className="px-4 py-2 rounded-xl bg-[var(--foreground)]/5 text-[var(--foreground)]/50 font-bold text-xs hover:bg-[var(--foreground)]/10 transition-all"
            >
              Réenregistrer
            </button>
          </div>
        )}
      </div>

      {/* Live Transcript / Transcription Result */}
      {(isTranscribing || transcript) && (
        <div className="mt-2 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="text-[10px] uppercase font-black tracking-widest text-primary/60 mb-2 flex items-center gap-2">
            <span>Retranscription (Speech-to-Text)</span>
            {isTranscribing && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
          </div>
          <p className="text-sm font-medium text-[var(--foreground)]/80 italic">
            {transcript || "En attente de votre voix..."}
          </p>
        </div>
      )}
    </div>
  );
}
