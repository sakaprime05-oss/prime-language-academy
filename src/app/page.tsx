import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { PrimeLogo } from "@/components/logo";
import { getSystemSettings } from "@/app/actions/system-settings";
import PricingSection from "./(landing)/PricingSection";

const isoSteps = [
  {
    number: "01",
    key: "INPUT",
    label: "Nourrir la compréhension",
    color: "from-blue-500 to-cyan-500",
    icon: "🧠",
    description: "Comprendre avant de parler, mais surtout comprendre en contexte. Nous exposons l'apprenant à la langue à travers des mots et expressions en contexte réel, des blocs de sens (chunks) directement utilisables, et une immersion progressive dans les sons et rythmes de la langue.",
    highlight: "L'objectif : créer une familiarité naturelle avec l'anglais tel qu'il est réellement utilisé.",
    note: "L'input n'est pas passif. Il est actif, répété et réutilisé régulièrement pour favoriser la mémorisation durable."
  },
  {
    number: "02",
    key: "STRUCTURE",
    label: "Construire une base claire et utile",
    color: "from-violet-500 to-purple-600",
    icon: "🏗️",
    description: "Donner des repères simples pour organiser la pensée. Nous aidons l'apprenant à structurer ses acquis grâce à une grammaire fonctionnelle, simple et immédiatement applicable, les fonctions langagières essentielles (se présenter, demander, expliquer, convaincre…), et des comparaisons stratégiques avec le français pour lever les blocages.",
    highlight: "L'objectif : comprendre comment fonctionne la langue sans tomber dans la complexité inutile.",
    note: "La structure reste légère et toujours orientée vers l'expression."
  },
  {
    number: "03",
    key: "OUTPUT",
    label: "S'exprimer dès le début",
    color: "from-rose-500 to-pink-600",
    icon: "🗣️",
    description: "Parler n'est pas une étape finale, c'est un processus continu. Dès les premières séances, l'apprenant est amené à s'exprimer avec les moyens qu'il possède : jeux de rôle et mises en situation réelles, dialogues guidés puis libres, tâches concrètes (appels, présentations, interactions professionnelles), et défis de communication avec contrainte de temps.",
    highlight: "L'objectif : développer la fluidité, la spontanéité et la confiance.",
    note: "Chaque séance implique une prise de parole active."
  },
  {
    number: "04",
    key: "AUTOMATISATION",
    label: "Transformer en réflexes",
    color: "from-amber-500 to-orange-500",
    icon: "⚡",
    description: "La maîtrise réelle commence lorsque l'apprenant n'a plus besoin de réfléchir pour parler. Nous développons l'automatisation à travers la répétition intelligente et espacée, des exercices rapides de questions-réponses, la réutilisation constante des structures, et des activités sous pression (réagir vite, répondre sans préparation).",
    highlight: "L'objectif : transformer les connaissances en réflexes naturels.",
    note: "C'est cette étape qui permet de passer de 'je comprends' à 'je parle facilement'."
  },
];

