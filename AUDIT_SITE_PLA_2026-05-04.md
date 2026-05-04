# Audit complet du site Prime Language Academy

Date: 2026-05-04
Projet: `prime-language-academy`
Site audite: `https://primelangageacademy.com`

## Resume executif

Le site compile correctement, le deploiement Vercel repond bien, les routes principales sont accessibles, et les corrections recentes du paiement en 2 fois sont presentes. Les fondations sont donc fonctionnelles.

Les priorites restantes sont surtout des sujets de protection business et securite applicative:

1. Bloquer l'acces aux cours tant que le paiement initial n'est pas confirme.
2. Ajouter du rate limiting sur inscription, login/reset, rendez-vous public, admin-bot et initialisation Paystack.
3. Ajouter une CSP propre en production.
4. Durcir l'upload de fichiers et le webhook Paystack.
5. Corriger quelques defauts visuels mobile: contraste faible, zones trop longues, boutons/liens peu lisibles.

## Verification effectuee

- `npx.cmd tsc --noEmit`: OK
- `npm.cmd run lint`: OK
- `npm.cmd run build`: OK
- `npm.cmd audit --audit-level=high`: OK pour le seuil high, mais 5 vulnerabilites moderees remontees.
- Headers production testes sur `/`, `/register`, `/register-club`, `/login`: OK pour `X-Frame-Options`, `nosniff`, `Referrer-Policy`; CSP absente.
- Screenshots de controle:
  - `audit-artifacts/register-mobile.png`
  - `audit-artifacts/club-mobile.png`
  - `audit-artifacts/home-desktop.png`

## Priorite 1 - A corriger rapidement

### P1-1 - Les etudiants en attente peuvent potentiellement acceder au contenu avant paiement

Localisation:
- `src/auth.ts:39-40`
- `src/app/dashboard/student/courses/page.tsx:12-15`

Preuve:
```ts
const canAccess =
    user.status === "ACTIVE" || (user.role === "STUDENT" && user.status === "PENDING");
```

Le login autorise les etudiants `PENDING`. Ensuite, la page cours verifie seulement que l'utilisateur est `STUDENT`, pas que son paiement est valide.

Impact:
Un inscrit qui n'a pas encore paye peut se connecter et, selon son niveau assigne, atteindre des ressources de cours/PDF. C'est surtout un risque business: acces gratuit involontaire.

Correction recommandee:
- Garder la connexion possible pour les `PENDING`, mais rediriger vers `/dashboard/student/payments` tant que `amountPaid === 0`.
- Bloquer explicitement les pages de cours, forum, club et documents si aucun paiement initial n'est confirme.
- Afficher une page claire: "Votre inscription est creee, finalisez la Prise en Charge pour debloquer l'espace."

### P1-2 - Pas de rate limiting sur les endpoints sensibles

Localisation:
- `src/app/actions/auth-actions.ts:116`
- `src/app/actions/auth-reset.ts:7-34`
- `src/app/api/public-appointment/route.ts:23-144`
- `src/app/api/admin-bot/route.ts:86-93`

Impact:
Ces endpoints peuvent etre abuses pour spam email, brute-force, enumeration de comptes, creation massive d'inscriptions ou appels repetes vers Paystack/Resend.

Correction recommandee:
- Ajouter un rate limiter par IP + email pour:
  - inscription
  - login/reset password
  - demande de rendez-vous
  - admin-bot
  - initialisation Paystack
- Sur Vercel, solution simple: Upstash Redis rate limiting ou Vercel Firewall si disponible.

### P1-3 - Reset password revele si un email existe

Localisation:
- `src/app/actions/auth-reset.ts:11-14`

Preuve:
```ts
if (!user) {
    return { error: "Aucun compte n'est associe a cette adresse email." };
}
```

Impact:
Un attaquant peut tester une liste d'emails et savoir quels comptes existent.

Correction recommandee:
- Toujours retourner le meme message public: "Si ce compte existe, un email a ete envoye."
- Garder le detail uniquement dans les logs internes.
- Ajouter rate limiting.

### P1-4 - `CRON_SECRET` est optionnel: si absent, la route cron devient publique

Localisation:
- `src/app/api/cron/reminders/route.ts:5-8`

Preuve:
```ts
if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
}
```

Impact:
Si `CRON_SECRET` n'est pas configure en production, n'importe qui peut declencher les rappels et envoyer des emails.

Correction recommandee:
- En production, refuser si `CRON_SECRET` est absent.
- Retourner 500 configuration ou 401, mais ne jamais continuer publiquement.

## Priorite 2 - Securite et robustesse

