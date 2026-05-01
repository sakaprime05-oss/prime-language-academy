const https = require('https');

const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YTQwZjljNC00OGQwLTRiMGItODUyOC0zMWQzYzE4NzVmZDkiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYWFlM2I4ZGMtZTU2Mi00YjUyLWJmYWQtMDU3OGQ1Y2IxZDA5IiwiaWF0IjoxNzc3NDI2MTA1fQ.sCm1FEdUTJGEAdi-CAthAgij_nwjq5qpSK6PY_6lWYE';
// Your Telegram chat ID (the director's personal chat)
const DIRECTOR_CHAT_ID = '6645894689';
// Telegram Bot Token for "secretaire_prime_bot"
const TELEGRAM_BOT_TOKEN = '8624804772:AAGKwH2mLc60q7-QHCGvzAr6OUHzg3wFGIA';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : undefined;
    const opts = {
      hostname: 'n8n.sakamomo.tech',
      path,
      method,
      headers: {
        'X-N8N-API-KEY': N8N_KEY,
        'Accept': 'application/json',
        ...(bodyStr ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) } : {})
      }
    };
    const req = https.request(opts, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(d) }));
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function main() {
  // ========================================================
  // CREATE: PLA Notifications Workflow
  // ========================================================
  const notifWorkflow = {
    name: "PLA - Notifications Temps Réel",
    nodes: [
      // 1. Webhook trigger
      {
        id: "webhook-trigger",
        name: "Webhook Trigger",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [0, 0],
        parameters: {
          httpMethod: "POST",
          path: "pla-notifications",
          responseMode: "responseNode"
        },
        webhookId: "pla-notifications-hook"
      },
      // 2. Route by notification type
      {
        id: "switch-type",
        name: "Type de Notification",
        type: "n8n-nodes-base.switch",
        typeVersion: 3.2,
        position: [250, 0],
        parameters: {
          mode: "rules",
          rules: {
            values: [
              {
                conditions: {
                  options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
                  conditions: [{ leftValue: "={{ $json.body.type }}", rightValue: "new_registration", operator: { type: "string", operation: "equals" } }],
                  combinator: "and"
                },
                renameOutput: true,
                outputKey: "Inscription"
              },
              {
                conditions: {
                  options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
                  conditions: [{ leftValue: "={{ $json.body.type }}", rightValue: "payment_proof", operator: { type: "string", operation: "equals" } }],
                  combinator: "and"
                },
                renameOutput: true,
                outputKey: "Paiement"
              },
              {
                conditions: {
                  options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
                  conditions: [{ leftValue: "={{ $json.body.type }}", rightValue: "new_appointment", operator: { type: "string", operation: "equals" } }],
                  combinator: "and"
                },
                renameOutput: true,
                outputKey: "RDV"
              }
            ]
          }
        }
      },
      // 3a. Telegram: New Registration
      {
        id: "tg-inscription",
        name: "TG - Nouvelle Inscription",
        type: "n8n-nodes-base.telegram",
        typeVersion: 1.2,
        position: [500, -200],
        parameters: {
          chatId: DIRECTOR_CHAT_ID,
          text: "=🎓 *Nouvelle Inscription !*\n\n👤 *Nom :* {{ $json.body.data.name }}\n📧 *Email :* {{ $json.body.data.email }}\n📋 *Formule :* {{ $json.body.data.type || 'FORMATION' }}\n⏰ *Heure :* {{ new Date().toLocaleTimeString('fr-FR') }}\n\n_Connectez-vous au dashboard pour voir le profil._",
          additionalFields: { parse_mode: "Markdown" }
        },
        credentials: { telegramApi: { id: "Xz9NG9CHQ0fBuJsR", name: "Telegram account" } }
      },
      // 3b. Telegram: Payment Proof
      {
        id: "tg-paiement",
        name: "TG - Preuve de Paiement",
        type: "n8n-nodes-base.telegram",
        typeVersion: 1.2,
        position: [500, 0],
        parameters: {
          chatId: DIRECTOR_CHAT_ID,
          text: "=💰 *Preuve de Paiement Reçue !*\n\n👤 *Étudiant :* {{ $json.body.data.name }}\n📧 *Email :* {{ $json.body.data.email }}\n💵 *Montant :* {{ $json.body.data.amount }} FCFA\n📱 *Moyen :* {{ $json.body.data.provider }}\n📞 *Numéro :* {{ $json.body.data.phone }}\n\n⚡ Pour valider, dites au Secrétaire PLA :\n_\"Valide le paiement de {{ $json.body.data.email }} pour {{ $json.body.data.amount }} FCFA\"_",
          additionalFields: { parse_mode: "Markdown" }
        },
        credentials: { telegramApi: { id: "Xz9NG9CHQ0fBuJsR", name: "Telegram account" } }
      },
      // 3c. Telegram: New Appointment
      {
        id: "tg-rdv",
        name: "TG - Nouveau RDV",
        type: "n8n-nodes-base.telegram",
        typeVersion: 1.2,
        position: [500, 200],
        parameters: {
          chatId: DIRECTOR_CHAT_ID,
          text: "=📅 *Nouveau Rendez-vous !*\n\n👤 *Étudiant :* {{ $json.body.data.studentName }}\n📅 *Date :* {{ $json.body.data.date }}\n⏰ *Heure :* {{ $json.body.data.time }}\n📝 *Motif :* {{ $json.body.data.reason || 'Non précisé' }}\n\n_Vérifiez votre agenda sur le dashboard._",
          additionalFields: { parse_mode: "Markdown" }
        },
        credentials: { telegramApi: { id: "Xz9NG9CHQ0fBuJsR", name: "Telegram account" } }
      },
      // 4. Respond OK to webhook immediately
      {
        id: "respond-webhook",
        name: "Réponse OK",
        type: "n8n-nodes-base.respondToWebhook",
        typeVersion: 1.1,
        position: [250, 250],
        parameters: {
          respondWith: "json",
          responseBody: '{ "received": true }'
        }
      }
    ],
    connections: {
      "Webhook Trigger": {
        main: [
          [
            { node: "Type de Notification", type: "main", index: 0 },
            { node: "Réponse OK", type: "main", index: 0 }
          ]
        ]
      },
      "Type de Notification": {
        main: [
          [{ node: "TG - Nouvelle Inscription", type: "main", index: 0 }],
          [{ node: "TG - Preuve de Paiement", type: "main", index: 0 }],
          [{ node: "TG - Nouveau RDV", type: "main", index: 0 }]
        ]
      }
    },
    settings: {}
  };

  const create = await request('POST', '/api/v1/workflows', notifWorkflow);
  if (create.status !== 200 && create.status !== 201) {
    console.log('Error creating workflow:', JSON.stringify(create.data));
    return;
  }
  const wfId = create.data.id;
  console.log('✅ Workflow créé! ID:', wfId);

  // Activate it
  const activate = await request('POST', `/api/v1/workflows/${wfId}/activate`);
  console.log('✅ Workflow activé! Status:', activate.status);
  console.log('');
  console.log('🔗 Webhook URL:');
  console.log(`   https://n8n.sakamomo.tech/webhook/pla-notifications`);
  console.log('');
  console.log('Workflow ID:', wfId);
}

main().catch(console.error);
