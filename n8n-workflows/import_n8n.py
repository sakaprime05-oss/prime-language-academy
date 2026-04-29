"""
Script pour importer les workflows n8n via l'API REST.
Lancez ce script APRES vous etre connecte a n8n et avoir recupere votre API key.

Usage: python import_n8n.py --url https://n8n.sakamomo.tech --apikey VOTRE_CLE_API
"""
import argparse
import json
import urllib.request
import urllib.error

def import_workflow(base_url, api_key, workflow_file):
    with open(workflow_file, 'r', encoding='utf-8') as f:
        workflow_data = json.load(f)

    # Remove versionId for clean import
    workflow_data.pop("versionId", None)

    data = json.dumps(workflow_data).encode('utf-8')
    req = urllib.request.Request(
        f"{base_url}/api/v1/workflows",
        data=data,
        headers={
            "Content-Type": "application/json",
            "X-N8N-API-KEY": api_key
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            print(f"✅ '{workflow_data['name']}' importé avec succès! ID: {result.get('id')}")
            return result.get('id')
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"❌ Erreur import '{workflow_data['name']}': {e.code} - {body}")
        return None

def activate_workflow(base_url, api_key, workflow_id):
    req = urllib.request.Request(
        f"{base_url}/api/v1/workflows/{workflow_id}/activate",
        headers={"X-N8N-API-KEY": api_key},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"✅ Workflow {workflow_id} activé!")
    except urllib.error.HTTPError as e:
        print(f"⚠️  Impossible d'activer {workflow_id}: {e.read().decode()}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True, help="URL de votre n8n (ex: https://n8n.sakamomo.tech)")
    parser.add_argument("--apikey", required=True, help="Votre clé API n8n (Settings > API Keys)")
    args = parser.parse_args()

    base_url = args.url.rstrip("/")
    api_key = args.apikey

    workflows = [
        "n8n-workflows/Morning_Report.json",
        "n8n-workflows/Bot_Commands.json"
    ]

    print(f"\n🚀 Import des workflows Prime Academy vers {base_url}\n")
    for wf_file in workflows:
        wf_id = import_workflow(base_url, api_key, wf_file)
        if wf_id:
            activate_workflow(base_url, api_key, wf_id)

    print("\n✅ Terminé!")
