export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-4xl font-extrabold">Gari bora. Deal clear.</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        GariBora is Kenya&apos;s premium car marketplace. We started with a simple frustration: buying a car in Nairobi
        meant endless WhatsApp forwards, unclear duty status and &quot;price on negotiation&quot;. We&apos;re fixing that with
        verified dealers, inspection badges and transparent KES pricing — mobile-first, because Kenya is mobile-first.
      </p>
      <h2 className="mt-8 text-2xl font-bold">What we promise</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Verified sellers — ID and yard location checked.</li>
        <li>Inspection badges — condition, mileage and duty reviewed.</li>
        <li>WhatsApp-fast contact — no gatekeepers.</li>
        <li>East Africa ready — launching Kenya first, then Uganda & Tanzania.</li>
      </ul>
    </div>
  );
}
