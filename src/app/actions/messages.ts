"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasInitialPayment } from "@/lib/student-payment-gate";
import { revalidatePath } from "next/cache";

async function checkUser() {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    if (session.user.role === "STUDENT" && !(await hasInitialPayment(session.user.id))) {
        throw new Error("Payment required");
    }
    return session.user;
}

export async function sendMessage(receiverId: string, content: string) {
    const user = await checkUser();

    if (!content.trim()) return { error: "Message cannot be empty" };

    const message = await prisma.message.create({
        data: {
            senderId: user.id!,
            receiverId,
            content
        }
    });

    revalidatePath("/dashboard/student/messages");
    revalidatePath("/dashboard/teacher/messages");
    return { success: true, message };
}

export async function getConversations() {
    const user = await checkUser();
    
    // Find all users the current user has exchanged messages with
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: user.id },
                { receiverId: user.id }
            ]
        },
        include: {
            sender: { select: { id: true, name: true, role: true } },
            receiver: { select: { id: true, name: true, role: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Group by conversation partner
    const conversationsMap = new Map();
    
    for (const msg of messages) {
        const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        const partner = msg.senderId === user.id ? msg.receiver : msg.sender;
        
        if (!conversationsMap.has(partnerId)) {
            conversationsMap.set(partnerId, {
                partner,
                lastMessage: msg,
                unreadCount: msg.receiverId === user.id && !msg.isRead ? 1 : 0
            });
        } else if (msg.receiverId === user.id && !msg.isRead) {
            const conv = conversationsMap.get(partnerId);
            conv.unreadCount += 1;
        }
    }

    return Array.from(conversationsMap.values());
}

export async function getMessages(partnerId: string) {
    const user = await checkUser();

    // Mark as read
    await prisma.message.updateMany({
        where: {
            senderId: partnerId,
            receiverId: user.id,
            isRead: false
        },
        data: { isRead: true }
    });

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: user.id, receiverId: partnerId },
                { senderId: partnerId, receiverId: user.id }
            ]
        },
        orderBy: { createdAt: 'asc' }
    });

    return messages;
}

export async function getAvailableContacts() {
    const user = await checkUser();
    
    // If student, return their teachers
    if (user.role === "STUDENT") {
        // Find teachers linked to their level schedules
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { level: true }
        });
        
        if (!dbUser || !dbUser.levelId) return [];
        
        const schedules = await prisma.teacherSchedule.findMany({
            where: { levelId: dbUser.levelId },
            include: { teacher: { select: { id: true, name: true, role: true } } }
        });
        
        const teacherIds = new Set();
        const teachers: any[] = [];
        
        schedules.forEach((s: any) => {
            if (!teacherIds.has(s.teacher.id)) {
                teacherIds.add(s.teacher.id);
                teachers.push(s.teacher);
            }
        });
        
        return teachers;
    } 
    // If teacher, return their students
    else if (user.role === "TEACHER") {
        const schedules = await prisma.teacherSchedule.findMany({
            where: { teacherId: user.id! }
        });
        
        const levelIds = schedules.map((s: any) => s.levelId);
        
        const students = await prisma.user.findMany({
            where: {
                role: "STUDENT",
                levelId: { in: levelIds }
            },
            select: { id: true, name: true, role: true }
        });
        
        return students;
    }
    // If admin, return all teachers and students
    else if (user.role === "ADMIN") {
        const users = await prisma.user.findMany({
            where: {
                role: { in: ["TEACHER", "STUDENT"] }
            },
            select: { id: true, name: true, role: true },
            orderBy: { name: 'asc' }
        });
        return users;
    }
    
    return [];
}
