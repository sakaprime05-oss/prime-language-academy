const VERCEL_TOKEN = "vcp_0DjMoc4wF9rQKSnhdhnUpp5RWRJNrFIibWsNO5wwpr";
const PROJECT_SLUG = "prime-language-academy";

async function main() {
    // 1. Get project info
    const projectRes = await fetch(`https://api.vercel.com/v9/projects/${PROJECT_SLUG}`, {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });
    const project = await projectRes.json();
    
    if (!project.id) {
        console.error("Projet non trouvé:", JSON.stringify(project));
        return;
    }
    
    console.log(`✅ Projet trouvé: ${project.name} (${project.id})`);
    
    // 2. List all env vars
    const envRes = await fetch(`https://api.vercel.com/v9/projects/${project.id}/env`, {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });
    const envData = await envRes.json();
    
    console.log("\n📋 Variables d'environnement:");
    for (const env of envData.envs || []) {
        console.log(`  ${env.key} [${env.type}] - ${env.target?.join(', ')} ${env.needsDecryption ? '⚠️ NEEDS ATTENTION' : '✅'}`);
    }
    
    console.log("\nProject ID:", project.id);
}

main().catch(console.error);
