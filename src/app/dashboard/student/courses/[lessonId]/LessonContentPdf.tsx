"use client";

interface LessonContentPdfProps {
    url: string | null;
}

export default function LessonContentPdf({ url }: LessonContentPdfProps) {
    if (!url) return null;

    return (
        <div className="flex w-full flex-col bg-white/5">
            <div className="flex flex-col gap-3 border-b border-white/10 bg-black/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Support PDF</p>
                    <p className="mt-1 text-sm font-bold text-white/80">Ouvrez le document ici ou telechargez-le pour travailler hors ligne.</p>
                </div>
                <div className="flex gap-2">
                    <a href={url} target="_blank" rel="noreferrer" className="rounded-xl border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70 hover:border-white/30 hover:text-white">
                        Ouvrir
                    </a>
                    <a href={url} download className="rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:opacity-90">
                        Telecharger
                    </a>
                </div>
            </div>
            <div className="flex h-[70vh] min-h-[500px] w-full flex-col items-center justify-center">
            <object
                data={url}
                type="application/pdf"
                className="w-full h-full border-0"
            >
                <div className="p-10 text-center flex flex-col items-center justify-center gap-4">
                    <p className="text-[var(--foreground)]/60">
                        Votre navigateur ne peut pas afficher directement ce PDF.
                    </p>
                    <a href={url} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-2">
                        Télécharger le PDF
                    </a>
                </div>
            </object>
            </div>
        </div>
    );
}
