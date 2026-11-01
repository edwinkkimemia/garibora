import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="container grid max-w-md py-12">
      <Card>
        <CardHeader><CardTitle>Reset password</CardTitle>
        <p className="text-sm text-muted-foreground">Enter your email — we&apos;ll send a reset link (email integration: Resend/Postmark).</p></CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required placeholder="you@example.com" /></div>
            <Button className="w-full">Send reset link</Button>
          </form>
          <p className="mt-4 text-center text-sm"><Link href="/login" className="text-primary hover:underline">Back to login</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
