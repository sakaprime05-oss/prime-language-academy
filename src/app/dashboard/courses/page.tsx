import { redirect } from "next/navigation";

export default function LegacyCoursesRedirect() {
  redirect("/dashboard/student/courses");
}
