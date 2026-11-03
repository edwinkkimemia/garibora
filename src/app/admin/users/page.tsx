import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { verifyUserAction, setUserRoleAction, rejectVerificationAction } from "@/lib/actions";

export const metadata = { title: "Admin — users & sellers" };

const pendingWhere = {
  idVerified: false,
  OR: [{ idNumber: { not: null } }, { kraPin: { not: null } }, { idDocUrl: { not: null } }, { kraPinDocUrl: { not: null } }, { bizPermitUrl: { not: null } }],
};

function Doc({ url, label }: { url: string | null; label: string }) {
  if (!url) return <span className="rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground">{label}: —</span>;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="group relative block h-14 w-20 overflow-hidden rounded-lg border" title={`View ${label}`}>
      <Image src={url} alt={label} fill className="object-cover transition group-hover:scale-105" sizes="100px" />
      <span className="absolute bottom-0 inset-x-0 bg-navy/85 px-1 py-0.5 text-center text-[10px] font-bold text-gold-light">{label} ↗</span>
    </a>
  );
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string }> }) {
  const { q, role } = await searchParams;
  const query = (q || "").trim();
  const roleFilter = ["BUYER", "SELLER", "DEALER", "ADMIN"].includes(role || "") ? role! : "";
  const userWhere = {
    ...(query ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { email: { contains: query, mode: "insensitive" } }, { phone: { contains: query } }] } : {}),
    ...(roleFilter ? { role: roleFilter as never } : {}),
  };
  const [requests, users, counts] = await Promise.all([
    prisma.user.findMany({ where: pendingWhere as never, orderBy: { createdAt: "desc" }, take: 30 }).catch(() => []),
    prisma.user.findMany({ where: userWhere as never, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []),
    prisma.user.groupBy({ by: ["role"], _count: true }).catch(() => [] as { role: string; _count: number }[]),
  ]);
  const qs = (over: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (roleFilter) sp.set("role", roleFilter);
    Object.entries(over).forEach(([k, v]) => { if (v) sp.set(k, v); else sp.delete(k); });
    return `/admin/users?${sp.toString()}`;
  };
  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Admin", href: "/admin" }, { label: "Users & sellers" }]} />
      <h1 className="text-2xl font-extrabold">Seller verification ({requests.length} pending)</h1>
      <p className="mt-1 text-sm text-muted-foreground">Check ID number + KRA PIN against the document photos, then verify or request changes.</p>

      <div className="mt-4 grid gap-3">
        {requests.map((u) => (
          <div key={u.id} className="rounded-2xl border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="text-sm">
                <p className="font-bold">{u.name} <Badge variant="outline">{u.role}</Badge></p>
                <p className="text-muted-foreground">{u.email}{u.phone ? ` • ${u.phone}` : ""}</p>
                <p className="mt-1 text-xs">ID: <b>{u.idNumber ?? "—"}</b> • KRA: <b>{u.kraPin ?? "—"}</b></p>
              </div>
              <form action={async () => { "use server"; await verifyUserAction(u.id); }}>
                <Button size="sm">Verify seller ✓</Button>
              </form>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Doc url={u.idDocUrl} label="ID" />
              <Doc url={u.kraPinDocUrl} label="KRA PIN" />
              <Doc url={u.bizPermitUrl} label="Permit" />
            </div>
            <form action={rejectVerificationAction} className="mt-3 flex gap-2">
              <input type="hidden" name="userId" value={u.id} />
              <Input name="note" placeholder="Reason (e.g. ID photo blurry, KRA name mismatch)…" className="h-8 text-xs" />
              <Button size="sm" variant="outline" className="shrink-0">Request changes</Button>
            </form>
          </div>
        ))}
        {requests.length === 0 && <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">No pending ID verifications.</p>}
      </div>

      <h2 className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <span className="text-xl font-extrabold">All users</span>
      <span className="text-xs font-normal text-muted-foreground">{counts.map((g) => `${g.role}: ${g._count}`).join(" • ")}</span>
    </h2>
    <form className="mt-3 flex flex-wrap gap-2" action="/admin/users" method="get">
      <Input name="q" defaultValue={query} placeholder="Search name, email, phone…" className="w-64" />
      {roleFilter && <input type="hidden" name="role" value={roleFilter} />}
      <Button type="submit" size="sm" variant="secondary">Search</Button>
      {(query || roleFilter) && <Link href="/admin/users"><Button size="sm" variant="ghost">Clear</Button></Link>}
    </form>
    <div className="mt-2 flex flex-wrap gap-2">
      <Link href={qs({ role: "" })}><Button size="sm" variant={!roleFilter ? "default" : "outline"}>All</Button></Link>
      {["BUYER", "SELLER", "DEALER", "ADMIN"].map((r) => (
        <Link key={r} href={qs({ role: roleFilter === r ? "" : r })}><Button size="sm" variant={roleFilter === r ? "default" : "outline"}>{r}s</Button></Link>
      ))}
    </div>
      <div className="mt-3 overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
            <th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Verified</th><th className="p-3">Change role</th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="p-3"><p className="font-semibold">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></td>
                <td className="p-3"><Badge variant="outline">{u.role}</Badge></td>
                <td className="p-3 text-xs">{u.idVerified ? "ID ✓" : u.verified ? "Email" : "—"}</td>
                <td className="p-3">
                  <form action={setUserRoleAction} className="flex gap-1">
                    <input type="hidden" name="userId" value={u.id} />
                    <Select name="role" defaultValue={u.role} className="h-8 w-28 text-xs">
                      <option value="BUYER">BUYER</option><option value="SELLER">SELLER</option>
                      <option value="DEALER">DEALER</option><option value="ADMIN">ADMIN</option>
                    </Select>
                    <Button size="sm" variant="secondary">Set</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
