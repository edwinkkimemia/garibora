import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { verifyUserAction, setUserRoleAction } from "@/lib/actions";

export const metadata = { title: "Admin — users & sellers" };

export default async function AdminUsersPage() {
  const [requests, users] = await Promise.all([
    prisma.user.findMany({ where: { idNumber: { not: null }, idVerified: false }, orderBy: { createdAt: "desc" }, take: 30 }).catch(() => []),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []),
  ]);
  return (
    <div>
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Users & sellers" }]} />
      <h1 className="text-2xl font-extrabold">Seller verification ({requests.length} pending)</h1>
      <div className="mt-4 grid gap-3">
        {requests.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
            <div className="text-sm">
              <p className="font-bold">{u.name} <Badge variant="outline">{u.role}</Badge></p>
              <p className="text-muted-foreground">{u.email}{u.phone ? ` • ${u.phone}` : ""} • ID: <b>{u.idNumber}</b></p>
            </div>
            <form action={async () => { await verifyUserAction(u.id); }}><Button size="sm">Verify seller ✓</Button></form>
          </div>
        ))}
        {requests.length === 0 && <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">No pending ID verifications.</p>}
      </div>

      <h2 className="mt-8 text-xl font-extrabold">All users ({users.length})</h2>
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
