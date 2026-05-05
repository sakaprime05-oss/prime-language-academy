import Link from "next/link";
import { PLA_CLUB_CAPACITY, PLA_SESSION } from "@/lib/pla-program";

export const metadata = {
  title: "Liste d'attente English Club | Prime Language Academy",
  description: "Confirmation de liste d'attente pour The English Club by Prime Language Academy.",
};

export default function ClubWaitlistPage() {
  return (
    <main className="min-h-screen bg-[#080808] px-4 py-10 text-[#F5F0E8] sm:px-6 sm:py-20">
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
        <div className="mb-8 rounded-full border border-[#E7162A]/20 bg-[#E7162A]/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#E7162A]">
          Liste d'attente confirmée
        </div>
        <h1 className="font-serif text-4xl font-black leading-tight sm:text-6xl">
          The English Club est limité à {PLA_CLUB_CAPACITY} membres.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-7 text-[#F5F0E8]/60 sm:text-base">
          Votre demande est bien enregistrée. Aucun paiement n'est demandé maintenant. L'équipe PLA vous contactera
          dès qu'une place se libère ou qu'une nouvelle vague Club est ouverte.
        </p>
        <div className="mt-8 grid w-full gap-3 rounded-3xl border border-[#E7162A]/15 bg-white/[0.04] p-5 text-left sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F5F0E8]/35">Capacité Club</p>
            <p className="mt-1 text-2xl font-black text-[#E7162A]">{PLA_CLUB_CAPACITY} membres</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F5F0E8]/35">Contact</p>
            <p className="mt-1 text-2xl font-black text-[#E7162A]">{PLA_SESSION.phone}</p>
          </div>
        </div>
        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/english-club" className="rounded-full border border-[#E7162A]/35 px-7 py-4 text-sm font-black uppercase tracking-widest text-[#E7162A]">
            Voir le Club
          </Link>
          <Link href="/" className="rounded-full bg-[#E7162A] px-7 py-4 text-sm font-black uppercase tracking-widest text-black">
            Retour accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
