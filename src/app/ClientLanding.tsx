"use client";

import Link from "next/link";
import { PrimeLogo } from "@/components/logo";
import PricingSection from "./(landing)/PricingSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ClientLanding({ session, systemSettings, latestArticles = [] }: { session: any, systemSettings: any, latestArticles?: any[] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blobY1 = useTransform(scrollYProgress, [0, 1], ["0px", "150px"]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], ["0px", "-150px"]);

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[#E7162A]/20 overflow-x-hidden" ref={ref}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[#21286E]/5 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PrimeLogo className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#21286E]/70">
            <a href="#mission" className="hover:text-[#E7162A] transition-colors">Notre Mission</a>
            <a href="#method" className="hover:text-[#E7162A] transition-colors">Méthode ISO+</a>
            <a href="#pricing" className="hover:text-[#E7162A] transition-colors">Tarifs</a>
            <Link href="/blog" className="hover:text-[#E7162A] transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="bg-[#E7162A] text-white font-bold py-2 px-5 rounded-xl hover:shadow-lg transition-all shadow-[#E7162A]/30 w-auto text-sm">
                Mon Espace
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-black text-[#21286E]/70 hover:text-[#E7162A] transition-colors">
                  Connexion
                </Link>
                <Link href="/register" className="bg-[#E7162A] text-white font-bold py-2 px-5 rounded-xl hover:shadow-lg transition-all shadow-[#E7162A]/30 w-auto text-sm">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ═══════════ HERO 3D ═══════════ */}
      <motion.header 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-40 pb-32 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center bg-[#21286E]"
      >
        {/* Dynamic Background */}
        <motion.div style={{ y: blobY1 }} className="absolute bg-blob w-[600px] h-[600px] bg-[#E7162A]/20 blur-[120px] top-[-100px] right-[-100px] rounded-full mix-blend-screen"></motion.div>
        <motion.div style={{ y: blobY2 }} className="absolute bg-blob w-[400px] h-[400px] bg-[#E7162A]/10 blur-[100px] bottom-[-100px] left-[-100px] rounded-full mix-blend-screen"></motion.div>
        
        {/* Subtle grid pattern pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(231,22,42,0.3)] backdrop-blur-sm"
          >
            Session de Lancement : 18 Juin – 19 Août 2026 (02 Mois)
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[1.1]"
          >
            L'Immersion <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7162A] to-pink-500 drop-shadow-[0_0_30px_rgba(231,22,42,0.4)]">
              Premium à Abidjan.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl mx-auto text-white/70 font-medium md:text-xl leading-relaxed"
          >
            Dans un environnement majoritairement francophone, Prime Language Academy transforme l'anglais en une compétence réelle et vivante. <br/>
            <span className="text-white font-bold mt-4 inline-block px-4 py-1 bg-[#E7162A]/20 rounded-md">
              🎁 Offre de lancement : Fais ton inscription à 0 FCFA.
            </span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/register" className="group relative w-full sm:w-auto px-10 py-5 text-lg bg-[#E7162A] text-white font-black rounded-2xl overflow-hidden transition-transform duration-300 shadow-[0_15px_30px_rgba(231,22,42,0.3)] hover:shadow-[0_20px_40px_rgba(231,22,42,0.5)] flex items-center justify-center gap-3">
              <span className="relative z-10 flex items-center gap-2">
                Réserver ma place <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </span>
            </Link>
            
            <Link href="/placement-test" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2 hover:-translate-y-1 duration-300 shadow-xl backdrop-blur-md">
              Test de Niveau Gratuit
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* ═══════════ MISSION & CADRE ═══════════ */}
      <section id="mission" className="py-32 px-6 bg-[var(--background)] relative z-20">
        <div className="max-w-7xl mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-black text-[#21286E] leading-tight tracking-tight">
              Notre Mission : <br/> <span className="text-[#E7162A]">Un Cadre d'Élite</span>
            </h2>
            <p className="text-[#21286E]/60 font-medium text-lg max-w-3xl mx-auto leading-relaxed">
              Pour cette session, nous avons doublé nos capacités afin de vous offrir l'environnement propice à l'excellence. L'immersion commence dès que vous franchissez nos portes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="bg-white border border-[#21286E]/5 rounded-[2rem] p-12 shadow-2xl shadow-[#21286E] hover:border-[#E7162A]/30 transition-colors"
              >
                <div className="w-20 h-20 bg-[#21286E]/5 text-[#21286E] rounded-2xl flex items-center justify-center text-4xl mb-8">
                  🏢
                </div>
                <h4 className="font-black text-3xl text-[#21286E] mb-4">Infrastructure Premium</h4>
                <p className="text-lg text-[#21286E]/70 leading-relaxed font-medium">
                  Salles de formation entièrement climatisées, équipées de technologies modernes, permettant de mener vos activités de groupe très confortablement.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-white border border-[#21286E]/5 rounded-[2rem] p-12 shadow-2xl shadow-[#21286E] hover:border-[#E7162A]/30 transition-colors"
               >
                <div className="w-20 h-20 bg-[#E7162A]/10 text-[#E7162A] rounded-2xl flex items-center justify-center text-4xl mb-8">
                  👨‍🏫
                </div>
                <h4 className="font-black text-3xl text-[#21286E] mb-4">Encadrement d'Experts</h4>
                <p className="text-lg text-[#21286E]/70 leading-relaxed font-medium">
                  Des formateurs experts et consultants mobilisés pour un suivi entièrement personnalisé de vos faiblesses. Vous n'êtes jamais seul.
                </p>
              </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ METHOD ISO+ ═══════════ */}
      <section id="method" className="py-32 px-6 bg-[#21286E]/[0.02]">
        <div className="max-w-7xl mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <div className="inline-block px-5 py-2 rounded-full bg-[#E7162A]/10 text-[#E7162A] text-[10px] font-black uppercase tracking-[0.3em]">
              Processus Dynamique
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#21286E] tracking-tight">
              La Méthode <span className="text-[#E7162A]">ISO+</span>
            </h2>
            <p className="text-[#21286E]/60 font-medium text-lg max-w-3xl mx-auto leading-relaxed">
              Un processus en 4 étapes structurées pour transformer vos connaissances passives en véritables réflexes naturels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", key: "INPUT", title: "Comprendre", desc: "Immersion structurée dans les sons et le vocabulaire natif de la langue.", color: "from-[#21286E] to-blue-600" },
              { num: "02", key: "STRUCTURE", title: "Construire", desc: "La loi de la fondation : de la grammaire expliquée, simplifiée et applicable.", color: "from-blue-500 to-cyan-500" },
              { num: "03", key: "OUTPUT", title: "Pratiquer", desc: "La bouche ouverte dès le premier jour. Le Club d'Anglais libère votre parole.", color: "from-[#E7162A] to-rose-500" },
              { num: "04", key: "AUTOMATISER", title: "Réfléchir", desc: "Plus d'hésitation. Les exercices répétés transforment l'anglais en un automatisme.", color: "from-teal-500 to-emerald-500" }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative flex flex-col bg-white border border-[#21286E]/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={\`w-full p-8 flex flex-col items-center justify-center bg-gradient-to-br \${step.color} min-h-[160px] text-white\`}>
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Phase {step.num}</div>
                  <div className="text-3xl font-black">{step.key}</div>
                </div>
                <div className="p-8 text-center bg-white h-full flex flex-col gap-3">
                  <h3 className="text-2xl font-black text-[#21286E]">{step.title}</h3>
                  <p className="text-sm text-[#21286E]/60 font-semibold leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-black text-[#21286E] tracking-tight">Grille Tarifaire <span className="italic opacity-50">"À la carte"</span></h2>
            <p className="text-[#21286E]/60 font-medium text-lg">Choisissez la flexibilité qui vous correspond. La durée standard est de 02 Mois.</p>
          </motion.div>
          <PricingSection />
        </div>
      </section>

      {/* ═══════════ LATEST ARTICLES (BLOG) ═══════════ */}
      {latestArticles && latestArticles.length > 0 && (
        <section className="py-32 px-6 bg-[#21286E]/5">
          <div className="max-w-7xl mx-auto space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-[#21286E]/10 pb-8"
            >
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-[#E7162A]/10 text-[#E7162A] text-[10px] font-black uppercase tracking-[0.3em]">
                  Actualités PLA
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#21286E] tracking-tight">Blog & Ressources</h2>
              </div>
              <Link href="/blog" className="hidden md:inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#21286E] font-black hover:bg-[#21286E] hover:text-white transition-colors border border-[#21286E]/10 shadow-lg">
                Voir tout le Blog
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestArticles.map((article: any, idx: number) => (
                <motion.article 
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white border border-[#21286E]/5 p-8 flex flex-col justify-between group hover:border-[#E7162A]/30 hover:shadow-2xl hover:shadow-[#21286E]/5 transition-all rounded-[2rem]"
                >
                  <div className="space-y-4 mb-6">
                    <span className="inline-block px-3 py-1 bg-[#21286E]/5 text-[#21286E] rounded-full text-[10px] font-black uppercase tracking-widest">
                      {article.category || "Conseils"}
                    </span>
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="text-2xl font-black text-[#21286E] leading-tight group-hover:text-[#E7162A] transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                  <p className="text-sm text-[#21286E]/50 font-medium line-clamp-3 mb-8">
                    {article.content}
                  </p>
                  <Link href={`/blog/${article.slug}`} className="text-sm font-black text-[#21286E] group-hover:text-[#E7162A] transition-colors flex items-center gap-2 mt-auto pb-2 border-b-2 border-transparent group-hover:border-[#E7162A] inline-block w-max">
                    Lire l'article <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </Link>
                </motion.article>
              ))}
            </div>

            <div className="text-center md:hidden pt-8">
              <Link href="/blog" className="inline-flex w-full items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#21286E] font-black shadow-lg">
                Visiter le Blog
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#21286E]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center space-y-10 bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-20 relative z-10 backdrop-blur-sm shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Prêt à briser la barrière <br/> francophone ?
          </h2>
          <p className="text-white/70 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            Rejoignez Prime Language Academy. Les inscriptions sont en cours et l'ouverture de dossier est à 0 FCFA pour la session du 18 Juin !
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/register" className="bg-[#E7162A] text-white font-black px-10 py-5 rounded-xl hover:scale-105 transition-transform duration-300 shadow-xl shadow-[#E7162A]/40 uppercase tracking-widest text-sm">
              S'inscrire Maintenant
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 bg-white border-t border-[#21286E]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <PrimeLogo className="h-10 opacity-90" />
            <p className="max-w-sm text-sm text-[#21286E]/60 font-semibold leading-relaxed">
              PRIME LANGUAGE ACADEMY : L'ingénierie absolue de votre succès anglophone.<br />
            </p>
          </div>
          <div>
            <h4 className="font-black text-[#21286E] mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-4 text-sm text-[#21286E]/60 font-bold">
              <li><Link href="/login" className="hover:text-[#E7162A] transition-colors">Connexion</Link></li>
              <li><Link href="/register" className="hover:text-[#E7162A] transition-colors">Inscription</Link></li>
              <li><Link href="/placement-test" className="hover:text-[#E7162A] transition-colors">Test Gratuit</Link></li>
              <li><Link href="/blog" className="hover:text-[#E7162A] transition-colors">Blog & Ressources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#21286E] mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm text-[#21286E]/60 font-bold">
              <li>📍 Angré 8e Tranche, Abidjan</li>
              <li>✉️ <a href="mailto:info@primelanguageacademy.com" className="hover:text-[#E7162A] transition-colors">info@primelanguageacademy.com</a></li>
              <li>📞 <a href="tel:+2250161337864" className="hover:text-[#E7162A] transition-colors">+225 01 61 33 78 64</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
