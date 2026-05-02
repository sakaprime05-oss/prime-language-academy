"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth-actions";
import { PLA_PLANS, PLA_TIME_SLOTS, formatFcfa } from "@/lib/pla-program";

const planSessions: Record<string, number> = {
    "loisir": 1,
    "essentiel": 2,
    "equilibre": 3,
    "performance": 4,
    "intensif": 5,
    "immersion": 6
};

const plans = [
    { id: "loisir", name: "Loisir (1 seance/sem)", price: formatFcfa(PLA_PLANS[0].price), desc: "Initiation ou contact leger" },
    { id: "essentiel", name: "Essentiel (2 seances/sem)", price: formatFcfa(PLA_PLANS[1].price), desc: "Construction des bases" },
    { id: "equilibre", name: "Equilibre (3 seances/sem)", price: formatFcfa(PLA_PLANS[2].price), desc: "Pratique reguliere" },
    { id: "performance", name: "Performance (4 seances/sem)", price: formatFcfa(PLA_PLANS[3].price), desc: "Resultats tangibles" },
    { id: "intensif", name: "Intensif (5 seances/sem)", price: formatFcfa(PLA_PLANS[4].price), desc: "Transformation radicale" },
    { id: "immersion", name: "Immersion (6 seances/sem)", price: formatFcfa(PLA_PLANS[5].price), desc: "Maitrise totale" }
];

const availableDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const objectives = [
    "Travail / carrière", "Voyage", "Études",
    "Business / entrepreneuriat", "Développement personnel", "Autre"
];

const communes = [
    "Abobo", "Adjamé", "Attécoubé", "Bingerville", "Cocody", 
    "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Treichville", 
    "Yopougon", "Autre"
];

const levels = ["Débutant", "Intermédiaire", "Avancé"];

const timeSlots = PLA_TIME_SLOTS.map((slot) => ({ id: slot.id, name: `${slot.label} (${slot.time})` }));

const steps = ["Infos requises", "Objectifs", "Formule & Jours", "Engagement"];

