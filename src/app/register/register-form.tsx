"use client";

import { useEffect, useState, Suspense, useRef } from "react";
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
    { id: "loisir", name: "Loisir (1 séance/sem)", price: formatFcfa(PLA_PLANS[0].price), desc: "Initiation ou contact léger" },
    { id: "essentiel", name: "Essentiel (2 séances/sem)", price: formatFcfa(PLA_PLANS[1].price), desc: "Construction des bases" },
    { id: "equilibre", name: "Équilibre (3 séances/sem)", price: formatFcfa(PLA_PLANS[2].price), desc: "Pratique régulière" },
    { id: "performance", name: "Performance (4 séances/sem)", price: formatFcfa(PLA_PLANS[3].price), desc: "Résultats tangibles" },
    { id: "intensif", name: "Intensif (5 séances/sem)", price: formatFcfa(PLA_PLANS[4].price), desc: "Transformation radicale" },
    { id: "immersion", name: "Immersion (6 séances/sem)", price: formatFcfa(PLA_PLANS[5].price), desc: "Maîtrise totale" }
];

const paymentMethods = [
    { id: "WAVE", name: "Wave", detail: "Prioritaire à Abidjan" },
    { id: "MOBILE_MONEY", name: "Mobile Money", detail: "Orange Money, MTN ou Moov" },
    { id: "CARD", name: "Carte bancaire", detail: "Visa ou Mastercard" },
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

const steps = ["Profil", "Objectifs", "Formule", "Paiement"];
const fieldLabelClass = "px-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--foreground)]/55";
const fieldClass = "w-full rounded-lg border border-[var(--foreground)]/15 bg-white/60 px-3 py-2.5 text-sm font-medium text-[var(--foreground)] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 dark:bg-white/5";
const choiceClass = "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors";
const actionBarClass = "sticky bottom-2 z-20 grid grid-cols-[0.82fr_1.18fr] gap-2 rounded-lg border border-[var(--foreground)]/10 bg-[var(--background)]/90 p-2 shadow-lg shadow-black/10 backdrop-blur sm:static sm:grid-cols-[0.8fr_1.2fr] sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none";
const backButtonClass = "min-h-12 rounded-lg bg-[var(--foreground)]/6 px-3 py-3 text-sm font-black text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/10";

function RegisterFormContent({ systemSettings }: { systemSettings?: any }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "available" | "pending" | "taken">("idle");
    const emailDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const formTopRef = useRef<HTMLDivElement | null>(null);

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
        paymentMethod: "WAVE",
        agreement: false,
        signature: "",
        signDate: new Date().toISOString().split("T")[0]
    });

    const selectedPlan = plans.find((plan) => plan.id === formData.planId) || plans[1];
    const selectedPlanAmount = PLA_PLANS.find((plan) => plan.id === formData.planId)?.price || PLA_PLANS[1].price;
    const selectedPaymentMethod = paymentMethods.find((method) => method.id === formData.paymentMethod) || paymentMethods[0];
    const immediateAmount = formData.paymentOption === "fractionne" ? selectedPlanAmount * 0.5 : selectedPlanAmount;
    const reservationAmount = selectedPlanAmount - immediateAmount;
    const shouldShowAccountRecovery =
        error.toLowerCase().includes("email") ||
        error.toLowerCase().includes("mot de passe") ||
        error.toLowerCase().includes("paiement");

    useEffect(() => {
        formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [step]);

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
            formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        if (step === 1 && emailStatus === "taken") {
            setError("Cet email est déjà associé à un compte. Veuillez vous connecter ou utiliser un autre email.");
            formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        if (step === 2 && (!formData.objective || !formData.level)) {
            setError("Veuillez choisir un objectif et un niveau d'anglais.");
            formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        const requiredDays = planSessions[formData.planId] || 2;
        if (step === 3 && (formData.days.length !== requiredDays || !formData.timeSlot)) {
            setError(`Veuillez choisir exactement ${requiredDays} jour(s) de base et un créneau horaire.`);
            formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <div ref={formTopRef} className="scroll-mt-4 space-y-4 sm:space-y-6">
            {/* Step Indicator */}
            <div className="mb-4 space-y-2 sm:mb-8">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-primary">
                        Étape {step} sur 4
                    </p>
                    <p className="truncate text-right text-[11px] font-bold text-[var(--foreground)]/55">
                        {steps[step - 1]}
                    </p>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                    {steps.map((label, idx) => {
                        const stepNum = idx + 1;
                        const isActive = step >= stepNum;
                        return (
                            <div
                                key={label}
                                className={`h-2 rounded-full transition-colors ${isActive ? "bg-primary" : "bg-[var(--foreground)]/12"}`}
                            />
                        );
                    })}
                </div>
            </div>

            {error && (
                <div className="space-y-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-bold text-red-500">
                    <p>{error}</p>
                    {shouldShowAccountRecovery && (
                        <div className="flex flex-wrap justify-center gap-2">
                            <Link href="/login" className="rounded-lg bg-red-500 px-3 py-2 uppercase tracking-widest text-white">
                                Se connecter
                            </Link>
                            <Link href="/forgot-password" className="rounded-lg border border-red-500/30 px-3 py-2 uppercase tracking-widest">
                                Mot de passe oublié
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* STEP 1: Informations Personnelles */}
                {step === 1 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-4 sm:space-y-4">
                        <h3 className="mb-1 text-lg font-black text-[var(--foreground)]">1. Informations personnelles</h3>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className={fieldLabelClass}>Nom et Prénoms *</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className={fieldClass} />
                            </div>
                            <div className="space-y-1">
                                <label className={fieldLabelClass}>Date de naissance</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={fieldClass} />
                            </div>
                            <div className="space-y-1">
                                <label className={fieldLabelClass}>Téléphone *</label>
                                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={fieldClass} />
                            </div>
                            <div className="space-y-1">
                                <label className={fieldLabelClass}>Email *</label>
                                <div className="relative">
                                    <input
                                        type="email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        className={`${fieldClass} pr-10 ${
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
                                        Inscription déjà créée. Continuez avec le même mot de passe pour reprendre le paiement.
                                        <Link href="/forgot-password" className="ml-1 underline">Mot de passe oublié ?</Link>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className={fieldLabelClass}>Profession</label>
                                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={fieldClass} />
                            </div>
                            <div className="space-y-1">
                                <label className={fieldLabelClass}>Entreprise / Institution</label>
                                <input type="text" name="company" value={formData.company} onChange={handleChange} className={fieldClass} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className={fieldLabelClass}>Commune de résidence</label>
                                <select name="commune" value={formData.commune} onChange={handleChange} className={fieldClass}>
                                    <option value="" disabled>Sélectionner une commune</option>
                                    {communes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            {formData.commune === "Autre" && (
                                <div className="space-y-1">
                                    <label className={fieldLabelClass}>Précisez</label>
                                    <input type="text" name="communeOther" value={formData.communeOther} onChange={handleChange} className={fieldClass} placeholder="Votre ville/quartier" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-1 pt-1">
                            <label className={fieldLabelClass}>Mot de passe (Compte) *</label>
                            <input type="password" name="password" required value={formData.password} onChange={handleChange} className={fieldClass} placeholder="••••••••" />
                        </div>

                        <div className="rounded-lg border border-primary/10 bg-primary/5 p-2 shadow-sm shadow-primary/10">
                            <button type="button" onClick={nextStep} className="btn-primary min-h-12 w-full">Suivant</button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Objectif & Niveau */}
                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-3">
                            <h3 className="text-lg font-black text-[var(--foreground)]">2. Objectif principal</h3>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                {objectives.map(obj => (
                                    <label key={obj} className={`${choiceClass} ${formData.objective === obj ? 'border-primary bg-primary/10 text-[var(--foreground)]' : 'border-[var(--foreground)]/10 bg-white/55 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                        <input type="radio" name="objective" value={obj} checked={formData.objective === obj} onChange={handleChange} className="accent-primary" />
                                        <span className="font-bold">{obj}</span>
                                    </label>
                                ))}
                            </div>
                            {formData.objective === "Autre" && (
                                <input type="text" name="objectiveOther" placeholder="Précisez votre objectif..." value={formData.objectiveOther} onChange={handleChange} className={`${fieldClass} mt-2`} />
                            )}
                        </div>


                        <div className="space-y-3 border-t border-[var(--foreground)]/10 pt-4">
                            <h3 className="text-lg font-black text-[var(--foreground)]">3. Niveau en anglais</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {levels.map(lvl => (
                                    <label key={lvl} className={`${choiceClass} ${formData.level === lvl ? 'border-primary bg-primary/10 text-[var(--foreground)]' : 'border-[var(--foreground)]/10 bg-white/55 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                        <input type="radio" name="level" value={lvl} checked={formData.level === lvl} onChange={handleChange} className="h-4 w-4 accent-primary" />
                                        <span className="font-black">{lvl}</span>
                                    </label>
                                ))}
                            </div>

                            {formData.level === "Avancé" && (
                                <div className="rounded-lg border border-secondary/25 bg-secondary/10 p-4 text-xs font-bold leading-6 text-[var(--foreground)]/70">
                                    Votre niveau semble déjà solide. Si votre objectif principal est la pratique orale, le networking et l'immersion sociale, le{" "}
                                    <Link href="/register-club" className="font-black text-secondary underline underline-offset-4">
                                        English Club
                                    </Link>{" "}
                                    peut être plus adapté que la formation de base.
                                </div>
                            )}

                            {/* Placement Test CTA */}
                            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <p className="mb-2 text-sm font-black text-primary">
                                    <span className="text-xl">🤔</span> Vous ne connaissez pas votre niveau ?
                                </p>
                                <p className="mb-3 text-xs font-bold leading-relaxed text-[var(--foreground)]/70">
                                    Passez notre test de placement gratuit pour découvrir votre profil linguistique exact !
                                </p>
                                <Link
                                    href={`/placement-test${formData.planId ? `?plan=${formData.planId}` : ''}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-white/70 px-4 py-3 text-sm font-black text-primary transition-colors hover:bg-primary/10 dark:bg-white/5"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Lancer le Test de Placement
                                </Link>
                            </div>
                        </div>


                        <div className={actionBarClass}>
                            <button type="button" onClick={prevStep} className={backButtonClass}>Retour</button>
                            <button type="button" onClick={nextStep} className="btn-primary min-h-12 text-sm">Suivant</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Formule & Jours */}
                {step === 3 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                        {/* Type & Mode */}
                        <div className="space-y-3">
                            <div className="space-y-3">
                                <h3 className="text-lg font-black text-[var(--foreground)]">Type d'étudiant</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-bold transition-colors ${formData.studentType === 'INDIVIDUEL' ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--foreground)]/10 bg-white/55 text-[var(--foreground)]/60 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                        <input type="radio" name="studentType" value="INDIVIDUEL" checked={formData.studentType === 'INDIVIDUEL'} onChange={handleChange} className="sr-only" />
                                        Particulier
                                    </label>
                                    {(systemSettings?.enableCorporateRegistration ?? true) && (
                                        <label className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-bold transition-colors ${formData.studentType === 'ENTREPRISE' ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--foreground)]/10 bg-white/55 text-[var(--foreground)]/60 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                            <input type="radio" name="studentType" value="ENTREPRISE" checked={formData.studentType === 'ENTREPRISE'} onChange={handleChange} className="sr-only" />
                                            Entreprise
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 border-t border-[var(--foreground)]/10 pt-4">
                                <h3 className="text-lg font-black text-[var(--foreground)]">Format des cours</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-bold transition-colors ${formData.courseMode === 'PRESENTIEL' ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--foreground)]/10 bg-white/55 text-[var(--foreground)]/60 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                        <input type="radio" name="courseMode" value="PRESENTIEL" checked={formData.courseMode === 'PRESENTIEL'} onChange={handleChange} className="sr-only" />
                                        Présentiel
                                    </label>
                                    {(systemSettings?.enableOnlineRegistration ?? true) && (
                                        <label className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-bold transition-colors ${formData.courseMode === 'ONLINE' ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--foreground)]/10 bg-white/55 text-[var(--foreground)]/60 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                            <input type="radio" name="courseMode" value="ONLINE" checked={formData.courseMode === 'ONLINE'} onChange={handleChange} className="sr-only" />
                                            En Ligne
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-[var(--foreground)]/10 pt-4">
                            <h3 className="text-lg font-black text-[var(--foreground)]">Formule choisie</h3>
                            <div className="space-y-2">
                                {plans.map(plan => (
                                    <label key={plan.id} className={`flex cursor-pointer flex-col rounded-lg border p-3 transition-colors ${formData.planId === plan.id ? 'border-primary bg-primary/10' : 'border-[var(--foreground)]/10 bg-white/55 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="planId" value={plan.id} checked={formData.planId === plan.id} onChange={handleChange} className="accent-primary" />
                                            <span className="font-black text-[var(--foreground)] text-sm">{plan.name}</span>
                                        </div>
                                        <div className="ml-7 mt-1 text-xs font-medium text-[var(--foreground)]/60">Organisation : {plan.desc}</div>
                                        <div className="ml-7 mt-1 text-sm font-black text-primary">{plan.price}</div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-[var(--foreground)]/10 pt-4">
                            <h3 className="text-lg font-black text-[var(--foreground)]">5. Créneau Horaire</h3>
                            <p className="text-xs text-[var(--foreground)]/60 mb-2">Choisissez votre vague horaire préférée.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {timeSlots.map(slot => (
                                    <label key={slot.id} className={`${choiceClass} ${formData.timeSlot === slot.id ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--foreground)]/10 bg-white/55 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                        <input type="radio" name="timeSlot" value={slot.id} checked={formData.timeSlot === slot.id} onChange={handleChange} className="accent-primary" />
                                        <span className="font-bold">{slot.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-[var(--foreground)]/10 pt-4">
                            <h3 className="text-lg font-black text-[var(--foreground)]">6. Jours de base</h3>
                            <p className="text-xs text-[var(--foreground)]/60 mb-2">Choisissez vos jours de base ({planSessions[formData.planId]} jour{planSessions[formData.planId] > 1 ? 's' : ''} requis).</p>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {availableDays.map(day => (
                                    <label key={day} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${formData.days.includes(day) ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--foreground)]/10 bg-white/55 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                        <input type="checkbox" checked={formData.days.includes(day)} onChange={() => handleDayToggle(day)} className="rounded border-primary/50 accent-primary" />
                                        <span className="font-bold">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={actionBarClass}>
                            <button type="button" onClick={prevStep} className={backButtonClass}>Retour</button>
                            <button type="button" onClick={nextStep} className="btn-primary min-h-12 text-sm">Suivant</button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Paiement & Contrat */}
                {step === 4 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-3">
                            <h3 className="text-lg font-black text-[var(--foreground)]">Moyen de paiement</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {paymentMethods.map((method) => (
                                    <label key={method.id} className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition-colors ${formData.paymentMethod === method.id ? 'border-primary bg-primary/10 text-primary' : 'border-[var(--foreground)]/10 bg-white/55 text-[var(--foreground)]/70 hover:border-[var(--foreground)]/20 dark:bg-white/5'}`}>
                                        <input type="radio" name="paymentMethod" value={method.id} checked={formData.paymentMethod === method.id} onChange={handleChange} className="sr-only" />
                                        <span className="font-black text-sm">{method.name}</span>
                                        <span className="text-[11px] font-medium leading-snug opacity-70">{method.detail}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-black text-[var(--foreground)]">6. Modalités de paiement</h3>
                            <div className="flex flex-col gap-2">
                                <label className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${formData.paymentOption === 'total' ? 'border-primary bg-primary/10' : 'border-[var(--foreground)]/10 bg-white/55 dark:bg-white/5'}`}>
                                    <input type="radio" name="paymentOption" value="total" checked={formData.paymentOption === 'total'} onChange={handleChange} className="accent-primary mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-sm">Paiement total</span>
                                        <span className="text-xs text-[var(--foreground)]/60 mt-1 block">Réglez la Prise en charge et la Réservation en une seule fois.</span>
                                    </div>
                                </label>
                                <label className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${formData.paymentOption === 'fractionne' ? 'border-primary bg-primary/10' : 'border-[var(--foreground)]/10 bg-white/55 dark:bg-white/5'}`}>
                                    <input type="radio" name="paymentOption" value="fractionne" checked={formData.paymentOption === 'fractionne'} onChange={handleChange} className="accent-primary mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-sm">Paiement en 2 fois</span>
                                        <span className="text-xs text-[var(--foreground)]/60 mt-1 block">1re moitié : la Prise en charge, qui donne accès à la documentation, aux conseils, à la plateforme et au suivi. 2e moitié : la Réservation de votre place.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-5">
                            <h3 className="text-sm font-black text-primary">Récapitulatif avant paiement</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-[var(--foreground)]/70">
                                <div><span className="block opacity-50">Formule</span>{selectedPlan.name}</div>
                                <div><span className="block opacity-50">Moyen</span>{selectedPaymentMethod.name}</div>
                                <div><span className="block opacity-50">Coût total</span>{formatFcfa(selectedPlanAmount)}</div>
                                <div><span className="block opacity-50">Option</span>{formData.paymentOption === "fractionne" ? "Paiement en 2 fois" : "Paiement total"}</div>
                            </div>
                            <div className="rounded-lg border border-[var(--foreground)]/10 bg-white/70 p-4 dark:bg-white/5">
                                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--foreground)]/45">Montant à payer maintenant</div>
                                <div className="mt-1 text-2xl font-black text-[var(--foreground)]">{formatFcfa(immediateAmount)}</div>
                                {formData.paymentOption === "fractionne" && (
                                    <p className="mt-2 text-xs font-medium text-[var(--foreground)]/60">
                                        Cette première moitié correspond à la Prise en charge. La Réservation restante sera de {formatFcfa(reservationAmount)}.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-[var(--foreground)]/10 pt-4">
                            <h3 className="text-lg font-black text-[var(--foreground)]">7. Règles et Engagement</h3>

                            <div className="rounded-lg border border-[var(--foreground)]/10 bg-white/65 p-4 text-xs font-bold leading-relaxed text-[var(--foreground)]/75 dark:bg-white/5">
                                <ul className="list-disc space-y-2 pl-4">
                                    <li>L'inscription offerte est réservée aux premiers inscrits.</li>
                                    <li>Le solde total doit obligatoirement être réglé avant le début de la formation.</li>
                                    <li><strong>Condition de remboursement :</strong> En cas d'annulation notifiée avant le début de la formation, un remboursement est possible. Aucun remboursement ne sera effectué une fois les cours commencés.</li>
                                    <li>Les supports pédagogiques sont offerts au format numérique.</li>
                                    <li>La présence régulière est indispensable pour obtenir l'attestation.</li>
                                </ul>
                            </div>

                            <label className="group flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--foreground)]/10 bg-white/55 p-3 dark:bg-white/5">
                                <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} className="accent-primary mt-1" />
                                <span className="text-xs text-[var(--foreground)]/80 group-hover:text-[var(--foreground)] font-bold transition-colors">
                                    Je confirme mon inscription au programme English Mastery et j'accepte les{" "}
                                    <Link href="/conditions-generales" target="_blank" className="text-primary underline underline-offset-4">conditions générales</Link>, la{" "}
                                    <Link href="/politique-confidentialite" target="_blank" className="text-primary underline underline-offset-4">politique de confidentialité</Link> et la{" "}
                                    <Link href="/politique-remboursement" target="_blank" className="text-primary underline underline-offset-4">politique de remboursement</Link>.
                                </span>
                            </label>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className={fieldLabelClass}>Signature (Nom complet) *</label>
                                    <input type="text" name="signature" required value={formData.signature} onChange={handleChange} className={fieldClass} placeholder="Ex: Jean Dupont" />
                                </div>
                                <div className="space-y-1">
                                    <label className={fieldLabelClass}>Date</label>
                                    <input type="date" name="signDate" disabled value={formData.signDate} className={`${fieldClass} cursor-not-allowed opacity-70`} />
                                </div>
                            </div>
                        </div>

                        <div className={actionBarClass}>
                            <button type="button" onClick={prevStep} className={backButtonClass}>Retour</button>
                            <button type="submit" className="btn-primary min-h-12 px-3 text-sm" disabled={loading}>
                                {loading ? "Création..." : "Valider le paiement"}
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
