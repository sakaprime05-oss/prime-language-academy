export const PAYMENT_METHODS = {
  WAVE: "Wave",
  MOBILE_MONEY: "Mobile Money",
  CARD: "Carte bancaire",
  PAYSTACK: "Paiement en ligne",
  MANUAL: "Paiement manuel",
} as const;

export function paymentMethodLabel(method?: string | null) {
  const value = String(method || "").toUpperCase();
  if (value.includes("WAVE")) return PAYMENT_METHODS.WAVE;
  if (value.includes("MOBILE") || value.includes("MOMO")) return PAYMENT_METHODS.MOBILE_MONEY;
  if (value.includes("CARD") || value.includes("CARTE")) return PAYMENT_METHODS.CARD;
  if (value.includes("MANUAL") || value.includes("MANUEL")) return PAYMENT_METHODS.MANUAL;
  if (value.includes("PAYSTACK")) return PAYMENT_METHODS.PAYSTACK;
  return method || "Non precise";
}

export function paystackChannels(preferredPaymentMethod?: string | null) {
  if (preferredPaymentMethod === "CARD") return ["card"];
  if (preferredPaymentMethod === "WAVE" || preferredPaymentMethod === "MOBILE_MONEY") return ["mobile_money"];
  return ["mobile_money", "card"];
}

export function paymentProviderLabel(preferredPaymentMethod?: string | null, channel?: string | null) {
  const preferred = paymentMethodLabel(preferredPaymentMethod);
  if (preferred !== PAYMENT_METHODS.PAYSTACK && preferred !== "Non precise") return preferred;

  const normalizedChannel = String(channel || "").toLowerCase();
  if (normalizedChannel.includes("card")) return PAYMENT_METHODS.CARD;
  if (normalizedChannel.includes("mobile")) return PAYMENT_METHODS.MOBILE_MONEY;
  return PAYMENT_METHODS.PAYSTACK;
}
