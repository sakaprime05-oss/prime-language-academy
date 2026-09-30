# Prime Language Academy

Plateforme EdTech (LMS + back-office) de l'académie de langues Prime Language Academy :
inscription, test de placement, paiement Mobile Money, cours en ligne, rendez-vous,
forum, messagerie, quiz, présences, notes et tableaux de bord Admin / Enseignant / Étudiant.

## Stack

| Domaine | Technologie |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| UI | Tailwind CSS v4, shadcn/ui, framer-motion, recharts |
| Données | PostgreSQL + Prisma 6 |
| Auth | NextAuth v5 (Credentials + bcryptjs, session JWT) |
| Paiement | Paystack (Orange, MTN, Moov, Wave) + preuve de paiement manuelle |
| Emails | Resend (+ repli Nodemailer), webhook n8n |
| IA | Google Gemini (notation du test de placement, repli heuristique) |
| Hébergement | Vercel (`fra1`), cron `/api/cron/reminders`, Vercel Blob pour les uploads |

## Démarrage

```bash
npm install --legacy-peer-deps
cp .env.example .env        # puis complétez les valeurs
npm run check:env           # vérifie la configuration
npx prisma generate
npm run db:push             # ou npm run db:migrate si vous utilisez les migrations
npm run db:seed             # données de démonstration (optionnel)
npm run dev
```

L'application est disponible sur http://localhost:3000.

## Scripts

| Script | Rôle |
|---|---|
| `npm run dev` / `build` / `start` | Cycle Next.js |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:env` | Validation des variables d'environnement (fail-fast) |
| `npm run db:push` | Applique le schéma Prisma sans migration |
| `npm run db:migrate` / `db:deploy` | Migrations Prisma (dev / prod) |
| `npm run db:seed` | Jeu de données initial |
| `npm run db:studio` | Prisma Studio |
| `npm run create:admins` | Crée/met à jour les comptes administrateurs (voir ci-dessous) |
| `npm run import:courses` | Import des supports de cours PDF |

### Comptes administrateurs

Aucun mot de passe n'est stocké dans le dépôt. Les identifiants sont fournis par
l'environnement, ou générés aléatoirement et affichés une seule fois :

```bash
ADMIN_EMAIL="admin@primelangageacademy.com" ADMIN_NAME="Administrateur PLA" \
  npm run create:admins
```

## Variables d'environnement

`.env.example` liste toutes les variables lues par l'application, avec leur criticité.
`npm run check:env` échoue si une variable requise manque (les variables marquées
« production » ne sont exigées que lorsque `NODE_ENV=production`).

Points d'attention :

- `BLOB_READ_WRITE_TOKEN` est **indispensable en production** : sans lui, les uploads
  retombent sur `public/uploads`, effacé à chaque déploiement.
- `GEMINI_API_KEY` est optionnelle : sans elle, le test de placement bascule sur une
  notation heuristique.
- `PAYMENT_ALLOWED_ORIGINS` permet d'autoriser un domaine de préproduction pour les
  callbacks Paystack (la production reste l'unique valeur par défaut).

## Intégration continue

`.github/workflows/ci.yml` exécute sur chaque PR : `prisma validate`, `prisma generate`,
`lint`, `typecheck`, `build`, plus un `npm audit --audit-level=high` non bloquant.

## Documentation interne

- `working.md` — mémo de reprise de session et journal des travaux.
- `ANALYSE_PROJET_2026-09-28.md` — analyse technique complète et plan d'action.
- `AUDIT_SITE_PLA_2026-05-04.md` — audit sécurité/UX antérieur.
- `INNOVATIONS.md` — idées produit.
- `security_best_practices_report.md` — bonnes pratiques appliquées.

## Dette technique connue

- Pas de dossier `prisma/migrations/` : le schéma est appliqué via `db push`.
- Rate limiting en mémoire (à migrer vers Vercel KV / Upstash pour être efficace en serverless).
- Les PDF de `public/course-documents/` sont servis publiquement, sans contrôle de paiement.
- Aucun test automatisé (Vitest sur `src/lib`, Playwright sur les parcours critiques à prévoir).
