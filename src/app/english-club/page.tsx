"use client";

import Link from "next/link";


const ACTIVITIES = [
  {
    icon: "🥂",
    tag: "Monthly",
    title: "English Social Nights",
    desc: "Soirées networking 100% en anglais autour de thèmes (Business, Tech, Cinéma, Culture, Voyage…). Ambiance feutrée, échanges de qualité, nouvelles connexions.",
  },
  {
    icon: "🎯",
    tag: "Weekly",
    title: "Conversation Circles",
    desc: "Petits groupes de 6 à 10 personnes autour d'un sujet précis — startups, géopolitique, marketing digital, cinéma. Échanges structurés et stimulants.",
  },
  {
    icon: "🎤",
    tag: "Bi-monthly",
    title: "Guest Talks & Masterclasses",
    desc: "Invités anglophones — entrepreneurs, expatriés, diplomates, créateurs — qui partagent leur expertise en anglais et répondent à vos questions en live.",
  },
  {
    icon: "🎬",
    tag: "Monthly",
    title: "Culture & Lifestyle",
    desc: "Projections de films en VO, clubs de lecture, ateliers CV & LinkedIn en anglais, simulations d'entretiens internationaux.",
  },
];

const MEMBERSHIPS = [
  { id: "loisir",      freq: "1 session / semaine", price: "50 000", label: "Social" },
  { id: "essentiel",   freq: "2 sessions / semaine", price: "70 000", label: "Connect" },
  { id: "equilibre",   freq: "3 sessions / semaine", price: "90 000", label: "Network" },
  { id: "performance", freq: "4 sessions / semaine", price: "110 000", label: "Executive" },
  { id: "intensif",    freq: "5 sessions / semaine", price: "130 000", label: "Elite" },
  { id: "immersion",   freq: "6 sessions / semaine", price: "150 000", label: "Founder", top: true },
];

