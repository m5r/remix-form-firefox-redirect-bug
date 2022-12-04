import { type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { authenticator } from "~/utils/auth.server";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);

  return { user };
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <p>Hello, {user?.fullName || "世界"}</p>
      <section>
        {user ? (
          <Link to="/sign-out">Sign out</Link>
        ) : (
          <Link to="sign-in">Sign in</Link>
        )}
      </section>
    </div>
  );
}
