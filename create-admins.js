const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('--- CRÉATION DES COMPTES ADMIN ---');
    
    const admins = [
        {
            email: 'admin@primelangageacademy.com',
            name: 'Administrateur PLA',
            password: 'PrimeAdmin2026!'
        },
        {
            email: 'direction@primelangageacademy.com',
            name: 'Direction PLA',
            password: 'PLA_Direction_2026'
        }
    ];

    for (const admin of admins) {
        try {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            
            const user = await prisma.user.upsert({
                where: { email: admin.email },
                update: {
                    passwordHash: hashedPassword,
                    role: 'ADMIN',
                    status: 'ACTIVE'
                },
                create: {
                    email: admin.email,
                    name: admin.name,
                    passwordHash: hashedPassword,
                    role: 'ADMIN',
                    status: 'ACTIVE'
                }
            });
            
            console.log(`✅ Compte ${admin.email} créé/mis à jour avec succès.`);
        } catch (e) {
            console.error(`❌ Erreur pour ${admin.email}:`, e.message);
        }
    }
    
    await prisma.$disconnect();
}

main();
