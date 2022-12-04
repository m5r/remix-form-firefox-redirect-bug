import { type ActionArgs, redirect } from "@remix-run/node";
import { SocialsProvider } from "remix-auth-socials";

import { authenticator } from "~/utils/auth.server";
import { commitSession, getSession } from "~/utils/session.server";

export async function loader() {
  return redirect("/sign-in");
}

export async function action({ request, params }: ActionArgs) {
  const provider = params.provider;
  if (provider !== SocialsProvider.GITHUB) {
    return redirect("/sign-in");
  }

  const user = await authenticator.authenticate(provider, request, { failureRedirect: "/sign-in" });
  const session = await getSession(request);
  session.set(authenticator.sessionKey, user);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
