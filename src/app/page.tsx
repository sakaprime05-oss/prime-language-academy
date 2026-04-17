import { auth } from "@/auth";
import { getSystemSettings } from "@/app/actions/system-settings";
import ClientLanding from "./ClientLanding";

export default async function LandingPage() {
  const session = await auth();
  const systemSettings = await getSystemSettings();

  return <ClientLanding session={session} systemSettings={systemSettings} />;
}
