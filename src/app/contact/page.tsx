import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Input, Textarea, Label } from "@/components/ui/input";

export const metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div className="container max-w-xl py-8">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <h1 className="text-3xl font-extrabold">Talk to us</h1>
      <p className="mt-1 text-muted-foreground">Kiambu Road, Nairobi • +254 700 000 000 • hello@garibora.ke</p>
      <Card className="mt-6"><CardHeader><CardTitle className="text-lg">Send a message</CardTitle></CardHeader>
        <CardContent><form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div><Label>Name</Label><Input required placeholder="Your name" /></div>
          <div><Label>Email</Label><Input type="email" required placeholder="you@example.com" /></div>
          <div><Label>Message</Label><Textarea required placeholder="How can we help?" /></div>
          <Button className="w-full">Send</Button>
        </form></CardContent></Card>
    </div>
  );
}