const whyUs = [
  { icon: "🎯", title: "Pédagogie claire & structurée", desc: "Un programme bâti sur la méthode ISO+, pensé pour les francophones." },
  { icon: "🤝", title: "Accompagnement humain", desc: "Des formateurs experts qui vous suivent individuellement." },
  { icon: "⏰", title: "Formats flexibles", desc: "Vague 1 (16h-18h) ou Vague 2 (18h-20h), du Lundi au Dimanche." },
  { icon: "🔊", title: "Pratique orale dès le Jour 1", desc: "Vous parlez dès la première séance. Garantit la confiance rapidement." },
  { icon: "🌍", title: "Ancrée en Afrique francophone", desc: "Pensée pour nos réalités, nos blocages et nos ambitions." },
  { icon: "📜", title: "Attestation certifiée", desc: "Une certification européenne (A1 à C2) reconnue à la fin de votre session." },
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

export default async function LandingPage() {
  const session = await auth();
  const systemSettings = await getSystemSettings();

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-primary/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--foreground)]/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PrimeLogo className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[var(--foreground)]/50">
            <a href="#method" className="hover:text-primary transition-colors">Méthode ISO+</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Tarifs</a>
            <a href="#location" className="hover:text-primary transition-colors">Localisation</a>
          </div>
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

      {/* ═══════════ HERO ═══════════ */}
      <header className="relative pt-40 pb-20 px-6 overflow-hidden">
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
            <a href="#method" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all flex items-center justify-center gap-2">
              Découvrir la méthode ISO+
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </a>
          </div>

          {/* 3 pillars preview */}
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

      {/* ═══════════ WHY US ═══════════ */}
      <section className="py-24 px-6 bg-[var(--foreground)]/[0.01]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              Notre Histoire
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)]">Pourquoi Prime Language Academy ?</h2>
            <p className="text-[var(--foreground)]/50 font-medium text-base leading-relaxed">
              Dans l'espace francophone africain, la maîtrise de langues étrangères reste un frein majeur pour beaucoup, alors même qu'elle est devenue une compétence clé dans le monde professionnel, académique et entrepreneurial.
            </p>
            <div className="text-left bg-[var(--foreground)]/5 border-l-4 border-primary rounded-r-2xl p-6 text-sm text-[var(--foreground)]/70 leading-relaxed space-y-3">
              <p>Prime Language Academy est née d'un constat simple, mais profond : dans un environnement majoritairement francophone, apprendre une langue étrangère reste un défi majeur pour beaucoup, malgré les nombreuses tentatives et offres de formation existantes.</p>
              <p className="font-bold text-[var(--foreground)]/90">Pourquoi ? Parce que ces offres ne prennent pas toujours en compte les réalités spécifiques des apprenants francophones :</p>
              <ul className="space-y-1 ml-4">
                <li>• les blocages psychologiques liés à l'oral,</li>
                <li>• la peur de faire des fautes,</li>
                <li>• l'absence d'un cadre progressif,</li>
                <li>• le manque d'une approche réellement pratique et adaptée.</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {whyUs.map((item, idx) => (
              <div key={idx} className="glass-card border-white/20 dark:border-white/5 hover:border-primary/30 transition-all group">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className="font-black text-[var(--foreground)] mb-2">{item.title}</h4>
                <p className="text-sm text-[var(--foreground)]/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-3xl p-8">
            <p className="text-lg font-black text-[var(--foreground)] leading-relaxed">
              "Nous ne formons pas juste à parler anglais.<br />
              <span className="text-primary">Nous aidons à débloquer le potentiel</span> de celles et ceux qui veulent faire la différence."
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ METHOD ISO+ ═══════════ */}
      <section id="method" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              Notre Méthode Exclusive
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)]">
              La Méthode{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ISO+</span>
            </h2>
            <p className="text-[var(--foreground)]/50 font-medium max-w-2xl mx-auto leading-relaxed">
              <strong className="text-[var(--foreground)]/80">Input, Structure, Output + Automatisation.</strong><br />
              Un parcours complet qui mène de la compréhension à l'expression fluide, pensée pour les francophones, ancrée dans des situations réelles.
            </p>
          </div>

          {/* ISO Steps */}
          <div className="space-y-8">
            {isoSteps.map((step, idx) => (
              <div
                key={step.key}
                className={`group relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${idx % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                {/* Visual side */}
                <div className={`relative flex items-center justify-center p-12 rounded-3xl bg-gradient-to-br ${step.color} bg-opacity-10 overflow-hidden min-h-[220px]`}>
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent" />
                  <div className="text-center relative z-10">
                    <div className="text-7xl mb-4">{step.icon}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-2">Pilier {step.number}</div>
                    <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
                      {step.key}
                    </div>
                  </div>
                </div>

                {/* Text side */}
                <div className="space-y-5">
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r ${step.color} mb-2`}>
                      Pilier {step.number} — {step.key}
                    </div>
                    <h3 className="text-2xl font-black text-[var(--foreground)]">{step.label}</h3>
                  </div>
                  <p className="text-sm text-[var(--foreground)]/60 leading-relaxed">{step.description}</p>
                  <div className="bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl p-4">
                    <p className="text-sm font-bold text-[var(--foreground)]/80">{step.highlight}</p>
                  </div>
                  <div className={`text-xs text-[var(--foreground)]/50 italic border-l-2 pl-4`} style={{ borderColor: `var(--primary)` }}>
                    {step.note}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary banner */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 border border-primary/20 rounded-3xl p-10 text-center space-y-4">
            <div className="flex justify-center gap-6 flex-wrap text-lg font-black mb-6">
              {["INPUT", "STRUCTURE", "OUTPUT", "AUTOMATISATION"].map((k, i) => (
                <span key={k} className="flex items-center gap-2">
                  <span className="text-primary">{k}</span>
                  {i < 3 && <span className="text-[var(--foreground)]/20">→</span>}
                </span>
              ))}
            </div>
            <p className="text-base text-[var(--foreground)]/70 font-medium max-w-2xl mx-auto leading-relaxed">
              La méthode ISO+ est pensée pour les francophones, ancrée dans des situations réelles et orientée vers des résultats concrets. Grâce à l'intégration de l'automatisation et à une forte pratique orale dès le début, elle permet aux apprenants de parler anglais avec <strong>confiance, spontanéité et efficacité</strong>.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 mt-4 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:opacity-90 transition-opacity">
              Commencer avec la méthode ISO+
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ PROGRAMS ═══════════ */}
      <section className="py-16 px-6 bg-[var(--foreground)]/[0.01]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)]">Nos Programmes</h2>
            <p className="text-[var(--foreground)]/60 font-medium max-w-xl mx-auto">Formation Régulière + Club d'Anglais. Deux formats complémentaires.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card hover:border-primary/50 transition-all border-white/40 dark:border-white/5 relative overflow-hidden group p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
                <div className="relative z-10 space-y-4">
                    <div className="text-3xl">📚</div>
                    <h3 className="text-2xl font-black text-[var(--foreground)]">Formation Régulière</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Bases & Structure</span>
                    <p className="text-sm font-medium text-[var(--foreground)]/60">Pour reconstruire vos bases linguistiques et maîtriser la structure fondamentale de l'anglais. Notre méthode ISO+ est appliquée dès la première séance avec un encadrement personnalisé de nos formateurs experts.</p>
                    <ul className="space-y-2 pt-2">
                      {["Méthode ISO+ complète", "Suivi hebdomadaire", "Supports numériques offerts", "Attestation de formation certifiée"].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]/60">
                          <svg className="w-3 h-3 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                </div>
            </div>

            <div className="glass-card hover:border-secondary/50 transition-all border-white/40 dark:border-white/5 relative overflow-hidden group p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
                <div className="relative z-10 space-y-4">
                    <div className="text-3xl">🎯</div>
                    <h3 className="text-2xl font-black text-[var(--foreground)]">Club d'Anglais</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">Pratique & Fluidité</span>
                    <p className="text-sm font-medium text-[var(--foreground)]/60">Après votre programme régulier, rejoignez le Club pour transformer vos acquis en automatismes fluides. Des séances de conversation libres et dirigées pour consolider tous les piliers de la méthode ISO+.</p>
                    <ul className="space-y-2 pt-2">
                      {["Conversations libres & thématiques", "Débats guidés", "Ateliers de prononciation", "Simulations professionnelles"].map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]/60">
                          <svg className="w-3 h-3 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SCHEDULE ═══════════ */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-[var(--foreground)]">Organisation des Séances</h2>
                    <p className="text-sm font-medium text-[var(--foreground)]/60">Les cours se déroulent du <b>Lundi au Dimanche</b> avec deux vagues au choix selon votre emploi du temps.</p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-[var(--foreground)]/5">
                        <span className="font-bold text-sm">🌅 Vague 1</span>
                        <span className="font-black text-primary">16h00 – 18h00</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-[var(--foreground)]/5">
                        <span className="font-bold text-sm">🌆 Vague 2</span>
                        <span className="font-black text-primary">18h00 – 20h00</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
              🎁 Offre de lancement : Inscription Offerte (0 FCFA)
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)]">Grille Tarifaire "À LA CARTE"</h2>
            <p className="text-[var(--foreground)]/50 font-medium">Payez selon l'intensité souhaitée pour votre session de 02 mois. Cliquez sur <strong>"En savoir plus"</strong> pour découvrir les détails de chaque parcours.</p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-24 px-6 bg-[var(--foreground)]/[0.02]">
        <div className="max-w-4xl mx-auto space-y-16">
            <h2 className="text-3xl font-black text-center">Réponses à vos préoccupations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="space-y-3 p-6 glass-card border-white/20 dark:border-white/5">
                        <h4 className="font-black text-primary uppercase text-xs tracking-widest">{faq.q}</h4>
                        <p className="text-sm font-medium text-[var(--foreground)]/60 leading-relaxed">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ═══════════ LOCATION ═══════════ */}
      <section id="location" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              📍 Nous Trouver
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)]">Notre Localisation</h2>
            <p className="text-[var(--foreground)]/50 font-medium">Situés au cœur d'Abidjan, dans un cadre moderne et accessible.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Info cards */}
            <div className="space-y-4">
              <div className="glass-card border-white/20 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">📍</div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Adresse</div>
                    <p className="text-sm font-bold text-[var(--foreground)]/80">Angré 8ème Tranche<br />Zone Bon Prix, Cocody<br />Abidjan, Côte d'Ivoire</p>
                  </div>
                </div>
              </div>
              <div className="glass-card border-white/20 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">📞</div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Téléphone</div>
                    <a href="tel:+2250161337864" className="text-sm font-bold text-[var(--foreground)]/80 hover:text-primary transition-colors">+225 01 61 33 78 64</a>
                  </div>
                </div>
              </div>
              <div className="glass-card border-white/20 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">✉️</div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Email</div>
                    <a href="mailto:contact@prime.ci" className="text-sm font-bold text-[var(--foreground)]/80 hover:text-primary transition-colors">contact@prime.ci</a>
                  </div>
                </div>
              </div>
              <div className="glass-card border-white/20 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">🕐</div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Horaires</div>
                    <p className="text-sm font-bold text-[var(--foreground)]/80">Lun – Dim : 16h00 – 20h00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="md:col-span-2 rounded-3xl overflow-hidden border border-[var(--foreground)]/10 shadow-xl" style={{ height: '420px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.3!2d-3.9517!3d5.3599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAngr%C3%A9+8%C3%A8me+Tranche%2C+Abidjan%2C+C%C3%B4te+d%27Ivoire!5e0!3m2!1sfr!2sci!4v1684000000000!5m2!1sfr!2sci"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Prime Language Academy - Localisation Angré 8ème Tranche Abidjan"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 rounded-3xl p-12">
          <div className="text-5xl">🎓</div>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--foreground)]">
            Prêt à commencer votre transformation ?
          </h2>
          <p className="text-[var(--foreground)]/60 font-medium leading-relaxed">
            Rejoignez Prime Language Academy dès aujourd'hui.<br/>
            <strong className="text-primary">L'inscription est offerte.</strong> Ne manquez pas votre session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary px-10 py-5 text-base">
              S'inscrire maintenant — Gratuit
            </Link>
            <Link href="/placement-test" className="px-10 py-5 rounded-2xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all">
              Tester mon niveau d'anglais
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-20 px-6 border-t border-[var(--foreground)]/5 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <PrimeLogo className="h-10" />
            <p className="max-w-xs text-sm text-[var(--foreground)]/40 font-medium leading-relaxed">
              PRIME LANGUAGE ACADEMY : Parlez anglais. Vivez des opportunités.<br />
              Méthode ISO+ — pensée pour les francophones africains.
            </p>
            <div className="flex gap-4">
              <a href="tel:+2250161337864" className="w-10 h-10 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center hover:bg-primary/10 transition-colors text-lg">📞</a>
              <a href="mailto:contact@prime.ci" className="w-10 h-10 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center hover:bg-primary/10 transition-colors text-lg">✉️</a>
              <a href="#location" className="w-10 h-10 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center hover:bg-primary/10 transition-colors text-lg">📍</a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[var(--foreground)] mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground)]/50 font-bold">
              <li><Link href="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Inscription</Link></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Tarifs</a></li>
              <li><a href="#method" className="hover:text-primary transition-colors">Méthode ISO+</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[var(--foreground)] mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground)]/50 font-bold">
              <li>Angré 8e Tranche, Zone Bon Prix</li>
              <li>Cocody, Abidjan</li>
              <li><a href="mailto:contact@prime.ci" className="hover:text-primary transition-colors">contact@prime.ci</a></li>
              <li><a href="tel:+2250161337864" className="hover:text-primary transition-colors">+225 01 61 33 78 64</a></li>
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
