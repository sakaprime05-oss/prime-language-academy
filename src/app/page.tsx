import { auth } from "@/auth";
import { getSystemSettings } from "@/app/actions/system-settings";
import { getArticles } from "@/app/actions/articles";
import ClientLanding from "./ClientLanding";

export default async function LandingPage() {
  const session = await auth().catch(() => null);
  const systemSettings = await getSystemSettings().catch(() => null);
  const latestArticles = await getArticles(true).catch(() => []);
  const landingArticles = latestArticles.slice(0, 3).map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    category: article.category,
    content: article.content,
    createdAt: article.createdAt.toISOString(),
  }));

  return <ClientLanding session={session} systemSettings={systemSettings} latestArticles={landingArticles} />;
}
