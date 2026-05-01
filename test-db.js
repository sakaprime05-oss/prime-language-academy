const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Tentative de connexion à la base de données...');
    const count = await prisma.user.count();
    console.log(`Connexion réussie ! Nombre d'utilisateurs: ${count}`);
  } catch (e) {
    console.error('ERREUR DE CONNEXION PRISMA:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
