import { type LoaderArgs, redirect } from "@remix-run/node";
import { SocialsProvider } from "remix-auth-socials";

import { authenticator } from "~/utils/auth.server";

export async function loader({ request }: LoaderArgs) {
  if (await authenticator.isAuthenticated(request)) {
    throw redirect("/");
  }

  return null;
}

export default function SignInPage() {
 return (
   <form method="post" action={`/sign-in/${SocialsProvider.GITHUB}`}>
     <button
       type="submit"
       className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 font-medium text-brand-700 shadow-sm hover:bg-gray-50"
     >
       Sign in with GitHub
     </button>
   </form>
 );
}