### P2-1 - CSP absente en production

Localisation:
- `next.config.ts:5-15`

Constat:
Les headers actuels sont utiles (`nosniff`, `DENY`, `Referrer-Policy`, `Permissions-Policy`) mais il manque `Content-Security-Policy`.

Impact:
Une CSP ne remplace pas les protections React, mais limite fortement les degats en cas d'injection XSS ou script tiers compromis.

Correction recommandee:
- Ajouter une CSP progressive, d'abord en report-only si besoin.
- Inclure au minimum `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, restrictions images/scripts/connect pour Vercel, Paystack, Resend/telemetry necessaire.

### P2-2 - Upload: validation MIME seulement, fichiers publics

Localisation:
- `src/app/api/upload/route.ts:37-52`
- `src/app/api/upload/route.ts:58-70`

Preuve:
```ts
if (!ALLOWED_UPLOAD_TYPES.has(file.type)) { ... }
...
access: 'public',
contentType: file.type,
```

Impact:
Le type MIME fourni par le client n'est pas une preuve suffisante. Un fichier mal forme ou renomme peut etre stocke publiquement. Les PDF publics peuvent aussi contenir du contenu actif cote lecteur PDF.

Correction recommandee:
- Verifier les magic bytes pour JPG/PNG/WebP/PDF.
- Stocker les fichiers sensibles en prive si possible.
- Servir les documents via une route authentifiee avec `Content-Disposition: attachment` pour les fichiers non image.
- Ajouter un scan antivirus si les fichiers viennent d'utilisateurs externes.

### P2-3 - Webhook Paystack: comparaison HMAC non constante

Localisation:
- `src/app/api/webhooks/paystack/route.ts:20-22`

Preuve:
```ts
const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
if (hash !== signature) { ... }
```

Impact:
Le risque pratique est faible, mais une comparaison non constante est moins robuste pour un secret HMAC.

Correction recommandee:
- Utiliser `crypto.timingSafeEqual` apres verification de longueur, comme deja fait pour `ADMIN_BOT_KEY`.

### P2-4 - Callback Paystack construit le redirect avec `url.origin` en fallback

Localisation:
- `src/app/api/payments/paystack/callback/route.ts:7`

Preuve:
```ts
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || url.origin;
```

Impact:
Si les variables d'environnement sont absentes ou mal configurees, le redirect peut dependre du host de la requete. Sur Vercel c'est probablement couvert par la config actuelle, mais le fallback est fragile.

Correction recommandee:
- Exiger une origine canonique configuree en production.
- Valider que `baseUrl` fait partie d'une allowlist: `https://primelangageacademy.com`.

### P2-5 - `admin-bot` expose des donnees sensibles derriere une seule cle API

Localisation:
- `src/app/api/admin-bot/route.ts:86-93`
- `src/app/api/admin-bot/route.ts:153-188`

Impact:
La cle est verifiee correctement, mais la route permet de lire des emails, paiements, rendez-vous et de modifier des statuts. Une fuite de cle donne beaucoup de pouvoir.

Correction recommandee:
- Ajouter rate limiting strict.
- Journaliser les actions sensibles avec type, date, IP, action.
- Scinder les actions lecture/ecriture avec des scopes ou cles separees.
- Eviter de renvoyer les emails complets quand ce n'est pas indispensable.

## Priorite 3 - Qualite produit et UX

### P3-1 - Contraste mobile faible sur les cartes inactives

Localisation:
- `src/app/register/register-form.tsx`
- `src/app/register-club/register-club-form.tsx`

Observation visuelle:
Sur mobile, la carte inactive "English Club" dans `/register` et le lien "Deja membre ? Se connecter" dans `/register-club` sont trop pales. Certains textes deviennent presque invisibles.

Correction recommandee:
- Augmenter l'opacite du texte secondaire.
- Eviter le blanc sur fond clair dans les cartes inactives.
- Garder un contraste minimum lisible sur mobile.

### P3-2 - Parcours inscription long sur mobile

Observation:
Le formulaire mobile est propre mais tres vertical. Les champs facultatifs occupent beaucoup de place avant le choix de formule/paiement.

Correction recommandee:
- Grouper les champs optionnels dans une section "Informations complementaires".
- Mettre le telephone/email/mot de passe en premier.
- Ajouter un indicateur "Etape 1 sur 4" plus lisible que les petits labels actuels.

### P3-3 - Rappel de paiement a clarifier apres inscription

