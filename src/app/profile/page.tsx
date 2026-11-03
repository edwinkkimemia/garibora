import { redirect } from "next/navigation";

// Profile now lives inside the dashboard so every role (including admin)
// uses the same settings screen.
export default function ProfileRedirect() {
  redirect("/dashboard/settings");
}
