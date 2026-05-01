export async function notifyTelegram(type: string, data: any) {
    try {
        const webhookUrl = process.env.N8N_PLA_NOTIFICATIONS_WEBHOOK;
        if (!webhookUrl) {
            console.warn("Notification webhook missing; Telegram notification skipped.");
            return;
        }

        await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type, data }),
        });
    } catch (error) {
        console.error("Erreur lors de l'envoi de la notification Telegram:", error);
    }
}
