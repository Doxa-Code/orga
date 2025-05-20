import "server-only";
import { checkAuthenticateAction, logoutAction } from "./actions/auth";

export default async function App({
  searchParams,
}: {
  searchParams?: { action: string };
}) {
  if (searchParams?.action === "logout") {
    await logoutAction();
    return <></>;
  }

  await checkAuthenticateAction();
  return <></>;
}
