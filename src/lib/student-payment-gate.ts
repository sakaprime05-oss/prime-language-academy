import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function hasInitialPayment(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      status: true,
      paymentPlans: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { amountPaid: true },
      },
    },
  });

  if (!user) return false;
  if (user.status === "ACTIVE") return true;
  return (user.paymentPlans[0]?.amountPaid || 0) > 0;
}

export async function requireInitialPayment(userId: string) {
  const allowed = await hasInitialPayment(userId);
  if (!allowed) redirect("/dashboard/student/payments?locked=1");
}
