/**
 * Configuration globale du site pour faciliter le clonage et la personnalisation.
 */
export const siteConfig = {
  name: "Prime Language Academy",
  shortName: "Prime Academy",
  description:
    "Formation d'anglais à Abidjan Cocody Angré avec méthode ISO+, cours en présentiel, English Club, test de niveau et accompagnement personnalisé.",
  url: "https://primelangageacademy.com",
  ogImage: "https://primelangageacademy.com/icon-512x512.png",
  links: {
    whatsapp: "https://wa.me/2250161337864",
  },
  themeColor: "#ffffff",
  contact: {
    email: "contact@primelangageacademy.com",
    phone: "+225 01 61 33 78 64",
    address: "Cocody Angré 8e Tranche, Zone Bon Prix, Abidjan",
  },
};

export type SiteConfig = typeof siteConfig;
