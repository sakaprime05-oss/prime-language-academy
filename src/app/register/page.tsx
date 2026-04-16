import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";
import Link from "next/link";

export default async function RegisterPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden">
            {/* Premium Background Blobs */}
            <div className="bg-blob w-[500px] h-[500px] bg-primary -top-20 -left-20 animate-float opacity-10"></div>
            <div className="bg-blob w-[400px] h-[400px] bg-secondary bottom-0 right-0 animate-float opacity-10" style={{ animationDelay: '-3s' }}></div>

            <div className="w-full max-w-sm glass-card relative z-10 border-white/20 dark:border-white/10 shadow-2xl">
                <div className="text-center space-y-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                        <span className="text-2xl font-black text-white -rotate-3">P</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Rejoindre Prime</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/40 mt-1">Établissement d'excellence</p>
                    </div>
                </div>

                <RegisterForm />

                <div className="pt-8 flex flex-col items-center gap-4">
                    <p className="text-xs font-bold text-[var(--foreground)]/50">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="text-primary hover:underline underline-offset-4">Se connecter</Link>
                    </p>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"></div>
                    <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-[var(--foreground)]/30">
                        © {new Date().getFullYear()} Precision Learning
                    </p>
                </div>
            </div>
        </main>
    );
}
