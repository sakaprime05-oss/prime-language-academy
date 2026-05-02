import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const routes = [
  "",
  "/programme",
  "/contact",
  "/english-club",
  "/blog",
  "/placement-test",
  "/register",
  "/register-club",
  "/rendez-vous",
  "/conditions-generales",
  "/mentions-legales",
  "/politique-confidentialite",
  "/politique-remboursement",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : route === "/programme" || route === "/contact" ? 0.9 : 0.7,
  }));
}
