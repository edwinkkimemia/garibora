import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-8">
      <Breadcrumbs items={[{ label: "Terms" }]} />
      <h1 className="text-3xl font-extrabold">Terms of use</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>GariBora is a marketplace connecting buyers and sellers. We verify dealer identities and review listings, but the sale contract is always between buyer and seller.</p>
        <p><b className="text-foreground">Buyers:</b> always view the car in person, verify the logbook on NTSA TIMS, confirm duty-paid status for imports, and never send money before viewing.</p>
        <p><b className="text-foreground">Sellers:</b> you must own the car (or act for the owner), list accurate mileage and condition, and hold a transferable logbook.</p>
        <p><b className="text-foreground">Fees:</b> basic listings are free. Featured placements and verification services may carry fees shown before checkout (M-Pesa / Stripe).</p>
      </div>
    </div>
  );
}