export default function EnglishClubPublicPage() {
  return (
    <div style={{ background: "#080808", color: "#F5F0E8", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        background: "rgba(8,8,8,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(231,22,42,0.1)",
        padding: "0 2rem", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 68,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="Prime Language Academy" style={{ height: 40, width: "auto", objectFit: "contain" }} />
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/" style={{ fontSize: 13, color: "rgba(245,240,232,0.5)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>Formation</Link>
          <Link href="/register" style={{
            fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            background: "linear-gradient(135deg,#E7162A,#FF4D5E,#B30012)", color: "#080808",
            padding: "10px 22px", borderRadius: 100, textDecoration: "none",
            boxShadow: "0 0 25px rgba(231,22,42,0.25)",
          }}>Rejoindre le Club</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "110px 2rem 80px", position: "relative", overflow: "hidden" }}>
        {/* Background elements */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(231,22,42,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(231,22,42,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(231,22,42,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(231,22,42,0.3)", borderRadius: 100, padding: "8px 22px", marginBottom: 40, background: "rgba(231,22,42,0.06)" }}>
            <span style={{ fontSize: 16 }}>🔑</span>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E7162A", fontWeight: 600 }}>Membership Privé · Abidjan</span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 1.05, fontWeight: 900, marginBottom: 32, letterSpacing: "-0.02em" }}>
            The English Club<br />
            <em style={{ color: "#E7162A", fontStyle: "italic" }}>by Prime Academy</em>
          </h1>

          <p style={{ fontSize: "clamp(1rem,2vw,1.2rem)", lineHeight: 1.85, color: "rgba(245,240,232,0.55)", maxWidth: 640, margin: "0 auto 56px" }}>
            Un cercle anglophone <strong style={{ color: "#F5F0E8" }}>privé et sélect</strong> pour cadres, entrepreneurs et créatifs d'Abidjan. Pratiquez un anglais naturel, réseautez avec des profils ambitieux et vivez la langue au quotidien.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 72 }}>
            <Link href="/register-club" style={{
              fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              background: "linear-gradient(135deg,#E7162A,#FF4D5E,#B30012)", color: "#080808",
              padding: "16px 36px", borderRadius: 100, textDecoration: "none",
              boxShadow: "0 0 40px rgba(231,22,42,0.3)",
            }}>Demander un accès →</Link>
            <a href="#activites" style={{
              padding: "16px 32px", borderRadius: 100,
              border: "1px solid rgba(231,22,42,0.25)", color: "#E7162A",
              textDecoration: "none", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
            }}>Découvrir le programme</a>
          </div>

          {/* Divider with tags */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {["Networking", "100% Anglais", "Niveau B2 → C2", "Abidjan", "Global Mindset"].map(t => (
              <span key={t} style={{ fontSize: 11, color: "rgba(245,240,232,0.35)", border: "1px solid rgba(231,22,42,0.12)", borderRadius: 100, padding: "5px 14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENCIATEUR FORMATION VS CLUB ── */}
      <section style={{ padding: "100px 2rem", background: "rgba(231,22,42,0.02)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E7162A", marginBottom: 16 }}>Deux offres distinctes</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, margin: 0 }}>
              Formation <em style={{ color: "rgba(245,240,232,0.35)" }}>vs</em> Club
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Formation */}
            <div style={{ border: "1px solid rgba(245,240,232,0.1)", borderRadius: 24, padding: "48px 40px", background: "rgba(20,20,30,0.5)", backdropFilter: "blur(16px)" }}>
              <div style={{ fontSize: 11, color: "rgba(245,240,232,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Parcours 01</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, marginBottom: 16 }}>Formation Régulière</h3>
              <p style={{ color: "rgba(245,240,232,0.5)", lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>
                Programme structuré pour apprendre l'anglais de zéro à un niveau opérationnel. Méthode ISO+ (Input, Structure, Output, Automatisation), attestation CECRL.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                {["Débutants → Avancés", "Grammaire, vocabulaire, expression", "Certification CECRL A1→C2", "Groupes réduits & suivi personnalisé"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(245,240,232,0.7)" }}>
                    <span style={{ color: "#E7162A" }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "rgba(245,240,232,0.3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Durée : 2 mois · Puis → accès Club</div>
            </div>

            {/* Club */}
            <div style={{ border: "1px solid #E7162A", borderRadius: 24, padding: "48px 40px", background: "rgba(231,22,42,0.04)", backdropFilter: "blur(16px)", boxShadow: "0 0 40px rgba(231,22,42,0.1), inset 0 0 40px rgba(231,22,42,0.03)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(231,22,42,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />
              <div style={{ fontSize: 11, color: "#E7162A", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Parcours 02 · Exclusif</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: "#E7162A", marginBottom: 16 }}>English Club</h3>
              <p style={{ color: "rgba(245,240,232,0.6)", lineHeight: 1.8, marginBottom: 28, fontSize: 15 }}>
                Cercle social privé pour anglophones confirmés. Pas de cours magistraux — de l'immersion, du networking et de la vie en anglais. Pour ceux qui maîtrisent et veulent aller plus loin.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                {["Niveau B2 minimum requis", "Networking & Social Events", "Guest Talks & Masterclasses", "Membership mensuel à la carte"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(245,240,232,0.8)" }}>
                    <span style={{ color: "#E7162A" }}>✦</span> {f}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#E7162A", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.12em" }}>Accès direct si niveau B2+ · Ou après Formation</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVITÉS ── */}
      <section id="activites" style={{ padding: "100px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E7162A", marginBottom: 16 }}>Programme</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, margin: 0 }}>
              Ce qui vous attend<br /><em style={{ color: "#E7162A" }}>au Club</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {ACTIVITIES.map(({ icon, tag, title, desc }) => (
              <div key={title} style={{ border: "1px solid rgba(231,22,42,0.12)", borderRadius: 20, padding: "36px 28px", background: "rgba(20,20,30,0.6)", backdropFilter: "blur(16px)", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(231,22,42,0.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(231,22,42,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontSize: 36 }}>{icon}</span>
                  <span style={{ fontSize: 10, color: "#E7162A", border: "1px solid rgba(231,22,42,0.3)", borderRadius: 100, padding: "4px 12px", letterSpacing: "0.15em", textTransform: "uppercase" }}>{tag}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#F5F0E8" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "rgba(245,240,232,0.5)", lineHeight: 1.75, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AMBIANCE ── */}
      <section style={{ padding: "80px 2rem", background: "rgba(231,22,42,0.02)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, marginBottom: 20 }}>
            L'ambiance ? <em style={{ color: "#E7162A" }}>Chaleureuse et exigeante.</em>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.9, color: "rgba(245,240,232,0.55)", maxWidth: 680, margin: "0 auto 48px" }}>
            100% anglais pendant les activités. Une communauté bienveillante mais exigeante sur la qualité de la langue — corrections légères, coaching naturel, feedback bienveillant. Pas de jugement, seulement de la progression.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
            {[["🌍", "Global Mindset"], ["🤝", "Bienveillance"], ["⚡", "Exigence"], ["🎯", "100% Anglais"], ["🥂", "Lifestyle"]].map(([icon, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 11, color: "#E7162A", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIPS ── */}
      <section style={{ padding: "100px 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E7162A", marginBottom: 16 }}>Membership</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, margin: "0 0 12px" }}>
              Choisissez votre <em style={{ color: "#E7162A" }}>niveau d'engagement</em>
            </h2>
            <p style={{ color: "rgba(245,240,232,0.4)", fontSize: 14 }}>Accès mensuel à la plateforme membre inclus dans tous les plans</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 16 }}>
            {MEMBERSHIPS.map(p => (
              <div key={p.id} style={{
                border: p.top ? "1px solid #E7162A" : "1px solid rgba(231,22,42,0.12)",
                borderRadius: 20, padding: "30px 20px",
                background: p.top ? "rgba(231,22,42,0.07)" : "rgba(20,20,30,0.6)",
                backdropFilter: "blur(16px)",
                boxShadow: p.top ? "0 0 30px rgba(231,22,42,0.12)" : "none",
                position: "relative", textAlign: "center",
              }}>
                {p.top && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#E7162A", color: "#080808", fontSize: 9, fontWeight: 800, padding: "4px 14px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>Le Plus Exclusif</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: p.top ? "#E7162A" : "rgba(245,240,232,0.8)", marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontSize: 10, color: "rgba(245,240,232,0.35)", marginBottom: 24, letterSpacing: "0.08em" }}>{p.freq}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: p.top ? "#E7162A" : "#F5F0E8" }}>{p.price}</div>
                <div style={{ fontSize: 10, color: "rgba(245,240,232,0.3)", marginTop: 3 }}>FCFA / mois</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/register-club" style={{
              fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              background: "linear-gradient(135deg,#E7162A,#FF4D5E,#B30012)", color: "#080808",
              padding: "16px 40px", borderRadius: 100, textDecoration: "none",
              boxShadow: "0 0 35px rgba(231,22,42,0.25)", display: "inline-block",
            }}>Rejoindre le cercle →</Link>
          </div>
        </div>
      </section>

      {/* ── PROFILS ── */}
      <section style={{ padding: "80px 2rem 120px", background: "rgba(231,22,42,0.02)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, marginBottom: 16 }}>
            Fait pour <em style={{ color: "#E7162A" }}>qui ?</em>
          </h2>
          <p style={{ color: "rgba(245,240,232,0.4)", fontSize: 14, marginBottom: 48 }}>Vous vous reconnaissez dans l'un de ces profils ?</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {[
              "Cadres & Managers", "Entrepreneurs", "Créatifs & Designers", "Consultants",
              "Étudiants Internationaux", "Freelances Global", "Diplomates", "Profils Tech & Startups",
              "Professionnels de la finance", "Communicants & Marketeurs",
            ].map(p => (
              <span key={p} style={{ border: "1px solid rgba(231,22,42,0.2)", borderRadius: 100, padding: "10px 20px", fontSize: 13, color: "rgba(245,240,232,0.65)" }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(231,22,42,0.1)", padding: "40px 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <Link href="/" style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "rgba(245,240,232,0.4)", textDecoration: "none" }}>← Prime Language Academy</Link>
        <div style={{ fontSize: 11, color: "rgba(245,240,232,0.2)" }}>© 2026 The English Club by Prime</div>
      </footer>
    </div>
  );
}
