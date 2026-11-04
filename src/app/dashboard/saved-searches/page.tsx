import Link from "next/link";
import { BellRing, Trash2, Search } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteSavedSearchAction } from "@/lib/actions";

export const metadata = { title: "Saved searches" };

function describe(filters: Record<string, unknown>): string {
  const parts: string[] = [];
  if (filters.q) parts.push(`“${filters.q}”`);
  if (filters.make) parts.push(String(filters.make));
  if (filters.bodyType) parts.push(String(filters.bodyType).replace(/_/g, " "));
  if (filters.location) parts.push(String(filters.location));
  if (filters.maxPrice) parts.push(`under KSh ${Number(filters.maxPrice).toLocaleString()}`);
  return parts.join(" • ") || "All cars";
}

function toSearch(filters: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  sp.delete("page");
  return `/cars?${sp.toString()}`;
}

export default async function SavedSearchesPage() {
  const session = await auth();
  const items = await prisma.savedSearch.findMany({
    where: { userId: session!.user!.id! }, orderBy: { createdAt: "desc" },
  }).catch(() => []);
  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Saved searches" }]} />
      <h1 className="text-2xl font-extrabold md:text-3xl">Saved searches ({items.length}/10)</h1>
      <p className="mt-1 text-sm text-muted-foreground">We check new listings every morning. Matches land in your notifications.</p>
      <div className="mt-5 grid gap-3">
        {items.map((s) => (
          <Card key={s.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <div>
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-muted-foreground">{describe(s.filters as Record<string, unknown>)}</p>
              </div>
              <div className="flex gap-2">
                <Link href={toSearch(s.filters as Record<string, unknown>)}><Button size="sm" variant="outline"><Search />View matches</Button></Link>
                <form action={async () => { "use server"; await deleteSavedSearchAction(s.id); }}>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 />Delete</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <BellRing className="mx-auto size-8 text-gold-dark" />
            <p className="mt-2 font-bold">No saved searches yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Search cars, set filters, tap <b>Save search</b> — we&apos;ll ping you when matches land.</p>
            <Link href="/cars"><Button className="mt-4">Search cars</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
