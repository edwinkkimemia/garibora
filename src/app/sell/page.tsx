import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SellForm } from "@/components/sell/sell-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = { title: "Sell your car — free listing" };

export default async function SellPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/sell");
  return (
    <div className="container max-w-3xl py-8">
      <Breadcrumbs items={[{ label: "Sell your car" }]} />
      <h1 className="text-3xl font-extrabold">List your car — free</h1>
      <p className="mt-1 text-muted-foreground">Takes ~3 minutes. Listings go live after a quick review. Photos sell cars: add 6+ clear shots.</p>
      <SellForm />
    </div>
  );
}
