/**
 * Configuration des liens de paiement Wave pour Prime Language Academy.
 * Remplacez les liens ci-dessous par vos liens Wave réels.
 */

export const WAVE_LINKS: Record<string, string> = {
  "loisir": "https://pay.wave.com/c/votre_lien_loisir",
  "essentiel": "https://pay.wave.com/c/votre_lien_essentiel",
  "equilibre": "https://pay.wave.com/c/votre_lien_equilibre",
  "performance": "https://pay.wave.com/c/votre_lien_performance",
  "intensif": "https://pay.wave.com/c/votre_lien_intensif",
  "immersion": "https://pay.wave.com/c/votre_lien_immersion",
  // Lien par défaut si l'offre n'est pas reconnue
  "default": "https://pay.wave.com/c/votre_lien_general"
};
