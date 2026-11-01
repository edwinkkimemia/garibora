import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/profile");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { dealerProfile: true } }).catch(() => null);
  return (
    <div className="container max-w-xl py-8">
      <h1 className="text-3xl font-extrabold">Profile</h1>
      <Card className="mt-5"><CardHeader><CardTitle>{user?.name}</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Email: {user?.email}</p>
          <p>Phone: {user?.phone ?? "—"}</p>
          <p>Role: {user?.role}</p>
          <p>Verified: {user?.verified ? "Yes ✓" : "Not yet"}</p>
          {user?.dealerProfile && <p>Dealer: {user.dealerProfile.businessName} ({user.dealerProfile.location})</p>}
        </CardContent></Card>
    </div>
  );
}
