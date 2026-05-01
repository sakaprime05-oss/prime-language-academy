const VERCEL_TOKEN = "vcp_0DjMoc4wF9rQKSnhdhnUpp5RWRJNrFIibWsNO5wwpr";
const TEAM_SLUG = "saliamohamed05-8715s-projects"; 
const PROJECT_NAME = "prime-language-academy";
const NEW_AUTH_SECRET = "8cb4069b98fce8f53f90c81bc9a5c8c1c70d258d7818d65a61e172c3b76413c7";

async function apiCall(url, options = {}) {
    const res = await fetch(`https://api.vercel.com${url}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${VERCEL_TOKEN}`,
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });
    const data = await res.json();
    if (!res.ok) console.error(`❌ API Error ${res.status}:`, JSON.stringify(data));
    return data;
}

async function main() {
    // 1. Find project
    console.log("🔍 Recherche du projet...");
    const projects = await apiCall(`/v9/projects?limit=20`);
    
    if (projects.error) {
        console.error("Erreur:", projects.error);
        // Try with team slug
        const projects2 = await apiCall(`/v9/projects?limit=20&teamId=${TEAM_SLUG}`);
        console.log("Tentative avec teamId:", JSON.stringify(projects2).slice(0, 500));
        return;
    }
    
    const project = projects.projects?.find(p => p.name === PROJECT_NAME);
    if (!project) {
        console.log("Projets disponibles:", projects.projects?.map(p => p.name));
        return;
    }
    
    console.log(`✅ Projet: ${project.name} (ID: ${project.id})`);
    
    // 2. List env vars
    const envData = await apiCall(`/v9/projects/${project.id}/env`);
    const envs = envData.envs || [];
    console.log(`\n📋 ${envs.length} variables trouvées:`);
    envs.forEach(e => console.log(`  ${e.key}: ${e.type} [${e.target?.join(',')}]`));
    
    // 3. Update AUTH_SECRET
    const authSecretEnv = envs.find(e => e.key === "AUTH_SECRET");
    if (authSecretEnv) {
        console.log("\n🔧 Mise à jour AUTH_SECRET...");
        const updateRes = await apiCall(`/v9/projects/${project.id}/env/${authSecretEnv.id}`, {
            method: "PATCH",
            body: JSON.stringify({ value: NEW_AUTH_SECRET })
        });
        if (!updateRes.error) console.log("✅ AUTH_SECRET mis à jour !");
    } else {
        console.log("\n🔧 Création de AUTH_SECRET...");
        const createRes = await apiCall(`/v9/projects/${project.id}/env`, {
            method: "POST",
            body: JSON.stringify([{
                key: "AUTH_SECRET",
                value: NEW_AUTH_SECRET,
                type: "encrypted",
                target: ["production", "preview", "development"]
            }])
        });
        if (!createRes.error) console.log("✅ AUTH_SECRET créé !");
    }
    
    // 4. Redeploy
    console.log("\n🚀 Déclenchement du redéploiement...");
    const deploys = await apiCall(`/v6/deployments?projectId=${project.id}&limit=1`);
    const latestDeploy = deploys.deployments?.[0];
    if (latestDeploy) {
        const redeployRes = await apiCall(`/v13/deployments`, {
            method: "POST",
            body: JSON.stringify({
                name: project.name,
                deploymentId: latestDeploy.uid,
                target: "production"
            })
        });
        console.log("Redeploy:", JSON.stringify(redeployRes).slice(0, 200));
    }
}

main().catch(console.error);
