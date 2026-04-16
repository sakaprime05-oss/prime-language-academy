import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfileRedirect() {
    const session = await auth();
    if (!session) redirect("/login");

    const role = session.user?.role;
    if (role === "STUDENT") redirect("/dashboard/student/profile");
    if (role === "ADMIN") redirect("/dashboard/admin");
    if (role === "TEACHER") redirect("/dashboard/teacher");
    redirect("/login");
}
