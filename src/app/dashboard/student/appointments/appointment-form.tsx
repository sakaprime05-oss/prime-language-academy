"use client";

import * as React from "react";
import { useState } from "react";
import { createAppointment } from "@/app/actions/appointments";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { format, addMinutes, startOfHour, setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

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

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-foreground/80">
                    Date souhaitée
                </label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full h-12 justify-start text-left font-medium rounded-xl border-[#21286E]/10 bg-white hover:bg-slate-50",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#E7162A]" />
                            {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-[#21286E]/10" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => { setDate(d); setTime(""); }}
                            disabled={isDateDisabled}
                            initialFocus
                            locale={fr}
                        />
                    </PopoverContent>
                </Popover>
                <p className="text-[10px] text-muted-foreground font-medium px-1">
                    Les rendez-vous sont disponibles les Mardis et Jeudis.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-foreground/80">
                    Heure (Créneaux de 30 min)
                </label>
                <Select disabled={!date} value={time} onValueChange={setTime}>
                    <SelectTrigger className="h-12 rounded-xl border-[#21286E]/10 bg-white hover:bg-slate-50">
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-[#E7162A]" />
                            <SelectValue placeholder={date ? "Choisir une heure" : "Sélectionnez d'abord une date"} />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#21286E]/10">
                        {timeSlots.length > 0 ? (
                            timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot} className="rounded-lg">
                                    {slot.replace(':', 'h')}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-2 text-xs text-center text-muted-foreground">Aucun créneau disponible</div>
                        )}
                    </SelectContent>
                </Select>
                {date && (
                    <p className="text-[10px] text-muted-foreground font-medium px-1">
                        {date.getDay() === 2 ? "Horaires du Mardi : 10h - 14h" : "Horaires du Jeudi : 09h - 14h"}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <label htmlFor="reason" className="text-sm font-semibold text-foreground/80">
                    Motif du rendez-vous
                </label>
                <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder="De quoi souhaitez-vous discuter ?"
                    className="resize-none rounded-xl p-4 border-[#21286E]/10 bg-white hover:bg-slate-50 focus:border-[#E7162A]/50 transition-colors"
                />
            </div>

            <Button
                type="submit"
                disabled={loading || !date || !time}
                className="w-full h-14 mt-2 text-base font-bold bg-[#21286E] hover:bg-[#21286E]/90 text-white rounded-xl transition-all shadow-lg shadow-[#21286E]/20 disabled:opacity-50"
            >
                {loading ? "Réservation en cours..." : "Confirmer la réservation"}
            </Button>
        </form>
    );
}
