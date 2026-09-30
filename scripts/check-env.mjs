/**
 * Vérification des variables d'environnement (fail-fast).
 *
 *   npm run check:env
 *
 * - En développement : seules les variables du noyau sont exigées.
 * - En production (NODE_ENV=production) : la liste complète est exigée
 *   et le script sort en code 1 si quelque chose manque.
 */

const isProduction = process.env.NODE_ENV === "production";

/** @type {{name: string, required: "always" | "production" | "optional", note: string}[]} */
const VARIABLES = [
  { name: "DATABASE_URL", required: "always", note: "Chaîne de connexion PostgreSQL" },
  { name: "AUTH_SECRET", required: "always", note: "Secret de session NextAuth" },
  { name: "NEXTAUTH_URL", required: "always", note: "URL de base de l'application" },
  { name: "NEXT_PUBLIC_APP_URL", required: "production", note: "URL publique (liens emails, callbacks)" },
  { name: "PAYSTACK_SECRET_KEY", required: "production", note: "Paiements Mobile Money" },
  { name: "CRON_SECRET", required: "production", note: "Protection de /api/cron/*" },
  { name: "ADMIN_BOT_KEY", required: "production", note: "Protection de /api/admin-bot" },
  { name: "BLOB_READ_WRITE_TOKEN", required: "production", note: "Uploads persistants (Vercel Blob)" },
  { name: "RESEND_API_KEY", required: "production", note: "Envoi d'emails transactionnels" },
  { name: "EMAIL_FROM", required: "production", note: "Expéditeur des emails" },
  { name: "EMAIL_USER", required: "optional", note: "Repli Nodemailer" },
  { name: "EMAIL_APP_PASSWORD", required: "optional", note: "Repli Nodemailer" },
  { name: "ADMIN_EMAIL", required: "optional", note: "Destinataire des alertes internes" },
  { name: "N8N_PLA_NOTIFICATIONS_WEBHOOK", required: "optional", note: "Webhook de notifications n8n" },
  { name: "GEMINI_API_KEY", required: "optional", note: "Notation IA (repli heuristique sinon)" },
  { name: "APP_URL", required: "optional", note: "Alias d'URL utilisé par certains scripts" },
  { name: "PLA_PUBLIC_SITE_URL", required: "optional", note: "URL affichée sur les documents" },
  { name: "PLA_PDF_QR_URL", required: "optional", note: "Cible des QR codes des PDF" },
  { name: "PAYSTACK_TEST_PLAN_TOKEN", required: "optional", note: "Accès au plan de paiement de test" },
];

/** Longueur minimale imposée aux clés de service. */
const MIN_KEY_LENGTH = { ADMIN_BOT_KEY: 24, CRON_SECRET: 24, AUTH_SECRET: 24 };

const missing = [];
const warnings = [];

console.log(`--- ENV CHECK (NODE_ENV=${process.env.NODE_ENV || "development"}) ---`);

for (const variable of VARIABLES) {
  const value = process.env[variable.name];
  const isRequired =
    variable.required === "always" || (variable.required === "production" && isProduction);

  if (!value) {
    if (isRequired) {
      missing.push(variable);
      console.log(`❌ ${variable.name} — MANQUANT (${variable.note})`);
    } else {
      console.log(`➖ ${variable.name} — absent (optionnel : ${variable.note})`);
    }
    continue;
  }

  const minLength = MIN_KEY_LENGTH[variable.name];
  if (minLength && value.length < minLength) {
    warnings.push(`${variable.name} fait moins de ${minLength} caractères.`);
    console.log(`⚠️  ${variable.name} — défini mais trop court (< ${minLength})`);
    continue;
  }

  console.log(`✅ ${variable.name} — défini`);
}

if (warnings.length > 0) {
  console.log("\nAvertissements :");
  for (const warning of warnings) console.log(`  - ${warning}`);
}

if (missing.length > 0) {
  console.error(`\n${missing.length} variable(s) requise(s) manquante(s). Voir .env.example.`);
  process.exit(1);
}

console.log("\nConfiguration valide.");
