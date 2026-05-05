import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDictionary, getLocale } from "@/lib/i18n";
import { LangToggle } from "@/components/lang-toggle";
import { prisma } from "@/lib/prisma";
import ThemeToggle from "@/components/ThemeToggle";
import { hasRequiredProfilePhoto } from "@/lib/student-profile";
import { LogoMark } from "@/components/logo";
import { StudentSidebarNavClient, StudentMobileNavClient } from "@/components/student-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;

  if (role === "ADMIN" || role === "TEACHER") {
    return <>{children}</>;
  }

  const dict = await getDictionary();
  const currentLang = await getLocale();
  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { registrationType: true, onboardingData: true },
  });
  const studentMode = student?.registrationType === "CLUB" ? "CLUB" : "FORMATION";
  const currentPath = (await headers()).get("x-url") || "";
  const canCompleteSetupLater =
    currentPath.startsWith("/dashboard/student/profile") ||
    currentPath.startsWith("/dashboard/student/payments");

  if (!hasRequiredProfilePhoto(student?.onboardingData) && !canCompleteSetupLater) {
    redirect("/dashboard/student/profile?complete=1");
  }

  return (
    <div className="platform-shell min-h-screen bg-[var(--background)] flex flex-col md:flex-row">
      <aside className="platform-sidebar hidden md:flex w-72 flex-col border-r sticky top-0 h-screen z-50">
        <div className="px-6 pt-7 pb-4">
          <div className="mb-4">
            <Link href="/dashboard">
              <LogoMark className="w-20 h-20 -ml-2" />
            </Link>
          </div>
          <p className="text-lg font-black text-[var(--foreground)] tracking-tight" style={{ fontFamily: "Inter,sans-serif" }}>
            Prime
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">
            {studentMode === "CLUB" ? "English Club" : "Formation"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 mt-4">
          <StudentSidebarNav dict={dict.nav} mode={studentMode} />
        </div>

        <div className="platform-user-card p-4 m-4 mt-auto flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black">
            {session.user.name?.[0] || session.user.email?.[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-[var(--foreground)] truncate">{session.user.name || "Étudiant"}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
              {studentMode === "CLUB" ? "Membre Club" : "Apprenant"}
            </p>
          </div>
          <ThemeToggle />
          <LangToggle currentLang={currentLang} />
        </div>
      </aside>

      <div className="md:hidden flex flex-col w-full min-h-screen pb-24">
        <header className="platform-mobile-header sticky top-0 z-40 border-b px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <LogoMark className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-black leading-none text-[var(--foreground)]">Prime</h1>
              <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">
                {studentMode === "CLUB" ? "Club" : "Formation"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LangToggle currentLang={currentLang} />
            <a href="/dashboard/student/profile" className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shadow-sm hover:bg-primary/15 transition-colors">
              {session.user.name?.[0] || session.user.email?.[0].toUpperCase()}
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 w-full">{children}</main>

        <StudentMobileNav dict={dict.nav} mode={studentMode} />
      </div>

      <main className="hidden md:block flex-1 p-8 lg:p-10 w-full h-screen overflow-y-auto relative">
        <div className="max-w-6xl mx-auto relative z-10">{children}</div>
      </main>
    </div>
  );
}

function StudentSidebarNav({ dict, mode }: { dict: any; mode: "FORMATION" | "CLUB" }) {
  return <StudentSidebarNavClient dict={dict} mode={mode} />;
}

function StudentMobileNav({ dict, mode }: { dict: any; mode: "FORMATION" | "CLUB" }) {
  return <StudentMobileNavClient dict={dict} mode={mode} />;
}
