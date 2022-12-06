import { type LoaderArgs, redirect } from "@remix-run/node";

import { commitSession, getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);
  session.set("authenticated", true);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
