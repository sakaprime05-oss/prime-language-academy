import { auth } from "@/auth";
import { getStudentProgressData } from "@/app/actions/student-progress";
import { parseStudentProfileData } from "@/lib/student-profile";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

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
          <Link href="/dashboard/admin/students" className="mb-2 flex items-center gap-1 text-xs font-bold text-red-400 hover:underline">
            Retour aux etudiants
          </Link>
          <h2 className="text-3xl font-black tracking-tight text-white">{student.name || "Étudiant"}</h2>
          <p className="mt-2 text-sm font-medium text-white/45">{student.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{student.registrationType}</Badge>
          <Badge>{student.status}</Badge>
          <Badge>{student.level?.name || "Niveau non assigne"}</Badge>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-2xl border border-white/5 bg-[#12121e] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white/5 text-2xl font-black text-white">
              {profile.profilePhotoUrl ? <img src={profile.profilePhotoUrl} alt="" className="h-full w-full object-cover" /> : (student.name?.[0] || "?")}
            </div>
            <div>
              <p className="text-lg font-black text-white">{profile.preferredName || student.name || "Sans nom"}</p>
              <p className="text-xs font-bold text-white/35">{profile.commune || "Commune non renseignee"}</p>
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
                <div key={tx.id} className="rounded-xl bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-white">{tx.amount.toLocaleString("fr-FR")} FCFA</p>
                    <Badge>{tx.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs font-bold text-white/35">{tx.provider || tx.method} - {new Date(tx.date).toLocaleString("fr-FR")}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Evaluations">
          {student.gradesReceived.length === 0 ? (
            <Empty>Aucune evaluation.</Empty>
          ) : student.gradesReceived.map((grade) => (
            <div key={grade.id} className="rounded-xl bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-white">{grade.category}</p>
                {grade.score !== null && <p className="text-sm font-black text-red-300">{grade.score}/100</p>}
              </div>
              {grade.feedback && <p className="mt-2 text-sm leading-6 text-white/55">{grade.feedback}</p>}
              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-white/25">{grade.date} - {grade.teacher.name || "Professeur"}</p>
            </div>
          ))}
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel title="Forum">
          {student.posts.length === 0 && student.comments.length === 0 ? (
            <Empty>Aucune activite forum.</Empty>
          ) : (
            <div className="space-y-3">
              {student.posts.map((post) => (
                <Link key={post.id} href={`/dashboard/student/forum/${post.id}`} className="block rounded-xl bg-white/[0.03] p-3 hover:bg-white/[0.06]">
                  <p className="text-sm font-black text-white">{post.title}</p>
                  <p className="mt-1 text-xs font-bold text-white/35">{post._count.comments} reponse(s)</p>
                </Link>
              ))}
              {student.comments.map((comment) => (
                <Link key={comment.id} href={`/dashboard/student/forum/${comment.post.id}`} className="block rounded-xl bg-white/[0.03] p-3 hover:bg-white/[0.06]">
                  <p className="text-sm font-black text-white">Reponse sur : {comment.post.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-white/45">{comment.content}</p>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Rendez-vous recents">
          {student.appointmentsAsStudent.length === 0 ? (
            <Empty>Aucun rendez-vous.</Empty>
          ) : student.appointmentsAsStudent.map((appointment) => (
            <div key={appointment.id} className="rounded-xl bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-white">{appointment.title || appointment.reason || "Rendez-vous"}</p>
                <Badge>{appointment.status}</Badge>
              </div>
              <p className="mt-1 text-xs font-bold text-white/35">{new Date(appointment.date).toLocaleDateString("fr-FR")}</p>
            </div>
          ))}
        </Panel>
      </section>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-200">{children}</span>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#12121e] p-5">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/5 bg-[#12121e] p-5">
      <h3 className="text-lg font-black text-white">{title}</h3>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/25">{label}</p>
      <p className="mt-1 text-sm font-bold text-white/70">{value || "Non renseigne"}</p>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-white/[0.03] p-4 text-sm font-bold text-white/35">{children}</p>;
}
