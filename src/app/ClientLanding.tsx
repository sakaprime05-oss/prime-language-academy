"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Clock, MapPin, Phone, Shield, Target, GraduationCap, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ClientLanding({ session }: { session: any }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-[#E7162A]/30">
      
      {/* NAVIGATION - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
              <Image 
                src="/icon-512x512.png" 
                alt="PLA Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-extrabold tracking-tight text-xl text-white hidden sm:block">
              Prime Academy
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#mission" className="hover:text-white transition-colors">Mission</a>
            <a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#organisation" className="hover:text-white transition-colors">Organisation</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Button asChild className="bg-[#E7162A] hover:bg-[#E7162A]/90 text-white font-bold">
                <Link href="/dashboard">Mon Espace</Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white hidden sm:block">
                  Connexion
                </Link>
                <Button asChild className="bg-[#E7162A] hover:bg-[#E7162A]/90 text-white font-bold shadow-[0_0_15px_rgba(231,22,42,0.3)]">
                  <Link href="/register">S'inscrire</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Modern Gradient & Typography */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#21286E]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E7162A]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-8 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="border-[#E7162A]/50 bg-[#E7162A]/10 text-[#E7162A] px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-4">
              PROGRAMME OFFICIEL DE FORMATION : PRIME LANGUAGE ACADEMY (PLA)
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1]"
          >
            Parlez anglais. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7162A] to-orange-500">
              Vivez des opportunités.
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 backdrop-blur-sm rounded-2xl p-4 md:p-6 inline-block mt-4"
          >
            <div className="flex items-center gap-3 justify-center text-slate-300 font-medium md:text-lg">
              <CalendarIcon className="text-[#E7162A] w-6 h-6" />
              <span>SESSION DE LANCEMENT : <strong className="text-white">21 JUIN – 19 AOUT 2026 (02 MOIS)</strong></span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button size="lg" asChild className="w-full sm:w-auto bg-[#E7162A] hover:bg-[#E7162A]/90 text-white font-bold h-14 px-8 text-lg rounded-xl shadow-[0_0_20px_rgba(231,22,42,0.4)]">
              <Link href="/register">Rejoindre la Session</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-xl border-slate-700 hover:bg-slate-800 text-white">
              <a href="#mission">Découvrir le programme</a>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* 1. MISSION */}
      <section id="mission" className="py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl text-center mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex flex-col items-center gap-2">
              <span className="text-[#E7162A] text-xl">1.</span>
              NOTRE MISSION : L’IMMERSION PREMIUM À ABIDJAN
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Dans un environnement majoritairement francophone, PLA transforme l'anglais en une compétence réelle et vivante. Pour cette session, nous doublons nos capacités pour vous offrir un cadre d'apprentissage d'élite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader>
                <MapPin className="w-10 h-10 text-[#E7162A] mb-2" />
                <CardTitle className="text-xl text-white">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">Salles de formation climatisées permettant de mener confortablement les activités.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800">
              <CardHeader>
                <GraduationCap className="w-10 h-10 text-[#21286E] mb-2" />
                <CardTitle className="text-xl text-white">Encadrement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">Formateurs experts mobilisés pour un suivi personnalisé et rigoureux.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800">
              <CardHeader>
                <Zap className="w-10 h-10 text-orange-500 mb-2" />
                <CardTitle className="text-xl text-white">Méthode ISO+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">Un processus dynamique (Input, Structure, Output, Automatisation) pour transformer vos connaissances en réflexes naturels.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. GRILLE TARIFAIRE */}
      <section id="tarifs" className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex flex-col items-center gap-2">
              <span className="text-[#E7162A] text-xl">2.</span>
              GRILLE TARIFAIRE "À LA CARTE"
            </h2>
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-sm px-4 py-1">SESSION DE 02 MOIS</Badge>
          </div>

          <Card className="bg-[#E7162A]/10 border-[#E7162A]/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7162A]/20 blur-3xl" />
            <CardHeader>
              <CardTitle className="text-[#E7162A] text-xl md:text-2xl flex items-center gap-2">
                <span>🎁</span> OFFRE DE LANCEMENT : INSCRIPTION OFFERTE (0 FCFA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 md:text-lg">
                Le programme est ouvert aux inscriptions 8 semaines avant le début des cours, vous permettant de solder votre participation en toute sérénité avant le démarrage.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Loisir", freq: "1 séance / semaine", price: "50 000 FCFA" },
              { name: "Essentiel", freq: "2 séances / semaine", price: "70 000 FCFA" },
              { name: "Équilibre", freq: "3 séances / semaine", price: "90 000 FCFA" },
              { name: "Performance", freq: "4 séances / semaine", price: "110 000 FCFA" },
              { name: "Intensif", freq: "5 séances / semaine", price: "130 000 FCFA" },
              { name: "Immersion", freq: "6 séances / semaine", price: "150 000 FCFA", highlight: true },
            ].map((plan, idx) => (
              <Card key={idx} className={`bg-slate-900 border-slate-800 relative transition-transform hover:-translate-y-1 ${plan.highlight ? 'ring-2 ring-[#E7162A] shadow-[0_0_30px_rgba(231,22,42,0.15)]' : ''}`}>
                {plan.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E7162A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Recommandé</div>}
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400">{plan.freq}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-white mb-6">{plan.price}</div>
                  <Button asChild className={`w-full font-bold ${plan.highlight ? 'bg-[#E7162A] hover:bg-[#E7162A]/90 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                    <Link href="/register">Sélectionner</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-[#E7162A] flex items-center gap-2"><Target className="w-5 h-5"/> Choix du Parcours</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400 leading-relaxed text-sm">
                Vous devez opter soit pour la Formation Régulière (bases et structure), soit pour le Club d’Anglais (pratique et fluidité). Ces parcours sont distincts et ne sont pas cumulables simultanément. Apres votre programme de formation régulière (2 mois) vous rejoignez le programme du Club d’Anglais.
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-[#E7162A] flex items-center gap-2"><Shield className="w-5 h-5"/> Paiement</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400 leading-relaxed text-sm">
                Le solde total doit être réglé avant le début de la formation pour garantir votre place.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3 & 4. FAQ + ORGANISATION */}
      <section className="py-24 px-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-5 space-y-8" id="organisation">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="text-[#E7162A] text-xl">4.</span> ORGANISATION DES SÉANCES
              </h2>
              <p className="text-slate-400 text-lg">
                Les cours se déroulent du <strong className="text-white">Lundi au Dimanche</strong> avec deux vagues au choix :
              </p>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-[#21286E]/20 border-[#21286E]/50">
                <CardHeader className="py-4">
                  <CardTitle className="text-slate-300 text-base font-semibold">Vague 1</CardTitle>
                  <CardDescription className="text-2xl font-black text-white mt-1">16h00 – 18h00</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-[#21286E]/20 border-[#21286E]/50">
                <CardHeader className="py-4">
                  <CardTitle className="text-slate-300 text-base font-semibold">Vague 2</CardTitle>
                  <CardDescription className="text-2xl font-black text-white mt-1">18h00 – 20h00</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8" id="faq">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="text-[#E7162A] text-xl">3.</span> RÉPONSES À VOS PRÉOCCUPATIONS (FAQ)
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Flexibilité et Absences", desc: "En cas d'imprévu, vous avez la possibilité de rattraper votre séance sur l'autre vague horaire de la même journée ou sur un autre créneau de la semaine." },
                { title: "Supports Pédagogiques", desc: "Aucun livre à acheter. Tous les supports de cours sont offerts en format numérique, accessibles sur votre smartphone ou tablette pour réviser partout." },
                { title: "Reconnaissance", desc: "Nous délivrons une Attestation de Formation en fin de session, certifiant votre assiduité et votre niveau selon le cadre européen (A1 à C2)." },
                { title: "Confort au Centre", desc: "Profitez d'un espace sécurisé avec WiFi haut débit, parking, et un espace \"breakout\" pour vos rafraîchissements." }
              ].map((faq, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E7162A]" />
                    {faq.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed pl-6">
                    {faq.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. FOOTER / INSCRIPTION */}
      <footer className="py-24 px-4 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#21286E]/10 blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex flex-col items-center gap-2">
              <span className="text-[#E7162A] text-xl">5.</span>
              INSCRIPTION & RÉSERVATION
            </h2>
          </div>

          <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
            <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#E7162A]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Test de niveau gratuit</h4>
                    <p className="text-slate-400 text-sm">Indispensable pour votre orientation.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#E7162A]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">RDV Consultant (Visio/Vocal)</h4>
                    <p className="text-slate-400 text-sm">Mardi (10h-14h) et Jeudi (9h-14h).</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#E7162A]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Localisation</h4>
                    <p className="text-slate-400 text-sm">Angré 8e Tranche, Zone Bon Prix (à 120m en face du carrefour Pain du Quotidien).</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#E7162A]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">WhatsApp / Tel</h4>
                    <a href="tel:+2250161337864" className="text-slate-400 hover:text-white transition-colors text-sm">+225 01 61 33 78 64</a>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="border-t border-slate-800 p-8 text-center bg-slate-900/50">
              <Button size="lg" asChild className="w-full sm:w-auto bg-[#E7162A] hover:bg-[#E7162A]/90 text-white font-bold h-14 px-12 text-lg rounded-xl">
                <Link href="/register">Procéder à l'inscription</Link>
              </Button>
            </div>
          </Card>

          <div className="mt-20 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto opacity-50">
              <Image src="/icon-512x512.png" alt="Logo PLA" fill className="object-contain" />
            </div>
            <div>
              <div className="font-black text-slate-500 tracking-widest uppercase mb-2">
                PRIME LANGUAGE ACADEMY
              </div>
              <div className="text-slate-600 text-sm font-medium">
                Parlez anglais. Vivez des opportunités.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Temporary icon to avoid importing Calendar from lucide if not present or to avoid naming conflicts
function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}
