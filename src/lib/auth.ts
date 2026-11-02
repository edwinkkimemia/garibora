import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Falls back to a dev-only value so `next dev` never crashes; Vercel MUST set AUTH_SECRET.
  secret: process.env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me",
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", newUser: "/register" },
  providers: [
    // Google is only wired when credentials exist — an undefined clientId
    // would otherwise crash the entire auth route (including email login).
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "Email",
      credentials: { email: { label: "Email" }, password: { label: "Password", type: "password" } },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const db = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { id: true, role: true },
        });
        if (db) {
          token.sub = db.id;
          (token as { role?: string }).role = db.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        (session.user as { role?: string }).role =
          (token as { role?: string }).role ?? "BUYER";
      }
      return session;
    },
  },
});
