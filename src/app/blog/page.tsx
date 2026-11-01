import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Insights — car buying guides Kenya" };
export const revalidate = 120;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }).catch(() => []);
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-extrabold">Insights & buying guides</h1>
      <p className="mt-1 text-muted-foreground">Duty, prices and what to check before you pay.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`}>
            <Card className="overflow-hidden hover:shadow-md">
              {p.coverUrl && <div className="relative h-40"><Image src={p.coverUrl} alt={p.title} fill className="object-cover" sizes="400px" /></div>}
              <CardContent className="pt-4"><p className="font-bold">{p.title}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p></CardContent>
            </Card>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted-foreground">Run the seed to load demo guides.</p>}
      </div>
    </div>
  );
}
