import { redirect } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const me = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, role: true, image: true } }).catch(() => null) : null;
  if (!me || me.role !== "ADMIN") redirect("/login?next=/admin");
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl bg-navy p-3 text-white shadow-md lg:sticky lg:top-20">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-3">
            <Avatar src={me?.image} name={me?.name || "A"} className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{me.name}</p>
              <p className="flex items-center gap-1 text-[11px] text-gold-light"><ShieldCheck className="size-3" /> Administrator</p>
            </div>
          </div>
          <div className="mt-2"><AdminSidebar /></div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
