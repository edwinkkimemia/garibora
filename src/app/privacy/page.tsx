import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = {
  title: "Privacy policy — GariBora Kenya",
  description: "How GariBora handles your data under Kenya's Data Protection Act 2019: what we collect, why, and your rights.",
};

const sections = [
  { h: "What we collect", p: "Account details (name, email, phone), listings and photos you publish, favourites, inquiries you send, and aggregated usage analytics. Phone numbers on listings are visible to buyers so deals can happen." },
  { h: "Why we use it", p: "To run the marketplace: showing your cars, connecting inquiries over WhatsApp and email, preventing fraud, and improving search. We never sell personal data to anyone." },
  { h: "Cookies & analytics", p: "We use privacy-respecting analytics to understand which cars and guides help Kenyans most. No advertising trackers, no cross-site profiling." },
  { h: "Your rights", p: "Under Kenya's Data Protection Act, 2019 you may access, correct or delete your data at any time. Email hello@garibora.ke and we act within 14 days." },
  { h: "Data security", p: "Passwords are hashed with bcrypt, sessions are encrypted, and database access is restricted. Report suspected breaches immediately." },
  { h: "Retention", p: "Active account data is kept while you use GariBora. Sold-car records are retained for fraud prevention, then anonymised." },
];

export default function PrivacyPage() {
  return (
    <div>
      <div className="container pt-8"><Breadcrumbs items={[{ label: "Privacy" }]} /></div>
      <section className="bg-navy text-white">
        <div className="container py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-light">Your data, your rights</p>
          <h1 className="mt-2 text-4xl font-extrabold">Privacy policy</h1>
          <p className="mt-2 text-slate-300">Compliant with Kenya&apos;s Data Protection Act, 2019. No data sales, ever.</p>
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
