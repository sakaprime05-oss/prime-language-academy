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

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blobY1 = useTransform(scrollYProgress, [0, 1], ["0px", "200px"]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], ["0px", "-200px"]);

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-primary/20 overflow-x-hidden perspective-1000" ref={ref}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="fixed top-0 w-full z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--foreground)]/5 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <PrimeLogo className="h-10" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[var(--foreground)]/50">
            <a href="#method" className="hover:text-primary transition-colors">Méthode ISO+</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Tarifs</a>
            <a href="#location" className="hover:text-primary transition-colors">Localisation</a>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
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
      </motion.nav>

      {/* ═══════════ HERO 3D ═══════════ */}
      <motion.header 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-40 pb-32 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center"
      >
        <motion.div style={{ y: blobY1 }} className="absolute bg-blob w-[600px] h-[600px] bg-primary/20 blur-[120px] top-[-100px] right-[-100px] rounded-full mix-blend-screen"></motion.div>
        <motion.div style={{ y: blobY2 }} className="absolute bg-blob w-[400px] h-[400px] bg-secondary/20 blur-[100px] bottom-[-100px] left-[-100px] rounded-full mix-blend-screen"></motion.div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-10 perspective-1000">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(var(--primary),0.2)]"
          >
            L'Anglais n'est pas un luxe, c'est une munition
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black text-[var(--foreground)] tracking-tighter leading-[0.9]"
          >
            Parlez anglais. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-secondary to-[var(--foreground)] drop-shadow-[0_0_30px_rgba(var(--primary),0.3)]">
              Dominez le monde.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl mx-auto text-[var(--foreground)]/60 font-medium md:text-xl leading-relaxed"
          >
            Pendant que certains doutent, l'Afrique avance en anglais. <br/> Ne soyez plus spectateur. <br/>
            <span className="text-[var(--foreground)] font-bold mt-2 inline-block">
              La session {systemSettings.currentSessionName} a commencé. 
            </span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/register" className="group relative w-full sm:w-auto px-10 py-5 text-lg btn-primary rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Commencer maintenant <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            
            <Link href="/placement-test" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 font-bold hover:bg-[var(--foreground)]/10 hover:border-[var(--foreground)]/20 text-[var(--foreground)] transition-all flex items-center justify-center gap-2 hover:-translate-y-1 duration-300">
              Passer le test gratuit
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* ═══════════ CARDS 3D SECTION ═══════════ */}
      <section className="py-32 px-6 bg-[var(--foreground)]/[0.01] relative z-20">
        <div className="max-w-7xl mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] leading-tight tracking-tight">
              Pourquoi nous avons <br/> <span className="text-primary italic">tout à prouver</span>
            </h2>
            <p className="text-[var(--foreground)]/50 font-medium text-lg max-w-3xl mx-auto leading-relaxed">
              Nous ne vendons pas des heures de cours, nous garantissons votre aisance. 
              L'immersion ne se voyage pas, elle se crée avec rigueur.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "L'Apprentissage Ciblé",
                desc: "Finies les récitations 'Hello, how are you?'. Nous reconstruisons votre structure linguistique.",
                delay: 0.1
              },
              {
                icon: "🗣️",
                title: "Acquisition Orale",
                desc: "L'output est roi. Sans immersion étrangère, c'est notre salle de classe qui sert de bain linguistique dès le 1er jour.",
                delay: 0.2
              },
              {
                icon: "⚡",
                title: "Le Ciment du Succès",
                desc: "Abidjan est le hub de demain. Apprenez la langue des décideurs et multipliez votre impact.",
                delay: 0.3
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, rotateY: -30, z: -100 }}
                whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
                whileHover={{ y: -10, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(var(--primary), 0.25)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: item.delay, type: "spring" }}
                className="glass-card border-white/10 dark:border-white/5 relative overflow-hidden group p-10 flex flex-col justify-between transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors duration-500"></div>
                <div className="relative z-10 space-y-6">
                  <div className="text-5xl drop-shadow-xl">{item.icon}</div>
                  <h4 className="font-black text-2xl text-[var(--foreground)] tracking-tight">{item.title}</h4>
                  <p className="text-base text-[var(--foreground)]/60 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ METHOD ISO+ ═══════════ */}
      <section id="method" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.3em]">
              Méthode Exclusif
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] tracking-tight">
              La Synchronisation <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary stroke-text">ISO+</span>
            </h2>
          </motion.div>

          <div className="space-y-12">
            {[
              { num: "01", key: "INPUT", title: "Nourrir la compréhension", desc: "Immersion structurée dans les rythmes et sons de la langue sans complexes.", color: "from-blue-500 to-cyan-500" },
              { num: "02", key: "STRUCTURE", title: "Base claire et utile", desc: "La loi de la fondation : comprendre les mécanismes, pas seulement retenir par cœur.", color: "from-purple-500 to-pink-500" },
              { num: "03", key: "OUTPUT", title: "Pratique Orale Intensive", desc: "La bouche de l'apprenant doit être ouverte dès la 1ère minute. Déblocage de la parole.", color: "from-emerald-500 to-teal-500" },
              { num: "04", key: "AUTOMATISATION", title: "Création du réflexe", desc: "Quand réfléchir n'est plus nécessaire. L'anglais devient un automatisme.", color: "from-amber-500 to-orange-500" }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="group relative flex flex-col md:flex-row gap-8 items-center glass-card p-4 md:p-8 hover:border-primary/30 transition-all rounded-[2.5rem]"
              >
                <div className={\`w-full md:w-1/3 flex flex-col items-center justify-center p-8 rounded-[2rem] bg-gradient-to-br \${step.color} bg-opacity-10 min-h-[200px] transform group-hover:scale-105 transition-transform duration-500\`}>
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-2">Phase {step.num}</div>
                  <div className={\`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r \${step.color}\`}>{step.key}</div>
                </div>
                <div className="w-full md:w-2/3 space-y-4 px-4 md:px-8">
                  <h3 className="text-3xl font-black text-[var(--foreground)]">{step.title}</h3>
                  <p className="text-lg text-[var(--foreground)]/60 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" className="py-32 px-6 bg-[var(--foreground)]/[0.02]">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] tracking-tight">Investissez en Vous</h2>
            <p className="text-[var(--foreground)]/50 font-medium text-lg">Votre anglais est votre assurance tout risque. Ne laissez pas le marché vous dépasser.</p>
          </motion.div>
          <PricingSection />
        </div>
      </section>

      {/* ═══════════ LATEST ARTICLES (BLOG) ═══════════ */}
      {latestArticles && latestArticles.length > 0 && (
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-6"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                Ressources & Actualités
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] tracking-tight">Le Blog <span className="text-primary italic">PLA</span></h2>
              <p className="text-[var(--foreground)]/50 font-medium text-lg max-w-2xl mx-auto">
                Découvrez nos derniers articles sur l'importance du bilinguisme et nos conseils d'apprentissage.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestArticles.map((article: any, idx: number) => (
                <motion.article 
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card border-white/10 dark:border-white/5 p-8 flex flex-col justify-between group hover:border-primary/30 transition-all rounded-[2rem]"
                >
                  <div className="space-y-4 mb-6">
                    <span className="inline-block px-3 py-1 bg-[var(--foreground)]/5 text-[var(--foreground)]/70 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {article.category}
                    </span>
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="text-xl font-black text-[var(--foreground)] leading-tight group-hover:text-primary transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                  <p className="text-sm text-[var(--foreground)]/50 font-medium line-clamp-3 mb-6">
                    {article.content}
                  </p>
                  <Link href={`/blog/${article.slug}`} className="text-sm font-black text-[var(--foreground)] group-hover:text-primary transition-colors flex items-center gap-2 mt-auto">
                    Lire la suite <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </Link>
                </motion.article>
              ))}
            </div>

            <div className="text-center pt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--foreground)]/5 font-bold hover:bg-[var(--foreground)]/10 text-[var(--foreground)] transition-all">
                Voir tous les articles
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CTA FINAL ═══════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-10 bg-gradient-to-br from-primary/20 via-[var(--background)] to-secondary/20 border border-primary/30 rounded-[3rem] p-16 relative z-10 shadow-[0_0_100px_rgba(var(--primary),0.1)]"
        >
          <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] tracking-tight leading-tight">
            Prêt à briser la barrière <br/> francophone ?
          </h2>
          <p className="text-[var(--foreground)]/60 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            Rejoignez Prime Language Academy dès aujourd'hui. L'Afrique avance, ne restez pas sur le quai. Frais d'inscription offerts pour la prochaine vague.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/register" className="btn-primary px-10 py-5 text-lg hover:scale-105 transition-transform duration-300 shadow-[0_10px_40px_rgba(var(--primary),0.4)]">
              M'inscrire Maintenant
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-[var(--foreground)]/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <PrimeLogo className="h-10 opacity-70" />
            <p className="max-w-xs text-sm text-[var(--foreground)]/40 font-medium leading-relaxed">
              PRIME LANGUAGE ACADEMY : L'ingénierie de votre succès anglophone.<br />
            </p>
          </div>
          <div>
            <h4 className="font-black text-[var(--foreground)] mb-6 uppercase text-xs tracking-widest">Plateforme</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground)]/50 font-bold">
              <li><Link href="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Inscription</Link></li>
              <li><Link href="/placement-test" className="hover:text-primary transition-colors">Test Gratuit</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog & Ressources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[var(--foreground)] mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm text-[var(--foreground)]/50 font-bold">
              <li>📍 Angré 8e Tranche, Abidjan</li>
              <li>✉️ <a href="mailto:contact@prime.ci" className="hover:text-primary transition-colors">contact@prime.ci</a></li>
              <li>📞 <a href="tel:+2250161337864" className="hover:text-primary transition-colors">+225 01 61 33 78 64</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
