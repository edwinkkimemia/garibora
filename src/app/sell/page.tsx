import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SellForm } from "@/components/sell/sell-form";
import { SellPartForm } from "@/components/sell/sell-part-form";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Sell your car or part — free listing" };

export default async function SellPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/sell");
  const { type } = await searchParams;
  const isPart = type === "part";

  return (
    <div className="container max-w-3xl py-8">
      <Breadcrumbs items={[{ label: isPart ? "Sell a part" : "Sell your car" }]} />
      <h1 className="text-3xl font-extrabold">{isPart ? "List a part — free" : "List your car — free"}</h1>
      <p className="mt-1 text-muted-foreground">
        {isPart ? "Reach thousands of car owners hunting for spares. Live after a quick review." : "Takes ~3 minutes. Listings go live after a quick review. Photos sell: add 6+ clear shots."}
      </p>
      <div className="mt-4 flex gap-2">
        <Link href="/sell"><Button size="sm" variant={isPart ? "outline" : "default"}>Sell a car</Button></Link>
        <Link href="/sell?type=part"><Button size="sm" variant={isPart ? "default" : "outline"}>Sell a part</Button></Link>
      </div>
      {isPart ? <SellPartForm /> : <SellForm />}
    </div>
  );
}
