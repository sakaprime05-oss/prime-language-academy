# 🚀 Guide d'intégration n8n - Prime Academy Bot

Pour vous faciliter la vie, j'ai pré-configuré les workflows n8n pour les 4 fonctionnalités "Pro" que nous venons d'implémenter.

## Fichiers disponibles
Dans votre projet, vous trouverez un nouveau dossier `n8n-workflows` contenant deux fichiers :
1. `Morning_Report.json` : S'exécute automatiquement tous les jours à 8h00.
2. `Bot_Commands.json` : Écoute les messages de votre bot Telegram pour exécuter vos commandes.

## 🛠️ Comment les importer dans n8n

1. Ouvrez votre interface **n8n**.
2. Créez un nouveau workflow (cliquez sur "+ Add Workflow").
3. Ouvrez l'un des fichiers `.json` (ex: `Morning_Report.json`) avec un éditeur de texte (VS Code, Notepad, etc.) et copiez tout son contenu.
4. Retournez dans n8n, cliquez n'importe où sur l'espace vide (canvas) et faites `Ctrl+V` (ou `Cmd+V` sur Mac) pour coller le workflow.
5. Les nœuds apparaîtront automatiquement !

## ⚙️ Configuration requise (À remplir dans n8n)

Dans les nœuds HTTP Request (nommés **API: ...**), vous devez :
- Mettre à jour l'URL avec votre domaine de production si ce n'est pas `www.primelanguageacademy.com`.
- Dans l'onglet **Headers**, remplacer `VOTRE_CLE_API_SECRETE_ICI` par la vraie valeur de votre variable d'environnement `ADMIN_BOT_KEY`.

Dans les nœuds Telegram :
- Sélectionnez vos "Credentials" Telegram (Connectez votre Bot via le BotFather si ce n'est pas déjà fait).
- Pour le Morning Report, remplacez `VOTRE_CHAT_ID_TELEGRAM` par votre identifiant de discussion (Chat ID) pour que le bot sache à qui envoyer le rapport à 8h.

## 💬 Commandes reconnues par le bot :
Une fois le workflow `Bot_Commands` activé, envoyez exactement ceci à votre bot :
- `"Valide le paiement de 50000 pour eleve@email.com"`
- `"Envoie un message de bienvenue"`
- `"Quels sont mes rendez-vous d'aujourd'hui"`
