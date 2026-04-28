"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogoMark } from "@/components/logo";

/* ── tiny helpers ── */
const PLANS = [
  { id:"loisir",      freq:"1×/sem",  price:"52 000",  label:"Loisir" },
  { id:"essentiel",   freq:"2×/sem",  price:"72 000",  label:"Essentiel" },
  { id:"equilibre",   freq:"3×/sem",  price:"92 000",  label:"Équilibre" },
  { id:"performance", freq:"4×/sem",  price:"112 000", label:"Performance" },
  { id:"intensif",    freq:"5×/sem",  price:"132 000", label:"Intensif" },
  { id:"immersion",   freq:"6×/sem",  price:"152 000", label:"Immersion", top:true },
];

const CLUB_PLANS = [
  { id: "loisir",      freq: "1×/sem", price: "52 000", label: "Social" },
  { id: "essentiel",   freq: "2×/sem", price: "72 000", label: "Connect" },
  { id: "equilibre",   freq: "3×/sem", price: "92 000", label: "Network" },
  { id: "performance", freq: "4×/sem", price: "112 000", label: "Executive" },
  { id: "intensif",    freq: "5×/sem", price: "132 000", label: "Elite" },
  { id: "immersion",   freq: "6×/sem", price: "152 000", label: "Founder", top: true },
];

const MARQUEE_WORDS = ["Speaking","Confidence","Fluency","Excellence","Bilinguisme","Impact","Immersion","Mastery","Progress","Growth","Networking","Community"];

const WHY = [
  { n:"01", title:"Méthode ISO+", desc:"Input → Structure → Output → Automatisation. Votre cerveau pense directement en anglais." },
  { n:"02", title:"Formateurs experts", desc:"Suivi personnalisé, corrections actives, mentorat continu pour chaque apprenant." },
  { n:"03", title:"Flexibilité totale", desc:"1 à 6 séances par semaine. Rattrapage possible le même jour sur une autre vague." },
  { n:"04", title:"Certification CECRL", desc:"Attestation officielle A1→C2 remise en fin de session, reconnue à l'international." },
];

