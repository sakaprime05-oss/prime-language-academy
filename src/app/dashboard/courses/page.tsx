import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function StudentCoursesPage() {
  const session = await auth();
  if (!session || session.user?.role !== "STUDENT") redirect("/login");

  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      level: {
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
      paymentPlans: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const level = student?.level;
  const isBlocked = student?.status === "BLOCKED" || student?.paymentPlans[0]?.status === "OVERDUE";

  if (isBlocked) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <header className="mb-4">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Mes cours</h2>
        </header>
        <div className="glass-card bg-red-500/10 border-red-500/20 text-center py-12 px-4 shadow-lg shadow-red-500/10">
          <div className="w-16 h-16 bg-red-600/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Accès suspendu</h3>
          <p className="text-[var(--foreground)]/70 text-sm mb-6 max-w-sm mx-auto">
            Votre accès aux cours est temporairement suspendu en raison d'un paiement en retard. Régularisez votre situation depuis l'espace paiements pour continuer à apprendre.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Programme : {level?.name || "Non assigné"}</h2>
        <p className="text-[var(--foreground)]/60 text-sm">Suivez les leçons à votre rythme.</p>
      </header>

      {!level || level.modules.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-[var(--foreground)]/50">Votre programme est en cours de préparation par votre formateur.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {level.modules.map((module) => (
            <div key={module.id} className="glass-card !p-0 overflow-hidden">
              <div className="p-4 border-b border-black/5 dark:border-white/5 bg-[var(--surface-hover)]">
                <h3 className="font-bold text-md text-[var(--foreground)]">Module {module.order} : {module.title}</h3>
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {module.lessons.map((lesson) => (
                  <button key={lesson.id} className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-hover)] transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                        {lesson.type === "VIDEO" ? (
                          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[var(--foreground)]">{lesson.title}</span>
                    </div>
                    <svg className="w-4 h-4 text-[var(--foreground)]/20 group-hover:text-[var(--primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
