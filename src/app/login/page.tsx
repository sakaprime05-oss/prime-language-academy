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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden">
      <div className="bg-blob w-[500px] h-[500px] bg-primary -top-20 -left-20 animate-float"></div>
      <div className="bg-blob w-[400px] h-[400px] bg-secondary bottom-0 right-0 animate-float" style={{ animationDelay: "-3s" }}></div>
      <div className="bg-blob w-[300px] h-[300px] bg-accent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"></div>

      <div className="w-full max-w-sm glass-card relative z-10 border-white/20 dark:border-white/10 shadow-2xl">
        <div className="text-center space-y-4 mb-10">
          <div className="mx-auto flex h-20 w-24 items-center justify-center rounded-[2rem] bg-white p-3 shadow-lg shadow-primary/15 ring-1 ring-black/5">
            <LogoMark className="h-12 w-16" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Prime Academy</h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/40 mt-1">
              Plateforme d'excellence
            </p>
          </div>
        </div>

        <LoginForm />

        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"></div>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--foreground)]/30">
            © {new Date().getFullYear()} Precision Learning
          </p>
        </div>
      </div>
    </main>
  );
}
