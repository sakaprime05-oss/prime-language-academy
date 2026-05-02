import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { PLA_SESSION, PLA_TIME_SLOTS } from "@/lib/pla-program";

export const metadata: Metadata = {
  title: "Contact | Prime Language Academy Abidjan",
  description:
    "Contactez Prime Language Academy à Abidjan Cocody Angré pour une inscription, un test de niveau, un rendez-vous ou une question sur la formation d'anglais.",
  alternates: {
    canonical: "/contact",
  },
};

const whatsappMessage = encodeURIComponent(
  "Bonjour Prime Language Academy, je souhaite avoir des informations sur la formation d'anglais."
);

const contactActions = [
  {
    label: "WhatsApp",
    value: siteConfig.contact.phone,
    href: `${siteConfig.links.whatsapp}?text=${whatsappMessage}`,
    icon: MessageCircle,
    tone: "primary",
  },
  {
    label: "Appel direct",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`,
    icon: Phone,
    tone: "neutral",
  },
  {
    label: "Email administratif",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
    tone: "neutral",
  },
];

const quickLinks = [
  { label: "S'inscrire", href: "/register", detail: "Réserver une place pour la session de lancement" },
  { label: "Test de niveau", href: "/placement-test", detail: "Évaluer son niveau avant de choisir un parcours" },
  { label: "Rendez-vous", href: "/rendez-vous", detail: "Planifier un échange avec un conseiller" },
  { label: "Programme", href: "/programme", detail: "Voir les horaires, tarifs et formules disponibles" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border)] px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-sm font-black uppercase tracking-[0.18em] text-[var(--foreground)]">
            Prime Academy
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-[#E7162A] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-[#c51224]"
          >
            Inscription
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#E7162A]">
              Contact & orientation
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-normal sm:text-5xl lg:text-6xl">
              Parlez-nous de votre objectif en anglais.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
              Pour une inscription, un test de niveau, un rendez-vous ou une question sur les formules, WhatsApp reste le
              canal le plus rapide. L'équipe vous oriente vers le bon parcours selon votre niveau, votre disponibilité et
              votre objectif.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`${siteConfig.links.whatsapp}?text=${whatsappMessage}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E7162A] px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white shadow-sm transition hover:bg-[#c51224]"
              >
                <MessageCircle className="h-4 w-4" />
                Écrire sur WhatsApp
              </a>
              <Link
                href="/rendez-vous"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-[var(--foreground)] transition hover:border-[#E7162A] hover:text-[#E7162A]"
              >
                <CalendarDays className="h-4 w-4" />
                Prendre rendez-vous
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <div className="grid gap-3">
              {contactActions.map((action) => {
                const Icon = action.icon;

                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`group flex items-center gap-4 rounded-xl border p-4 transition ${
                      action.tone === "primary"
                        ? "border-[#E7162A]/30 bg-[#E7162A]/10"
                        : "border-[var(--border)] bg-[var(--background)]"
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-[#E7162A] ring-1 ring-[var(--border)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-black uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                        {action.label}
                      </span>
                      <span className="mt-1 block break-words text-sm font-bold text-[var(--foreground)] group-hover:text-[#E7162A]">
                        {action.value}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)] px-6 py-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <InfoPanel
            icon={MapPin}
            title="Adresse"
            value={siteConfig.contact.address}
            detail={`${PLA_SESSION.location}. ${PLA_SESSION.locationHint}.`}
          />
          <InfoPanel
            icon={Clock}
            title="Horaires des cours"
            value={PLA_TIME_SLOTS.map((slot) => `${slot.label}: ${slot.time}`).join(" | ")}
            detail="Rattrapage possible selon disponibilité et organisation de la semaine."
          />
          <InfoPanel
            icon={ShieldCheck}
            title="Session en cours"
            value={PLA_SESSION.dates}
            detail="Inscription offerte pour la session de lancement, place confirmée après validation du dossier."
          />
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E7162A]">Accès rapide</p>
              <h2 className="mt-3 text-2xl font-black tracking-normal sm:text-3xl">Choisissez la prochaine action</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
              Les demandes d'inscription et de rendez-vous passent par des formulaires dédiés pour éviter les oublis.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[#E7162A]/60 hover:shadow-md"
              >
                <span className="block text-lg font-black text-[var(--foreground)] group-hover:text-[#E7162A]">
                  {item.label}
                </span>
                <span className="mt-3 block text-sm leading-6 text-[var(--muted-foreground)]">{item.detail}</span>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#E7162A]">
                  Ouvrir
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

type InfoPanelProps = {
  icon: typeof MapPin;
  title: string;
  value: string;
  detail: string;
};

function InfoPanel({ icon: Icon, title, value, detail }: InfoPanelProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#E7162A]/10 text-[#E7162A]">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{title}</h2>
      <p className="mt-3 text-base font-black leading-7 text-[var(--foreground)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{detail}</p>
    </div>
  );
}
