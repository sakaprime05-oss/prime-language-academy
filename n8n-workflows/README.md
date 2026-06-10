# Guide d'integration n8n - Prime Academy Bot

Ces exports permettent de connecter le bot Telegram d'administration au site Prime Language Academy.

## Fichiers disponibles

Le dossier `n8n-workflows` contient deux fichiers :
1. `Morning_Report.json` : s'execute automatiquement tous les jours a 8h00.
2. `Bot_Commands.json` : ecoute les messages Telegram pour executer les commandes admin.

## Comment les importer dans n8n

1. Ouvrez votre interface n8n.
2. Creez un nouveau workflow.
3. Ouvrez l'un des fichiers `.json` avec un editeur de texte et copiez tout son contenu.
4. Retournez dans n8n, cliquez sur l'espace vide du canvas et faites `Ctrl+V`.
5. Les noeuds apparaissent automatiquement.

## Configuration requise

Les noeuds HTTP Request pointent maintenant vers :
`https://primelangageacademy.com/api/admin-bot`

Dans n8n, configurez la variable d'environnement :
`ADMIN_BOT_KEY`

Les exports utilisent cette valeur dans les headers avec :
`={{ $env.ADMIN_BOT_KEY }}`

Dans les noeuds Telegram :
- Selectionnez vos credentials Telegram.
- Pour le Morning Report, remplacez le `chatId` par votre identifiant de discussion Telegram.

## Commandes reconnues par le bot

Une fois le workflow `Bot_Commands` active, vous pouvez envoyer :
- `Valide le paiement de 50000 pour eleve@email.com`
- `Envoie un message de bienvenue`
- `Quels sont mes rendez-vous d'aujourd'hui`
- `Programme`
- `Offres`
- `Tarifs`
- `Aide`

Les commandes `Programme`, `Offres` et `Tarifs` appellent l'action `get_program_info`, qui utilise les memes donnees que le site : Formation Hybride, English Club, session du 11 juillet au 12 septembre 2026, tarifs de 53 000 a 155 000 FCFA, centres Programme 6 et Poincare.
