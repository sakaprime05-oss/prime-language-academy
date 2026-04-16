import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CoursesList from "./CoursesList";

export default async function AdminCoursesPage() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") redirect("/login");

    const levels = await prisma.level.findMany({
        include: {
            modules: {
                include: {
                    lessons: true
                }
            },
            _count: {
                select: { students: true }
            }
        }
    });

    return (
        <CoursesList levels={levels} />
    );
}
