import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EnglishClubPage() {
    const session = await auth();
    if (!session || session.user?.role !== "STUDENT") redirect("/login");

    const activities = [
        { name: "Débats", icon: "🗣️", desc: "Échangez sur des sujets d'actualité pour forger votre argumentation." },
        { name: "Jeux de rôle", icon: "🎭", desc: "Mettez-vous en situation réelle pour développer votre répartie." },
        { name: "Discussions thématiques", icon: "💡", desc: "Explorez un nouveau thème professionnel ou culturel à chaque session." },
        { name: "Storytelling", icon: "📖", desc: "Apprenez à captiver une audience en racontant des histoires en anglais." },
        { name: "Présentations", icon: "📊", desc: "Structurez vos idées et boostez votre aisance oratoire." },
        { name: "Simulations professionnelles", icon: "👔", desc: "Préparez-vous pour vos réunions, entretiens et négociations." }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
            <header className="relative overflow-hidden rounded-3xl glass-card border-secondary/20 p-8 md:p-12 text-center md:text-left">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:justify-between">
                    <div className="space-y-4 max-w-xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                            Espace Exclusif B2 - C2
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter">
                            Bienvenue dans le <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-500">English Club</span>
                        </h1>
                        <p className="text-[var(--foreground)]/60 font-medium md:text-lg leading-relaxed">
                            Dans un environnement francophone, il est fréquent de perdre son niveau faute de pratique. 
                            Le Club d'Anglais vous permet de maintenir votre fluidité, d'enrichir votre vocabulaire et d'évoluer en immersion.
                        </p>
                    </div>
                </div>
            </header>

            <section className="grid md:grid-cols-3 gap-6">
                <div className="glass-card md:col-span-2 p-8 border-[var(--foreground)]/5 space-y-6">
                    <div>
                        <h2 className="text-xl font-black text-[var(--foreground)] flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">🎯</span>
                            Objectifs du Club
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            "Maintenir la fluidité", 
                            "Enrichir le vocabulaire", 
                            "Développer la confiance à l'oral", 
                            "Évoluer dans un environnement anglophone"
                        ].map((obj, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--foreground)]/5 font-bold text-sm text-[var(--foreground)]/80">
                                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                {obj}
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-[var(--foreground)]/5">
                        <h2 className="text-xl font-black text-[var(--foreground)] flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">📅</span>
                            Programme
                        </h2>
                        <div className="flex gap-4">
                            <div className="p-4 rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] flex-1 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 mb-1">Jours</p>
                                <p className="font-black text-sm text-[var(--foreground)]">Lundi – Samedi</p>
                            </div>
                            <div className="p-4 rounded-2xl border border-secondary/20 bg-secondary/5 flex-1 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-1">Horaires</p>
                                <p className="font-black text-sm text-secondary">16h00 – 18h00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 border-purple-500/20 bg-purple-500/5 group">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl shadow-xl shadow-purple-500/30 mb-6 group-hover:scale-110 transition-transform">
                        💬
                    </div>
                    <h3 className="text-xl font-black text-[var(--foreground)] mb-2">Forum de Partage</h3>
                    <p className="text-sm font-medium text-[var(--foreground)]/60 mb-8">
                        Prolongez les discussions du club en ligne. Échangez avec les autres membres, partagez des ressources et débattez à tout moment.
                    </p>
                    <Link href="/dashboard/student/forum" className="w-full flex items-center justify-center py-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all shadow-lg shadow-purple-500/20 text-sm">
                        Rejoindre le forum du Club →
                    </Link>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-black text-[var(--foreground)]">Les activités au programme</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {activities.map((act, i) => (
                        <div key={i} className="glass-card p-6 border-[var(--foreground)]/5 hover:border-secondary/30 hover:bg-secondary/5 transition-all group cursor-default">
                            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">{act.icon}</div>
                            <h4 className="font-black text-[var(--foreground)] text-sm mb-2">{act.name}</h4>
                            <p className="text-xs font-medium text-[var(--foreground)]/50 leading-relaxed">{act.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
