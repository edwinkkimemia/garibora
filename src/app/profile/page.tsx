import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Clock } from "lucide-react";

export const metadata = { title: "Profile & verification" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/profile");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { dealerProfile: true } }).catch(() => null);
  if (!user) redirect("/login");

  const verification = user.idVerified
    ? { label: "Verified seller", cls: "bg-emerald-50 text-emerald-700", icon: BadgeCheck }
    : user.idNumber
      ? { label: "ID under review (within 24h)", cls: "bg-amber-50 text-amber-800", icon: Clock }
      : null;

  return (
    <div className="container max-w-xl py-8">
      <Breadcrumbs items={[{ label: "Profile" }]} />
      <h1 className="text-3xl font-extrabold">Profile</h1>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-muted px-3 py-1 font-semibold">{user.role}</span>
        {verification && (
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${verification.cls}`}>
            <verification.icon className="size-4" /> {verification.label}
          </span>
        )}
      </div>
      {user.dealerProfile && (
        <Card className="mt-4"><CardContent className="pt-4 text-sm">
          Dealer: <b>{user.dealerProfile.businessName}</b> ({user.dealerProfile.location})
        </CardContent></Card>
      )}
      <Card className="mt-4">
        <CardHeader><CardTitle className="text-lg">Edit details & get verified</CardTitle></CardHeader>
        <CardContent>
          <ProfileForm user={{ name: user.name, phone: user.phone, idNumber: user.idNumber }} />
          <p className="mt-3 text-xs text-muted-foreground">Verified sellers get a badge on listings and rank higher in search — buyers contact you 3× more.</p>
        </CardContent>
      </Card>
    </div>
  );
}
