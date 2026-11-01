import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  if (!post || !post.published) notFound();
  return (
    <article className="container max-w-3xl py-8">
      <Breadcrumbs items={[{ label: "Insights", href: "/blog" }, { label: post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title }]} />
      <h1 className="text-3xl font-extrabold md:text-4xl">{post.title}</h1>
      <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
      {post.coverUrl && <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-2xl"><Image src={post.coverUrl} alt={post.title} fill className="object-cover" sizes="800px" /></div>}
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
        {post.content.split("\n\n").map((para, i) => <p key={i} className={i === 0 ? "text-lg font-medium text-foreground" : "text-muted-foreground"}>{para}</p>)}
        <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5">
          <h2 className="font-extrabold">Key takeaways for Kenyan buyers</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground"><li>Always verify the logbook on NTSA TIMS before paying.</li><li>Insist on duty-paid proof for foreign-used units.</li><li>Budget 10–15% above price for transfer, service and tyres.</li></ul>
        </div>
      </div>
    </article>
  );
}
