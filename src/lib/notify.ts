export async function notifyTelegram(type: string, data: any) {
    try {
        const webhookUrl = "https://n8n.sakamomo.tech/webhook/pla-notifications";
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
