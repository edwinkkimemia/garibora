import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const me = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }).catch(() => null) : null;
  if (!me || me.role !== "ADMIN") redirect("/login?next=/admin");
  const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/listings", label: "Listing review" },
    { href: "/admin/users", label: "Users & sellers" },
  ];
  return (
    <div className="container grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border border-gold/40 bg-navy p-3 text-white lg:sticky lg:top-20">
        <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-light">Admin</p>
        <nav className="grid gap-1">
          {links.map((l) => <Link key={l.href} href={l.href} className="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/10">{l.label}</Link>)}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
