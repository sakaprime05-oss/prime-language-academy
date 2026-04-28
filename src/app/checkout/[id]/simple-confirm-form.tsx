"use client";

import { useState, useRef } from "react";
import { confirmWavePayment } from "@/app/actions/payments";
import { UploadCloud, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";

export default function SimpleConfirmForm({ transactionId }: { transactionId: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError("");
        }
    };

    const handleConfirm = async () => {
        if (!file) {
            setError("Veuillez importer la capture d'écran de votre reçu Wave.");
            return;
        }

        setLoading(true);
        setError("");
        
        const formData = new FormData();
        formData.append("transactionId", transactionId);
        formData.append("proof", file);

        const result = await confirmWavePayment(formData);
        
        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // L'état de la transaction a changé en base, un rechargement affichera la page de succès
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6 flex flex-col h-full justify-center">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold text-center">
                    {error}
                </div>
            )}
            
            <div className="space-y-4">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        file 
                        ? 'border-green-500 bg-green-500/5' 
                        : 'border-[var(--foreground)]/20 hover:border-primary bg-[var(--foreground)]/5'
                    }`}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    
                    {file ? (
                        <div className="flex flex-col items-center text-green-500">
                            <CheckCircle2 className="w-8 h-8 mb-2" />
                            <span className="text-sm font-bold truncate max-w-[200px]">{file.name}</span>
                            <span className="text-xs opacity-70 mt-1 cursor-pointer underline">Changer l'image</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-[var(--foreground)]/60">
                            <UploadCloud className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm font-bold">Importez votre capture d'écran</span>
                            <span className="text-xs opacity-50 mt-1">PNG, JPG ou JPEG</span>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleConfirm}
                disabled={loading || !file}
                className="w-full flex items-center justify-center gap-2 py-5 bg-[#E7162A] hover:bg-[#c41222] text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-[#E7162A]/25 active:scale-95 disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                    <>
                        <ImageIcon className="w-5 h-5" />
                        Envoyer ma preuve de paiement
                    </>
                )}
            </button>
            <p className="text-center text-[10px] text-[var(--foreground)]/40 uppercase tracking-widest font-black mt-2">
                Format image uniquement
            </p>
        </div>
    );
}
