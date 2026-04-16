"use client";

interface LessonContentPdfProps {
    url: string | null;
}

export default function LessonContentPdf({ url }: LessonContentPdfProps) {
    if (!url) return null;

    return (
        <div className="w-full h-[70vh] min-h-[500px] bg-white/5 flex flex-col items-center justify-center">
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
    );
}
