"use client";

import { Download, ExternalLink, FileText } from "lucide-react";

interface LessonContentPdfProps {
    url: string | null;
}

export default function LessonContentPdf({ url }: LessonContentPdfProps) {
    if (!url) {
        return (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 p-8 text-center">
                <FileText className="h-10 w-10 text-[var(--foreground)]/35" aria-hidden="true" />
                <p className="max-w-sm text-sm font-bold leading-6 text-[var(--foreground)]/55">
                    Ce support n'est pas encore disponible. Contactez l'equipe PLA si vous pensez qu'il manque.
                </p>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col bg-white/5">
            <div className="flex flex-col gap-3 border-b border-white/10 bg-black/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Support PDF</p>
                    <p className="mt-1 text-sm font-bold text-white/80">
                        Ouvrez le document en plein ecran ou telechargez-le pour travailler hors ligne.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70 transition-colors hover:border-white/30 hover:text-white"
                    >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Ouvrir
                    </a>
                    <a
                        href={url}
                        download
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                    >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Telecharger
                    </a>
                </div>
            </div>
            <div className="flex h-[70vh] min-h-[520px] w-full flex-col items-center justify-center bg-white">
                <object data={url} type="application/pdf" className="h-full w-full border-0">
                    <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
                        <p className="text-sm font-bold text-slate-600">
                            Votre navigateur ne peut pas afficher directement ce PDF.
                        </p>
                        <a href={url} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-2">
                            Ouvrir le PDF
                        </a>
                    </div>
                </object>
            </div>
        </div>
    );
}
