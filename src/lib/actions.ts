"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { inquirySchema, listCarSchema, registerSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function registerAction(prev: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"), email: formData.get("email"),
    phone: formData.get("phone"), password: formData.get("password"),
    role: formData.get("role") || "BUYER",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Email already registered. Please log in." };
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: { name: parsed.data.name, email, phone: parsed.data.phone, passwordHash, role: parsed.data.role },
  });
  redirect("/login?registered=1");
}

export async function listCarAction(prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please log in to list a car." };
  const raw = {
    title: formData.get("title"), make: formData.get("make"), model: formData.get("model"),
    year: formData.get("year"), price: formData.get("price"), negotiable: formData.get("negotiable") === "on",
    listingType: formData.get("listingType") || "SALE",
    dailyRate: formData.get("dailyRate") || undefined,
    mileage: formData.get("mileage"), transmission: formData.get("transmission"), fuelType: formData.get("fuelType"),
    bodyType: formData.get("bodyType"), condition: formData.get("condition"), location: formData.get("location"),
    description: formData.get("description"), engineCc: formData.get("engineCc") || undefined,
    drive: formData.get("drive") || undefined, color: formData.get("color") || undefined,
    images: formData.getAll("images").filter(Boolean) as string[],
  };
  const parsed = listCarSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  const d = parsed.data;
  const brand = await prisma.brand.upsert({
    where: { slug: slugify(d.make) }, update: {},
    create: { name: d.make, slug: slugify(d.make) },
  });
  // Attach dealer profile if seller is a dealer
  const me = await prisma.user.findUnique({ where: { id: session.user.id }, include: { dealerProfile: true } });
  const slug = `${slugify(`${d.year}-${d.make}-${d.model}`)}-${Date.now().toString(36)}`;
  const car = await prisma.car.create({
    data: {
      ...d, engineCc: d.engineCc ?? null, slug, status: "PENDING",
      sellerId: session.user.id, dealerId: me?.dealerProfile?.id ?? null, brandId: brand.id,
      images: { create: d.images.map((url, i) => ({ url, isPrimary: i === 0, sortOrder: i })) },
    },
  });
  revalidatePath("/cars");
  redirect(`/dashboard/listings?created=${car.id}`);
}

export async function toggleFavoriteAction(carId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/cars/" + carId);
  const where = { userId_carId: { userId: session.user.id, carId } };
  const existing = await prisma.favorite.findUnique({ where: where as never });
  if (existing) await prisma.favorite.delete({ where: { id: existing.id } });
  else await prisma.favorite.create({ data: { userId: session!.user!.id!, carId } });
  revalidatePath("/cars");
  revalidatePath("/favorites");
  return { saved: !existing };
}

export async function inquiryAction(prev: unknown, formData: FormData) {
  const parsed = inquirySchema.safeParse({
    carId: formData.get("carId"), name: formData.get("name"),
    phone: formData.get("phone"), message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const session = await auth();
  await prisma.inquiry.create({
    data: { ...parsed.data, buyerId: session?.user?.id ?? null },
  });
  return { ok: true };
}

export async function markSoldAction(carId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Login required" };
  await prisma.car.updateMany({ where: { id: carId, sellerId: session.user.id }, data: { status: "SOLD" } });
  revalidatePath("/dashboard/listings");
}

export async function deleteListingAction(carId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Login required" };
  await prisma.car.deleteMany({ where: { id: carId, sellerId: session.user.id } });
  revalidatePath("/dashboard/listings");
}

async function requireAdmin() {
  const session = await auth();
  const me = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null;
  if (!me || me.role !== "ADMIN") throw new Error("Admin only");
  return me;
}

/** Seller updates own profile + submits ID for verification. */
export async function updateProfileAction(prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please log in." };
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const idNumber = String(formData.get("idNumber") || "").trim();
  if (name.length < 2) return { error: "Enter your name." };
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone: phone || null, idNumber: idNumber || null },
  });
  revalidatePath("/profile");
  return { ok: true };
}

/** Seller: relist a sold car. */
export async function relistAction(carId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.car.updateMany({ where: { id: carId, sellerId: session.user.id }, data: { status: "ACTIVE" } });
  revalidatePath("/dashboard/listings");
}

/** Seller: mark an inquiry as read. */
export async function markInquiryReadAction(inquiryId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.inquiry.updateMany({ where: { id: inquiryId, car: { sellerId: session.user.id } }, data: { read: true } });
  revalidatePath("/dashboard/inquiries");
}

/** Admin: approve a pending listing (goes ACTIVE + verified). */
export async function approveCarAction(carId: string) {
  await requireAdmin();
  await prisma.car.update({ where: { id: carId }, data: { status: "ACTIVE", verified: true } });
  revalidatePath("/admin/listings");
  revalidatePath("/cars");
}

/** Admin: reject a pending listing. */
export async function rejectCarAction(carId: string) {
  await requireAdmin();
  await prisma.car.update({ where: { id: carId }, data: { status: "REJECTED" } });
  revalidatePath("/admin/listings");
}

/** Admin: verify a seller's ID. */
export async function verifyUserAction(userId: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { idVerified: true, verified: true } });
  revalidatePath("/admin/users");
}

/** Admin: change a user's role (used directly as a form action). */
export async function setUserRoleAction(formData: FormData) {
  try { await requireAdmin(); } catch { return; }
  const userId = String(formData.get("userId") || "");
  const role = String(formData.get("role") || "");
  if (!userId || !["BUYER", "SELLER", "DEALER", "ADMIN"].includes(role)) return;
  await prisma.user.update({ where: { id: userId }, data: { role: role as never } });
  revalidatePath("/admin/users");
}
