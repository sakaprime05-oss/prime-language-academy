import { auth } from "@/auth";
import { getSystemSettings } from "@/app/actions/system-settings";
import { getArticles } from "@/app/actions/articles";
import ClientLanding from "./ClientLanding";

export default async function LandingPage() {
  const session = await auth();
  const systemSettings = await getSystemSettings();
  const latestArticles = (await getArticles(true)).slice(0, 3);

  return <ClientLanding session={session} systemSettings={systemSettings} latestArticles={latestArticles} />;
}
