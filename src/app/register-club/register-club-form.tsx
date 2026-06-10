"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth-actions";
import { PLA_CLUB_PLANS, formatFcfa } from "@/lib/pla-program";

const memberships = [
    { id: "loisir", name: "Social (1x/sem)", price: formatFcfa(PLA_CLUB_PLANS[0].price), amount: PLA_CLUB_PLANS[0].price },
    { id: "essentiel", name: "Connect (2x/sem)", price: formatFcfa(PLA_CLUB_PLANS[1].price), amount: PLA_CLUB_PLANS[1].price },
    { id: "equilibre", name: "Network (3x/sem)", price: formatFcfa(PLA_CLUB_PLANS[2].price), amount: PLA_CLUB_PLANS[2].price },
    { id: "performance", name: "Executive (4x/sem)", price: formatFcfa(PLA_CLUB_PLANS[3].price), amount: PLA_CLUB_PLANS[3].price },
    { id: "intensif", name: "Elite (5x/sem)", price: formatFcfa(PLA_CLUB_PLANS[4].price), amount: PLA_CLUB_PLANS[4].price },
    { id: "immersion", name: "Founder (6x/sem)", price: formatFcfa(PLA_CLUB_PLANS[5].price), amount: PLA_CLUB_PLANS[5].price }
];

const paymentMethods = [
    { id: "WAVE", name: "Wave", detail: "Paiement via checkout sécurisé Paystack" },
    { id: "MOBILE_MONEY", name: "Mobile Money", detail: "Orange Money, MTN ou Moov via Paystack" },
    { id: "CARD", name: "Carte bancaire", detail: "Visa ou Mastercard via Paystack" },
];

const levels = ["Intermédiaire (B1/B2)", "Avancé (C1/C2)"];
const steps = ["Identité", "Profil", "Membership", "Validation"];
const requiredPasswordLength = 8;

