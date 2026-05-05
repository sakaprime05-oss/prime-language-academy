"use client";

import * as React from "react";
import { useState } from "react";
import { createAppointment } from "@/app/actions/appointments";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, addMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { motion, type Variants } from "framer-motion";

export function AppointmentForm() {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string>("");
    const [reason, setReason] = useState("");

    // Générer les créneaux horaires selon le jour
    const getTimeSlots = () => {
        if (!date) return [];
        const dayOfWeek = date.getDay();
        const slots = [];

        let start = 0;
        let end = 0;

        if (dayOfWeek === 2) { // Mardi: 10h-14h
            start = 10;
            end = 14;
        } else if (dayOfWeek === 4) { // Jeudi: 9h-14h
            start = 9;
            end = 14;
        } else {
            return [];
        }

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

        try {
            const [hours, minutes] = time.split(":").map(Number);
            const startTime = new Date(date);
            startTime.setHours(hours, minutes, 0, 0);

            const endTime = addMinutes(startTime, 30);

            await createAppointment({
                date: date,
                startTime,
                endTime,
                reason
            });

            toast.success("Votre demande de rendez-vous a été envoyée !");
            setDate(undefined);
            setTime("");
            setReason("");
        } catch (err) {
            toast.error("Une erreur est survenue lors de la réservation.");
        } finally {
            setLoading(false);
        }
    }

    const isDateDisabled = (date: Date) => {
        const day = date.getDay();
        // Désactiver si pas mardi (2) ou jeudi (4), ou si c'est dans le passé
        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
        return isPast || (day !== 2 && day !== 4);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
    };

    return (
        <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={onSubmit} 
            className="flex flex-col gap-4"
        >
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                <label className="ml-1 text-xs font-black uppercase tracking-[0.08em] text-[var(--foreground)]/65">
                    Date souhaitée
                </label>
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "min-h-12 justify-start rounded-lg border-[var(--border)]/70 bg-card text-left text-sm font-semibold transition-colors hover:bg-[var(--muted)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-3 h-5 w-5 text-[#E7162A]" />
                            {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="flex flex-col items-center rounded-t-xl border-primary/10 px-4 pb-8 pt-4 shadow-2xl">
                        <div className="w-12 h-1.5 rounded-full bg-muted/60 mb-6 mx-auto"></div>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => { setDate(d); setTime(""); }}
                            disabled={isDateDisabled}
                            initialFocus
                            locale={fr}
                            className="flex w-full origin-top justify-center border-none bg-transparent p-0"
                        />
                    </DrawerContent>
                </Drawer>
                <p className="text-xs text-muted-foreground font-medium px-1">
                    Les rendez-vous sont disponibles les Mardis et Jeudis.
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                <label className="ml-1 text-xs font-black uppercase tracking-[0.08em] text-[var(--foreground)]/65">
                    Heure (Créneaux de 30 min)
                </label>
                <Select disabled={!date} value={time} onValueChange={(value) => setTime(value ?? "")}>
                    <SelectTrigger className="min-h-12 rounded-lg border-[var(--border)]/70 bg-card text-sm font-semibold transition-colors hover:bg-[var(--muted)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                        <div className="flex items-center">
                            <Clock className="mr-3 h-5 w-5 text-[#E7162A]" />
                            <SelectValue placeholder={date ? "Choisir une heure" : "Sélectionnez d'abord une date"} />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-[60vh] rounded-lg border-primary/10 shadow-xl">
                        {timeSlots.length > 0 ? (
                            timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot} className="cursor-pointer rounded-lg py-3 text-sm">
                                    {slot.replace(':', 'h')}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-4 text-sm text-center text-muted-foreground">Aucun créneau disponible</div>
                        )}
                    </SelectContent>
                </Select>
                {date && (
                    <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-muted-foreground font-medium px-1"
                    >
                        {date.getDay() === 2 ? "Horaires du Mardi : 10h - 14h" : "Horaires du Jeudi : 09h - 14h"}
                    </motion.p>
                )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                <label htmlFor="reason" className="ml-1 text-xs font-black uppercase tracking-[0.08em] text-[var(--foreground)]/65">
                    Motif du rendez-vous
                </label>
                <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder="De quoi souhaitez-vous discuter ?"
                    className="min-h-[112px] resize-none rounded-lg border-[var(--border)]/70 bg-card p-3 text-sm transition-colors placeholder:text-muted-foreground/60 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10"
                />
            </motion.div>

            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !date || !time}
                className="mt-2 min-h-12 w-full rounded-lg bg-primary text-sm font-black text-white shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? "Réservation en cours..." : "Confirmer la réservation"}
            </motion.button>
        </motion.form>
    );
}
