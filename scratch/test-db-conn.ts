import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking database connection...");
        const userCount = await prisma.user.count();
        console.log(`Connected! Total users: ${userCount}`);
        
        const firstUser = await prisma.user.findFirst();
        console.log("First user:", firstUser ? { id: firstUser.id, email: firstUser.email, role: firstUser.role } : "No users found");
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
