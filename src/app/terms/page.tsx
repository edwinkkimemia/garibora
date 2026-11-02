import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = {
  title: "Terms of use — Motiva Kenya",
  description: "Motiva marketplace terms: buyer safety rules, seller obligations, logbook transfer, fees in KES.",
};

const sections = [
  { h: "1. The marketplace", p: "Motiva connects buyers with verified sellers and dealers across Kenya. The sale contract is always between buyer and seller; we verify identities, review listings and provide communication tools, but we are not a party to the sale unless an escrow product is explicitly used." },
  { h: "2. Buyer rules", p: "Always view the car in person, verify the logbook on NTSA TIMS, confirm duty-paid status for foreign-used imports, and never send money before viewing. Report suspicious listings immediately — fraud reports lead to instant suspension." },
  { h: "3. Seller obligations", p: "You must own the vehicle or act for the owner, list accurate year, mileage and condition, hold a transferable logbook, and disclose accident history, outstanding loans and mechanical faults you know about." },
  { h: "4. Verification badges", p: "Verified and Inspected badges reflect checks done at review time (identity, yard location, duty evidence, condition photos). They are indicators of diligence, not warranties. Independent inspection is always recommended for high-value purchases." },
  { h: "5. Fees & payments", p: "Basic listings are free. Featured placements, verification services and future escrow carry fees shown in KES before checkout, payable via M-Pesa or card. Buyer-to-seller vehicle payments happen directly between parties." },
  { h: "6. Accounts & conduct", p: "One account per person or business. Misrepresentation, odometer fraud, duplicate listings and fee circumvention lead to permanent bans. Kenyan law applies; disputes are handled under the laws of Kenya." },
];

export default function TermsPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Terms" }]} /></div>
      <section className="bg-navy text-white">
        <div className="container py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">The fine print, in plain language</p>
          <h1 className="mt-2 text-4xl font-extrabold">Terms of use</h1>
          <p className="mt-2 text-slate-300">Last updated November 2026. Short version: be honest, verify everything, transfer on NTSA together.</p>
        </div>
      </section>
      <section className="container max-w-4xl py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((s) => (
            <div key={s.h} className="rounded-2xl border bg-card p-5">
              <p className="font-bold">{s.h}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
