import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);
    const teacherPassword = await bcrypt.hash("prof123", 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@prime.ci" },
        update: {},
        create: {
            email: "admin@prime.ci",
            name: "Super Admin",
            passwordHash: adminPassword,
            role: "ADMIN",
        },
    });

    // 2. Create Level
    const defaultLevel = await prisma.level.upsert({
        where: { id: "default-level-id" }, // Using a fixed ID for seed stability
        update: {},
        create: {
            id: "default-level-id",
            name: "Débutant (Niveau 1)",
            description: "Pour ceux qui commencent de zéro.",
            price: 75000,
        }
    });

    // 3. Create Student
    const student = await prisma.user.upsert({
        where: { email: "student@prime.ci" },
        update: {},
        create: {
            email: "student@prime.ci",
            name: "Koffi Test",
            passwordHash: studentPassword,
            role: "STUDENT",
            levelId: defaultLevel.id,
        },
    });

    // 4. Create Teacher
    const teacher = await prisma.user.upsert({
        where: { email: "prof@prime.ci" },
        update: {},
        create: {
            email: "prof@prime.ci",
            name: "M. Traoré (English Teacher)",
            passwordHash: teacherPassword,
            role: "TEACHER",
        },
    });

    console.log("Database seeded successfully!");
    console.log({ 
        admin: admin.email, 
        student: student.email, 
        teacher: teacher.email,
        level: defaultLevel.name 
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