function RegisterFormContent({ systemSettings }: { systemSettings?: any }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "available" | "pending" | "taken">("idle");
    const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [formData, setFormData] = useState({
        type: "FORMATION",
        name: "",
        dob: "",
        profession: "",
        company: "",
        phone: "",
        email: "",
        commune: "",
        communeOther: "",
        password: "",

        objective: "",
        objectiveOther: "",
        level: searchParams.get("level") || "",

        planId: searchParams.get("plan") || "essentiel",
        courseMode: "PRESENTIEL", // PRESENTIEL, ONLINE
        studentType: "INDIVIDUEL", // INDIVIDUEL, ENTREPRISE
        days: [] as string[],
        timeSlot: "",

        paymentOption: "total",
        agreement: false,
        signature: "",
        signDate: new Date().toISOString().split("T")[0]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const name = target.name;
        const value = target.value;
        const type = target.type;
        
        if (type === "checkbox" && target instanceof HTMLInputElement) {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => {
                const newData = { ...prev, [name]: value };
                if (name === "planId") {
                    newData.days = []; // Reset days when plan changes to ensure correct count
                }
                return newData;
            });
        }

        // Real-time email check with debounce
        if (name === "email") {
            setEmailStatus("idle");
            if (emailDebounceRef.current) clearTimeout(emailDebounceRef.current);
            const trimmed = value.trim();
            if (trimmed.includes("@") && trimmed.length > 5) {
                setEmailStatus("checking");
                emailDebounceRef.current = setTimeout(async () => {
                    try {
                        const res = await fetch(`/api/check-email?email=${encodeURIComponent(trimmed)}`);
                        const data = await res.json();
                        setEmailStatus(data.canResumePayment ? "pending" : data.exists ? "taken" : "available");
                    } catch {
                        setEmailStatus("idle");
                    }
                }, 600);
            }
        }
    };

    const handleDayToggle = (day: string) => {
        const maxSessions = planSessions[formData.planId] || 2;
        setFormData(prev => {
            if (prev.days.includes(day)) {
                return { ...prev, days: prev.days.filter(d => d !== day) };
            }
            if (prev.days.length >= maxSessions) {
                setError(`Votre formule ne permet de choisir que ${maxSessions} jour(s).`);
                return prev;
            }
            setError("");
            return { ...prev, days: [...prev.days, day] };
        });
    };

    const nextStep = () => {
        setError("");
        if (step === 1 && (!formData.name || !formData.email || !formData.password || !formData.phone)) {
            setError("Veuillez remplir les informations obligatoires (Nom, Email, Téléphone, Mot de passe).");
            return;
        }
        if (step === 1 && emailStatus === "taken") {
            setError("Cet email est déjà associé à un compte. Veuillez vous connecter ou utiliser un autre email.");
            return;
        }
        if (step === 2 && (!formData.objective || !formData.level)) {
            setError("Veuillez choisir un objectif et un niveau d'anglais.");
            return;
        }
        const requiredDays = planSessions[formData.planId] || 2;
        if (step === 3 && (formData.days.length !== requiredDays || !formData.timeSlot)) {
            setError(`Veuillez choisir exactement ${requiredDays} jour(s) de base et un créneau horaire.`);
            return;
        }
        setStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setError("");
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.agreement || !formData.signature) {
            setError("Veuillez signer et accepter les conditions d'engagement.");
            setLoading(false);
            return;
        }

        const finalData = {
            ...formData,
            objective: formData.objective === "Autre" ? formData.objectiveOther : formData.objective,
            commune: formData.commune === "Autre" ? formData.communeOther : formData.commune
        };

        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("email", formData.email);
        submitData.append("password", formData.password);
        submitData.append("planId", formData.planId);
        submitData.append("onboardingData", JSON.stringify(finalData));

        const result = await registerUser(submitData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            if (result.redirectUrl) {
                if (result.redirectUrl.startsWith("http")) {
                    window.location.href = result.redirectUrl;
                } else {
                    router.push(result.redirectUrl);
                }
            } else {
                router.push("/dashboard");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 px-2 overflow-x-auto pb-4 gap-2 scrollbar-none">
                {steps.map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = step >= stepNum;
                    const isCurrent = step === stepNum;
                    return (
                        <div key={idx} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-[60px]">
                            <div className={`flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-[var(--foreground)]/40'}`}>
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-[var(--foreground)]/10 text-[var(--foreground)]/60 border border-[var(--foreground)]/20'}`}>
                                    {stepNum}
                                </div>
                                <span className={`text-[7px] sm:text-[9px] uppercase tracking-widest text-center truncate max-w-[60px] sm:max-w-full ${isCurrent ? 'font-black opacity-100' : 'font-bold opacity-60'}`}>{label}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`flex-1 h-px mt-[-15px] ${isActive ? 'bg-primary/50' : 'bg-[var(--foreground)]/20'}`}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="p-4 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: Informations Personnelles */}
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h3 className="font-black text-[var(--foreground)] text-lg mb-2">1. Informations personnelles</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black px-1 text-[var(--foreground)]/40 uppercase tracking-[0.2em]">Nom et Prénoms *</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)] font-medium" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black px-1 text-[var(--foreground)]/60 uppercase tracking-[0.2em]">Date de naissance</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black px-1 text-[var(--foreground)]/60 uppercase tracking-[0.2em]">Téléphone *</label>
                                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black px-1 text-[var(--foreground)]/60 uppercase tracking-[0.2em]">Email *</label>
                                <div className="relative">
                                    <input
                                        type="email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        className={`w-full bg-[var(--foreground)]/5 border rounded-xl px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)] transition-colors ${
                                            emailStatus === "taken" ? "border-red-500/70 bg-red-500/5" :
                                            emailStatus === "available" ? "border-green-500/70 bg-green-500/5" :
                                            emailStatus === "pending" ? "border-amber-500/70 bg-amber-500/5" :
                                            "border-[var(--foreground)]/20"
                                        }`}
                                    />
                                    {/* Email status indicator */}
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {emailStatus === "checking" && (
                                            <span className="w-4 h-4 border-2 border-indigo-500/40 border-t-indigo-500 rounded-full animate-spin block" />
                                        )}
                                        {emailStatus === "available" && (
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {emailStatus === "taken" && (
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                        {emailStatus === "pending" && (
                                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                {emailStatus === "taken" && (
                                    <p className="text-[11px] text-red-500 font-bold px-1 mt-1 flex items-center gap-1">
                                        <span>⚠️</span> Email déjà utilisé.
                                        <a href="/login" className="underline hover:text-red-400">Se connecter ?</a>
                                    </p>
                                )}
                                {emailStatus === "available" && (
                                    <p className="text-[11px] text-green-600 font-bold px-1 mt-1">✓ Email disponible</p>
                                )}
                                {emailStatus === "pending" && (
                                    <p className="text-[11px] text-amber-600 font-bold px-1 mt-1">
                                        Inscription deja creee. Continuez avec le meme mot de passe pour reprendre le paiement.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black px-1 text-[var(--foreground)]/60 uppercase tracking-[0.2em]">Profession</label>
                                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black px-1 text-[var(--foreground)]/60 uppercase tracking-[0.2em]">Entreprise / Institution</label>
                                <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black px-1 text-[var(--foreground)]/60 uppercase tracking-[0.2em]">Commune de résidence</label>
                                <select name="commune" value={formData.commune} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)]">
                                    <option value="" disabled>Sélectionner une commune</option>
                                    {communes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            {formData.commune === "Autre" && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black px-1 text-[var(--foreground)]/60 uppercase tracking-[0.2em]">Précisez</label>
                                    <input type="text" name="communeOther" value={formData.communeOther} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)]" placeholder="Votre ville/quartier" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-1 pt-2">
                            <label className="text-[10px] font-black px-1 text-[var(--foreground)]/60 uppercase tracking-[0.2em]">Mot de passe (Compte) *</label>
                            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--foreground)]" placeholder="••••••••" />
                        </div>

                        <button type="button" onClick={nextStep} className="btn-primary w-full mt-6">Suivant →</button>
                    </div>
                )}

                {/* STEP 2: Objectif & Niveau */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-3">
                            <h3 className="font-black text-[var(--foreground)] text-lg">2. Objectif principal</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {objectives.map(obj => (
                                    <label key={obj} className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${formData.objective === obj ? 'bg-primary/10 border-primary text-[var(--foreground)]' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                        <input type="radio" name="objective" value={obj} checked={formData.objective === obj} onChange={handleChange} className="accent-primary" />
                                        <span className="font-bold">{obj}</span>
                                    </label>
                                ))}
                            </div>
                            {formData.objective === "Autre" && (
                                <input type="text" name="objectiveOther" placeholder="Précisez votre objectif..." value={formData.objectiveOther} onChange={handleChange} className="w-full mt-2 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                            )}
                        </div>


                        <div className="space-y-3 pt-4 border-t border-[var(--foreground)]/10">
                            <h3 className="font-black text-[var(--foreground)] text-lg">3. Niveau en anglais</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {levels.map(lvl => (
                                    <label key={lvl} className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm cursor-pointer transition-all ${formData.level === lvl ? 'bg-primary/10 border-primary text-[var(--foreground)]' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                        <input type="radio" name="level" value={lvl} checked={formData.level === lvl} onChange={handleChange} className="accent-primary w-4 h-4" />
                                        <span className="font-black">{lvl}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Placement Test CTA */}
                            <div className="mt-4 p-5 bg-indigo-500/10 border-2 border-indigo-500/30 rounded-2xl shadow-lg shadow-indigo-500/5">
                                <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                                    <span className="text-xl">🤔</span> Vous ne connaissez pas votre niveau ?
                                </p>
                                <p className="text-xs font-bold text-[var(--foreground)]/70 mb-4 leading-relaxed">
                                    Passez notre test de placement gratuit pour découvrir votre profil linguistique exact !
                                </p>
                                <Link
                                    href={`/placement-test${formData.planId ? `?plan=${formData.planId}` : ''}`}
                                    className="flex items-center justify-center gap-2 w-full px-5 py-4 rounded-xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-indigo-600/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Lancer le Test de Placement
                                </Link>
                            </div>
                        </div>


                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all">Retour</button>
                            <button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Formule & Jours */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {/* Type & Mode */}
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <h3 className="font-black text-[var(--foreground)] text-lg">Type d'étudiant</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className={`flex items-center justify-center p-3 rounded-xl border text-sm font-bold cursor-pointer transition-all ${formData.studentType === 'INDIVIDUEL' ? 'bg-primary/10 border-primary text-primary' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20 text-[var(--foreground)]/60'}`}>
                                        <input type="radio" name="studentType" value="INDIVIDUEL" checked={formData.studentType === 'INDIVIDUEL'} onChange={handleChange} className="sr-only" />
                                        Particulier
                                    </label>
                                    {(systemSettings?.enableCorporateRegistration ?? true) && (
                                        <label className={`flex items-center justify-center p-3 rounded-xl border text-sm font-bold cursor-pointer transition-all ${formData.studentType === 'ENTREPRISE' ? 'bg-primary/10 border-primary text-primary' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20 text-[var(--foreground)]/60'}`}>
                                            <input type="radio" name="studentType" value="ENTREPRISE" checked={formData.studentType === 'ENTREPRISE'} onChange={handleChange} className="sr-only" />
                                            Entreprise
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-[var(--foreground)]/10">
                                <h3 className="font-black text-[var(--foreground)] text-lg">Format des cours</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className={`flex items-center justify-center p-3 rounded-xl border text-sm font-bold cursor-pointer transition-all ${formData.courseMode === 'PRESENTIEL' ? 'bg-primary/10 border-primary text-primary' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20 text-[var(--foreground)]/60'}`}>
                                        <input type="radio" name="courseMode" value="PRESENTIEL" checked={formData.courseMode === 'PRESENTIEL'} onChange={handleChange} className="sr-only" />
                                        Présentiel
                                    </label>
                                    {(systemSettings?.enableOnlineRegistration ?? true) && (
                                        <label className={`flex items-center justify-center p-3 rounded-xl border text-sm font-bold cursor-pointer transition-all ${formData.courseMode === 'ONLINE' ? 'bg-primary/10 border-primary text-primary' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20 text-[var(--foreground)]/60'}`}>
                                            <input type="radio" name="courseMode" value="ONLINE" checked={formData.courseMode === 'ONLINE'} onChange={handleChange} className="sr-only" />
                                            En Ligne
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-[var(--foreground)]/10">
                            <h3 className="font-black text-[var(--foreground)] text-lg">Formule choisie</h3>
                            <div className="space-y-2">
                                {plans.map(plan => (
                                    <label key={plan.id} className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${formData.planId === plan.id ? 'bg-primary/10 border-primary' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="planId" value={plan.id} checked={formData.planId === plan.id} onChange={handleChange} className="accent-primary" />
                                            <span className="font-black text-[var(--foreground)] text-sm">{plan.name}</span>
                                        </div>
                                        <div className="ml-7 mt-1 text-xs text-[var(--foreground)]/60 font-medium"> Organisation : {plan.desc}</div>
                                        <div className="ml-7 mt-2 font-black text-primary text-sm">{plan.price}</div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-[var(--foreground)]/10">
                            <h3 className="font-black text-[var(--foreground)] text-lg">5. Créneau Horaire</h3>
                            <p className="text-xs text-[var(--foreground)]/60 mb-2">Choisissez votre vague horaire préférée.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {timeSlots.map(slot => (
                                    <label key={slot.id} className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${formData.timeSlot === slot.id ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-500' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                        <input type="radio" name="timeSlot" value={slot.id} checked={formData.timeSlot === slot.id} onChange={handleChange} className="accent-indigo-500" />
                                        <span className="font-bold">{slot.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-[var(--foreground)]/10">
                            <h3 className="font-black text-[var(--foreground)] text-lg">6. Jours de base</h3>
                            <p className="text-xs text-[var(--foreground)]/60 mb-2">Choisissez vos jours de base ({planSessions[formData.planId]} jour{planSessions[formData.planId] > 1 ? 's' : ''} requis).</p>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {availableDays.map(day => (
                                    <label key={day} className={`flex items-center gap-2 p-3 rounded-xl border text-sm cursor-pointer transition-all ${formData.days.includes(day) ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-500' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10 hover:border-[var(--foreground)]/20'}`}>
                                        <input type="checkbox" checked={formData.days.includes(day)} onChange={() => handleDayToggle(day)} className="accent-indigo-500 border-indigo-500/50 rounded" />
                                        <span className="font-bold">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all">Retour</button>
                            <button type="button" onClick={nextStep} className="btn-primary flex-1">Suivant →</button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Paiement & Contrat */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-3">
                            <h3 className="font-black text-[var(--foreground)] text-lg">6. Modalités de paiement</h3>
                            <div className="flex flex-col gap-2">
                                <label className={`flex p-4 rounded-xl border cursor-pointer transition-all gap-3 ${formData.paymentOption === 'total' ? 'bg-primary/5 border-primary' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10'}`}>
                                    <input type="radio" name="paymentOption" value="total" checked={formData.paymentOption === 'total'} onChange={handleChange} className="accent-primary mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-sm">Paiement Total</span>
                                        <span className="text-xs text-[var(--foreground)]/60 mt-1 block">Règlement du coût total de la formation dès l'inscription.</span>
                                    </div>
                                </label>
                                <label className={`flex p-4 rounded-xl border cursor-pointer transition-all gap-3 ${formData.paymentOption === 'fractionne' ? 'bg-primary/5 border-primary' : 'bg-[var(--foreground)]/5 border-[var(--foreground)]/10'}`}>
                                    <input type="radio" name="paymentOption" value="fractionne" checked={formData.paymentOption === 'fractionne'} onChange={handleChange} className="accent-primary mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-sm">Paiement en 2 fois (Fractionné)</span>
                                        <span className="text-xs text-[var(--foreground)]/60 mt-1 block">Payez 50% maintenant pour valider l'inscription, et les 50% restants avant le début de la formation.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[var(--foreground)]/10">
                            <h3 className="font-black text-[var(--foreground)] text-lg">7. Règles et Engagement</h3>

                            <div className="bg-slate-900 text-white p-5 rounded-xl text-xs font-bold leading-relaxed border-l-4 border-primary shadow-lg shadow-black/10">
                                <ul className="list-disc pl-4 space-y-2">
                                    <li>L'inscription offerte est réservée aux premiers inscrits.</li>
                                    <li>Le solde total doit obligatoirement être réglé avant le début de la formation.</li>
                                    <li><strong>Condition de remboursement :</strong> En cas d'annulation notifiée avant le début de la formation, un remboursement est possible. Aucun remboursement ne sera effectué une fois les cours commencés.</li>
                                    <li>Les supports pédagogiques sont offerts au format numérique.</li>
                                    <li>La présence régulière est indispensable pour obtenir l'attestation.</li>
                                </ul>
                            </div>

                            <label className="flex items-start gap-3 p-3 cursor-pointer group">
                                <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} className="accent-primary mt-1" />
                                <span className="text-xs text-[var(--foreground)]/80 group-hover:text-[var(--foreground)] font-bold transition-colors">Je confirme mon inscription au programme English Mastery et m'engage à respecter les règles de participation.</span>
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black px-1 text-[var(--foreground)]/40 uppercase tracking-[0.2em]">Signature (Nom complet) *</label>
                                    <input type="text" name="signature" required value={formData.signature} onChange={handleChange} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)] outline-none" placeholder="Ex: Jean Dupont" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black px-1 text-[var(--foreground)]/40 uppercase tracking-[0.2em]">Date</label>
                                    <input type="date" name="signDate" disabled value={formData.signDate} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 opacity-70 rounded-xl px-4 py-3 text-sm outline-none cursor-not-allowed" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-[var(--foreground)]/10">
                            <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all">Retour</button>
                            <button type="submit" className="btn-primary flex-1" disabled={loading}>
                                {loading ? "Création en cours..." : "Valider l'inscription"}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default function RegisterForm({ systemSettings }: { systemSettings?: any }) {
    return (
        <Suspense fallback={<div className="text-center py-10 opacity-50">Chargement...</div>}>
            <RegisterFormContent systemSettings={systemSettings} />
        </Suspense>
    );
}
