import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/app/actions/admin-stats";
import { getPaymentStats } from "@/app/actions/admin-payments";
import { StatsCharts } from "@/components/admin/StatsCharts";
import { prisma } from "@/lib/prisma";
import { PLA_CLUB_CAPACITY } from "@/lib/pla-program";
import { parseForumContent } from "@/lib/forum-content";
import { hasRequiredProfilePhoto } from "@/lib/student-profile";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/login");

  let stats = { totalRevenue: 0, overdueCount: 0 };
  let chartData = { revenueData: [], studentData: [], levelData: [] };
  let totalStudents = 0;
  let totalLevels = 0;
  let clubActive = 0;
  let clubPending = 0;
  let clubWaitlist = 0;
  let incompleteProfiles = 0;
  let reportedForumItems = 0;

  try {
    const [s, c, studentCount, levelCount, activeCount, pendingCount, waitlistCount, profileRows, forumPosts] = await Promise.all([
      getPaymentStats().catch(() => ({ totalRevenue: 0, overdueCount: 0 })),
      getAdminStats().catch(() => ({ revenueData: [], studentData: [], levelData: [] })),
      prisma.user.count({ where: { role: "STUDENT" } }).catch(() => 0),
      prisma.level.count().catch(() => 0),
      prisma.user.count({ where: { role: "STUDENT", registrationType: "CLUB", status: "ACTIVE" } }).catch(() => 0),
      prisma.user.count({ where: { role: "STUDENT", registrationType: "CLUB", status: "PENDING" } }).catch(() => 0),
      prisma.user.count({ where: { role: "STUDENT", registrationType: "CLUB", status: "WAITLIST" } }).catch(() => 0),
      prisma.user.findMany({ where: { role: "STUDENT" }, select: { onboardingData: true } }).catch(() => []),
      prisma.post.findMany({ select: { content: true, comments: { select: { content: true } } } }).catch(() => []),
    ]);

    if (s) stats = s;
    if (c) chartData = c as any;
    totalStudents = studentCount;
    totalLevels = levelCount;
    clubActive = activeCount;
    clubPending = pendingCount;
    clubWaitlist = waitlistCount;
    incompleteProfiles = profileRows.filter((student) => !hasRequiredProfilePhoto(student.onboardingData)).length;
    reportedForumItems = forumPosts.reduce((count, post) => {
      const postReports = (parseForumContent(post.content).reportedBy || []).length > 0 ? 1 : 0;
      const commentReports = post.comments.filter((comment) => (parseForumContent(comment.content).reportedBy || []).length > 0).length;
      return count + postReports + commentReports;
    }, 0);
  } catch (error) {
    console.error("Dashboard data fetching error:", error);
  }

  const clubReserved = clubActive + clubPending;
  const clubRemaining = Math.max(0, PLA_CLUB_CAPACITY - clubReserved);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-700">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--primary)]">
            Prime Admin
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--foreground)]">
            Tableau de bord
          </h2>
          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
            Gestion globale de Prime Language Academy.
          </p>
        </div>
        <div className="flex h-10 items-center rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
          Live Stats
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AdminMetric href="/dashboard/admin/students" label="Étudiants" value={totalStudents} />
        <AdminMetric href="/dashboard/admin/payments" label="Revenus" value={`${stats.totalRevenue.toLocaleString()} FCFA`} compact />
        <AdminMetric href="/dashboard/admin/payments" label="Retards paiement" value={stats.overdueCount} accent="danger" />
        <AdminMetric href="/dashboard/admin/courses" label="Niveaux" value={totalLevels} />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminAlert
          href="/dashboard/admin/students"
          label="Profils incomplets"
          value={incompleteProfiles}
          tone="amber"
          description="Étudiants sans photo obligatoire ou profil finalisé."
        />
        <AdminAlert
          href="/dashboard/admin/forum"
          label="Forum à vérifier"
          value={reportedForumItems}
          tone="red"
          description="Discussions ou réponses signalées par les étudiants."
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Link href="/dashboard/admin/club-waitlist" className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)] transition-all hover:border-[var(--primary)]/35 hover:shadow-[var(--glass-shadow)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">
                English Club
              </p>
              <h3 className="text-2xl font-black">Capacité et liste d'attente</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Le Club reste limité à {PLA_CLUB_CAPACITY} membres. Les invitations ouvrent le paiement en ligne seulement quand une place est libre.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <MiniStat label="Pris" value={clubReserved} />
              <MiniStat label="Libres" value={clubRemaining} tone="emerald" />
              <MiniStat label="Attente" value={clubWaitlist} tone="amber" />
            </div>
          </div>
        </Link>
      </section>

      <StatsCharts data={chartData} />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <QuickAction
          title="Gestion pédagogique"
          description="Créez et modifiez les modules, leçons et exercices."
          href="/dashboard/admin/courses"
          label="Accéder au contenu"
        />
        <QuickAction
          title="Gestion étudiants"
          description="Inscrivez, modifiez ou suspendez les comptes élèves."
          href="/dashboard/admin/students"
          label="Gérer les inscrits"
        />
      </section>
    </div>
  );
}

function AdminMetric({ href, label, value, compact = false, accent }: { href: string; label: string; value: string | number; compact?: boolean; accent?: "danger" }) {
  return (
    <Link href={href} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-[var(--foreground)] transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/35 hover:shadow-[var(--glass-shadow)] sm:p-6">
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className={`${compact ? "text-xl sm:text-2xl" : "text-3xl"} font-black ${accent === "danger" ? "text-[var(--primary)]" : "text-[var(--foreground)]"}`}>
        {value}
      </p>
    </Link>
  );
}

function AdminAlert({ href, label, value, description, tone }: { href: string; label: string; value: number; description: string; tone: "amber" | "red" }) {
  const toneClass = tone === "amber" ? "text-amber-500 border-amber-500/20" : "text-[var(--primary)] border-[var(--primary)]/20";
  return (
    <Link href={href} className={`rounded-2xl border bg-[var(--card)] p-6 transition-all hover:shadow-[var(--glass-shadow)] ${toneClass}`}>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em]">{label}</p>
      <p className="text-3xl font-black text-[var(--foreground)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
    </Link>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone?: "emerald" | "amber" }) {
  const color = tone === "emerald" ? "text-emerald-500" : tone === "amber" ? "text-amber-500" : "text-[var(--foreground)]";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{label}</p>
      <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function QuickAction({ title, description, href, label }: { title: string; description: string; href: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-[var(--foreground)]">
      <h3 className="mb-2 text-xl font-black">{title}</h3>
      <p className="mb-6 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      <Link href={href} className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition-colors hover:brightness-110">
        {label}
      </Link>
    </div>
  );
}
