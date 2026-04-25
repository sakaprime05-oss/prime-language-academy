# Analyse rapide
- **Type de produit :** Plateforme SaaS EdTech / Gestionnaire d'Académie de Langues (Prime Language Academy).
- **Objectif probable :** Digitaliser la gestion de l'académie : inscriptions, paiements mobile money, suivi des élèves, gestion des professeurs, prise de rendez-vous, cours en ligne, forum, et gamification.
- **Stack technique :** Next.js 16.1 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma 6, PostgreSQL, Next-Auth v5 (beta), Nodemailer.
- **Niveau d’avancement :** Avancé. La base de données est très complète. La séparation des rôles (Admin, Teacher, Student) est faite. Les intégrations pour paiements (PawaPay probable) et envois d'emails sont en place. Beaucoup de fonctionnalités sont implémentées côté Server Actions.
- **Blocages ou inconnues :** Next-Auth v5 (beta) peut être instable. L'intégration de paiement (PawaPay/Mobile money) nécessite des clés API spécifiques. L'état exact de l'UI pour la gamification (Badges) et la messagerie interne reste à confirmer.

---

# working.md

## 1. Résumé du projet
Prime Language Academy est une plateforme SaaS éducative complète visant à digitaliser l'apprentissage de l'anglais en Côte d'Ivoire. Elle intègre un Learning Management System (LMS) avec des modules de cours, un système de réservation de séances (appointments), une gestion financière via Mobile Money, un forum communautaire, et un portail de gestion pour les professeurs et administrateurs.

## 2. Objectif produit
Offrir un écosystème autonome où les étudiants peuvent s'inscrire, payer, suivre leur progression, interagir avec les professeurs, planifier des séances orales, et être récompensés (gamification). Côté administration, suivre le chiffre d'affaires, la présence, évaluer les étudiants et définir les horaires.

## 3. Cible utilisateur
- **Student :** L'apprenant francophone souhaitant devenir bilingue (via la méthode ISO+).
- **Teacher :** Les formateurs qui gèrent les présences, évaluent et accompagnent.
- **Admin :** L'équipe de direction qui pilote les finances, les contenus, et la plateforme.

## 4. Stack technique
- **Framework :** Next.js 16.1.6 (App Router)
- **Langage :** TypeScript / React 19.2.3
- **Styling :** Tailwind CSS v4 (nouveau standard)
- **Base de données :** PostgreSQL via Prisma ORM (v6.19.2)
- **Authentification :** Next-Auth (v5.0.0-beta.30) avec `bcryptjs`
- **Mails :** Nodemailer (v8.0.4) avec tâches planifiées (Vercel Cron)
- **Paiements :** Intégration Custom / PawaPay (Orange, MTN, Moov, Wave)
- **UI Framework :** shadcn/ui (Radix UI + Lucide)

## 5. Architecture du projet
- `prisma/schema.prisma` : Modèle relationnel très riche (20+ entités).
- `src/app/(landing) & page.tsx` : Vitrine (landing page, tarifs ISO+, offres).
- `src/app/api/` : Routes backend pour webhooks (paiement), auth, cron (rappels de rdv), uploads.
- `src/app/actions/` : Server actions fortement découpées (auth, forum, payments, quizzes, teacher-mgmt).
- `src/app/dashboard/` : Protégé, découpé en rôles (`admin/`, `teacher/`, `student/`).

