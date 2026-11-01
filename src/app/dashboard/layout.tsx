import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/dashboard");
  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/listings", label: "My listings" },
    { href: "/dashboard/inquiries", label: "Inquiries" },
    { href: "/sell", label: "＋ New listing" },
    { href: "/profile", label: "Profile" },
  ];
  return (
    <div className="container grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border bg-card p-3 lg:sticky lg:top-20">
        <nav className="grid gap-1">
          {links.map((l) => <Link key={l.href} href={l.href} className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-accent">{l.label}</Link>)}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