Observation:
Le parcours affiche maintenant le moyen de paiement et le recapitulatif, mais apres retour Paystack, il faut s'assurer que l'utilisateur comprend clairement:
- paiement confirme
- compte active
- montant restant si paiement en 2 fois
- prochaine etape: acceder aux documents ou payer la Reservation

Correction recommandee:
- Creer une page `/payment/success` ou un etat dashboard dedie au lieu de seulement `login?status=payment_success`.
- Afficher le reste a payer et le libelle "Reservation".

### P3-4 - Widget flottant et WhatsApp peuvent gener visuellement

Observation:
Sur desktop, les elements flottants autour du hero attirent beaucoup l'oeil et peuvent concurrencer le message principal.

Correction recommandee:
- Reduire leur taille ou les afficher apres quelques secondes.
- Verifier qu'ils ne couvrent pas les CTA sur petits ecrans.

## Priorite 4 - Maintenabilite code

### P4-1 - Client Prisma instancie directement dans une action

Localisation:
- `src/app/actions/appointments.ts:4-8`

Preuve:
```ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

Impact:
Le reste du projet utilise `@/lib/prisma`. Cette exception peut multiplier les connexions et compliquer le comportement en serverless.

Correction recommandee:
- Remplacer par `import { prisma } from "@/lib/prisma";`.

### P4-2 - Validation runtime encore trop faible dans plusieurs Server Actions

Localisation:
- `src/app/actions/auth-actions.ts:116-131`
- `src/app/actions/appointments.ts:10-23`

Impact:
Les types TypeScript ne valident pas les donnees au runtime. Plusieurs actions acceptent des `FormData`, `any`, ou objets libres sans schema strict.

Correction recommandee:
- Ajouter `zod` ou validation maison centralisee.
- Normaliser email, telephone, date, formule, type d'inscription, option paiement.
- Refuser explicitement les valeurs inconnues au lieu de les ignorer.

### P4-3 - Dependances avec vulnerabilites moderees

Sortie `npm audit`:
- `postcss <8.5.10` via `next`
- `uuid <14.0.0` via `resend/svix`

Impact:
Pas bloquant au niveau high, mais a suivre rapidement.

Correction recommandee:
- Ne pas lancer `npm audit fix --force` directement car il propose des changements cassants.
- Surveiller une version patchee de Next/Resend.
- Tester upgrade dans une branche separee.

## Priorite 5 - Paiement et operations

### P5-1 - Anciennes transactions Paystack PENDING non expirees explicitement

Constat:
Quand un utilisateur relance une inscription en attente, une nouvelle transaction est creee. Les anciennes transactions restent en `PENDING`.

Impact:
L'admin peut voir des lignes de paiement en attente qui ne correspondent plus au dernier choix du client.

Correction recommandee:
- Ajouter une notion `EXPIRED` ou marquer les anciennes tentatives comme remplacees.
- Cote callback, accepter uniquement la derniere tentative active ou afficher un message si un ancien lien est paye.

### P5-2 - Emailing: manque de journal metier visible

Localisation:
- `src/lib/email.ts:114-165`

Observation:
Le systeme sait envoyer via Resend/Gmail/simulation, mais l'admin n'a pas encore une vue claire "email envoye / echoue / a qui / pourquoi".

Correction recommandee:
- Ajouter une table `EmailLog` ou au minimum un journal admin.
- Lister les emails transactionnels: bienvenue, activation, recu, rappel, reset password.
- Afficher l'expediteur configure dans l'admin settings.

## Plan de correction recommande

### Lot 1 - Protection paiement et acces

1. Bloquer les cours/club/forum tant que le premier paiement n'est pas confirme.
2. Ajouter une page succes paiement avec solde restant.
3. Expirer/remplacer les anciennes tentatives Paystack.

### Lot 2 - Anti-abus

1. Rate limiting sur inscription/login/reset/rendez-vous/admin-bot/payments.
2. Message reset password non enumerant.
3. `CRON_SECRET` obligatoire en production.

### Lot 3 - Securite headers/upload/webhook

1. Ajouter CSP.
2. Durcir upload.
3. `timingSafeEqual` pour Paystack.
4. Origine canonique obligatoire pour callbacks.

### Lot 4 - UX mobile et admin

1. Corriger contrastes mobile.
2. Simplifier la premiere etape d'inscription.
3. Ajouter journal emailing.
4. Clarifier dashboard paiement restant.

## Conclusion

Le site est deployable et les controles de base passent. Il reste surtout a fermer les portes qui peuvent couter de l'argent ou creer de la confusion: acces avant paiement, abus d'emails/inscriptions, rate limits, et clarification du parcours post-paiement. Les corrections peuvent etre appliquees en lots sans refondre tout le site.
