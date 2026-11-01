import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  if (!post || !post.published) notFound();
  return (
    <article className="container max-w-3xl py-8">
      <h1 className="text-3xl font-extrabold md:text-4xl">{post.title}</h1>
      <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
      {post.coverUrl && <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-2xl"><Image src={post.coverUrl} alt={post.title} fill className="object-cover" sizes="800px" /></div>}
      <div className="prose mt-6"><p>{post.content}</p>
        <h2>Key takeaways for Kenyan buyers</h2>
        <ul><li>Always verify the logbook on NTSA TIMS before paying.</li><li>Insist on duty-paid proof for foreign-used units.</li><li>Budget 10–15% above price for transfer, service and tyres.</li></ul>
      </div>
    </article>
  );
}
