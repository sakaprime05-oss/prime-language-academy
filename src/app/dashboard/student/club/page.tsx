import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getStudentPhase } from "@/app/actions/student-phase";

const ACTIVITIES = [
  { icon:"🥂", title:"English Social Nights",   freq:"Mensuel",    desc:"Soirées networking thématiques — Business, Tech, Culture, Cinéma. Ambiance feutrée, 100% anglais." },
  { icon:"🎯", title:"Conversation Circles",     freq:"Hebdo",      desc:"Petits groupes (6–10 pers) autour d'un sujet précis : startups, géopolitique, marketing digital…" },
  { icon:"🎤", title:"Guest Talks",              freq:"Bi-mensuel", desc:"Invités anglophones — entrepreneurs, expatriés, diplomates — qui partagent leur expertise en live." },
  { icon:"🎬", title:"Culture & Lifestyle",      freq:"Mensuel",    desc:"Films en VO, clubs de lecture, ateliers CV & LinkedIn en anglais, simulations d'entretiens." },
  { icon:"🗣️", title:"Débats & Argumentation",  freq:"Hebdo",      desc:"Échangez sur l'actualité mondiale. Forgez votre argumentation en anglais, sans filet." },
  { icon:"📊", title:"Présentations Pro",        freq:"Bi-mensuel", desc:"Structurez vos idées, boostez votre aisance oratoire. Feedback structuré par les pairs." },
];

