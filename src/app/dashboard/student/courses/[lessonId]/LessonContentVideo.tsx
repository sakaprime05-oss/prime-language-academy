"use client";

interface LessonContentVideoProps {
    url: string | null;
}

export default function LessonContentVideo({ url }: LessonContentVideoProps) {
    if (!url) return null;

    // Support YouTube embed logic if needed
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

    if (isYouTube) {
        let embedUrl = url;
        try {
            if (url.includes("watch?v=")) {
                embedUrl = url.replace("watch?v=", "embed/");
            } else if (url.includes("youtu.be/")) {
                embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
            }
            // Strip any query params from embedUrl and add ?rel=0
            embedUrl = embedUrl.split('&')[0];
        } catch (e) {
            console.error("Erreur de parsing YouTube URL", e);
        }

        return (
            <div className="aspect-video w-full">
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    return (
        <div className="aspect-video w-full bg-black flex items-center justify-center">
            <video
                src={url}
                controls
                className="w-full h-full"
                controlsList="nodownload"
            >
                Votre navigateur ne prend pas en charge la balise vidéo.
            </video>
        </div>
    );
}
