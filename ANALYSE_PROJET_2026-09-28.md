# Analyse du projet — Prime Language Academy

Date : 2026-09-28
Branche analysée : `arena/01a0e617-prime-language-academy` (depuis `main` @ `9dbb931`)
Périmètre : code source, schéma de données, sécurité, qualité, dépendances, hygiène du dépôt.

---

## 1. Vue d'ensemble

| Élément | Valeur |
|---|---|
| Type de produit | Plateforme EdTech / LMS + back-office d'académie de langues (FR → anglais) |
| Framework | Next.js **16.2.7** (App Router, React 19.2.3, TypeScript strict) |
| UI | Tailwind CSS v4, shadcn/ui (Radix/Base UI), framer-motion, lucide, recharts |
| Données | PostgreSQL via Prisma 6.19 (25 modèles) |
| Auth | NextAuth v5 (beta.30), Credentials + bcryptjs, session JWT |
| Paiement | Paystack (mobile money : Orange, MTN, Moov, Wave) + preuve de paiement manuelle |
| Emails | Resend + Nodemailer, webhook n8n pour notifications |
| IA | Google Gemini 1.5 Flash (notation du test de placement) |
| Déploiement | Vercel (`fra1`), cron quotidien `/api/cron/reminders`, Vercel Blob pour les uploads |
| Volume de code | 178 fichiers dans `src/`, ~23 000 lignes TS/TSX, 47 routes, 73 server actions |

Le projet est **mature et fonctionnellement très complet** : inscription (Formation / English Club),
test de placement chronométré avec reconnaissance vocale, paiement fractionné, LMS
(Niveaux → Modules → Leçons → Progression), rendez-vous, forum, messagerie interne, quiz,
présences, notes, badges, blog, PWA (manifest + service worker + offline), back-offices
Admin / Enseignant / Étudiant, et un « admin-bot » piloté par API/n8n.

---

## 2. Architecture

```
src/
├── app/
│   ├── (landing)/, page.tsx, ClientLanding.tsx   → vitrine marketing
│   ├── actions/            (21 fichiers)         → server actions métier
│   ├── api/                (9 routes)            → webhooks, cron, upload, bot, invoice
│   ├── dashboard/admin|teacher|student/          → back-offices par rôle
│   └── pages publiques : blog, programme, english-club, placement-test, rendez-vous,
│                          register, register-club, checkout, mentions légales
├── components/  (UI shadcn + composants métier)
├── lib/         (19 modules : prisma, email, rate-limit, sanitize-html, i18n,
│                 pla-program, payment-*, student-payment-gate, site-config…)
├── auth.ts / auth.config.ts
└── proxy.ts     (middleware Next 16 : injecte l'en-tête x-url)
```

Points forts d'architecture :

- Séparation nette **server actions / routes API / pages**, logique métier factorisée dans `src/lib`.
- Guards de rôle **centralisés par fichier d'actions** (`requireAdmin`, guards teacher/admin) et
  vérifiés dans les layouts (`dashboard/admin/layout.tsx` redirige si `role !== "ADMIN"`).
- Barrière de paiement dédiée (`lib/student-payment-gate.ts` → `requireInitialPayment`), qui répond
  au point P1-1 de l'audit du 2026-05-04.
- Configuration métier centralisée (`lib/pla-program.ts`, `lib/site-config.ts`) plutôt que dispersée.

---

## 3. Modèle de données (`prisma/schema.prisma`, 354 lignes, 25 modèles)

`User`, `PasswordResetToken`, `Level`, `Module`, `Lesson`, `Progress`, `PaymentPlan`, `Transaction`,
`Post`, `Comment`, `Appointment`, `SystemSettings`, `TeacherSchedule`, `TrainingDocument`,
`Attendance`, `StudentGrade`, `Badge`, `StudentBadge`, `Quiz`, `QuizQuestion`, `QuizAttempt`,
`Message`, `Article`.

Bon : cascades cohérentes (`onDelete: Cascade` / `SetNull`), contraintes d'unicité pertinentes
(`Progress[userId,lessonId]`, `Attendance[studentId,scheduleId,date]`, `StudentBadge[userId,badgeId]`).

Faiblesses :

1. **Aucun dossier `prisma/migrations/`** → le schéma est visiblement appliqué via `db push`.
   Pas d'historique, pas de rollback, risque élevé de dérive entre environnements.
2. **Énumérations en `String` libres** (`role`, `status`, `type`, `category`, `provider`,
   `correctAnswer`…) : aucune garantie d'intégrité côté base ; une faute de frappe passe.
   Des `enum` Prisma seraient plus sûrs.
3. **Dates stockées en `String`** (`Attendance.date`, `StudentGrade.date`,
   `TeacherSchedule.specificDate/startTime/endTime`) → tri, comparaison et fuseaux fragiles.
4. **Index manquants** sur les colonnes de filtrage fréquentes : `Transaction.status/date`,
   `Message.receiverId/isRead`, `Appointment.date/status`, `Article.published/slug(ok)`,
   `User.role/status`. À surveiller dès quelques milliers de lignes.
