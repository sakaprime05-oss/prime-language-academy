"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ClientLanding({ session, systemSettings, latestArticles = [] }: { session: any, systemSettings: any, latestArticles?: any[] }) {
  return (
    <div className="min-h-screen bg-[#0b102b] text-white selection:bg-[#E7162A]/30 font-sans">
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b102b]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
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
            <span className="font-black tracking-tight text-xl text-white hidden sm:block">
              Prime Academy
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/70">
            <a href="#mission" className="hover:text-white transition-colors">Mission</a>
            <a href="#organisation" className="hover:text-white transition-colors">Organisation</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="bg-[#E7162A] text-white font-semibold py-2 px-6 rounded hover:bg-[#E7162A]/90 transition-all text-sm">
                Mon Espace
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors hidden sm:block">
                  Connexion
                </Link>
                <Link href="/register" className="bg-[#E7162A] text-white font-semibold py-2 px-6 rounded hover:bg-[#E7162A]/90 transition-all text-sm">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-40 pb-20 px-6 min-h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#21286E]/20 to-[#0b102b] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center border border-white/10 rounded-full px-5 py-2 bg-white/5 backdrop-blur-sm"
          >
            <span className="text-sm font-bold tracking-widest uppercase text-white/80">
              PROGRAMME OFFICIEL DE FORMATION : PLA
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1]"
          >
            Parlez anglais. <br />
            <span className="text-[#E7162A]">Vivez des opportunités.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-white/70 font-medium text-lg md:text-xl leading-relaxed"
          >
            SESSION DE LANCEMENT : <span className="text-white font-bold">21 JUIN – 19 AOUT 2026 (02 MOIS)</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-[#E7162A] text-white font-bold rounded hover:bg-[#E7162A]/90 transition-all text-lg">
              S'inscrire maintenant
            </Link>
            <a href="#mission" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded hover:bg-white/10 transition-all text-lg">
              Découvrir le programme
            </a>
          </motion.div>
        </div>
      </header>

      {/* 1. MISSION */}
      <section id="mission" className="py-24 px-6 bg-[#21286E]/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl">
            <div className="text-[#E7162A] font-black text-xl mb-4">1.</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase mb-6">
              NOTRE MISSION : L’IMMERSION PREMIUM À ABIDJAN
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Dans un environnement majoritairement francophone, PLA transforme l'anglais en une compétence réelle et vivante. Pour cette session, nous doublons nos capacités pour vous offrir un cadre d'apprentissage d'élite :
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Infrastructure", desc: "Salles de formation climatisées permettant de mener confortablement les activités." },
              { title: "Encadrement", desc: "Formateurs experts mobilisés pour un suivi personnalisé." },
              { title: "Méthode ISO+", desc: "Un processus dynamique (Input, Structure, Output, Automatisation) pour transformer vos connaissances en réflexes naturels." }
            ].map((item, i) => (
              <div key={i} className="bg-[#0b102b] p-8 rounded border border-white/5 hover:border-white/20 transition-colors">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#E7162A]"></span>
                  {item.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ORGANISATION DES SÉANCES (Moved up for better logical flow before pricing) */}
      <section id="organisation" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="text-[#E7162A] font-black text-xl">4.</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              ORGANISATION DES SÉANCES
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Les cours se déroulent du <strong className="text-white">Lundi au Dimanche</strong> avec deux vagues au choix :
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <div className="bg-[#21286E]/20 border border-[#21286E] px-8 py-6 rounded">
                <div className="font-bold text-lg text-white mb-2">Vague 1</div>
                <div className="text-2xl font-black text-[#E7162A]">16h00 – 18h00</div>
              </div>
              <div className="bg-[#21286E]/20 border border-[#21286E] px-8 py-6 rounded">
                <div className="font-bold text-lg text-white mb-2">Vague 2</div>
                <div className="text-2xl font-black text-[#E7162A]">18h00 – 20h00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GRILLE TARIFAIRE */}
      <section id="pricing" className="py-24 px-6 bg-[#21286E]/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="text-[#E7162A] font-black text-xl">2.</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              GRILLE TARIFAIRE "À LA CARTE"
            </h2>
            <div className="text-xl font-bold text-white/70">(SESSION DE 02 MOIS)</div>
            
            <div className="mt-8 inline-block bg-[#E7162A]/10 border border-[#E7162A]/20 px-6 py-4 rounded text-left">
              <div className="font-bold text-[#E7162A] mb-2 flex items-center gap-2">
                <span>🎁</span> OFFRE DE LANCEMENT : INSCRIPTION OFFERTE (0 FCFA)
              </div>
              <p className="text-white/80 text-sm">
                Le programme est ouvert aux inscriptions 8 semaines avant le début des cours, vous permettant de solder votre participation en toute sérénité avant le démarrage.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Intensité</th>
                  <th className="py-4 px-6 font-semibold">Fréquence Hebdomadaire</th>
                  <th className="py-4 px-6 font-semibold text-right text-white">Tarif Total (Pour 2 Mois)</th>
                </tr>
              </thead>
              <tbody className="text-lg">
                {[
                  { name: "Loisir", freq: "1 séance / semaine", price: "50 000 FCFA" },
                  { name: "Essentiel", freq: "2 séances / semaine", price: "70 000 FCFA" },
                  { name: "Équilibre", freq: "3 séances / semaine", price: "90 000 FCFA" },
                  { name: "Performance", freq: "4 séances / semaine", price: "110 000 FCFA" },
                  { name: "Intensif", freq: "5 séances / semaine", price: "130 000 FCFA" },
                  { name: "Immersion", freq: "6 séances / semaine", price: "150 000 FCFA", highlight: true },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-white/5 transition-colors ${row.highlight ? 'bg-[#E7162A]/5' : 'hover:bg-white/5'}`}>
                    <td className="py-5 px-6 font-bold text-white">{row.name}</td>
                    <td className="py-5 px-6 text-white/70">{row.freq}</td>
                    <td className="py-5 px-6 text-right font-black text-[#E7162A]">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="max-w-4xl mx-auto bg-[#0b102b] p-8 rounded border border-white/5 space-y-6">
            <div>
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-[#E7162A]">•</span> Choix du Parcours
              </h4>
              <p className="text-white/60 text-sm leading-relaxed pl-5">
                Vous devez opter soit pour la Formation Régulière (bases et structure), soit pour le Club d’Anglais (pratique et fluidité). Ces parcours sont distincts et ne sont pas cumulables simultanément. Apres votre programme de formation régulière (2 mois) vous rejoignez le programme du Club d’Anglais.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-[#E7162A]">•</span> Paiement
              </h4>
              <p className="text-white/60 text-sm leading-relaxed pl-5">
                Le solde total doit être réglé avant le début de la formation pour garantir votre place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="text-[#E7162A] font-black text-xl">3.</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              RÉPONSES À VOS PRÉOCCUPATIONS (FAQ)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Flexibilité et Absences", desc: "En cas d'imprévu, vous avez la possibilité de rattraper votre séance sur l'autre vague horaire de la même journée ou sur un autre créneau de la semaine." },
              { title: "Supports Pédagogiques", desc: "Aucun livre à acheter. Tous les supports de cours sont offerts en format numérique, accessibles sur votre smartphone ou tablette pour réviser partout." },
              { title: "Reconnaissance", desc: "Nous délivrons une Attestation de Formation en fin de session, certifiant votre assiduité et votre niveau selon le cadre européen (A1 à C2)." },
              { title: "Confort au Centre", desc: "Profitez d'un espace sécurisé avec WiFi haut débit, parking, et un espace \"breakout\" pour vos rafraîchissements." }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 p-6 rounded border border-white/5">
                <h4 className="font-bold text-white mb-3">{faq.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{faq.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INSCRIPTION & RÉSERVATION (FOOTER) */}
      <footer className="py-24 px-6 bg-[#060a1f] border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[#E7162A] font-black text-xl mb-4">5.</div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">
              INSCRIPTION & RÉSERVATION
            </h2>
          </div>

          <div className="bg-[#21286E]/20 p-8 rounded border border-[#21286E] space-y-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="text-[#E7162A] font-bold mt-1">•</span>
                <div>
                  <strong className="text-white block mb-1">Test de niveau gratuit :</strong>
                  <span className="text-white/60">Indispensable pour votre orientation.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#E7162A] font-bold mt-1">•</span>
                <div>
                  <strong className="text-white block mb-1">RDV Consultant et Responsable du programme (Visio ou Vocal) :</strong>
                  <span className="text-white/60">Mardi (10h-14h) et Jeudi (9h-14h).</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#E7162A] font-bold mt-1">•</span>
                <div>
                  <strong className="text-white block mb-1">Localisation :</strong>
                  <span className="text-white/60">Angré 8e Tranche, Zone Bon Prix (à 120m en face du carrefour Pain du Quotidien).</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#E7162A] font-bold mt-1">•</span>
                <div>
                  <strong className="text-white block mb-1">WhatsApp / Tel :</strong>
                  <a href="tel:+2250161337864" className="text-[#E7162A] font-bold hover:underline">+225 01 61 33 78 64</a>
                </div>
              </li>
            </ul>

            <div className="pt-8 mt-8 border-t border-white/10 text-center">
              <Link href="/register" className="inline-block px-10 py-4 bg-[#E7162A] text-white font-bold rounded hover:bg-[#E7162A]/90 transition-all text-lg">
                Procéder à l'inscription
              </Link>
            </div>
          </div>

          <div className="mt-20 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6 grayscale opacity-50">
              <Image src="/icon-512x512.png" alt="Logo" fill className="object-contain" />
            </div>
            <div className="font-bold text-white/80 tracking-widest uppercase mb-4">
              PRIME LANGUAGE ACADEMY
            </div>
            <div className="text-white/40 text-sm">
              Parlez anglais. Vivez des opportunités.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
