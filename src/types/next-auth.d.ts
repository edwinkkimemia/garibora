import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string; role?: string } & NonNullable<import("next-auth").Session["user"]>;
  }
}
declare module "next-auth/jwt" {
  interface JWT { role?: string }
}

export {};
