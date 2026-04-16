import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const role = session.user?.role;

    switch (role) {
        case "ADMIN":
            redirect("/dashboard/admin");
            break;
        case "TEACHER":
            redirect("/dashboard/teacher");
            break;
        case "STUDENT":
        default:
            redirect("/dashboard/student");
            break;
    }
}
