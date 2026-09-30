/**
 * URL de base utilisée pour les `callback_url` Paystack.
 *
 * Le callback ne doit jamais pointer vers un domaine arbitraire (redirection
 * ouverte / détournement de transaction). On conserve donc une allow-list,
 * mais configurable via `PAYMENT_ALLOWED_ORIGINS` afin de pouvoir tester un
 * paiement en préproduction sans être renvoyé sur la production.
 *
 * `PAYMENT_ALLOWED_ORIGINS="https://staging.exemple.com,https://preview.exemple.com"`
 */

export const DEFAULT_PAYMENT_BASE_URL = "https://primelangageacademy.com";

const BUILT_IN_ORIGINS = [
  "https://primelangageacademy.com",
  "https://www.primelangageacademy.com",
];

function normalize(url: string | undefined | null) {
  if (!url) return null;
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") return null;
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

export function getAllowedPaymentOrigins() {
  const extra = (process.env.PAYMENT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => normalize(origin))
    .filter((origin): origin is string => Boolean(origin));

  return Array.from(new Set([...BUILT_IN_ORIGINS, ...extra]));
}

/**
 * Retourne l'URL de base configurée si elle fait partie de l'allow-list,
 * sinon le domaine de production.
 */
export function getPaymentBaseUrl() {
  const configured = normalize(process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL);
  if (!configured) return DEFAULT_PAYMENT_BASE_URL;

  return getAllowedPaymentOrigins().includes(configured)
    ? configured
    : DEFAULT_PAYMENT_BASE_URL;
}
