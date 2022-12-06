import { type LoaderArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);

  if (session.get("authenticated") === true) {
    throw redirect("/");
  }

  return null;
}

export default function SignInPage() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Sign In Page</h1>
      <Form method="post" action="/sign-in/provider">
        <button type="submit">Sign in</button>
      </Form>
    </div>
  );
}
