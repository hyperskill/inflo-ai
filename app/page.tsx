import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the interests page
  redirect("/interests");
}
