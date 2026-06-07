export const APPOINTMENT_SESSION_MINUTES = 30;

export const APPOINTMENT_CHANNELS = [
    {
        id: "ZOOM",
        label: "Visioconférence Zoom",
        publicLabel: "Visioconférence Zoom",
        shortLabel: "Zoom",
        description: "Echange en ligne avec un responsable PLA.",
        days: [
            {
                dayOfWeek: 2,
                label: "Mardi",
                ranges: [
                    { start: "10:00", end: "14:00" },
                    { start: "17:00", end: "20:00" },
                ],
            },
            {
                dayOfWeek: 4,
                label: "Jeudi",
                ranges: [
                    { start: "09:00", end: "14:00" },
                    { start: "17:00", end: "20:00" },
                ],
            },
        ],
    },
    {
        id: "CALL",
        label: "Appel téléphonique",
        publicLabel: "Appel téléphonique",
        shortLabel: "Appel",
        description: "Echange vocal avec un responsable PLA.",
        days: [
            {
                dayOfWeek: 3,
                label: "Mercredi",
                ranges: [
                    { start: "11:00", end: "14:00" },
                    { start: "17:00", end: "20:00" },
                ],
            },
            {
                dayOfWeek: 6,
                label: "Samedi",
                ranges: [
                    { start: "10:00", end: "14:00" },
                    { start: "17:00", end: "20:00" },
                ],
            },
        ],
    },
] as const;

export type AppointmentChannelId = (typeof APPOINTMENT_CHANNELS)[number]["id"];

export const DEFAULT_APPOINTMENT_CHANNEL: AppointmentChannelId = "ZOOM";

export function getAppointmentChannel(channelId?: string) {
    return APPOINTMENT_CHANNELS.find((channel) => channel.id === channelId) || APPOINTMENT_CHANNELS[0];
}

export function getAppointmentDayConfig(channelId: string | undefined, date?: Date) {
    if (!date) return undefined;
    const channel = getAppointmentChannel(channelId);
    return channel.days.find((day) => day.dayOfWeek === date.getDay());
}

function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return NaN;
    return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function formatHour(time: string) {
    const [hours, minutes] = time.split(":");
    return minutes === "00" ? `${Number(hours)}h` : `${Number(hours)}h${minutes}`;
}

export function formatAppointmentRanges(ranges: readonly { start: string; end: string }[]) {
    return ranges.map((range) => `${formatHour(range.start)}-${formatHour(range.end)}`).join(" et ");
}

export function formatAppointmentChannelDays(channelId: string) {
    const channel = getAppointmentChannel(channelId);
    return channel.days.map((day) => `${day.label} ${formatAppointmentRanges(day.ranges)}`).join(" · ");
}

export function generateAppointmentTimeSlots(channelId: string | undefined, date?: Date) {
    const dayConfig = getAppointmentDayConfig(channelId, date);
    if (!dayConfig) return [];

    return dayConfig.ranges.flatMap((range) => {
        const slots: string[] = [];
        const start = timeToMinutes(range.start);
        const end = timeToMinutes(range.end);
        for (let current = start; current < end; current += APPOINTMENT_SESSION_MINUTES) {
            slots.push(minutesToTime(current));
        }
        return slots;
    });
}

export function validateAppointmentSlot(channelId: string | undefined, date: Date, time: string) {
    const channel = getAppointmentChannel(channelId);
    const dayConfig = getAppointmentDayConfig(channel.id, date);

    if (!dayConfig) {
        return {
            ok: false,
            error: `Les rendez-vous ${channel.shortLabel} sont disponibles uniquement: ${formatAppointmentChannelDays(channel.id)}.`,
        };
    }

    if (!generateAppointmentTimeSlots(channel.id, date).includes(time)) {
        return {
            ok: false,
            error: `Ce créneau n'est pas disponible pour ${channel.publicLabel}. Choisissez: ${formatAppointmentRanges(dayConfig.ranges)}.`,
        };
    }

    return { ok: true, error: "" };
}
