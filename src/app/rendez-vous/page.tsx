"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { PrimeLogo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar as CalendarIcon, Clock, MapPin, Phone, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function RendezVousPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>("");
    const [reason, setReason] = useState("");

    const getTimeSlots = () => {
        if (!date) return [];
        const dayOfWeek = date.getDay();
        const slots = [];
        let start = 0; let end = 0;
        if (dayOfWeek === 2) { start = 10; end = 14; }
        else if (dayOfWeek === 4) { start = 9; end = 14; }
        else return [];
        for (let h = start; h < end; h++) {
            slots.push(`${h.toString().padStart(2, '0')}:00`);
            slots.push(`${h.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    const timeSlots = getTimeSlots();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!date || !time) {
            toast.error("Veuillez sélectionner une date et une heure.");
            return;
        }

        setLoading(true);

        const data = {
            name,
            email,
            phone,
            date: format(date, "yyyy-MM-dd"),
            time,
            reason,
        };

        try {
            const res = await fetch("/api/public-appointment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.error || "Une erreur est survenue.");
            } else {
                toast.success("Demande envoyée avec succès !");
                setSuccess(true);
            }
        } catch {
            toast.error("Une erreur réseau est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    }

    const isDateDisabled = (date: Date) => {
        const day = date.getDay();
        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
        return isPast || (day !== 2 && day !== 4);
    };

    return (
        <main className="min-h-screen bg-[var(--background)] overflow-x-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[#21286E]/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <PrimeLogo className="h-9" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/placement-test" className="text-sm font-bold text-[#21286E]/60 hover:text-[#E7162A] transition-colors hidden sm:inline">
                            Test de Niveau Gratuit
                        </Link>
                        <Link href="/register" className="bg-[#E7162A] text-white font-bold py-2 px-5 rounded-xl text-sm hover:shadow-lg shadow-[#E7162A]/30 transition-all">
                            S&apos;inscrire
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative pt-32 pb-20 px-6 bg-[#21286E] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute w-[600px] h-[600px] bg-[#E7162A]/20 blur-[150px] -top-40 -right-40 rounded-full" />
                    <div className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-[100px] bottom-0 left-0 rounded-full" />
                </div>
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#E7162A] animate-pulse" />
                        Consultation Gratuite
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white leading-tight"
                    >
                        Prendre un{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7162A] to-orange-400">
                            Rendez-vous
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                    >
                        Discutez avec notre équipe de votre projet de formation. La consultation est <strong className="text-white">100% gratuite</strong> et sans engagement.
                    </motion.p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Left — Infos */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-[#21286E] mb-3">Infos pratiques</h2>
                            <p className="text-[var(--foreground)]/60 font-medium leading-relaxed">
                                Remplissez le formulaire et nous vous confirmerons votre créneau dans les 24h.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {[
                                {
                                    icon: <CalendarIcon className="w-5 h-5 text-[#E7162A]" />,
                                    title: "Jours disponibles",
                                    desc: "Mardi et Jeudi uniquement",
                                },
                                {
                                    icon: <Clock className="w-5 h-5 text-[#E7162A]" />,
                                    title: "Horaires",
                                    desc: "Mardi : 10h–14h | Jeudi : 09h–14h",
                                },
                                {
                                    icon: <MapPin className="w-5 h-5 text-[#E7162A]" />,
                                    title: "Lieu",
                                    desc: "En présentiel ou en ligne selon votre préférence",
                                },
                                {
                                    icon: <Phone className="w-5 h-5 text-[#E7162A]" />,
                                    title: "Durée",
                                    desc: "30 minutes par session",
                                },
                            ].map((item) => (
                                <div key={item.title} className="flex items-start gap-4 p-4 bg-[#21286E]/5 rounded-2xl border border-[#21286E]/10">
                                    <div className="w-10 h-10 bg-[#E7162A]/10 rounded-xl flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#21286E] text-sm">{item.title}</p>
                                        <p className="text-[var(--foreground)]/60 text-sm font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 bg-[#21286E] rounded-2xl text-white">
                            <p className="text-sm font-bold mb-1">🎓 Vous êtes déjà étudiant ?</p>
                            <p className="text-white/70 text-sm">
                                Connectez-vous à votre espace pour gérer vos RDV directement.
                            </p>
                            <Link href="/login" className="inline-block mt-3 text-[#E7162A] font-black text-sm hover:underline">
                                Se connecter →
                            </Link>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white border border-[#21286E]/10 rounded-3xl p-8 shadow-2xl shadow-[#21286E]/5">
                            <h3 className="text-xl font-black text-[#21286E] mb-6 flex items-center gap-2">
                                <CalendarCheck className="w-6 h-6 text-[#E7162A]" />
                                Réserver un créneau
                            </h3>

                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-16 text-center space-y-4"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h4 className="text-2xl font-black text-[#21286E]">Demande envoyée !</h4>
                                    <p className="text-[var(--foreground)]/60 font-medium max-w-sm mx-auto">
                                        Nous vous contacterons très prochainement pour confirmer votre créneau. Vérifiez votre boîte email.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSuccess(false);
                                            setName(""); setEmail(""); setPhone(""); setDate(undefined); setTime(""); setReason("");
                                        }}
                                        className="mt-4 rounded-xl border-[#21286E]/20 text-[#21286E] font-bold"
                                    >
                                        Faire une autre demande
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="name" className="text-sm font-bold text-[#21286E]">
                                                Nom complet <span className="text-[#E7162A]">*</span>
                                            </label>
                                            <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Jean Dupont" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="phone" className="text-sm font-bold text-[#21286E]">
                                                Téléphone
                                            </label>
                                            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+221 XX XXX XX XX" className="h-12 rounded-xl" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-sm font-bold text-[#21286E]">
                                            Adresse email <span className="text-[#E7162A]">*</span>
                                        </label>
                                        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="jean@exemple.com" className="h-12 rounded-xl" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-[#21286E]">
                                                Date souhaitée <span className="text-[#E7162A]">*</span>
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "h-12 justify-start text-left font-medium rounded-xl border-[#21286E]/10 bg-slate-50/50 hover:bg-slate-50 transition-all",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4 text-[#E7162A]" />
                                                        {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-[#21286E]/10">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(d) => { setDate(d); setTime(""); }}
                                                        disabled={isDateDisabled}
                                                        locale={fr}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <p className="text-[10px] text-[var(--foreground)]/50 font-medium">Mardis et Jeudis uniquement</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-[#21286E]">
                                                Heure <span className="text-[#E7162A]">*</span>
                                            </label>
                                            <Select disabled={!date} value={time} onValueChange={setTime}>
                                                <SelectTrigger className="h-12 rounded-xl border-[#21286E]/10 bg-slate-50/50 hover:bg-slate-50 transition-all">
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 h-4 w-4 text-[#E7162A]" />
                                                        <SelectValue placeholder={date ? "Choisir une heure" : "D'abord une date"} />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-[#21286E]/10">
                                                    {timeSlots.map(slot => (
                                                        <SelectItem key={slot} value={slot} className="rounded-lg">
                                                            {slot.replace(':', 'h')}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[10px] text-[var(--foreground)]/50 font-medium">
                                                {date && date.getDay() === 2 ? "Mar 10h-14h" : date && date.getDay() === 4 ? "Jeu 9h-14h" : "Selon disponibilité"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="reason" className="text-sm font-bold text-[#21286E]">
                                            Motif / Questions
                                        </label>
                                        <Textarea
                                            id="reason"
                                            value={reason}
                                            onChange={e => setReason(e.target.value)}
                                            rows={4}
                                            placeholder="De quoi souhaitez-vous discuter ? (programme, tarifs, inscription…)"
                                            className="resize-none rounded-xl border-[#21286E]/10 bg-slate-50/50 hover:bg-slate-50 focus:border-[#E7162A]/50 transition-all"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || !date || !time}
                                        className="h-14 w-full text-base font-black rounded-xl bg-[#E7162A] hover:bg-[#c8102a] text-white transition-all shadow-lg shadow-[#E7162A]/30 hover:shadow-[#E7162A]/50 hover:-translate-y-0.5 mt-2 disabled:opacity-50"
                                    >
                                        {loading ? "Envoi en cours..." : "Confirmer la demande de RDV →"}
                                    </Button>
                                    <p className="text-center text-xs text-[var(--foreground)]/40 font-medium">
                                        Vos données sont confidentielles et ne seront jamais partagées.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div className="py-8 text-center border-t border-[#21286E]/10">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]/30">
                    © {new Date().getFullYear()} Prime Language Academy
                </p>
            </div>
        </main>
    );
}