export default async function EnglishClubPage() {
  const session = await auth();
  if (!session || session.user?.role !== "STUDENT") redirect("/login");

  const phase = await getStudentPhase();

  if (phase === "TRAINING") {
    return (
      <div style={{ background:"#080808", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ maxWidth:560, textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(212,175,55,0.1)", border:"1px solid rgba(212,175,55,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 32px" }}>🔑</div>
          <div style={{ fontSize:11, color:"#D4AF37", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:16 }}>Accès réservé</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.5rem)", fontWeight:900, color:"#F5F0E8", marginBottom:20, lineHeight:1.2 }}>
            The English Club<br/><em style={{ color:"#D4AF37" }}>vous attend</em>
          </h1>
          <p style={{ color:"rgba(245,240,232,0.5)", fontSize:15, lineHeight:1.8, marginBottom:40 }}>
            Le Club sera débloqué automatiquement après vos <strong style={{ color:"#F5F0E8" }}>2 mois de Formation Régulière</strong>. Concentrez-vous sur vos cours fondamentaux — votre cercle anglophone vous attend de l'autre côté.
          </p>

          <div style={{ border:"1px solid rgba(212,175,55,0.15)", borderRadius:16, padding:"24px", marginBottom:32, background:"rgba(212,175,55,0.03)" }}>
            <div style={{ fontSize:11, color:"rgba(245,240,232,0.4)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:16 }}>Ce qui vous attend</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {["🥂 English Social Nights","🎯 Conversation Circles","🎤 Guest Talks & Masterclasses","🎬 Projections VO & Ateliers"].map(f => (
                <div key={f} style={{ fontSize:13, color:"rgba(245,240,232,0.6)", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:"#D4AF37" }}>✦</span> {f}
                </div>
              ))}
            </div>
          </div>

          <Link href="/dashboard/student/courses" style={{ fontSize:13, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", background:"linear-gradient(135deg,#D4AF37,#F0D060,#A08828)", color:"#080808", padding:"14px 32px", borderRadius:100, textDecoration:"none", display:"inline-block" }}>
            Reprendre mes cours →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom:80 }}>

      {/* ── HERO ── */}
      <div style={{ position:"relative", overflow:"hidden", borderRadius:24, marginBottom:32, background:"linear-gradient(135deg, #0D0D14, #1A1520)", border:"1px solid #D4AF37", padding:"48px 40px" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"rgba(212,175,55,0.08)", filter:"blur(80px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#D4AF37,transparent)", opacity:0.4 }}/>

        <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24 }}>
          <div>
            <div style={{ fontSize:10, color:"#D4AF37", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:14 }}>Espace Exclusif · Membre Actif</div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:900, color:"#D4AF37", marginBottom:12, lineHeight:1.1 }}>
              The English Club
            </h1>
            <p style={{ color:"rgba(245,240,232,0.6)", fontSize:15, lineHeight:1.7, maxWidth:520 }}>
              Bienvenue dans votre cercle anglophone privé. Pratiquez un anglais naturel, réseautez avec des profils ambitieux et vivez la langue au quotidien. <strong style={{ color:"#F5F0E8" }}>100% anglais pendant les activités.</strong>
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"flex-end" }}>
            <div style={{ border:"1px solid rgba(212,175,55,0.3)", borderRadius:12, padding:"12px 20px", textAlign:"center", background:"rgba(212,175,55,0.04)" }}>
              <div style={{ fontSize:10, color:"rgba(245,240,232,0.4)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:6 }}>Niveau requis</div>
              <div style={{ color:"#D4AF37", fontWeight:700, fontSize:16 }}>B2 → C2</div>
            </div>
            <Link href="/dashboard/student/forum" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:"linear-gradient(135deg,#D4AF37,#F0D060,#A08828)", color:"#080808", padding:"12px 24px", borderRadius:100, textDecoration:"none", textAlign:"center" }}>
              Forum du Club →
            </Link>
          </div>
        </div>
      </div>

      {/* ── RAPPEL AMBIANCE ── */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:40 }}>
        {["Chaleureux","Exigeant","Bienveillant","Chic","Networking","Global Mindset","Corrections légères","Feedback positif"].map(t => (
          <span key={t} style={{ fontSize:10, border:"1px solid rgba(212,175,55,0.2)", borderRadius:100, padding:"5px 14px", color:"rgba(245,240,232,0.5)", letterSpacing:"0.08em" }}>{t}</span>
        ))}
      </div>

      {/* ── ACTIVITÉS ── */}
      <div style={{ marginBottom:48 }}>
        <div style={{ fontSize:10, color:"rgba(245,240,232,0.4)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:24 }}>Programme des activités</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>
          {ACTIVITIES.map(({ icon, title, freq, desc }) => (
            <div key={title} style={{ border:"1px solid rgba(212,175,55,0.1)", borderRadius:16, padding:"28px 24px", background:"rgba(20,20,30,0.6)", backdropFilter:"blur(16px)", transition:"all 0.25s", cursor:"default" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,175,55,0.35)"; (e.currentTarget as HTMLElement).style.transform="translateY(-4px)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,175,55,0.1)"; (e.currentTarget as HTMLElement).style.transform="translateY(0)";}}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <span style={{ fontSize:28 }}>{icon}</span>
                <span style={{ fontSize:9, color:"#D4AF37", border:"1px solid rgba(212,175,55,0.3)", borderRadius:100, padding:"4px 10px", letterSpacing:"0.12em", textTransform:"uppercase" }}>{freq}</span>
              </div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:"#F5F0E8", marginBottom:10 }}>{title}</h3>
              <p style={{ fontSize:13, color:"rgba(245,240,232,0.48)", lineHeight:1.7, margin:0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RÈGLES DU CLUB ── */}
      <div style={{ border:"1px solid rgba(212,175,55,0.15)", borderRadius:20, padding:"36px 32px", background:"rgba(212,175,55,0.03)" }}>
        <div style={{ fontSize:10, color:"#D4AF37", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:20 }}>Règles du Club</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:20 }}>
          {[
            { n:"01", r:"100% anglais pendant les activités", d:"Le français est réservé aux urgences uniquement." },
            { n:"02", r:"Bienveillance et respect", d:"Corrections légères, feedback constructif. Jamais de moquerie." },
            { n:"03", r:"Participation active", d:"Le Club vit par ses membres. Chaque voix compte." },
            { n:"04", r:"Exigence sur la qualité", d:"On se tire mutuellement vers le haut. L'excellence est une norme." },
          ].map(({ n, r, d }) => (
            <div key={n}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:900, color:"rgba(212,175,55,0.2)", lineHeight:1, marginBottom:10 }}>{n}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#F5F0E8", marginBottom:6 }}>{r}</div>
              <div style={{ fontSize:12, color:"rgba(245,240,232,0.4)", lineHeight:1.6 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
