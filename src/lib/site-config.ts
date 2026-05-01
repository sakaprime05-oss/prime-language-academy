/**
 * Configuration globale du site pour faciliter le clonage et la personnalisation.
 */
export const siteConfig = {
  name: "Prime Language Academy",
  shortName: "Prime Academy",
  description: "Système de gestion pédagogique haute performance pour Prime Language Academy. Parlez anglais. Vivez des opportunités.",
  url: "https://primelangageacademy.com",
  ogImage: "https://primelangageacademy.com/icon-512x512.png",
  links: {
    whatsapp: "https://wa.me/225xxxxxxxx", // À mettre à jour
  },
  themeColor: "#E7162A",
  contact: {
    email: "contact@primelanguageacademy.com",
  }
};

export type SiteConfig = typeof siteConfig;
