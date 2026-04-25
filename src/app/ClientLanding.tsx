"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Clock, MapPin, Phone, Shield, Target, GraduationCap, Zap, Star, Users, BrainCircuit, Globe2 } from "lucide-react";
import { ParticlesBackground } from "@/components/particles";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ClientLanding({ session }: { session: any }) {
  // Animation variants for "Lottie-style" continuous icon animations
  const bounceAnim = {
    y: [0, -8, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  };
  
  const pulseAnim = {
    scale: [1, 1.1, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  };

  const rotateAnim = {
    rotate: [0, 10, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-[#E7162A]/30 relative overflow-hidden">
      <ParticlesBackground />
      
      {/* NAVIGATION */}
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
            <a href="#pourquoi-nous" className="hover:text-white transition-colors">Pourquoi Nous</a>
            <a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-1">
              Blog <span className="text-xs bg-[#E7162A]/20 text-[#E7162A] px-1.5 py-0.5 rounded ml-1 font-bold">NEW</span>
            </Link>
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
                <Button asChild className="bg-[#E7162A] hover:bg-[#E7162A]/90 text-white font-bold shadow-[0_0_15px_rgba(231,22,42,0.3)] hover:shadow-[0_0_25px_rgba(231,22,42,0.5)] transition-shadow">
                  <Link href="/register">S'inscrire</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#21286E]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E7162A]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-6 md:space-y-8 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="border-[#E7162A]/50 bg-[#E7162A]/10 text-[#E7162A] px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-4 shadow-[0_0_15px_rgba(231,22,42,0.2)] text-center w-full block sm:inline-block max-w-[90vw] leading-relaxed">
              PROGRAMME OFFICIEL DE FORMATION : PRIME LANGUAGE ACADEMY (PLA)
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] md:leading-[1.1]"
          >
            Parlez anglais. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7162A] to-orange-500">
              Vivez des opportunités.
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 backdrop-blur-sm rounded-2xl p-4 md:p-6 inline-block mt-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 justify-center text-slate-300 font-medium text-sm md:text-lg text-center">
              <motion.div animate={rotateAnim}>
                <Clock className="text-[#E7162A] w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
              <span>SESSION DE LANCEMENT : <strong className="text-white block sm:inline mt-1 sm:mt-0">21 JUIN – 19 AOUT 2026 (02 MOIS)</strong></span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button size="lg" asChild className="w-full sm:w-auto bg-[#E7162A] hover:bg-[#E7162A]/90 text-white font-bold h-14 px-8 text-lg rounded-xl shadow-[0_0_20px_rgba(231,22,42,0.4)]">
              <Link href="/register">Rejoindre la Session</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* NOTRE VISION : Language Mastery Academy */}
      <section id="vision" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#21286E]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="bg-[#E7162A]/10 text-[#E7162A] hover:bg-[#E7162A]/20 px-4 py-1">Notre Identité</Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              LANGUAGE MASTERY ACADEMY
            </h2>
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
            <p className="text-xl md:text-2xl text-white font-medium mb-12 text-center leading-relaxed">
              L’ambition d’offrir une vraie maîtrise — <span className="text-[#E7162A]">pas seulement des notions.</span>
            </p>
            
            <p className="mb-6">
              C’est la volonté d’accompagner les professionnels, les étudiants, les entrepreneurs et les acteurs du changement, à devenir à l’aise, confiants et efficaces dans leur communication multilingue.
            </p>
            
            <p className="mb-10">
              Dans l’espace francophone africain, la maîtrise de langues étrangères reste un frein majeur pour beaucoup, alors même qu’elle est devenue une compétence clé dans le monde professionnel, académique et entrepreneurial. Language Mastery Academy est née d’un constat simple, mais profond : dans un environnement majoritairement francophone, apprendre une langue étrangère — notamment l’anglais — reste un défi majeur pour beaucoup, malgré les nombreuses tentatives et offres de formation existantes.
            </p>
            
            <h3 className="text-2xl text-white font-bold mt-12 mb-6 flex items-center gap-3">
              <span className="bg-[#E7162A] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">?</span>
              Pourquoi ?
            </h3>
            <p className="mb-4">Parce que ces offres ne prennent pas toujours en compte les réalités spécifiques des apprenants francophones :</p>
            <ul className="list-none space-y-3 pl-0 my-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#E7162A] shrink-0" /> les blocages psychologiques liés à l’oral,</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#E7162A] shrink-0" /> la peur de faire des fautes,</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#E7162A] shrink-0" /> l’absence d’un cadre progressif,</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#E7162A] shrink-0" /> ou encore le manque d’une approche réellement pratique et adaptée.</li>
            </ul>

            <p className="mt-10 mb-10">
              <strong className="text-white">Nous connaissons notre public.</strong> Nous savons que derrière chaque apprenant, il y a un professionnel, un entrepreneur, un étudiant ou un travailleur ambitieux, confronté à la mondialisation, à la compétitivité, et à la nécessité de communiquer efficacement.
            </p>
            
            <h3 className="text-2xl text-white font-bold mt-12 mb-6">Une solution ciblée</h3>
            <p className="mb-6">Language Mastery Academy a donc été pensée comme une solution ciblée :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> 
                <span className="text-sm md:text-base font-medium">Une pédagogie claire et structurée</span>
              </div>
              <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> 
                <span className="text-sm md:text-base font-medium">Un accompagnement humain et motivant</span>
              </div>
              <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> 
                <span className="text-sm md:text-base font-medium">Des formats flexibles</span>
              </div>
              <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> 
                <span className="text-sm md:text-base font-medium">Priorité donnée à la maîtrise active de la langue</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-[#21286E]/20 border border-[#21286E]/30 p-8 md:p-12 rounded-[2rem] mt-16 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E7162A] to-transparent opacity-50" />
              <h3 className="text-3xl font-black text-white mb-6">Notre mission ?</h3>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Aider chaque apprenant à prendre confiance, progresser avec méthode, et s’exprimer avec impact dans une langue étrangère.
                <br /><br />
                <strong className="text-white block text-2xl mb-4">Nous ne formons pas juste à parler anglais.</strong>
                <span className="text-[#E7162A] font-bold">Nous aidons à débloquer le potentiel</span> de celles et ceux qui veulent faire la différence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS ? */}
      <section id="pourquoi-nous" className="py-24 px-4 bg-slate-900/50 border-t border-slate-800/50 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="bg-[#21286E]/40 text-blue-300 hover:bg-[#21286E]/50">L'Excellence PLA</Badge>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              POURQUOI NOUS CHOISIR ?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              L'anglais n'est pas une matière scolaire à mémoriser, c'est un muscle à entraîner. Voici pourquoi notre académie est différente de toutes les autres.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BrainCircuit, color: "text-purple-400", title: "Zéro Traduction Mentale", desc: "Notre méthode force votre cerveau à penser directement en anglais, éliminant les hésitations et les blocages." },
              { icon: Globe2, color: "text-blue-400", title: "Immersion Sans Voyager", desc: "Vivez une véritable immersion linguistique en plein cœur d'Abidjan, avec des mises en situation réelles." },
              { icon: Target, color: "text-green-400", title: "Objectif ROI Rapide", desc: "Chaque séance est conçue pour un retour sur investissement immédiat dans votre carrière professionnelle." },
              { icon: Star, color: "text-yellow-400", title: "Exigence & Certification", desc: "Nous ne faisons pas dans l'à-peu-près. Obtenez un niveau certifié et validé (Standard Européen CECRL)." }
            ].map((item, idx) => (
              <motion.div key={idx} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card className="bg-slate-900 border-slate-800 h-full">
                  <CardHeader>
                    <motion.div animate={pulseAnim} className="mb-4">
                      <div className={`w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                    </motion.div>
                    <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <Card className="bg-slate-950 border-slate-800 group hover:border-[#E7162A]/50 transition-colors">
              <CardHeader>
                <motion.div animate={bounceAnim} className="mb-2">
                  <MapPin className="w-10 h-10 text-[#E7162A]" />
                </motion.div>
                <CardTitle className="text-xl text-white">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">Salles de formation climatisées permettant de mener confortablement les activités interactives et les débats.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800 group hover:border-[#21286E] transition-colors">
              <CardHeader>
                <motion.div animate={pulseAnim} className="mb-2">
                  <Users className="w-10 h-10 text-[#5c68ea]" />
                </motion.div>
                <CardTitle className="text-xl text-white">Encadrement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">Formateurs experts mobilisés pour un suivi personnalisé, une correction active et un mentorat continu.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-950 border-slate-800 group hover:border-orange-500/50 transition-colors">
              <CardHeader>
                <motion.div animate={rotateAnim} className="mb-2">
                  <Zap className="w-10 h-10 text-orange-500" />
                </motion.div>
                <CardTitle className="text-xl text-white">Méthode ISO+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">Un processus dynamique (Input, Structure, Output, Automatisation) pour transformer vos connaissances en réflexes naturels.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. GRILLE TARIFAIRE DÉTAILLÉE */}
      <section id="tarifs" className="py-24 px-4 relative overflow-hidden bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex flex-col items-center gap-2">
              <span className="text-[#E7162A] text-xl">2.</span>
              GRILLE TARIFAIRE "À LA CARTE"
            </h2>
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 text-sm px-4 py-1">SESSION DE 02 MOIS</Badge>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="bg-[#E7162A]/10 border-[#E7162A]/30 overflow-hidden relative max-w-4xl mx-auto">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7162A]/20 blur-3xl" />
              <CardHeader>
                <CardTitle className="text-[#E7162A] text-xl md:text-2xl flex items-center gap-2">
                  <motion.span animate={bounceAnim}>🎁</motion.span> OFFRE DE LANCEMENT : INSCRIPTION OFFERTE (0 FCFA)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 md:text-lg">
                  Le programme est ouvert aux inscriptions 8 semaines avant le début des cours, vous permettant de solder votre participation en toute sérénité avant le démarrage.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              { 
                name: "Loisir", freq: "1 séance / semaine", price: "50 000 FCFA", 
                target: "Débutants absolus ou curieux.", 
                use: "Découvrir la langue sans pression et maintenir un contact basique avec l'anglais."
              },
              { 
                name: "Essentiel", freq: "2 séances / semaine", price: "70 000 FCFA", 
                target: "Étudiants ou professionnels très occupés.", 
                use: "Bâtir des fondations solides et comprendre la structure de base sans surcharger son emploi du temps."
              },
              { 
                name: "Équilibre", freq: "3 séances / semaine", price: "90 000 FCFA", 
                target: "Personnes cherchant le compromis idéal.", 
                use: "Progresser régulièrement, enrichir son vocabulaire et commencer à converser avec confiance."
              },
              { 
                name: "Performance", freq: "4 séances / semaine", price: "110 000 FCFA", 
                target: "Professionnels préparant des réunions/examens.", 
                use: "Développer une fluidité rapide, vaincre la peur de parler en public et maîtriser le jargon métier."
              },
              { 
                name: "Intensif", freq: "5 séances / semaine", price: "130 000 FCFA", 
                target: "Futurs expatriés ou managers d'équipes internationales.", 
                use: "Atteindre un niveau opérationnel très rapidement pour interagir au quotidien (Business English)."
              },
              { 
                name: "Immersion", freq: "6 séances / semaine", price: "150 000 FCFA", highlight: true,
                target: "Ceux qui visent l'excellence et le bilinguisme total.", 
                use: "Penser et rêver en anglais. Créer des réflexes natifs automatiques pour une maîtrise absolue."
              },
            ].map((plan, idx) => (
              <motion.div key={idx} whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="h-full">
                <Card className={`h-full flex flex-col bg-slate-900 border-slate-800 relative ${plan.highlight ? 'ring-2 ring-[#E7162A] shadow-[0_0_30px_rgba(231,22,42,0.15)]' : ''}`}>
                  {plan.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E7162A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Le Summum</div>}
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <CardTitle className="text-xl lg:text-2xl text-white">{plan.name}</CardTitle>
                      <Badge variant="outline" className="text-slate-400 border-slate-700 text-xs text-center">{plan.freq}</Badge>
                    </div>
                    <div className="text-2xl lg:text-3xl font-black text-white">{plan.price}</div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Users className="w-3 h-3"/> À qui est-ce destiné ?
                      </h4>
                      <p className="text-slate-300 text-sm">{plan.target}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Target className="w-3 h-3"/> À quoi ça sert ?
                      </h4>
                      <p className="text-slate-300 text-sm">{plan.use}</p>
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button asChild className={`w-full font-bold ${plan.highlight ? 'bg-[#E7162A] hover:bg-[#E7162A]/90 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                      <Link href="/register">Sélectionner</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Choix du parcours & Paiement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-[#E7162A] flex items-center gap-2">
                  <motion.div animate={pulseAnim}><Target className="w-5 h-5"/></motion.div> Choix du Parcours
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400 leading-relaxed text-sm">
                Vous devez opter soit pour la <strong>Formation Régulière</strong> (bases et structure), soit pour le <strong>Club d’Anglais</strong> (pratique et fluidité). Ces parcours sont distincts et ne sont pas cumulables simultanément. Après votre programme de formation régulière (2 mois), vous rejoignez le programme du Club d’Anglais.
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-[#E7162A] flex items-center gap-2">
                  <motion.div animate={bounceAnim}><Shield className="w-5 h-5"/></motion.div> Paiement Exigé
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400 leading-relaxed text-sm">
                Le solde total doit être réglé en intégralité avant le début de la formation pour garantir votre place et confirmer votre engagement vers l'excellence.
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
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="bg-[#21286E]/20 border-[#21286E]/50 overflow-hidden relative group">
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#E7162A] transform translate-x-full group-hover:translate-x-0 transition-transform"/>
                  <CardHeader className="py-5">
                    <CardTitle className="text-slate-300 text-base font-semibold uppercase tracking-widest">Vague 1</CardTitle>
                    <CardDescription className="text-3xl font-black text-white mt-1">16h00 – 18h00</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="bg-[#21286E]/20 border-[#21286E]/50 overflow-hidden relative group">
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#E7162A] transform translate-x-full group-hover:translate-x-0 transition-transform"/>
                  <CardHeader className="py-5">
                    <CardTitle className="text-slate-300 text-base font-semibold uppercase tracking-widest">Vague 2</CardTitle>
                    <CardDescription className="text-3xl font-black text-white mt-1">18h00 – 20h00</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8" id="faq">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="text-[#E7162A] text-xl">3.</span> FAQ
              </h2>
              <p className="text-slate-400">Réponses rapides à vos préoccupations fréquentes.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Flexibilité et Absences", desc: "En cas d'imprévu, vous avez la possibilité de rattraper votre séance sur l'autre vague horaire de la même journée ou sur un autre créneau de la semaine." },
                { title: "Supports Pédagogiques", desc: "Aucun livre à acheter. Tous les supports de cours sont offerts en format numérique, accessibles sur votre smartphone ou tablette pour réviser partout." },
                { title: "Reconnaissance", desc: "Nous délivrons une Attestation de Formation en fin de session, certifiant votre assiduité et votre niveau selon le cadre européen (A1 à C2)." },
                { title: "Confort au Centre", desc: "Profitez d'un espace sécurisé avec WiFi haut débit, parking, et un espace \"breakout\" pour vos rafraîchissements." }
              ].map((faq, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="space-y-2 p-4 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E7162A]" />
                    {faq.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed pl-6">
                    {faq.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. FOOTER / INSCRIPTION */}
      <footer className="py-24 px-4 border-t border-slate-800 relative overflow-hidden bg-[#060A14]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#21286E]/10 blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex flex-col items-center gap-2">
              <span className="text-[#E7162A] text-xl">5.</span>
              INSCRIPTION & RÉSERVATION
            </h2>
            <p className="text-slate-400">Prenez votre avenir en main dès aujourd'hui.</p>
          </div>

          <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
            <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <motion.div animate={pulseAnim} className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#E7162A]/20 transition-colors">
                    <Target className="w-6 h-6 text-[#E7162A]" />
                  </motion.div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-lg">Test de niveau gratuit</h4>
                    <p className="text-slate-400 text-sm">Indispensable pour votre orientation.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 group">
                  <motion.div animate={rotateAnim} className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#E7162A]/20 transition-colors">
                    <Clock className="w-6 h-6 text-[#E7162A]" />
                  </motion.div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-lg">RDV Consultant</h4>
                    <p className="text-slate-400 text-sm">Mardi (10h-14h) et Jeudi (9h-14h) en Visio ou Vocal.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <motion.div animate={bounceAnim} className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#E7162A]/20 transition-colors">
                    <MapPin className="w-6 h-6 text-[#E7162A]" />
                  </motion.div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-lg">Localisation</h4>
                    <p className="text-slate-400 text-sm">Angré 8e Tranche, Zone Bon Prix (à 120m en face du carrefour Pain du Quotidien).</p>
                  </div>
                </div>
                
                <div className="flex gap-4 group">
                  <motion.div animate={pulseAnim} className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#E7162A]/20 transition-colors">
                    <Phone className="w-6 h-6 text-[#E7162A]" />
                  </motion.div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-lg">WhatsApp / Tel</h4>
                    <a href="tel:+2250161337864" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">+225 01 61 33 78 64</a>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="border-t border-slate-800 p-8 text-center bg-slate-900/50 rounded-b-xl">
              <Button size="lg" asChild className="w-full sm:w-auto bg-[#E7162A] hover:bg-[#E7162A]/90 text-white font-bold h-14 px-12 text-lg rounded-xl shadow-[0_0_20px_rgba(231,22,42,0.4)]">
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