export default function ClientLanding({ session, systemSettings }: { session: any, systemSettings?: any, latestArticles?: any[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [activePlan, setActivePlan] = useState("immersion");
  const [pricingMode, setPricingMode] = useState<"formation"|"club">("formation");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background:"#080808", color:"#F5F0E8", fontFamily:"'Inter', sans-serif", overflowX:"hidden" }}>

      {/* ══════════ NAV ══════════ */}
      <nav style={{
        position:"fixed", top:0, width:"100%", zIndex:100,
        background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(231,22,42,0.12)" : "1px solid transparent",
        transition:"all 0.4s ease",
        padding:"0 2rem",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        height:"72px",
      }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:"12px", textDecoration:"none" }}>
          {/* Remplacez '/logo.png' par le nom exact de votre fichier logo s'il est différent (ex: '/logo.svg') */}
          <LogoMark className="h-20 w-20 sm:h-24 sm:w-24" />
        </Link>

        <div className="hidden lg:flex gap-10 text-[13px] font-medium tracking-widest uppercase text-[#F5F0E8]/55">
          {[["Mission","#mission"],["Méthode","#methode"],["Tarifs","#tarifs"],["Le Club","/english-club"],["Blog","/blog"]].map(([l,h]) => (
            <Link key={l} href={h} style={{ color:"inherit", textDecoration:"none", transition:"color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="#E7162A")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(245,240,232,0.55)")}>{l}</Link>
          ))}
        </div>

        <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
          {session ? (
            <Link href="/dashboard" className="btn-primary" style={{ textDecoration:"none", padding:"10px 24px", fontSize:12 }}>
              Mon Espace
            </Link>
          ) : (
            <>
              <Link href="/login" style={{ fontSize:13, color:"rgba(245,240,232,0.5)", textDecoration:"none", letterSpacing:"0.05em" }}>Connexion</Link>
              <Link href="/register" className="btn-primary" style={{ textDecoration:"none", padding:"10px 24px", fontSize:12 }}>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", padding:"120px 2rem 80px", overflow:"hidden" }}>
        {/* Glow blobs */}
        <div style={{ position:"absolute", top:"20%", left:"15%", width:500, height:500, borderRadius:"50%", background:"rgba(231,22,42,0.06)", filter:"blur(100px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"10%", right:"10%", width:400, height:400, borderRadius:"50%", background:"rgba(231,22,42,0.04)", filter:"blur(120px)", pointerEvents:"none" }}/>
        {/* Grid lines */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(231,22,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(231,22,42,0.03) 1px, transparent 1px)", backgroundSize:"80px 80px", pointerEvents:"none" }}/>

        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", position:"relative", zIndex:1 }}>

          {/* Left */}
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, border:"1px solid rgba(231,22,42,0.3)", borderRadius:100, padding:"6px 18px", marginBottom:32, background:"rgba(231,22,42,0.06)" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#E7162A", display:"inline-block", animation:"ping 2s infinite" }}/>
              <span style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E7162A", fontWeight:600 }}>Session Juin – Août 2026</span>
            </div>

            <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(3rem,6vw,5.5rem)", lineHeight:1.05, fontWeight:900, marginBottom:28, letterSpacing:"-0.02em" }}>
              Parlez anglais.<br/>
              <em style={{ color:"#E7162A", fontStyle:"italic" }}>Vivez des</em><br/>
              opportunités.
            </h1>

            <p style={{ fontSize:17, lineHeight:1.75, color:"rgba(245,240,232,0.6)", maxWidth:600, marginBottom:44, marginLeft:"auto", marginRight:"auto" }}>
              Prime Language Academy accompagne professionnels, étudiants et entrepreneurs francophones vers une maîtrise confiante et efficace de l'anglais.
            </p>

            <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
              <Link href="/register" className="btn-primary" style={{ textDecoration:"none", display:"inline-block" }}>
                Rejoindre la session →
              </Link>
              <Link href="/placement-test" style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"14px 28px", borderRadius:100,
                border:"1px solid rgba(231,22,42,0.25)", color:"#E7162A",
                textDecoration:"none", fontSize:13, letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600,
                transition:"all 0.25s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(231,22,42,0.08)"; e.currentTarget.style.borderColor="rgba(231,22,42,0.5)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(231,22,42,0.25)";}}>
                Test de niveau gratuit
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display:"flex", gap:40, marginTop:56, paddingTop:40, borderTop:"1px solid rgba(231,22,42,0.12)", justifyContent:"center", width:"100%" }}>
              {[["6","Formules adaptées"],["2","Vagues horaires"],["21 juin","Début session"]].map(([v,l])=>(
                <div key={l}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:"#E7162A", lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:11, color:"rgba(245,240,232,0.4)", marginTop:6, textTransform:"uppercase", letterSpacing:"0.1em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* ══════════ MARQUEE ══════════ */}
      <div style={{ borderTop:"1px solid rgba(231,22,42,0.1)", borderBottom:"1px solid rgba(231,22,42,0.1)", padding:"18px 0", overflow:"hidden", background:"rgba(231,22,42,0.03)" }}>
        <div className="marquee-track" style={{ display:"flex", gap:"60px", width:"max-content" }}>
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w,i) => (
            <span key={i} style={{ fontSize:13, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color: i%3===0 ? "#E7162A" : "rgba(245,240,232,0.25)", whiteSpace:"nowrap" }}>
              {w} <span style={{ color:"rgba(231,22,42,0.3)", marginLeft:30 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ POURQUOI NOUS ══════════ */}
      <section id="methode" style={{ padding:"120px 2rem", maxWidth:1200, margin:"0 auto" }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E7162A", marginBottom:16 }}>Notre différence</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.5rem)", fontWeight:900, lineHeight:1.1, margin:0 }}>
              Pourquoi choisir<br/><em style={{ color:"#E7162A" }}>Prime Academy ?</em>
            </h2>
          </div>
          <p className="max-w-[320px] text-[15px] text-[#F5F0E8]/50 leading-relaxed md:text-right">
            L'anglais n'est pas une matière à mémoriser. C'est un muscle à entraîner — avec la bonne méthode.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:24 }}>
          {WHY.map(({ n, title, desc }) => (
            <div key={n} style={{
              border:"1px solid rgba(231,22,42,0.12)", borderRadius:20, padding:"36px 28px",
              background:"rgba(20,20,30,0.6)", backdropFilter:"blur(16px)",
              transition:"all 0.3s",
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(231,22,42,0.4)"; (e.currentTarget as HTMLElement).style.transform="translateY(-6px)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(231,22,42,0.12)"; (e.currentTarget as HTMLElement).style.transform="translateY(0)";}}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:56, fontWeight:900, color:"rgba(231,22,42,0.12)", lineHeight:1, marginBottom:20 }}>{n}</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, marginBottom:12, color:"#F5F0E8" }}>{title}</h3>
              <p style={{ fontSize:14, color:"rgba(245,240,232,0.5)", lineHeight:1.7, margin:0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="divider-gold" style={{ maxWidth:1200, margin:"0 auto" }}/>

      {/* ══════════ FORMATS DE COURS ══════════ */}
      <section style={{ padding:"120px 2rem", background:"rgba(231,22,42,0.02)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E7162A", marginBottom:16 }}>Flexibilité totale</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.2rem)", fontWeight:900, margin:"0 0 16px" }}>
              Des formats adaptés à <em style={{ color:"#E7162A" }}>vos besoins</em>
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24 }}>
            {/* Format Présentiel */}
            <div style={{ border:"1px solid rgba(231,22,42,0.15)", borderRadius:20, padding:"40px", background:"rgba(20,20,30,0.6)", backdropFilter:"blur(16px)" }}>
              <div style={{ width:50, height:50, borderRadius:12, background:"rgba(231,22,42,0.1)", color:"#E7162A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:24 }}>🏢</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:900, color:"#F5F0E8", marginBottom:12 }}>Présentiel</h3>
              <p style={{ color:"rgba(245,240,232,0.5)", lineHeight:1.7, fontSize:15, marginBottom:24 }}>Immersion totale dans nos locaux à Angré 8e Tranche. L'environnement idéal pour rester concentré, interagir en face-à-face et profiter de la dynamique de groupe.</p>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#E7162A" }}>Disponible</div>
            </div>

            {/* Format En Ligne (Conditionnel) */}
            {(systemSettings?.enableOnlineRegistration ?? true) && (
              <div style={{ border:"1px solid rgba(231,22,42,0.15)", borderRadius:20, padding:"40px", background:"rgba(20,20,30,0.6)", backdropFilter:"blur(16px)" }}>
                <div style={{ width:50, height:50, borderRadius:12, background:"rgba(231,22,42,0.1)", color:"#E7162A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:24 }}>💻</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:900, color:"#F5F0E8", marginBottom:12 }}>En Ligne (100% Live)</h3>
                <p style={{ color:"rgba(245,240,232,0.5)", lineHeight:1.7, fontSize:15, marginBottom:24 }}>Suivez vos cours depuis chez vous ou le bureau via Zoom/Meet. Une interactivité préservée, des corrections en direct, et un gain de temps précieux dans les transports.</p>
                <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#1dcaff" }}>Inscriptions ouvertes</div>
              </div>
            )}

            {/* Format Entreprise (Conditionnel) */}
            {(systemSettings?.enableCorporateRegistration ?? true) && (
              <div style={{ border:"1px solid rgba(231,22,42,0.15)", borderRadius:20, padding:"40px", background:"rgba(20,20,30,0.6)", backdropFilter:"blur(16px)" }}>
                <div style={{ width:50, height:50, borderRadius:12, background:"rgba(231,22,42,0.1)", color:"#E7162A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:24 }}>💼</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:900, color:"#F5F0E8", marginBottom:12 }}>B2B & Entreprises</h3>
                <p style={{ color:"rgba(245,240,232,0.5)", lineHeight:1.7, fontSize:15, marginBottom:24 }}>Programmes sur-mesure pour vos collaborateurs. Coaching exécutif, formations sectorielles et renforcement des capacités en anglais professionnel intra-muros.</p>
                <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#f59e0b" }}>Sur devis</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-gold" style={{ maxWidth:1200, margin:"0 auto" }}/>

      {/* ══════════ MISSION / VISION ══════════ */}
      <section id="mission" style={{ padding:"120px 2rem" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", top:-40, left:-40, width:300, height:300, borderRadius:"50%", background:"rgba(231,22,42,0.05)", filter:"blur(80px)", pointerEvents:"none" }}/>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E7162A", marginBottom:16 }}>Notre mission</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:900, lineHeight:1.15, marginBottom:28 }}>
              Prime Language<br/><em style={{ color:"#E7162A" }}>Academy</em>
            </h2>
            <p style={{ fontSize:16, lineHeight:1.85, color:"rgba(245,240,232,0.6)", marginBottom:20 }}>
              Dans l'espace francophone africain, la maîtrise des langues étrangères reste un frein majeur. Prime Language Academy est née d'un constat simple : les offres existantes ne prennent pas en compte les réalités spécifiques des apprenants francophones.
            </p>
            <p style={{ fontSize:16, lineHeight:1.85, color:"rgba(245,240,232,0.6)" }}>
              Les blocages psychologiques à l'oral, la peur de faire des fautes, l'absence d'un cadre progressif et adapté. <strong style={{ color:"#F5F0E8" }}>Nous connaissons notre public.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon:"🧠", t:"Pédagogie claire", d:"Structure progressive et adaptée aux francophones" },
              { icon:"🤝", t:"Accompagnement humain", d:"Formateurs engagés, pas des algorithmes" },
              { icon:"⚡", t:"Formats flexibles", d:"1 à 6 séances selon votre rythme de vie" },
              { icon:"🌍", t:"Maîtrise active", d:"Priorité à l'expression orale et à la confiance" },
            ].map(({icon,t,d}) => (
              <div key={t} style={{ border:"1px solid rgba(231,22,42,0.1)", borderRadius:16, padding:"24px 20px", background:"rgba(20,20,30,0.5)" }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#F5F0E8", marginBottom:6 }}>{t}</div>
                <div style={{ fontSize:12, color:"rgba(245,240,232,0.45)", lineHeight:1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TARIFS ══════════ */}
      <section id="tarifs" style={{ padding:"120px 2rem", background:"rgba(231,22,42,0.02)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E7162A", marginBottom:16 }}>Tarification</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.2rem)", fontWeight:900, margin:"0 0 16px" }}>
              Grille <em style={{ color:"#E7162A" }}>« À la carte »</em>
            </h2>
            <p style={{ color:"rgba(245,240,232,0.45)", fontSize:15, marginBottom:40 }}>Frais d'inscription offerts (0 FCFA) pour toutes les offres</p>

            {/* Toggle Switch */}
            <div style={{ display:"inline-flex", background:"rgba(20,20,30,0.8)", border:"1px solid rgba(231,22,42,0.2)", borderRadius:100, padding:6, position:"relative" }}>
              <button onClick={() => setPricingMode("formation")}
                style={{ position:"relative", zIndex:1, padding:"12px 28px", borderRadius:100, fontSize:13, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color: pricingMode==="formation" ? "#080808" : "rgba(245,240,232,0.5)", transition:"color 0.3s" }}>
                Formation (2 Mois)
              </button>
              <button onClick={() => setPricingMode("club")}
                style={{ position:"relative", zIndex:1, padding:"12px 28px", borderRadius:100, fontSize:13, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color: pricingMode==="club" ? "#080808" : "rgba(245,240,232,0.5)", transition:"color 0.3s" }}>
                English Club (Mensuel)
              </button>
              {/* Highlight Background */}
              <div style={{
                position:"absolute", top:6, left:6, bottom:6, width:"calc(50% - 6px)",
                background:"linear-gradient(135deg,#E7162A,#FF4D5E)", borderRadius:100,
                transition:"transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: pricingMode==="club" ? "translateX(100%)" : "translateX(0)",
                boxShadow:"0 0 20px rgba(231,22,42,0.2)"
              }}/>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:16 }}>
            {(pricingMode === "formation" ? PLANS : CLUB_PLANS).map(p => (
              <div key={p.id}
                onClick={() => setActivePlan(p.id)}
                style={{
                  border: activePlan===p.id ? "1px solid #E7162A" : "1px solid rgba(231,22,42,0.12)",
                  borderRadius:20, padding:"28px 20px", cursor:"pointer",
                  background: activePlan===p.id ? "rgba(231,22,42,0.08)" : "rgba(20,20,30,0.6)",
                  backdropFilter:"blur(16px)",
                  boxShadow: activePlan===p.id ? "0 0 30px rgba(231,22,42,0.15)" : "none",
                  transition:"all 0.25s", position:"relative",
                }}>
                {p.top && <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:"#E7162A", color:"#080808", fontSize:10, fontWeight:800, padding:"4px 12px", borderRadius:100, textTransform:"uppercase", letterSpacing:"0.12em", whiteSpace:"nowrap" }}>Le Summum</div>}
                <div style={{ fontSize:13, fontWeight:700, color: activePlan===p.id ? "#E7162A" : "#F5F0E8", marginBottom:6 }}>{p.label}</div>
                <div style={{ fontSize:11, color:"rgba(245,240,232,0.4)", marginBottom:20, letterSpacing:"0.08em" }}>{p.freq}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color: activePlan===p.id ? "#E7162A" : "#F5F0E8" }}>{p.price}</div>
                <div style={{ fontSize:11, color:"rgba(245,240,232,0.35)", marginTop:2 }}>FCFA {pricingMode === "club" ? "/ mois" : "/ 2 mois"}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:48, display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
            <Link href={pricingMode === "formation" ? "/register" : "/register-club"} className="btn-primary" style={{ textDecoration:"none", display:"inline-block" }}>
              {pricingMode === "formation" ? "Réserver ma place →" : "Rejoindre le cercle →"}
            </Link>
            {pricingMode === "club" && (
              <Link href="/english-club" style={{ color:"rgba(245,240,232,0.5)", fontSize:13, letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600, textDecoration:"underline", textUnderlineOffset:4 }}>
                Découvrir en détail le Club
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ══════════ HORAIRES ══════════ */}
      <section style={{ padding:"80px 2rem" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[["Vague 1","16h00 – 18h00","Idéale pour les lycéens & étudiants"],["Vague 2","18h00 – 20h00","Idéale pour les professionnels"]].map(([label,time,desc]) => (
            <div key={label} style={{ border:"1px solid rgba(231,22,42,0.15)", borderRadius:20, padding:"40px 32px", background:"rgba(20,20,30,0.6)", backdropFilter:"blur(16px)", overflow:"hidden", position:"relative" }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(231,22,42,0.05)", filter:"blur(30px)" }}/>
              <div style={{ fontSize:11, color:"#E7162A", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12 }}>{label}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:900, color:"#F5F0E8", marginBottom:12 }}>{time}</div>
              <div style={{ fontSize:13, color:"rgba(245,240,232,0.45)" }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section style={{ padding:"120px 2rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, borderRadius:"50%", background:"rgba(231,22,42,0.05)", filter:"blur(120px)", pointerEvents:"none" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E7162A", marginBottom:24 }}>Inscription ouverte</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", fontWeight:900, lineHeight:1.1, marginBottom:20, maxWidth:700, margin:"0 auto 20px" }}>
            Prêt à débloquer<br/><em style={{ color:"#E7162A" }}>votre potentiel ?</em>
          </h2>
          <p style={{ color:"rgba(245,240,232,0.5)", fontSize:16, marginBottom:48, maxWidth:480, marginLeft:"auto", marginRight:"auto", lineHeight:1.7 }}>
            Angré 8e Tranche · Lun–Dim · 16h – 20h<br/>
            <a href="https://wa.me/2250161337864?text=Bonjour%20!%20Je%20souhaite%20avoir%20des%20informations%20sur%20Prime%20Language%20Academy%20%F0%9F%8E%93" target="_blank" rel="noopener noreferrer" style={{ color:"#25D366", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:6, marginTop:8 }}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.83 6.5L4 29l7.7-1.81A12.94 12.94 0 0016 28c6.627 0 12-5.373 12-13S22.627 3 16 3z" fill="#25D366"/><path d="M21.04 18.16c-.28-.14-1.664-.82-1.92-.912-.256-.096-.44-.14-.628.14-.188.28-.72.912-.88 1.1-.164.184-.324.208-.604.07-.28-.14-1.18-.436-2.248-1.388-.832-.74-1.392-1.656-1.556-1.936-.164-.28-.016-.432.124-.572.126-.124.28-.324.42-.488.14-.164.188-.28.28-.468.096-.188.048-.352-.024-.492-.068-.14-.628-1.512-.86-2.072-.228-.548-.456-.472-.628-.48l-.536-.008c-.188 0-.492.068-.748.352-.256.284-.98.956-.98 2.332 0 1.376 1.004 2.704 1.14 2.892.14.188 1.968 3.004 4.768 4.212.668.288 1.188.46 1.596.588.668.212 1.276.184 1.756.112.536-.08 1.664-.68 1.896-1.34.236-.656.236-1.22.168-1.34-.072-.12-.252-.188-.532-.328z" fill="white"/></svg>
              +225 01 61 33 78 64 · WhatsApp
            </a>
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" className="btn-primary" style={{ textDecoration:"none" }}>
              Commencer maintenant
            </Link>
            <Link href="/placement-test" style={{
              display:"inline-flex", alignItems:"center",
              padding:"14px 28px", borderRadius:100,
              border:"1px solid rgba(231,22,42,0.3)", color:"#E7162A",
              textDecoration:"none", fontSize:13, letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600,
            }}>Test de placement gratuit</Link>
          </div>
        </div>
      </section>

      {/* ══════════ ENGLISH CLUB SECTION ══════════ */}
      <section style={{ padding:"120px 2rem", background:"rgba(231,22,42,0.02)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(ellipse 60% 50% at 50% 100%, rgba(231,22,42,0.07) 0%, transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:24, marginBottom:64 }}>
            <div>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E7162A", marginBottom:16 }}>Exclusivité</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,4vw,3.5rem)", fontWeight:900, margin:0, lineHeight:1.1 }}>
                The English Club<br/><em style={{ color:"#E7162A" }}>by Prime</em>
              </h2>
            </div>
            <Link href="/english-club" style={{ fontSize:12, color:"#E7162A", textDecoration:"none", border:"1px solid rgba(231,22,42,0.3)", borderRadius:100, padding:"10px 22px", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600, flexShrink:0, transition:"all 0.2s" }}>Découvrir le Club →</Link>
          </div>

          {/* Two-column split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left — concept */}
            <div className="lg:row-span-2" style={{ border:"1px solid #E7162A", borderRadius:24, padding:"48px 40px", background:"rgba(231,22,42,0.04)", backdropFilter:"blur(16px)", boxShadow:"0 0 40px rgba(231,22,42,0.08)" }}>
              <div style={{ fontSize:11, color:"#E7162A", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:20 }}>Cercle Privé · B2 → C2</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:"#E7162A", marginBottom:20, lineHeight:1.2 }}>Un club social anglophone pour l'élite d'Abidjan</h3>
              <p style={{ color:"rgba(245,240,232,0.6)", lineHeight:1.85, fontSize:15, marginBottom:32 }}>
                Pour ceux qui maîtrisent déjà l'anglais et veulent <strong style={{ color:"#F5F0E8" }}>le vivre au quotidien</strong>. Un cercle chic et connecté — cadres, entrepreneurs, créatifs, profils international — où la langue est un passeport social.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:40 }}>
                {["🥂 English Social Nights","🎯 Conversation Circles (6–10 pers)","🎤 Guest Talks & Masterclasses","🎬 Projections VO & Ateliers CV"].map(f => (
                  <div key={f} style={{ fontSize:13, color:"rgba(245,240,232,0.75)", display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ color:"#E7162A" }}>✦</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/english-club" style={{ fontSize:12, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", background:"linear-gradient(135deg,#E7162A,#FF4D5E,#B30012)", color:"#080808", padding:"14px 28px", borderRadius:100, textDecoration:"none", display:"inline-block", boxShadow:"0 0 25px rgba(231,22,42,0.2)" }}>Rejoindre le cercle →</Link>
            </div>

            {/* Right top — public vs formation */}
            <div style={{ border:"1px solid rgba(231,22,42,0.12)", borderRadius:20, padding:"32px 28px", background:"rgba(20,20,30,0.6)", backdropFilter:"blur(16px)" }}>
              <div style={{ fontSize:11, color:"rgba(245,240,232,0.4)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:16 }}>Comment ça marche ?</div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { step:"01", label:"Vous avez déjà le niveau B2+", sub:"Accès direct au Club" },
                  { step:"02", label:"Vous débutez ?", sub:"Formation 2 mois → puis Club" },
                  { step:"03", label:"Membership mensuel à la carte", sub:"1 à 6 sessions / semaine" },
                  { step:"04", label:"Espace membre privé inclus", sub:"Accès à la plateforme & forums" },
                ].map(({step,label,sub}) => (
                  <div key={step} style={{ display:"flex", alignItems:"flex-start", gap:16, padding:"14px 0", borderBottom:"1px solid rgba(231,22,42,0.07)" }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:"rgba(231,22,42,0.25)", lineHeight:1, flexShrink:0, width:28 }}>{step}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#F5F0E8", marginBottom:3 }}>{label}</div>
                      <div style={{ fontSize:11, color:"rgba(245,240,232,0.4)" }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right bottom — ambiance */}
            <div style={{ border:"1px solid rgba(231,22,42,0.12)", borderRadius:20, padding:"28px", background:"rgba(20,20,30,0.6)", backdropFilter:"blur(16px)" }}>
              <div style={{ fontSize:11, color:"rgba(245,240,232,0.4)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>L'ambiance</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {["Chaleureux","Exigeant","Bienveillant","Chic","100% Anglais","Networking","Ouvert","Global Mindset","Connecté"].map(t => (
                  <span key={t} style={{ fontSize:11, border:"1px solid rgba(231,22,42,0.2)", borderRadius:100, padding:"5px 14px", color:"rgba(245,240,232,0.55)" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-[#E7162A]/10 px-6 sm:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <LogoMark className="h-16 w-16 sm:h-20 sm:w-20" />
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"rgba(245,240,232,0.5)" }}>Prime Language Academy</span>
        </div>
        <div style={{ display:"flex", gap:32, fontSize:12, color:"rgba(245,240,232,0.3)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
          <Link href="/blog" style={{ color:"inherit", textDecoration:"none" }}>Blog</Link>
          <Link href="/english-club" style={{ color:"#E7162A", textDecoration:"none" }}>English Club</Link>
          <Link href="/placement-test" style={{ color:"inherit", textDecoration:"none" }}>Test</Link>
          <Link href="/login" style={{ color:"inherit", textDecoration:"none" }}>Connexion</Link>
        </div>
        <div style={{ fontSize:11, color:"rgba(245,240,232,0.2)", letterSpacing:"0.1em" }}>© 2026 Prime Language Academy</div>
      </footer>
    </div>
  );
}
