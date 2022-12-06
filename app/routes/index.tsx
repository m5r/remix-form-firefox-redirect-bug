import { type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);

  return { authenticated: session.get("authenticated") as boolean | undefined };
}

export default function Index() {
  const { authenticated } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <p>Hello, {authenticated ? "authenticated user" : "世界"}</p>
      <section>
        {authenticated ? (
          <Link to="/sign-out">Sign out</Link>
        ) : (
          <Link to="sign-in">Sign in</Link>
        )}
      </section>
    </div>
  );
}
