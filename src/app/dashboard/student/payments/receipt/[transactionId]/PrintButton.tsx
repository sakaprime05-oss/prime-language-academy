"use client";

import { useEffect } from "react";

export default function PrintButton() {
    useEffect(() => {
        // Optional: auto-print on load after a slight delay
        const timer = setTimeout(() => {
            window.print();
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <button 
            onClick={() => window.print()} 
            className="fixed bottom-8 right-8 bg-black text-white px-6 py-3 rounded-full font-black tracking-widest uppercase text-xs shadow-2xl flex items-center gap-2 hover:bg-black/80 transition-all print:hidden z-50"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Imprimer / PDF
        </button>
    );
}
