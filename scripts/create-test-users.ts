import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            name: 'Test Admin',
            passwordHash,
            role: 'ADMIN'
        }
    });

    const student = await prisma.user.upsert({
        where: { email: 'student@test.com' },
        update: {},
        create: {
            email: 'student@test.com',
            name: 'Test Student',
            passwordHash,
            role: 'STUDENT'
        }
    });

    console.log('Admin:', admin.email);
    console.log('Student:', student.email);
}

main().then(() => prisma.$disconnect());
