import { redirect } from "next/navigation";

export default function HomePage() {
  // Always redirect to login for now. Later we will add auth check.
  redirect("/login");
}
