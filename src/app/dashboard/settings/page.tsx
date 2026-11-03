import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Clock } from "lucide-react";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id! },
    select: { name: true, email: true, phone: true, idNumber: true, kraPin: true, idDocUrl: true, kraPinDocUrl: true, bizPermitUrl: true, role: true, idVerified: true, verified: true, verifyNote: true, dealerProfile: { select: { businessName: true, location: true, verified: true } } },
  }).catch(() => null);
  if (!user) return <p className="text-sm text-muted-foreground">Could not load your profile.</p>;

  const submitted = !!(user.idNumber || user.kraPin || user.idDocUrl || user.kraPinDocUrl || user.bizPermitUrl);
  const dealerVerified = user.dealerProfile?.verified ?? false;
  const verification = user.idVerified
    ? { label: "Verified seller", cls: "bg-emerald-50 text-emerald-700", icon: BadgeCheck }
    : dealerVerified
      ? { label: "Verified dealer yard", cls: "bg-emerald-50 text-emerald-700", icon: BadgeCheck }
      : submitted
        ? { label: "Documents under review (within 24h)", cls: "bg-amber-50 text-amber-800", icon: Clock }
        : null;

  return (
    <div>
      <Breadcrumbs variant="inline" items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }]} />
      <h1 className="text-2xl font-extrabold md:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user.email} • {user.role}</p>
      {user.verifyNote && !user.idVerified && (
        <p className="mt-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"><b>Reviewer note:</b> {user.verifyNote} — update your documents below and resubmit.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {verification ? (
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${verification.cls}`}>
            <verification.icon className="size-4" /> {verification.label}
          </span>
        ) : (
          <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
            Not verified — submit your ID below to earn the badge
          </span>
        )}
      </div>
      {user.dealerProfile && (
        <Card className="mt-4"><CardContent className="pt-4 text-sm">
          Dealer: <b>{user.dealerProfile.businessName}</b> ({user.dealerProfile.location})
        </CardContent></Card>
      )}
      <Card className="mt-4">
        <CardHeader><CardTitle className="text-lg">Profile & verification documents</CardTitle></CardHeader>
        <CardContent>
          <ProfileForm user={{ name: user.name, phone: user.phone, idNumber: user.idNumber, kraPin: user.kraPin, idDocUrl: user.idDocUrl, kraPinDocUrl: user.kraPinDocUrl, bizPermitUrl: user.bizPermitUrl }} />
          <p className="mt-3 text-xs text-muted-foreground">Verified sellers get a badge on listings and rank higher in search — buyers contact you 3× more.</p>
        </CardContent>
      </Card>
    </div>
  );
}