5. `Float` pour les montants : acceptable en FCFA (entiers) mais `Int`/`Decimal` serait plus juste.

---

## 4. Sécurité

### Déjà en place (bon niveau)

- **CSP complète** en production dans `next.config.ts` (+ `X-Frame-Options`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, `no-store` sur `/api/*`, `noindex` sur `/dashboard/*`).
- **Webhook Paystack** : HMAC SHA-512 avec `crypto.timingSafeEqual` et log de l'IP.
- **Admin-bot** : clé comparée en temps constant, longueur minimale 24, rate limit 30/min par IP.
- **Upload durci** : auth + rôle ADMIN/TEACHER, allow-list MIME, 5 Mo max, **vérification des
  magic bytes**, nom de fichier assaini, Vercel Blob en prod.
- **Rate limiting** sur login (8/15 min), inscription (5/15 min), reset (3/15 min),
  check-email, rendez-vous public (3/15 min), paiement étudiant (6/10 min).
- **Sanitisation HTML** maison (allow-list de balises/attributs, filtrage des `href`).
- Connexion refusée si `user.status !== "ACTIVE"`; accès aux cours conditionné au 1er paiement.

### Risques identifiés

| # | Sévérité | Constat | Recommandation |
|---|---|---|---|
| S1 | **Élevée** | `evaluateTranscriptAction` (`src/app/actions/ai-grader.ts`) est une **server action publique sans authentification ni rate limit**, appelée depuis le composant client du test de placement. N'importe qui peut l'appeler en boucle → facture Gemini et exfiltration de capacité (prompt entièrement contrôlé par l'utilisateur, 4 000 caractères). | Ajouter un rate limit par IP/session + un jeton de test de placement, et plafonner le nombre d'appels par session. |
| S2 | **Élevée** | `create-admins.js` versionné avec des **mots de passe administrateur en clair** (`PrimeAdmin2026!`, `PLA_Direction_2026`). Si ces comptes existent en prod, ils sont compromis. | Retirer le fichier du dépôt, faire tourner les mots de passe, générer via variables d'environnement. |
| S3 | **Moyenne** | Le **rate limiter est en mémoire** (`Map` sur `globalThis`). Sur Vercel (serverless, multi-instances, cold starts) la protection est largement contournable. | Passer sur un store partagé (Upstash Redis, Vercel KV) ou Vercel Firewall. |
| S4 | **Moyenne** | 29 vulnérabilités npm dont **3 critiques** : `next` (contournement middleware/proxy App Router), `next-auth`/`@auth/core` (bypass par homoglyphe dans la normalisation d'email), plus 15 « high » (`undici`, `nodemailer` option `raw`, `postcss`, `ip-address`, `sharp`…). | `npm audit fix` ; monter `next` 16.2.7 → 16.3.6 et `next-auth` beta.30 → beta.32, puis re-tester. |
| S5 | Moyenne | `NEXTAUTH_URL`/`AUTH_SECRET` documentés mais le code lit `NEXT_PUBLIC_APP_URL`, `GEMINI_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `APP_URL`, `PLA_PDF_QR_URL`, `PLA_PUBLIC_SITE_URL`, `PAYSTACK_TEST_PLAN_TOKEN` — **absents de `.env.example`**. Démarrage silencieusement dégradé (IA désactivée, uploads écrits sur le FS éphémère de Vercel). | Compléter `.env.example` et ajouter une validation au boot (zod/`check-env.js` étendu) qui échoue vite. |
| S6 | Faible | `initiatePayment` force `baseUrl` sur `https://primelangageacademy.com` quelle que soit la config → impossible de tester un paiement en préproduction (callback renvoyé en prod). | Autoriser une liste de domaines (prod + staging) via variable d'environnement. |
| S7 | Faible | Fallback d'upload sur `public/uploads` : en serverless le fichier disparaît au prochain déploiement et l'URL retournée devient 404 silencieusement. | Rendre `BLOB_READ_WRITE_TOKEN` obligatoire en production. |
| S8 | Faible | Session JWT sans `maxAge` explicite ni rotation ; pas de verrouillage de compte après N échecs (seulement rate limit mémoire). | Définir `session.maxAge`, journaliser les échecs de connexion. |

---

## 5. Qualité de code et outillage

Vérifications exécutées dans le bac à sable :

- `npx eslint .` → **0 erreur, 0 warning**.
- `npx tsc --noEmit` → 50 erreurs, **mais** liées au client Prisma non généré (téléchargement des
  binaires `binaries.prisma.sh` bloqué par le réseau du bac à sable) : `Module '@prisma/client' has
  no exported member 'User'/'Level'` entraîne en cascade des `TS7006 implicit any` sur les callbacks
  de résultats Prisma. Après `prisma generate`, le typage devrait repasser au vert (cohérent avec
  l'audit du 2026-05-04 qui notait `tsc --noEmit: OK`).
- `npm install --legacy-peer-deps` → OK (789 paquets).

Observations :

- **Aucun test** (unitaire, intégration ou e2e) et **aucune CI** (`.github/` absent) pour ~23 kloc
  gérant de l'argent réel. C'est le principal déficit d'ingénierie du projet.
- **110 occurrences de `: any`** dans `src/` — surtout des `formData.get(...) as string` et des
  résultats Prisma. À remplacer par des schémas de validation (zod) aux frontières.
- **Validation d'entrée ad hoc** : les server actions lisent `FormData` avec des casts, sans schéma.
  Un `zod` partagé réduirait à la fois les `any` et la surface de bug/sécurité.
- Fichiers très volumineux à découper : `register/register-form.tsx` (859 l.), `ClientLanding.tsx`
  (666 l.), `api/admin-bot/route.ts` (618 l.), `PlacementTest.tsx` (539 l.).
- `0 console.log` résiduel (bon), mais pas de logger structuré ni de monitoring d'erreurs
  (Sentry / Vercel Observability absents).
- i18n maison `fr`/`en` via cookie : correct pour le périmètre, mais seuls les tableaux de bord sont
  traduits ; la vitrine reste FR only.

---

## 6. Hygiène du dépôt

- **Historique réduit à un seul commit** (`9dbb931`) contenant tout le projet : impossible de
  bisecter ou d'attribuer une régression.
- **27 Mo de PDF** dans `public/course-documents/` (sur 28 Mo de `public/`) versionnés en Git →
  clone lourd, et ces supports pédagogiques sont servis **publiquement sans contrôle d'accès**
  (`/course-documents/...` est accessible sans être connecté ni avoir payé — contradiction avec la
  barrière de paiement du dashboard). À déplacer derrière une route protégée ou sur Blob privé.
- Scripts jetables à la racine (`replace_colors.js`, `create_notif_workflow.js`, `test-db.js`,
  `check-env.js`, `create-admins.js`) et dossier `scratch/` versionné : à ranger dans `scripts/` ou
  supprimer.
- **`README.md` = template `create-next-app`** : aucune documentation d'installation, de variables
  d'environnement, de seed ou de déploiement. Les vrais documents utiles sont `working.md`,
  `INNOVATIONS.md` et `AUDIT_SITE_PLA_2026-05-04.md`.
- `package.json` n'expose ni `typecheck`, ni `test`, ni `db:migrate`/`db:seed`.

---

## 7. État de l'audit du 2026-05-04

| Point d'audit | État aujourd'hui |
|---|---|
| P1-1 Accès aux cours avant paiement | **Corrigé** (`lib/student-payment-gate.ts`) — mais contourné par les PDF publics de `public/course-documents/` |
| P1-2 Rate limiting endpoints sensibles | **Corrigé fonctionnellement**, mais implémentation en mémoire (cf. S3) |
| P1-3 CSP en production | **Corrigé** (`next.config.ts`) |
| P1-4 Durcissement upload + webhook | **Corrigé** (magic bytes, HMAC timing-safe) |
| P1-5 Défauts visuels mobile | Non vérifiable ici (pas de rendu) — à re-tester |
| Vulnérabilités npm | **Régression** : 5 modérées à l'époque → 29 aujourd'hui dont 3 critiques |

---

## 8. Plan d'action recommandé

**Immédiat (sécurité / risque business)**

1. Protéger `evaluateTranscriptAction` (auth légère + rate limit + quota) — S1.
2. Supprimer `create-admins.js` du dépôt et faire tourner les mots de passe admin — S2.
3. `npm audit fix`, montée de `next` et `next-auth`, re-run lint/typecheck/build — S4.
4. Mettre les PDF de cours derrière une route authentifiée (ou Blob privé signé).

**Court terme (fiabilité)**

5. Introduire `prisma migrate` + un dossier `migrations/` versionné.
6. Compléter `.env.example` + validation zod des variables au démarrage (fail-fast).
7. Rate limiting distribué (Vercel KV / Upstash).
8. Ajouter une CI GitHub Actions : `lint` + `tsc --noEmit` + `prisma validate` + `next build`.

**Moyen terme (qualité)**

9. Schémas zod sur toutes les server actions, éradication progressive des 110 `any`.
10. Tests : Vitest sur `lib/` (paiement, gate, sanitize, rate-limit) + Playwright sur les parcours
    inscription → paiement → accès cours.
11. `enum` Prisma, colonnes `DateTime` au lieu de `String`, index sur les colonnes filtrées.
12. Découpage des composants > 400 lignes, monitoring d'erreurs (Sentry), README réel.

---

## 9. Synthèse

Produit **avancé et cohérent**, avec une vraie discipline de sécurité applicative (CSP, HMAC,
magic bytes, guards de rôle, barrière de paiement) rare à ce stade. Les faiblesses ne sont pas
fonctionnelles mais **industrielles** : pas de migrations de base, pas de tests, pas de CI,
dépendances critiques en retard, et deux fuites concrètes (action IA publique, identifiants admin
versionnés, supports de cours accessibles sans paiement). Traiter les quatre points « immédiat »
ci-dessus remet le projet dans une posture saine pour la production.