function ErrorHint({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-[11px] font-bold leading-5 text-red-500">{message}</p>;
}

const communes = [
    "Abobo", "Adjamé", "Attécoubé", "Bingerville", "Cocody", 
    "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Treichville", 
    "Yopougon", "Autre"
];

export default function RegisterClubForm({ isWaitlistMode, remainingSeats, initialLevel = "" }: { isWaitlistMode: boolean; remainingSeats: number; initialLevel?: string }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        profession: "",
        company: "",
        level: initialLevel,
        commune: "",
        communeOther: "",
        planId: "essentiel",
        paymentOption: "fractionne",
        paymentMethod: "WAVE",
        agreement: false,
        signature: ""
    });

    const selectedMembership = memberships.find((plan) => plan.id === formData.planId) || memberships[1];
    const immediateAmount = formData.paymentOption === "fractionne" ? selectedMembership.amount * 0.5 : selectedMembership.amount;
    const reservationAmount = selectedMembership.amount - immediateAmount;
    const selectedPaymentMethod = paymentMethods.find((method) => method.id === formData.paymentMethod) || paymentMethods[0];
    const passwordIsValid = formData.password.length >= requiredPasswordLength && formData.password.length <= 128;
    const shouldShowAccountRecovery =
        error.toLowerCase().includes("déjà associé") ||
        error.toLowerCase().includes("attente de paiement") ||
        error.toLowerCase().includes("récupérer l'accès");

    const markErrors = (errors: Record<string, string>) => {
        setFieldErrors(errors);
        setError(`Corrigez: ${Object.values(errors).join(" ")}`);
    };

    const fieldStateClass = (field: string) => fieldErrors[field] ? "border-red-500/70 bg-red-500/5 focus:border-red-500" : "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const name = target.name;
        const value = target.value;
        const type = target.type;

        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
        
        if (type === "checkbox" && target instanceof HTMLInputElement) {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const nextStep = () => {
        setError("");
        setFieldErrors({});
        if (step === 1) {
            const errors: Record<string, string> = {};
            if (!formData.name.trim()) errors.name = "Nom complet requis.";
            if (!formData.email.trim()) errors.email = "Email requis.";
            if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.email = "Email invalide.";
            if (!formData.phone.trim()) errors.phone = "Téléphone WhatsApp requis.";
            if (!formData.password) errors.password = "Mot de passe requis.";
            if (formData.password && formData.password.length < requiredPasswordLength) errors.password = `Mot de passe: ${requiredPasswordLength} caractères minimum.`;
            if (formData.commune === "Autre" && !formData.communeOther.trim()) errors.communeOther = "Précisez votre commune.";
            if (Object.keys(errors).length) return markErrors(errors);
        }
        if (step === 2) {
            const errors: Record<string, string> = {};
            if (!formData.profession.trim()) errors.profession = "Profession requise.";
            if (!formData.level) errors.level = "Niveau requis.";
            if (Object.keys(errors).length) return markErrors(errors);
        }
        if (step === 3 && !formData.planId) return markErrors({ planId: "Choisissez un membership." });
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError("");
        setFieldErrors({});
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        const submitErrors: Record<string, string> = {};
        if (!formData.agreement) submitErrors.agreement = "Cochez l'acceptation des règles.";
        if (!formData.signature.trim()) submitErrors.signature = "Signez avec votre nom complet.";
        if (Object.keys(submitErrors).length) {
            markErrors(submitErrors);
            return;
        }

        setLoading(true);

        const onboardingData = {
            type: "CLUB",
            profession: formData.profession,
            company: formData.company,
            level: formData.level,
            commune: formData.commune === "Autre" ? formData.communeOther : formData.commune,
            signature: formData.signature,
            phone: formData.phone,
            paymentOption: formData.paymentOption,
            paymentMethod: formData.paymentMethod,
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

            if (res.waitlisted) {
                router.push("/register-club/waitlist");
                return;
            }

            if (res.redirectUrl) {
                if (res.redirectUrl.startsWith("http")) {
                    window.location.href = res.redirectUrl;
                } else {
                    router.push(res.redirectUrl);
                }
            } else {
                router.push("/dashboard/student/club");
            }
        } catch (err) {
            setError("Une erreur inattendue s'est produite.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-0">
            <div className="flex items-center justify-between mb-8 px-2">
                {steps.map((label, idx) => {
                    const isActive = step === idx + 1;
                    const isPassed = step > idx + 1;
                    return (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isActive ? 'bg-secondary text-[#080808] shadow-[0_0_15px_rgba(231,22,42,0.4)] scale-110' :
                                isPassed ? 'bg-secondary/20 text-secondary' :
                                'bg-[var(--foreground)]/10 text-[var(--foreground)]/60 border border-[var(--foreground)]/20'
                            }`}>
                                {isPassed ? '✓' : idx + 1}
                            </div>
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="space-y-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
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

            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/70 mb-2">Nom Complet</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={`input-field border-[var(--foreground)]/20 ${fieldStateClass("name")}`} placeholder="John Doe" required aria-invalid={Boolean(fieldErrors.name)} />
                        <ErrorHint message={fieldErrors.name} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/70 mb-2">Email Pro / Personnel</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`input-field border-[var(--foreground)]/20 ${fieldStateClass("email")}`} placeholder="john@example.com" required aria-invalid={Boolean(fieldErrors.email)} />
                        <ErrorHint message={fieldErrors.email} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/70 mb-2">Téléphone (WhatsApp)</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`input-field border-[var(--foreground)]/20 ${fieldStateClass("phone")}`} placeholder="+225 00 00 00 00 00" required aria-invalid={Boolean(fieldErrors.phone)} />
                        <ErrorHint message={fieldErrors.phone} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/70 mb-2">Mot de passe</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className={`input-field border-[var(--foreground)]/20 ${fieldStateClass("password")}`} placeholder="8 caractères minimum" required minLength={requiredPasswordLength} maxLength={128} autoComplete="new-password" aria-invalid={Boolean(fieldErrors.password)} />
                        <div className={`mt-1 flex items-center justify-between gap-3 text-[11px] font-bold ${passwordIsValid ? "text-emerald-600" : "text-[var(--foreground)]/50"}`}>
                            <span>8 caractères minimum pour sécuriser votre espace.</span>
                            <span>{Math.min(formData.password.length, requiredPasswordLength)}/{requiredPasswordLength}</span>
                        </div>
                        <ErrorHint message={fieldErrors.password} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/70 mb-2">Commune de résidence</label>
                        <select name="commune" value={formData.commune} onChange={handleChange} className="input-field cursor-pointer border-[var(--foreground)]/20 text-[var(--foreground)]">
                            <option value="" disabled>Sélectionner une commune</option>
                            {communes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {formData.commune === "Autre" && (
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Précisez la commune</label>
                            <input type="text" name="communeOther" value={formData.communeOther} onChange={handleChange} className={`input-field ${fieldStateClass("communeOther")}`} placeholder="Votre ville/quartier" aria-invalid={Boolean(fieldErrors.communeOther)} />
                            <ErrorHint message={fieldErrors.communeOther} />
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Profession</label>
                        <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={`input-field ${fieldStateClass("profession")}`} placeholder="Ex: Entrepreneur, Manager..." required aria-invalid={Boolean(fieldErrors.profession)} />
                        <ErrorHint message={fieldErrors.profession} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Entreprise (Optionnel)</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-field" placeholder="Nom de votre structure" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/70 mb-2">Niveau actuel</label>
                        <p className="mb-3 rounded-xl border border-secondary/15 bg-secondary/10 p-3 text-xs font-bold leading-6 text-[var(--foreground)]/65">
                            Le Club est pensé pour les profils déjà autonomes en anglais. Si vous êtes débutant ou encore hésitant, la Formation Hybride reste le meilleur point d'entrée.
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            {levels.map(lvl => (
                                <button type="button" key={lvl} onClick={() => {
                                    setFieldErrors(prev => {
                                        const next = { ...prev };
                                        delete next.level;
                                        return next;
                                    });
                                    setFormData({ ...formData, level: lvl });
                                }}
                                    className={`p-4 rounded-xl border-2 text-left text-sm font-black transition-all ${
                                        formData.level === lvl 
                                        ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_15px_rgba(231,22,42,0.15)]' 
                                        : fieldErrors.level ? 'border-red-500/50 bg-red-500/5 text-[var(--foreground)]/70' : 'border-[var(--foreground)]/10 text-[var(--foreground)]/70 hover:border-[var(--foreground)]/30'
                                    }`}>
                                    {lvl}
                                </button>
                            ))}
                            </div>
                            <ErrorHint message={fieldErrors.level} />
                        </div>
                    </div>
            )}

            {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    {isWaitlistMode && (
                        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-xs font-bold leading-6 text-amber-600">
                            Le Club est complet. Vous pouvez continuer pour rejoindre la liste d'attente, sans paiement immédiat.
                        </div>
                    )}
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Choisissez votre Membership</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {memberships.map(plan => (
                            <button type="button" key={plan.id} onClick={() => {
                                setFieldErrors(prev => {
                                    const next = { ...prev };
                                    delete next.planId;
                                    return next;
                                });
                                setFormData({ ...formData, planId: plan.id });
                            }}
                                className={`p-4 rounded-xl border text-center transition-all ${
                                    formData.planId === plan.id 
                                    ? 'bg-secondary/10 border-secondary shadow-[0_0_20px_rgba(231,22,42,0.15)]' 
                                    : fieldErrors.planId ? 'border-red-500/50 bg-red-500/5' : 'border-[var(--foreground)]/10 hover:border-secondary/30'
                                }`}>
                                <div className={`text-xs font-black mb-1 ${formData.planId === plan.id ? 'text-secondary' : 'text-[var(--foreground)]/70'}`}>{plan.name}</div>
                                <div className={`text-[10px] font-bold ${formData.planId === plan.id ? 'text-secondary/80' : 'text-[var(--foreground)]/40'}`}>{plan.price}</div>
                            </button>
                        ))}
                    </div>
                    <ErrorHint message={fieldErrors.planId} />
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    {!isWaitlistMode && (
                        <>
                            <div className="space-y-3">
                                <h4 className="text-sm font-black text-[var(--foreground)]">Moyen de paiement</h4>
                                <p className="rounded-xl border border-[var(--foreground)]/10 bg-white/55 p-3 text-xs font-bold leading-5 text-[var(--foreground)]/60 dark:bg-white/5">
                                    Après validation, vous serez redirigé vers checkout.paystack.com, la page de paiement sécurisée utilisée par Prime Language Academy. Vérifiez le montant avant de confirmer.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {paymentMethods.map((method) => (
                                        <label key={method.id} className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentMethod === method.id ? 'bg-secondary/10 border-secondary text-secondary' : 'border-[var(--foreground)]/10 text-[var(--foreground)]/70 hover:border-secondary/30'}`}>
                                            <input type="radio" name="paymentMethod" value={method.id} checked={formData.paymentMethod === method.id} onChange={handleChange} className="sr-only" />
                                            <span className="block text-xs font-black">{method.name}</span>
                                            <span className="mt-1 block text-[10px] font-bold opacity-60">{method.detail}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-black text-[var(--foreground)]">Option de paiement</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <label className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentOption === 'total' ? 'bg-secondary/10 border-secondary text-secondary' : 'border-[var(--foreground)]/10 text-[var(--foreground)]/70 hover:border-secondary/30'}`}>
                                        <input type="radio" name="paymentOption" value="total" checked={formData.paymentOption === 'total'} onChange={handleChange} className="sr-only" />
                                        <span className="block text-xs font-black">Paiement total</span>
                                        <span className="mt-1 block text-[10px] font-bold opacity-60">Prise en charge + Réservation.</span>
                                    </label>
                                    <label className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.paymentOption === 'fractionne' ? 'bg-secondary/10 border-secondary text-secondary' : 'border-[var(--foreground)]/10 text-[var(--foreground)]/70 hover:border-secondary/30'}`}>
                                        <input type="radio" name="paymentOption" value="fractionne" checked={formData.paymentOption === 'fractionne'} onChange={handleChange} className="sr-only" />
                                        <span className="block text-xs font-black">Paiement en 2 fois</span>
                                        <span className="mt-1 block text-[10px] font-bold opacity-60">Prise en charge maintenant, solde de réservation avant le début officiel.</span>
                                    </label>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                        <h4 className="text-sm font-black text-secondary mb-2">Récapitulatif</h4>
                        <ul className="space-y-2 text-xs font-medium text-[var(--foreground)]/70">
                            <li><span className="opacity-50">Nom:</span> {formData.name}</li>
                            <li><span className="opacity-50">Profil:</span> {formData.profession} ({formData.level})</li>
                            <li><span className="opacity-50">Membership:</span> {selectedMembership.name}</li>
                            {!isWaitlistMode && (
                                <>
                                    <li><span className="opacity-50">Moyen:</span> {selectedPaymentMethod.name}</li>
                                     <li><span className="opacity-50">Option:</span> {formData.paymentOption === "fractionne" ? "Paiement en 2 fois" : "Paiement total"}</li>
                                    <li><span className="opacity-50">{formData.paymentOption === "fractionne" ? "Prise en charge maintenant:" : "Paiement total maintenant:"}</span> <strong className="text-secondary">{formatFcfa(immediateAmount)}</strong></li>
                                    {formData.paymentOption === "fractionne" && (
                                        <li><span className="opacity-50">Réservation restante:</span> {formatFcfa(reservationAmount)}</li>
                                    )}
                                    {formData.paymentOption === "fractionne" && (
                                        <li className="leading-5 text-[var(--foreground)]/55">Le solde de réservation doit être réglé avant le début officiel pour confirmer définitivement la place.</li>
                                    )}
                                    <li className="rounded-lg border border-secondary/15 bg-secondary/10 p-3 leading-5 text-[var(--foreground)]/65">
                                        Page suivante: checkout.paystack.com. Le paiement sera rattaché à Prime Language Academy et au moyen choisi: {selectedPaymentMethod.name}.
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <label className={`flex items-start gap-3 cursor-pointer group rounded-xl border p-3 ${fieldErrors.agreement ? "border-red-500/50 bg-red-500/5" : "border-transparent"}`}>
                            <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} className="mt-1" />
                            <span className="text-xs text-[var(--foreground)]/60 leading-relaxed font-medium group-hover:text-[var(--foreground)]/80 transition-colors">
                                J'accepte les règles du Club (100% anglais, bienveillance, participation active).
                            </span>
                        </label>
                        <ErrorHint message={fieldErrors.agreement} />
                        
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/50 mb-2">Signature (Tapez votre nom)</label>
                            <input type="text" name="signature" value={formData.signature} onChange={handleChange} className={`input-field font-serif italic text-lg text-secondary ${fieldStateClass("signature")}`} placeholder="Votre signature" required aria-invalid={Boolean(fieldErrors.signature)} />
                            <ErrorHint message={fieldErrors.signature} />
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
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin"></span>
                        ) : isWaitlistMode ? (
                            "Rejoindre la liste d'attente"
                        ) : (
                            `Confirmer et ouvrir Paystack (${remainingSeats} places)`
                        )}
                    </button>
                )}
            </div>
        </form>
    );
}
