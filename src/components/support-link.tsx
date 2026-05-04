const WA_NUMBER = "2250161337864";

function supportUrl(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function SupportLink({ context = "general", className = "" }: { context?: string; className?: string }) {
  const messages: Record<string, string> = {
    payment: "Bonjour Prime Language Academy, j'ai besoin d'aide concernant mon paiement.",
    courses: "Bonjour Prime Language Academy, j'ai besoin d'aide concernant mes cours ou mes supports PDF.",
    profile: "Bonjour Prime Language Academy, j'ai besoin d'aide pour completer mon profil.",
    general: "Bonjour Prime Language Academy, j'ai besoin d'aide sur la plateforme.",
  };

  return (
    <a
      href={supportUrl(messages[context] || messages.general)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-emerald-600 transition-colors hover:bg-emerald-500/15 ${className}`}
    >
      Besoin d'aide ?
    </a>
  );
}
