import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CarCard } from "@/components/cars/car-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = { title: "Saved cars" };

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/favorites");
  const favs = await prisma.favorite.findMany({
    where: { userId: session.user.id }, include: { car: { include: { images: true, dealer: { select: { businessName: true } } } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);
  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ label: "Saved cars" }]} />
      <h1 className="text-3xl font-extrabold">Saved cars ({favs.length})</h1>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {favs.map((f) => <CarCard key={f.id} car={f.car as never} />)}
      </div>
      {favs.length === 0 && <p className="mt-6 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Tap the heart on any car to save it here.</p>}
    </div>
  );
}