## 6. Modules déjà implémentés
*(Dédouit de l'arborescence et du schéma de DB)*
- **Auth & Sécurité :** Login, Inscription, Reset Password complet (avec modèle de tokens courts).
- **LMS (Cours) :** Niveaux (Level) > Modules > Leçons (Vidéo/PDF) avec tracking de progression.
- **Rendez-vous (Appointments) :** Réservation étudiant/admin avec module Cron de relance à h-24 et h-1.
- **Forum :** Modules de `Post` et `Comment` visibles.
- **Quizz :** Modèles de questions/réponses et tracking de scores (`QuizAttempt`).
- **Gestion Professeur :** Emplois du temps (`TeacherSchedule`), notation (`StudentGrade`), appels (`Attendance`).
- **Finance :** Plans de paiement (`PaymentPlan`) et transactions ciblant les providers Mobile Money.
- **Système de RDV Public :** Page `/rendez-vous` pour les visiteurs, avec API d'envoi d'emails de notification (`/api/public-appointment`).
- **Modernisation UI :** Migration progressive vers shadcn/ui pour les formulaires et composants interactifs.

## 7. Modules incomplets ou manquants
- **Messagerie Interne (`Message`) :** Le modèle DB existe, mais aucune action serveur (`message.ts` ou autre) ne semble présente dans l'arborescence actuelle concernant l'envoi direct entre utilisateurs.
- **Badges / Gamification :** Les modèles `Badge` et `StudentBadge` existent, mais l'automatisation de la distribution n'est pas claire.
- **Système de placement (Placement Test) :** Le dossier `/placement-test` existe, mais il faut s'assurer du raccordement avec le niveau initial (Level) attribué à l'apprenant dans Prisma.

## 8. Flux utilisateur
1. Landing Page -> Test de niveau -> Choix du forfait (Loisir à Immersion).
2. Register -> Paiement (ou acompte).
3. Dashboard Student : Consultation des leçons en ligne, accès au PDF, suivi de la progression.
4. Prise de rendez-vous pour les séances orales.
5. Accès au Forum pour échanger.

## 9. Flux admin
1. Dashboard Admin : Vision panoramique des inscrits, revenus (Transactions).
2. Configuration des Niveaux et Upload de leçons PDF/Vidéos.
3. Affection professeurs aux classes/horaires.
4. Gestion détaillée des comptes (blocage, ajustements financiers).

## 10. Base de données / API / intégrations
- **Base de données :** Architecture relationnelle robuste. Il y a un modèle intelligent de cascade deletion.
- **Uploads d'images/fichiers :** Route `api/upload` présente. (Probablement géré via Vercel Blob, S3, ou fs local).
- **Webhooks :** `api/webhooks` suggère une écoute asynchrone pour valider les paiements PawaPay en arrière-plan.

## 11. Variables d’environnement et dépendances critiques
*(À configurer impérativement dans `.env`)*
- `DATABASE_URL` = PostgreSQL connection string
- `NEXTAUTH_SECRET` & `NEXTAUTH_URL` = Variables de session
- `EMAIL_USER` & `EMAIL_APP_PASSWORD` = Nodemailer
- `CRON_SECRET` = Sécurité pour l'API des rappels automatiques.
- Clés API PawaPay / Opérateur de paiement mobile.
- Clés API Provider d'upload (si externe).

## 12. Problèmes, risques et dette technique
- **Next-Auth v5 Beta :** Instabilité possible. Si la session se déconnecte aléatoirement ou que les callbacks buggent, c'est la cause numéro 1.
- **Tailwind v4 :** C'est une refonte majeure, l'intégration des variables CSS et plugins est très différente de la v3. Il faut être prudent lors des ajouts d'interfaces.
- **Idempotence des Webhooks :** Risque critique si le webhook de Pawapay est déclenché deux fois pour la même transaction financière.
- **Système de Présence et Rattrapage :** Conceptuellement complexe si un élève rate son emploi du temps rigide et bascule sur un autre. L'interface devra être béton.

## 13. Prochaines étapes prioritaires
1. **Validation de l'onboarding et test de niveau** (Le flux de la landing page vers le dashboard).
2. **Audit complet de la sécurisation des paiements** (webhooks PawaPay).
3. **Tester les Vercel Cron jobs** (Rappels de cours par email).
4. **Finaliser le portail Teacher** (Prise de présences et notes).
5. **Implémenter / Câbler la Gamification (Badges) et la messagerie interne** si promis par le produit.

## 14. Questions à clarifier (à destination du propriétaire du produit)
- Quelle est la plateforme exacte d'hébergement visée (Vercel garanti ?)
- Avez-vous les clés PawaPay prêtes pour l'intégration mobile money en prod ?
- La messagerie interne (1 to 1) est-elle une priorité pour la V1 ou est-ce que le forum suffit initialement ?
- Le stockage des fichiers cours (PDFs) et vidéos se fait-il sur le même serveur, sur AWS S3 ou Vercel Blob ?

## 15. Journal de reprise
- *Date :* [17/04/2026]
- *Action :* Génération du working.md initial via audit de l'arborescence, `package.json`, et `schema.prisma`.
- *Status :* Projet compris, architecture validée. Prêt pour développements et bug hunting.
- *Date :* [22/04/2026]
- *Action :* Intégration de shadcn/ui, création du système de RDV public, refonte du formulaire RDV étudiant, et correction des bugs d'encodage/build.
- *Status :* Système de RDV et UI modernisés. Build stabilisé.
- *Date :* [25/04/2026]
- *Action :* Refonte visuelle "Premium Dark", intégration du blog (25 articles), ajout des particules flottantes, implémentation du mode Sombre/Clair, et intégration de la vision "Language Mastery Academy".
- *Status :* Site moderne, immersif et prêt pour la production.
