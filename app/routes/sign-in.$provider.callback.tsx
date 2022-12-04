import { type LoaderArgs, redirect } from "@remix-run/node";
import { SocialsProvider } from "remix-auth-socials";

import { commitSession, getSession } from "~/utils/session.server";
import { authenticator } from "~/utils/auth.server";

export async function loader({ request, params }: LoaderArgs) {
  const provider = params.provider;
  if (provider !== SocialsProvider.GITHUB) {
    return redirect("/sign-in?h");
  }

  const session = await getSession(request);
  const searchParams = new URL(request.url).searchParams;
  if (searchParams.has("error")) {
    const error = searchParams.get("error");
    const errorMessage = searchParams.get("error_description");
    const errorURI = searchParams.get("error_uri");

    console.error(`OAuth login error with provider "${provider}".
error="${error}"
error_description="${errorMessage}"
error_uri="${errorURI}"`);

    return redirect("/sign-in?error", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  request.headers.set("Set-Cookie", await commitSession(session));

  const user = await authenticator.authenticate(provider, request, { failureRedirect: "/sign-in" });
  session.set(authenticator.sessionKey, user);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
