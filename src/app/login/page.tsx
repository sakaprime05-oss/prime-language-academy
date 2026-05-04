import { auth } from "@/auth";
import { LogoMark } from "@/components/logo";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white relative overflow-hidden">

      <div className="w-full max-w-sm glass-card relative z-10 border-slate-200 bg-white shadow-xl">
        <div className="text-center space-y-4 mb-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-4 ring-1 ring-black/10">
            <LogoMark className="h-16 w-16" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight">Prime Academy</h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
              Plateforme d'excellence
            </p>
          </div>
        </div>

        <LoginForm />

        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-400">
            © {new Date().getFullYear()} Precision Learning
          </p>
        </div>
      </div>
    </main>
  );
}
