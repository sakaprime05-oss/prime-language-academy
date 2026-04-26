"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth-actions";
import { signIn } from "next-auth/react";

const memberships = [
    { id: "loisir", name: "Social (1x/sem)", price: "50 000 FCFA" },
    { id: "essentiel", name: "Connect (2x/sem)", price: "70 000 FCFA" },
    { id: "equilibre", name: "Network (3x/sem)", price: "90 000 FCFA" },
    { id: "performance", name: "Executive (4x/sem)", price: "110 000 FCFA" },
    { id: "intensif", name: "Elite (5x/sem)", price: "130 000 FCFA" },
    { id: "immersion", name: "Founder (6x/sem)", price: "150 000 FCFA" }
];

const levels = ["Intermédiaire (B1/B2)", "Avancé (C1/C2)"];
const steps = ["Identité", "Profil", "Membership", "Validation"];

export default function RegisterClubForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        profession: "",
        company: "",
        level: "",
        planId: "essentiel",
        agreement: false,
        signature: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const name = target.name;
        const value = target.value;
        const type = target.type;
        
        if (type === "checkbox" && target instanceof HTMLInputElement) {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const nextStep = () => {
        setError("");
        if (step === 1 && (!formData.name || !formData.email || !formData.password || !formData.phone)) {
            setError("Veuillez remplir toutes vos informations.");
            return;
        }
        if (step === 2 && (!formData.profession || !formData.level)) {
            setError("Veuillez indiquer votre profession et votre niveau.");
            return;
        }
        if (step === 3 && !formData.planId) {
            setError("Veuillez choisir un membership.");
            return;
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError("");
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.agreement || !formData.signature) {
            setError("Veuillez accepter les conditions et signer.");
            return;
        }

        setLoading(true);

        const onboardingData = {
            type: "CLUB",
            profession: formData.profession,
            company: formData.company,
            level: formData.level,
            signature: formData.signature,
            phone: formData.phone
        };

        const form = new FormData();
        form.append("name", formData.name);
        form.append("email", formData.email);
        form.append("password", formData.password);
        form.append("planId", formData.planId);
        form.append("onboardingData", JSON.stringify(onboardingData));

        try {
            const res = await registerUser(form);
            if (res?.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            const signInResult = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (signInResult?.error) {
                setError("Compte créé mais connexion automatique échouée.");
                setLoading(false);
            } else {
                router.push("/dashboard/student/club");
                router.refresh();
            }
        } catch (err) {
            setError("Une erreur inattendue s'est produite.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-8 px-2">
                {steps.map((label, idx) => {
                    const isActive = step === idx + 1;
                    const isPassed = step > idx + 1;
                    return (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isActive ? 'bg-secondary text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110' :
                                isPassed ? 'bg-secondary/20 text-secondary' :
                                'bg-[var(--foreground)]/5 text-[var(--foreground)]/30'
                            }`}>
                                {isPassed ? '✓' : idx + 1}
                            </div>
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Nom Complet</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Email Pro / Personnel</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Téléphone (WhatsApp)</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+225 00 00 00 00 00" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Mot de passe</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••••" required />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Profession</label>
                        <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="input-field" placeholder="Ex: Entrepreneur, Manager..." required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Entreprise (Optionnel)</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-field" placeholder="Nom de votre structure" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Niveau Actuel</label>
                        <div className="grid grid-cols-1 gap-2">
                            {levels.map(lvl => (
                                <button type="button" key={lvl} onClick={() => setFormData({ ...formData, level: lvl })}
                                    className={`p-4 rounded-xl border text-left text-sm font-bold transition-all ${
                                        formData.level === lvl 
                                        ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                                        : 'border-[var(--foreground)]/10 text-[var(--foreground)]/60 hover:border-[var(--foreground)]/30'
                                    }`}>
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Choisissez votre Membership</label>
                    <div className="grid grid-cols-2 gap-3">
                        {memberships.map(plan => (
                            <button type="button" key={plan.id} onClick={() => setFormData({ ...formData, planId: plan.id })}
                                className={`p-4 rounded-xl border text-center transition-all ${
                                    formData.planId === plan.id 
                                    ? 'bg-secondary/10 border-secondary shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                                    : 'border-[var(--foreground)]/10 hover:border-secondary/30'
                                }`}>
                                <div className={`text-xs font-black mb-1 ${formData.planId === plan.id ? 'text-secondary' : 'text-[var(--foreground)]/70'}`}>{plan.name}</div>
                                <div className={`text-[10px] font-bold ${formData.planId === plan.id ? 'text-secondary/80' : 'text-[var(--foreground)]/40'}`}>{plan.price}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                        <h4 className="text-sm font-black text-secondary mb-2">Récapitulatif</h4>
                        <ul className="space-y-2 text-xs font-medium text-[var(--foreground)]/70">
                            <li><span className="opacity-50">Nom:</span> {formData.name}</li>
                            <li><span className="opacity-50">Profil:</span> {formData.profession} ({formData.level})</li>
                            <li><span className="opacity-50">Membership:</span> {memberships.find(p => p.id === formData.planId)?.name}</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} className="mt-1" />
                            <span className="text-xs text-[var(--foreground)]/60 leading-relaxed font-medium group-hover:text-[var(--foreground)]/80 transition-colors">
                                J'accepte les règles du Club (100% anglais, bienveillance, participation active).
                            </span>
                        </label>
                        
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Signature (Tapez votre nom)</label>
                            <input type="text" name="signature" value={formData.signature} onChange={handleChange} className="input-field font-serif italic text-lg text-secondary" placeholder="Votre signature" required />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-[var(--foreground)]/10">
                {step > 1 && (
                    <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-[var(--foreground)]/50 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors">
                        Retour
                    </button>
                )}
                {step < 4 ? (
                    <button type="button" onClick={nextStep} className="flex-1 btn-primary text-xs uppercase tracking-widest py-4">
                        Continuer
                    </button>
                ) : (
                    <button type="submit" disabled={loading} className="flex-1 btn-primary text-xs uppercase tracking-widest py-4 disabled:opacity-50 flex justify-center items-center gap-2">
                        {loading ? <span className="w-4 h-4 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin"></span> : "Rejoindre le Cercle"}
                    </button>
                )}
            </div>
        </form>
    );
}
