import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { PrimeLogo } from "@/components/logo";
import { getSystemSettings } from "@/app/actions/system-settings";

export default async function LandingPage() {
  const session = await auth();
  const systemSettings = await getSystemSettings();
  const levels = [
    {
      id: "loisir",
      name: "Parcours Loisir",
      price: 50000,
      description: "1 séance par semaine. Idéal pour s'initier ou maintenir un contact léger avec la langue.",
      features: ["Accès flexible", "Supports numériques inclus", "Attestation de formation"]
    },
    {
      id: "essentiel",
      name: "Parcours Essentiel",
      price: 70000,
      description: "2 séances par semaine. Parfait pour construire des bases solides avec régularité.",
      features: ["Programme structuré", "Suivi personnalisé", "Supports numériques inclus"]
    },
    {
      id: "equilibre",
      name: "Parcours Équilibre",
      price: 90000,
      description: "3 séances par semaine. Le juste milieu pour progresser sereinement.",
      features: ["Pratique orale renforcée", "Accès WiFi inclus", "Attestation certifiée"]
    },
    {
      id: "performance",
      name: "Parcours Performance",
      price: 110000,
      description: "4 séances par semaine. Pour ceux qui veulent des résultats tangibles rapidement.",
      features: ["Immersion dynamique", "Corrections intensives", "Espace breakout accessible"]
    },
    {
      id: "intensif",
      name: "Parcours Intensif",
      price: 130000,
      description: "5 séances par semaine. Une transformation radicale de votre anglais.",
      features: ["Quasi-quotidien", "Objectifs hebdomadaires", "Méthode ISO+ appliquée"]
    },
    {
      id: "immersion",
      name: "Parcours Immersion",
      price: 150000,
      description: "6 séances par semaine. L'élite de la formation pour une maîtrise totale.",
      features: ["Immersion totale", "Priorité aux séances", "Expertise formateurs premium"]
    }
  ];

  const faqs = [
    {
      q: "Flexibilité et Absences",
      a: "En cas d'imprévu, rattrapez votre séance sur l'autre vague horaire de la même journée ou sur un autre créneau de la semaine."
    },
    {
      q: "Supports Pédagogiques",
      a: "Aucun livre à acheter. Tous les supports de cours sont offerts en format numérique, accessibles sur smartphone ou tablette."
    },
    {
      q: "Reconnaissance",
      a: "Nous délivrons une Attestation de Formation en fin de session, certifiant votre assiduité et votre niveau européen (A1 à C2)."
    },
    {
      q: "Confort au Centre",
      a: "Espace sécurisé avec WiFi haut débit, parking, et espace 'breakout' pour vos rafraîchissements."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-primary/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--foreground)]/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PrimeLogo className="h-10" />
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="btn-primary !py-2 !px-5 text-sm w-auto">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-black text-[var(--foreground)]/60 hover:text-primary transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary !py-2 !px-5 text-sm w-auto">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Decor */}
        <div className="bg-blob w-[600px] h-[600px] bg-primary/10 top-[-200px] right-[-100px] animate-float"></div>
        <div className="bg-blob w-[400px] h-[400px] bg-secondary/10 bottom-[-100px] left-[-100px] animate-float" style={{ animationDelay: '-4s' }}></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            IMMERSION PREMIUM À ABIDJAN
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] tracking-tighter leading-[0.9]">
            Parlez anglais. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Vivez des opportunités.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[var(--foreground)]/50 font-medium md:text-lg">
            Dans un environnement francophone, PLA transforme l'anglais en une compétence réelle. <br/>
            <span className="text-primary font-bold">{systemSettings.currentSessionName}</span>. Durée : {systemSettings.currentSessionDuration}.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary w-full sm:w-auto px-10 py-5 text-lg">
              S'inscrire maintenant (Insc. Offerte)
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all flex items-center justify-center">
              Voir la grille tarifaire
            </Link>
          </div>

          {/* Intro Text */}
          <div className="max-w-4xl mx-auto pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-[var(--foreground)]/5 rounded-3xl border border-[var(--foreground)]/10">
                <div className="text-primary font-black mb-2 uppercase text-[10px] tracking-widest">Infrastructure</div>
                <p className="text-xs font-medium text-[var(--foreground)]/60 leading-relaxed">Salles de formation climatisées permettant de mener confortablement les activités.</p>
            </div>
            <div className="p-6 bg-[var(--foreground)]/5 rounded-3xl border border-[var(--foreground)]/10">
                <div className="text-primary font-black mb-2 uppercase text-[10px] tracking-widest">Encadrement</div>
                <p className="text-xs font-medium text-[var(--foreground)]/60 leading-relaxed">Formateurs experts mobilisés pour un suivi personnalisé et rigoureux.</p>
            </div>
            <div className="p-6 bg-[var(--foreground)]/5 rounded-3xl border border-[var(--foreground)]/10">
                <div className="text-primary font-black mb-2 uppercase text-[10px] tracking-widest">Méthode ISO+</div>
                <p className="text-xs font-medium text-[var(--foreground)]/60 leading-relaxed">Input, Structure, Output, Automatisation pour transformer vos connaissances en réflexes.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Programs Section */}
      <section className="py-24 px-6 bg-[var(--foreground)]/[0.01]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)]">Nos Parcours</h2>
            <p className="text-[var(--foreground)]/60 font-medium max-w-xl mx-auto">Ces parcours sont distincts et ne sont pas cumulables simultanément.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card hover:border-primary/50 transition-all border-white/40 dark:border-white/5 relative overflow-hidden group p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-black text-[var(--foreground)]">Formation Régulière</h3>
                    <div className="space-y-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Bases & Structure</span>
                        <p className="text-sm font-medium text-[var(--foreground)]/60">Pour reconstruire vos bases linguistiques et maîtriser la structure fondamentale de l'anglais.</p>
                    </div>
                </div>
            </div>

            <div className="glass-card hover:border-secondary/50 transition-all border-white/40 dark:border-white/5 relative overflow-hidden group p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-black text-[var(--foreground)]">Club d’Anglais</h3>
                    <div className="space-y-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">Pratique & Fluidité</span>
                        <p className="text-sm font-medium text-[var(--foreground)]/60">Après votre programme régulier, rejoignez le Club pour transformer vos acquis en automatismes fluides.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organisation Schedule */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-[var(--foreground)]">Organisation des Séances</h2>
                    <p className="text-sm font-medium text-[var(--foreground)]/60">Les cours se déroulent du <b>Lundi au Dimanche</b> avec deux vagues au choix selon votre emploi du temps.</p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-[var(--foreground)]/5">
                        <span className="font-bold text-sm">Vague 1</span>
                        <span className="font-black text-primary">16h00 – 18h00</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-[var(--foreground)]/5">
                        <span className="font-bold text-sm">Vague 2</span>
                        <span className="font-black text-primary">18h00 – 20h00</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                🎁 Offre de lancement : Inscription Offerte (0 FCFA)
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)]">Grille Tarifaire "À LA CARTE"</h2>
            <p className="text-[var(--foreground)]/50 font-medium">Payez selon l'intensité souhaitée pour votre session de 02 mois.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels.map((level) => (
              <div key={level.id} className="glass-card flex flex-col justify-between group hover:border-primary/50 transition-all border-white/40 dark:border-white/5 relative overflow-hidden backdrop-blur-md">
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-white transition-all">
                      {level.id.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[var(--foreground)]">{level.name}</h3>
                    <div className="mt-2 text-3xl font-black text-primary">
                      {level.price.toLocaleString()} F
                    </div>
                    <p className="text-xs text-[var(--foreground)]/50 mt-4 font-medium min-h-[40px]">
                      {level.description}
                    </p>
                  </div>
                  <ul className="space-y-2 pt-4 border-t border-[var(--foreground)]/5">
                    {level.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-[var(--foreground)]/70 uppercase tracking-tight">
                        <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-8 relative z-10">
                  <Link href={`/register?plan=${level.id}`} className="w-full text-center flex items-center justify-center px-8 py-4 rounded-2xl bg-[var(--foreground)]/5 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
                    Choisir ce parcours
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-[var(--foreground)]/[0.02]">
        <div className="max-w-4xl mx-auto space-y-16">
            <h2 className="text-3xl font-black text-center">Réponses à vos préoccupations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="space-y-3">
                        <h4 className="font-black text-primary uppercase text-xs tracking-widest">{faq.q}</h4>
                        <p className="text-sm font-medium text-[var(--foreground)]/60 leading-relaxed">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[var(--foreground)]/5 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-lg font-black shadow-lg shadow-primary/20 rotate-3">
                <span className="-rotate-3">P</span>
              </div>
              <span className="text-lg font-black text-[var(--foreground)] tracking-tight">Prime Academy</span>
            </div>
            <p className="max-w-xs text-sm text-[var(--foreground)]/40 font-medium">
                PRIME LANGUAGE ACADEMY : Parlez anglais. Vivez des opportunités.
            </p>
          </div>

          <div>
            <h4 className="font-black text-[var(--foreground)] mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground)]/50 font-bold">
              <li><Link href="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Inscription</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Tarifs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[var(--foreground)] mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground)]/50 font-bold">
              <li>Angré 8e Tranche, Zone Bon Prix</li>
              <li>contact@prime.ci</li>
              <li>+225 01 61 33 78 64</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-[var(--foreground)]/5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/20">
          © {new Date().getFullYear()} Precision Learning Group. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
