"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LangToggle({ currentLang }: { currentLang: string }) {
    const router = useRouter();

    const toggleLang = () => {
        const newLang = currentLang === "fr" ? "en" : "fr";
        document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
        router.refresh();
    };

    return (
        <Button 
            onClick={toggleLang} 
            variant="outline" 
            size="sm"
            className="rounded-full text-xs font-bold border-primary/20 text-primary hover:bg-primary/10"
        >
            {currentLang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
        </Button>
    );
}
