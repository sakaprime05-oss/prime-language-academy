import { auth } from "@/auth";
import { getSystemSettings } from "@/app/actions/system-settings";
import { getArticles } from "@/app/actions/articles";
import ClientLanding from "./ClientLanding";

export default async function LandingPage() {
  // Tentative de restauration de la version complète
  const session = await auth().catch(() => null);
  const systemSettings = await getSystemSettings().catch(() => null);
  const latestArticles = await getArticles(true).catch(() => []);

  return <ClientLanding session={session} systemSettings={systemSettings} latestArticles={latestArticles?.slice(0, 3) || []} />;
}
