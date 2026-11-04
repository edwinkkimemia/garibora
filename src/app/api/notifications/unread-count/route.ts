import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth().catch(() => null);
  if (!session?.user?.id) return Response.json({ count: 0 });
  const count = await prisma.notification.count({ where: { userId: session.user.id, read: false } }).catch(() => 0);
  return Response.json({ count });
}
