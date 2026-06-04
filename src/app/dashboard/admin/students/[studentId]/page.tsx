import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStudentProgressData } from "@/app/actions/student-progress";
import { prisma } from "@/lib/prisma";
import { parseStudentProfileData } from "@/lib/student-profile";

export default async function AdminStudentDetailPage(props: { params: Promise<{ studentId: string }> }) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") redirect("/login");
  const { studentId } = await props.params;

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      level: true,
      paymentPlans: { include: { transactions: { orderBy: { date: "desc" } } } },
      appointmentsAsStudent: { orderBy: { date: "desc" }, take: 5 },
      posts: { orderBy: { createdAt: "desc" }, take: 5, include: { _count: { select: { comments: true } } } },
      comments: { orderBy: { createdAt: "desc" }, take: 5, include: { post: { select: { id: true, title: true } } } },
      badges: { include: { badge: true } },
      gradesReceived: { orderBy: { date: "desc" }, take: 5, include: { teacher: { select: { name: true } } } },
    },
  });

  if (!student || student.role !== "STUDENT") redirect("/dashboard/admin/students");

  const profile = parseStudentProfileData(student.onboardingData);
  const progress = await getStudentProgressData(student.id);
  const plan = student.paymentPlans[0];
  const remaining = plan ? Math.max(0, plan.totalAmount - plan.amountPaid) : 0;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Link
            href="/dashboard/admin/students"
            className="mb-2 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[var(--primary)] hover:underline"
          >
            Retour aux etudiants
          </Link>
          <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)]">{student.name || "Etudiant"}</h2>
          <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">{student.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{student.registrationType}</Badge>
          <Badge>{student.status}</Badge>
          <Badge>{student.level?.name || "Niveau non assigne"}</Badge>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[var(--muted)] text-2xl font-black text-[var(--foreground)]">
              {profile.profilePhotoUrl ? (
                <img src={profile.profilePhotoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                student.name?.[0] || "?"
              )}
            </div>
            <div>
              <p className="text-lg font-black text-[var(--foreground)]">{profile.preferredName || student.name || "Sans nom"}</p>
              <p className="text-xs font-bold text-[var(--muted-foreground)]">{profile.commune || "Commune non renseignee"}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <Info label="Telephone" value={profile.phone} />
            <Info label="WhatsApp" value={profile.whatsapp} />
            <Info label="Urgence" value={profile.emergencyContact} />
            <Info label="Disponibilites" value={profile.availability} />
            <Info label="Objectif" value={profile.learningGoal || profile.objective} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Progression" value={`${progress.percentage}%`} />
          <Stat label="Lecons" value={`${progress.completedLessons || 0}/${progress.totalLessons || 0}`} />
          <Stat label="Solde" value={`${remaining.toLocaleString("fr-FR")} FCFA`} />
          <Stat label="Verse" value={`${(plan?.amountPaid || 0).toLocaleString("fr-FR")} FCFA`} />
          <Stat label="Badges" value={String(student.badges.length)} />
          <Stat label="Forum" value={`${student.posts.length} sujets`} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Paiements">
          {!plan ? (
            <Empty>Aucun plan de paiement.</Empty>
          ) : (
            <div className="space-y-3">
              {plan.transactions.map((tx) => (
                <SoftBox key={tx.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-[var(--foreground)]">{tx.amount.toLocaleString("fr-FR")} FCFA</p>
                    <Badge>{tx.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs font-bold text-[var(--muted-foreground)]">
                    {tx.provider || tx.method} - {new Date(tx.date).toLocaleString("fr-FR")}
                  </p>
                </SoftBox>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Evaluations">
          {student.gradesReceived.length === 0 ? (
            <Empty>Aucune evaluation.</Empty>
          ) : (
            student.gradesReceived.map((grade) => (
              <SoftBox key={grade.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-[var(--foreground)]">{grade.category}</p>
                  {grade.score !== null && <p className="text-sm font-black text-[var(--primary)]">{grade.score}/100</p>}
                </div>
                {grade.feedback && <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{grade.feedback}</p>}
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">
                  {grade.date} - {grade.teacher.name || "Professeur"}
                </p>
              </SoftBox>
            ))
          )}
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Forum">
          {student.posts.length === 0 && student.comments.length === 0 ? (
            <Empty>Aucune activite forum.</Empty>
          ) : (
            <div className="space-y-3">
              {student.posts.map((post) => (
                <Link key={post.id} href={`/dashboard/student/forum/${post.id}`} className="block rounded-xl bg-[var(--muted)] p-3 hover:bg-[var(--accent)]">
                  <p className="text-sm font-black text-[var(--foreground)]">{post.title}</p>
                  <p className="mt-1 text-xs font-bold text-[var(--muted-foreground)]">{post._count.comments} reponse(s)</p>
                </Link>
              ))}
              {student.comments.map((comment) => (
                <Link key={comment.id} href={`/dashboard/student/forum/${comment.post.id}`} className="block rounded-xl bg-[var(--muted)] p-3 hover:bg-[var(--accent)]">
                  <p className="text-sm font-black text-[var(--foreground)]">Reponse sur : {comment.post.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">{comment.content}</p>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Rendez-vous recents">
          {student.appointmentsAsStudent.length === 0 ? (
            <Empty>Aucun rendez-vous.</Empty>
          ) : (
            student.appointmentsAsStudent.map((appointment) => (
              <SoftBox key={appointment.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-[var(--foreground)]">{appointment.title || appointment.reason || "Rendez-vous"}</p>
                  <Badge>{appointment.status}</Badge>
                </div>
                <p className="mt-1 text-xs font-bold text-[var(--muted-foreground)]">
                  {new Date(appointment.date).toLocaleDateString("fr-FR")}
                </p>
              </SoftBox>
            ))
          )}
        </Panel>
      </section>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 text-xl font-black text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className="text-lg font-black text-[var(--foreground)]">{title}</h3>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <SoftBox>
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--foreground)]">{value || "Non renseigne"}</p>
    </SoftBox>
  );
}

function SoftBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-[var(--muted)] p-3">{children}</div>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-[var(--muted)] p-4 text-sm font-bold text-[var(--muted-foreground)]">{children}</p>;
}
