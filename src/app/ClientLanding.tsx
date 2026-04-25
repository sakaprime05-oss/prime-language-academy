"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ClientLanding({ session, systemSettings, latestArticles = [] }: { session: any, systemSettings: any, latestArticles?: any[] }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#21286E] selection:bg-[#E7162A]/20 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#21286E]/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image 
                src="/icon-512x512.png" 
                alt="Prime Language Academy Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-black tracking-tight text-xl text-[#21286E] hidden sm:block">
              Prime Academy
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#21286E]/70">
            <a href="#method" className="hover:text-[#E7162A] transition-colors">La Méthode</a>
            <a href="#pricing" className="hover:text-[#E7162A] transition-colors">Programmes</a>
            <Link href="/blog" className="hover:text-[#E7162A] transition-colors">Ressources</Link>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="bg-[#21286E] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[#21286E]/90 transition-all text-sm shadow-sm">
                Mon Espace
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-[#21286E] hover:text-[#E7162A] transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="bg-[#E7162A] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[#E7162A]/90 transition-all text-sm shadow-sm">
                  Rejoindre l'Académie
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-40 pb-20 px-6 min-h-[90vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#21286E]/[0.02] to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E7162A]/10 text-[#E7162A] text-xs font-bold uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-[#E7162A] animate-pulse"></span>
            Session intensive : 18 Juin – 19 Août 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-[#21286E] tracking-tight leading-[1.05]"
          >
            Maîtrisez l'anglais. <br />
            <span className="text-[#E7162A]">Propulsez votre carrière.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-[#21286E]/70 font-medium text-lg md:text-xl leading-relaxed"
          >
            Prime Language Academy est le hub d'excellence linguistique pour les professionnels ambitieux. Une méthode immersive, des résultats certifiés.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-[#21286E] text-white font-semibold rounded-lg hover:bg-[#21286E]/90 transition-all shadow-xl shadow-[#21286E]/20 text-lg">
              Commencer l'immersion
            </Link>
            <Link href="/placement-test" className="w-full sm:w-auto px-8 py-4 bg-white border border-[#21286E]/10 text-[#21286E] font-semibold rounded-lg hover:bg-[#FAFAFA] transition-all shadow-sm text-lg">
              Évaluer mon niveau
            </Link>
          </motion.div>
        </div>
      </header>

      {/* METRICS / LOGOS SECTION */}
      <section className="py-12 border-y border-[#21286E]/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale">
          {/* Replace with actual partner logos or trusted badges if needed, for now placeholders */}
          <div className="font-black text-2xl tracking-tighter">EXCELLENCE</div>
          <div className="font-black text-2xl tracking-tighter">IMMERSION</div>
          <div className="font-black text-2xl tracking-tighter">LEADERSHIP</div>
          <div className="font-black text-2xl tracking-tighter">RÉSULTATS</div>
        </div>
      </section>

      {/* METHOD ISO+ SECTION */}
      <section id="method" className="py-32 px-6 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-[#21286E] tracking-tight">
              La méthodologie <span className="text-[#E7162A]">ISO+</span>
            </h2>
            <p className="text-[#21286E]/60 text-lg leading-relaxed">
              Une ingénierie pédagogique conçue pour contourner la traduction mentale et créer des automatismes linguistiques naturels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { num: "01", title: "Immersion Active", desc: "Plongez dans un environnement 100% anglophone. Entraînez votre oreille à capter les nuances et les accents natifs dès le premier jour." },
              { num: "02", title: "Structure Intuitive", desc: "Oubliez les règles de grammaire abstraites. Apprenez la structure de la langue à travers des mises en situation réelles et pratiques." },
              { num: "03", title: "Output Permanent", desc: "Brisez la barrière psychologique. Notre méthode vous force à parler, à débattre et à présenter vos idées en anglais continuellement." },
              { num: "04", title: "Automatisation", desc: "Grâce à la répétition espacée et au feedback instantané, l'anglais devient un réflexe, une seconde nature." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-10 rounded-2xl border border-[#21286E]/5 hover:shadow-xl hover:shadow-[#21286E]/5 transition-all group"
              >
                <div className="text-[#E7162A] font-black text-xl mb-4">{step.num}.</div>
                <h3 className="text-2xl font-bold text-[#21286E] mb-4">{step.title}</h3>
                <p className="text-[#21286E]/60 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 px-6 bg-white border-t border-[#21286E]/5">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-[#21286E] tracking-tight">
              Investissez en vous.
            </h2>
            <p className="text-[#21286E]/60 text-lg leading-relaxed">
              Des programmes flexibles adaptés à vos objectifs professionnels et à votre disponibilité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-[#21286E]/5 flex flex-col">
              <h3 className="font-bold text-xl text-[#21286E] mb-2">Essentiel</h3>
              <div className="text-[#21286E]/60 text-sm mb-6">Pour acquérir les bases solides</div>
              <div className="text-4xl font-black text-[#21286E] mb-8">50.000 <span className="text-lg font-medium text-[#21286E]/50">FCFA/mois</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#21286E]/80"><span className="text-[#E7162A]">✓</span> Accès aux cours de groupe</li>
                <li className="flex items-center gap-3 text-sm text-[#21286E]/80"><span className="text-[#E7162A]">✓</span> Support pédagogique digital</li>
                <li className="flex items-center gap-3 text-sm text-[#21286E]/80"><span className="text-[#E7162A]">✓</span> Évaluations mensuelles</li>
              </ul>
              <Link href="/register" className="w-full block text-center py-3 rounded-lg bg-white border border-[#21286E]/10 text-[#21286E] font-semibold hover:bg-[#FAFAFA] transition-colors">
                Choisir cette offre
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-[#21286E] rounded-3xl p-8 shadow-2xl shadow-[#21286E]/20 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E7162A] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Recommandé
              </div>
              <h3 className="font-bold text-xl text-white mb-2">Intensif Pro</h3>
              <div className="text-white/60 text-sm mb-6">L'immersion totale pour des résultats rapides</div>
              <div className="text-4xl font-black text-white mb-8">80.000 <span className="text-lg font-medium text-white/50">FCFA/mois</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-white/90"><span className="text-[#E7162A]">✓</span> Tout de l'offre Essentiel</li>
                <li className="flex items-center gap-3 text-sm text-white/90"><span className="text-[#E7162A]">✓</span> Sessions de conversation privées</li>
                <li className="flex items-center gap-3 text-sm text-white/90"><span className="text-[#E7162A]">✓</span> Préparation aux entretiens</li>
                <li className="flex items-center gap-3 text-sm text-white/90"><span className="text-[#E7162A]">✓</span> Accès VIP au Club d'Anglais</li>
              </ul>
              <Link href="/register" className="w-full block text-center py-3 rounded-lg bg-[#E7162A] text-white font-semibold hover:bg-[#E7162A]/90 transition-colors">
                Commencer maintenant
              </Link>
            </div>

            {/* Executive Plan */}
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-[#21286E]/5 flex flex-col">
              <h3 className="font-bold text-xl text-[#21286E] mb-2">Executive</h3>
              <div className="text-[#21286E]/60 text-sm mb-6">Sur mesure pour les dirigeants</div>
              <div className="text-4xl font-black text-[#21286E] mb-8">Sur devis</div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#21286E]/80"><span className="text-[#E7162A]">✓</span> Coaching individuel 100%</li>
                <li className="flex items-center gap-3 text-sm text-[#21286E]/80"><span className="text-[#E7162A]">✓</span> Horaires ultra-flexibles</li>
                <li className="flex items-center gap-3 text-sm text-[#21286E]/80"><span className="text-[#E7162A]">✓</span> Anglais des affaires spécifique</li>
              </ul>
              <Link href="/rendez-vous" className="w-full block text-center py-3 rounded-lg bg-white border border-[#21286E]/10 text-[#21286E] font-semibold hover:bg-[#FAFAFA] transition-colors">
                Contacter un conseiller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="py-16 px-6 bg-white border-t border-[#21286E]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3 opacity-90">
              <div className="relative w-10 h-10">
                <Image src="/icon-512x512.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-black tracking-tight text-lg text-[#21286E]">Prime Academy</span>
            </div>
            <p className="max-w-md text-sm text-[#21286E]/60 leading-relaxed">
              L'excellence linguistique au service de vos ambitions. Transformez votre carrière en maîtrisant l'anglais professionnel.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#21286E] mb-6 text-sm">Plateforme</h4>
            <ul className="space-y-4 text-sm text-[#21286E]/60">
              <li><Link href="/login" className="hover:text-[#E7162A] transition-colors">Connexion</Link></li>
              <li><Link href="/register" className="hover:text-[#E7162A] transition-colors">Inscription</Link></li>
              <li><a href="#pricing" className="hover:text-[#E7162A] transition-colors">Tarifs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#21286E] mb-6 text-sm">Contact</h4>
            <ul className="space-y-4 text-sm text-[#21286E]/60">
              <li>📍 Angré 8e Tranche, Zone Bon Prix</li>
              <li><a href="tel:+2250161337864" className="hover:text-[#E7162A] transition-colors">📞 +225 01 61 33 78 64</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#21286E]/5 text-center text-xs font-medium text-[#21286E]/40">
          © {new Date().getFullYear()} Prime Language Academy. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
