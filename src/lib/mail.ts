import { sendEmail } from "@/lib/email";

function textToHtml(text: string) {
    return text
        .split("\n")
        .filter(Boolean)
        .map((line) => `<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;">${line}</p>`)
        .join("");
}

export const sendMail = async (to: string | string[], subject: string, text: string, html?: string) => {
    const recipients = Array.isArray(to) ? to.join(",") : to;
    return sendEmail({
        to: recipients,
        subject,
        html: html || textToHtml(text),
    });
};
