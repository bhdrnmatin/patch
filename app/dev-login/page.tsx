import { notFound } from "next/navigation";
import DevLogin from "./DevLogin";

/**
 * Dev-only auth bypass, for working on guarded pages while the API is down.
 * Visit /dev-login and you land in the app with a fake token.
 *
 * 404s in production: NODE_ENV is inlined at build time, so this guard is a
 * constant in a production build and the page can never hand out a session.
 * Delete this folder once the backend is reliable — it's scaffolding.
 */
export default function DevLoginPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <DevLogin />;
}
