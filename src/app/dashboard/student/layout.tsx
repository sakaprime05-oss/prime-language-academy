import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session || session.user?.role !== "STUDENT") {
        if (session?.user?.role === "ADMIN") redirect("/dashboard/admin");
        if (session?.user?.role === "TEACHER") redirect("/dashboard/teacher");
        redirect("/login");
    }

    return <>{children}</>;
}
