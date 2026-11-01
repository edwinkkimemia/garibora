import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-8">
      <Breadcrumbs items={[{ label: "Privacy" }]} />
      <h1 className="text-3xl font-extrabold">Privacy policy</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>We collect your name, email, phone and listing details to run the marketplace — showing your cars, saving favourites and connecting inquiries.</p>
        <p>Your phone number is shown on listings you publish so buyers can reach you. We never sell personal data. Analytics are aggregated.</p>
        <p>You may request correction or deletion of your data at hello@garibora.ke. We comply with Kenya&apos;s Data Protection Act, 2019.</p>
      </div>
    </div>
  );
}
