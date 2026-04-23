"use client";

import Link from "next/link";
import { PrimeLogo } from "@/components/logo";
import PricingSection from "./(landing)/PricingSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Version: 1.1.0 - Forced Update
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
            <Link href="/blog" className="hover:text-[#E7162A] transition-colors font-black text-[#E7162A]">Le Blog</Link>
            <a href="/rendez-vous" className="hover:text-[#E7162A] transition-colors">Prendre RDV</a>
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

      {/* HERO SECTION */}
      <motion.header 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-40 pb-32 px-6 overflow-hidden min-h-[95vh] flex flex-col justify-center bg-[#21286E]"
      >
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ y: blobY1 }} 
            className="absolute bg-blob w-[800px] h-[800px] bg-[#E7162A]/20 blur-[150px] top-[-200px] right-[-200px] rounded-full mix-blend-screen opacity-50"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ y: blobY2 }} 
            className="absolute bg-blob w-[600px] h-[600px] bg-blue-500/10 blur-[120px] bottom-[-200px] left-[-200px] rounded-full mix-blend-screen opacity-50"
          ></motion.div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-10"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(231,22,42,0.2)] backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#E7162A] animate-pulse"></span>
            Session de Lancement : 18 Juin – 19 Août 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9]"
          >
            Maîtrisez <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E7162A] via-pink-500 to-orange-400 drop-shadow-[0_0_30px_rgba(231,22,42,0.4)]">
              l'Anglais (v1.1.2)
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-3xl mx-auto text-white/70 font-medium md:text-2xl leading-relaxed"
          >
            Transformez votre carrière avec l'immersion premium de Prime Language Academy. <br className="hidden md:block" />
            <span className="text-white font-bold mt-6 inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
              🎁 Inscription à 0 FCFA — Places limitées.
            </span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            <Link href="/register" className="group relative w-full sm:w-auto px-12 py-6 text-xl bg-[#E7162A] text-white font-black rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_20px_50px_rgba(231,22,42,0.4)] hover:shadow-[0_30px_60px_rgba(231,22,42,0.6)] hover:-translate-y-2 flex items-center justify-center gap-3">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-3">
                Réserver ma place <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </span>
            </Link>
            
            <Link href="/placement-test" className="w-full sm:w-auto px-12 py-6 text-xl rounded-2xl bg-white/5 border border-white/20 font-bold hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-2 duration-300 shadow-2xl backdrop-blur-md">
              Test de Niveau Gratuit
            </Link>

            <a href="/rendez-vous" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl rounded-2xl bg-blue-600/20 border border-blue-400/30 font-bold hover:bg-blue-600/40 text-white transition-all flex items-center justify-center gap-3 hover:-translate-y-2 duration-300 shadow-2xl backdrop-blur-md">
              Prendre un RDV
            </a>
          </motion.div>
        </div>
      </motion.header>

      {/* MISSION SECTION */}
      <section id="mission" className="py-40 px-6 bg-[var(--background)] relative z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#21286E]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto space-y-32">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-8"
          >
            <h2 className="text-5xl md:text-8xl font-black text-[#21286E] leading-tight tracking-tight">
              L'excellence <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21286E] to-[#E7162A]">sans compromis.</span>
            </h2>
            <p className="text-[#21286E]/60 font-medium text-xl max-w-3xl mx-auto leading-relaxed">
              Nous avons créé un écosystème conçu pour la performance. Chaque détail de notre infrastructure et de notre accompagnement vise à libérer votre potentiel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="group bg-white border border-[#21286E]/5 rounded-[3rem] p-16 shadow-2xl shadow-[#21286E]/5 hover:border-[#E7162A]/30 transition-all hover:-translate-y-2"
              >
                <div className="w-24 h-24 bg-[#21286E]/5 text-[#21286E] rounded-3xl flex items-center justify-center text-5xl mb-10 group-hover:bg-[#21286E] group-hover:text-white transition-colors">
                  🏢
                </div>
                <h4 className="font-black text-4xl text-[#21286E] mb-6">Cadre Premium</h4>
                <p className="text-xl text-[#21286E]/70 leading-relaxed font-medium">
                  Des salles de formation high-tech, entièrement climatisées et ergonomiques pour une concentration absolue.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="group bg-white border border-[#21286E]/5 rounded-[3rem] p-16 shadow-2xl shadow-[#21286E]/5 hover:border-[#E7162A]/30 transition-all hover:-translate-y-2"
               >
                <div className="w-24 h-24 bg-[#E7162A]/10 text-[#E7162A] rounded-3xl flex items-center justify-center text-5xl mb-10 group-hover:bg-[#E7162A] group-hover:text-white transition-colors">
                  👨‍🏫
                </div>
                <h4 className="font-black text-4xl text-[#21286E] mb-6">Coaching d'Élite</h4>
                <p className="text-xl text-[#21286E]/70 leading-relaxed font-medium">
                  Un suivi personnalisé par des experts dédiés à votre progression quotidienne. Aucun élève n'est laissé pour compte.
                </p>
              </motion.div>
          </div>
        </div>
      </section>

      {/* METHOD ISO+ SECTION */}
      <section id="method" className="py-40 px-6 bg-[#21286E]/[0.02] relative">
        <div className="max-w-7xl mx-auto space-y-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <div className="inline-block px-6 py-2 rounded-full bg-[#E7162A]/10 text-[#E7162A] text-[11px] font-black uppercase tracking-[0.4em]">
              Ingénierie Pédagogique
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-[#21286E] tracking-tight">
              La Méthode <span className="text-[#E7162A]">ISO+</span>
            </h2>
            <p className="text-[#21286E]/60 font-medium text-xl max-w-3xl mx-auto leading-relaxed">
              Une structure scientifique pour passer de la théorie à l'automatisme.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", key: "INPUT", title: "Compréhension", desc: "Immersion auditive structurée pour habituer l'oreille aux sons natifs.", color: "from-[#21286E] to-blue-700" },
              { num: "02", key: "STRUCTURE", title: "Fondation", desc: "La grammaire expliquée par l'usage, pas par le par cœur.", color: "from-blue-600 to-cyan-500" },
              { num: "03", key: "OUTPUT", title: "Expression", desc: "Parler dès le 1er jour. Libérer la barrière psychologique.", color: "from-[#E7162A] to-rose-600" },
              { num: "04", key: "AUTOMATISER", title: "Réflexes", desc: "Répétition espacée pour graver la langue dans votre subconscient.", color: "from-teal-500 to-emerald-600" }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative flex flex-col bg-white border border-[#21286E]/10 rounded-[3rem] overflow-hidden hover:shadow-[0_40px_80px_rgba(33,40,110,0.1)] hover:-translate-y-4 transition-all duration-500"
              >
                <div className={`w-full p-12 flex flex-col items-center justify-center bg-gradient-to-br ${step.color} min-h-[220px] text-white relative overflow-hidden`}>
                  <div className="absolute top-4 right-8 text-8xl font-black opacity-10">{step.num}</div>
                  <div className="text-[12px] font-black uppercase tracking-[0.5em] opacity-70 mb-4">Phase {step.num}</div>
                  <div className="text-4xl font-black tracking-tighter">{step.key}</div>
                </div>
                <div className="p-12 text-center bg-white h-full flex flex-col gap-6">
                  <h3 className="text-3xl font-black text-[#21286E]">{step.title}</h3>
                  <p className="text-lg text-[#21286E]/60 font-semibold leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="text-5xl md:text-7xl font-black text-[#21286E] tracking-tight">Ce qu'ils en <span className="text-[#E7162A]">disent.</span></h2>
            <p className="text-[#21286E]/60 font-medium text-xl">Rejoignez des centaines de professionnels satisfaits.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Marc A.", role: "Chef de projet IT", text: "En 2 mois, j'ai gagné l'assurance nécessaire pour mener mes réunions avec nos partenaires aux USA. La méthode ISO+ est bluffante.", avatar: "MA" },
              { name: "Sarah K.", role: "Marketing Manager", text: "L'immersion est réelle. On n'apprend pas juste l'anglais, on le vit. L'ambiance à l'académie est ultra-motivante.", avatar: "SK" },
              { name: "Jean-Eudes T.", role: "Entrepreneur", text: "Le meilleur investissement pour ma carrière cette année. Zéro regret.", avatar: "JT" }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 rounded-[2.5rem] bg-[#21286E]/[0.02] border border-[#21286E]/5 relative"
              >
                <div className="absolute top-8 right-12 text-6xl text-[#E7162A]/10 font-serif">"</div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-[#E7162A] text-white flex items-center justify-center font-black text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-black text-[#21286E]">{t.name}</div>
                    <div className="text-sm text-[#21286E]/50 font-bold">{t.role}</div>
                  </div>
                </div>
                <p className="text-lg text-[#21286E]/70 font-medium leading-relaxed italic">
                  {t.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-40 px-6 bg-[#21286E]/[0.01]">
        <div className="max-w-7xl mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-5xl md:text-8xl font-black text-[#21286E] tracking-tight">Investissez en <span className="italic opacity-50">Vous.</span></h2>
            <p className="text-[#21286E]/60 font-medium text-xl">Tarification flexible "À la carte" pour s'adapter à votre rythme.</p>
          </motion.div>
          <PricingSection />
        </div>
      </section>

      {/* DEDICATED PUBLIC BLOG SECTION */}
      {latestArticles && latestArticles.length > 0 && (
        <section id="blog-preview" className="py-40 px-6 bg-[#21286E] text-white overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('/grid.svg')] opacity-5"></div>
          
          {/* Animated background blobs */}
          <div className="absolute w-[800px] h-[800px] bg-[#E7162A]/10 blur-[150px] -top-40 -right-40 rounded-full" />
          <div className="absolute w-[600px] h-[600px] bg-blue-500/10 blur-[100px] bottom-0 left-0 rounded-full" />

          <div className="max-w-7xl mx-auto space-y-24 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/10 pb-12"
            >
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#E7162A] text-white text-[11px] font-black uppercase tracking-[0.4em]">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Le Hub de Savoir
                </div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
                  Nos dernières <br/> <span className="text-[#E7162A]">Ressources</span>
                </h2>
                <p className="text-white/50 text-xl font-medium max-w-xl">
                  Découvrez nos conseils exclusifs pour accélérer votre apprentissage et comprendre les enjeux du bilinguisme.
                </p>
              </div>
              <Link href="/blog" className="group hidden md:inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-white text-[#21286E] font-black hover:bg-[#E7162A] hover:text-white transition-all duration-300 shadow-2xl">
                Accéder au Blog Public
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {latestArticles.map((article: any, idx: number) => (
                <motion.article 
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group bg-white/5 border border-white/10 p-10 flex flex-col justify-between hover:bg-white/10 hover:border-[#E7162A]/50 transition-all duration-500 rounded-[3.5rem] backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7162A]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#E7162A]/20 transition-all" />
                  
                  <div className="space-y-6 mb-10 relative z-10">
                    <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-[#E7162A] transition-colors">
                      {article.category || "Conseils"}
                    </span>
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="text-3xl font-black text-white leading-tight group-hover:text-[#E7162A] transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                  
                  <p className="text-lg text-white/50 font-medium line-clamp-3 mb-10 relative z-10">
                    {article.content.replace(/<[^>]*>/g, '')}
                  </p>
                  
                  <Link href={`/blog/${article.slug}`} className="text-sm font-black text-white group-hover:text-[#E7162A] transition-all flex items-center gap-3 mt-auto pb-4 border-b-2 border-white/10 group-hover:border-[#E7162A] w-max relative z-10">
                    Lire l'article <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </Link>
                </motion.article>
              ))}
            </div>

            <div className="text-center md:hidden pt-12">
              <Link href="/blog" className="inline-flex w-full items-center justify-center gap-4 px-10 py-6 rounded-2xl bg-[#E7162A] text-white font-black shadow-2xl">
                Consulter tout le Blog
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="py-40 px-6 relative overflow-hidden bg-[#21286E]">
        <div className="bg-blob w-[1000px] h-[1000px] bg-[#E7162A]/10 blur-[200px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center space-y-12 bg-white/5 border border-white/10 rounded-[4rem] p-20 md:p-32 relative z-10 backdrop-blur-xl shadow-2xl"
        >
          <h2 className="text-5xl md:text-9xl font-black text-white tracking-tight leading-[0.9]">
            Brisez les <br/> <span className="text-[#E7162A]">Frontières.</span>
          </h2>
          <p className="text-white/70 font-medium text-2xl leading-relaxed max-w-3xl mx-auto">
            Rejoignez Prime Language Academy. Ouverture de dossier à 0 FCFA pour la session du 18 Juin !
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-12">
            <Link href="/register" className="group bg-[#E7162A] text-white font-black px-16 py-7 rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(231,22,42,0.4)] uppercase tracking-[0.2em] text-lg flex items-center justify-center gap-3">
              Commencer l'Aventure <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="py-24 px-6 bg-white border-t border-[#21286E]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2 space-y-10">
            <PrimeLogo className="h-12 opacity-90" />
            <p className="max-w-md text-lg text-[#21286E]/60 font-semibold leading-relaxed">
              PRIME LANGUAGE ACADEMY : L'ingénierie absolue de votre succès anglophone. Parlez anglais, vivez des opportunités.<br />
            </p>
          </div>
          <div>
            <h4 className="font-black text-[#21286E] mb-8 uppercase text-xs tracking-[0.4em]">Navigation</h4>
            <ul className="space-y-6 text-sm text-[#21286E]/60 font-bold">
              <li><Link href="/login" className="hover:text-[#E7162A] transition-colors">Espace Membre</Link></li>
              <li><Link href="/register" className="hover:text-[#E7162A] transition-colors">Nous Rejoindre</Link></li>
              <li><Link href="/placement-test" className="hover:text-[#E7162A] transition-colors">Évaluation Gratuite</Link></li>
              <li><Link href="/blog" className="hover:text-[#E7162A] transition-colors">Blog & Ressources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#21286E] mb-8 uppercase text-xs tracking-[0.4em]">Contact Direct</h4>
            <ul className="space-y-6 text-sm text-[#21286E]/60 font-bold">
              <li>📍 Angré 8e Tranche, Abidjan</li>
              <li>✉️ <a href="mailto:info@primelanguageacademy.com" className="hover:text-[#E7162A] transition-colors">info@primelanguageacademy.com</a></li>
              <li>📞 <a href="tel:+2250161337864" className="hover:text-[#E7162A] transition-colors">+225 01 61 33 78 64</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-[#21286E]/5 text-center text-[10px] font-black uppercase tracking-[0.5em] text-[#21286E]/30">
          © {new Date().getFullYear()} Prime Language Academy. All Rights Reserved.
        </div>
      </footer>
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/2250161337864"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all group"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute right-full mr-4 px-4 py-2 bg-white text-[#21286E] text-xs font-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-[#21286E]/5 pointer-events-none uppercase tracking-widest">
          Besoin d'aide ?
        </span>
      </a>
    </div>
  );
}
