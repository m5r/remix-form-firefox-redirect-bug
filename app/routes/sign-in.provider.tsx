import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/sign-in");
}

export async function action() {
  return redirect("http://localhost:3001/");
}
