"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { auth, signOut } from "@/lib/auth";
import { inquirySchema, listCarSchema, listPartSchema, partInquirySchema, registerSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { canList } from "@/lib/permissions";

export async function registerAction(prev: unknown, formData: FormData) {
  const one = (k: string) => {
    const s = String(formData.get(k) || "").trim();
    return s || undefined;
  };
  const parsed = registerSchema.safeParse({    name: formData.get("name"), email: formData.get("email"),
    phone: formData.get("phone"), password: formData.get("password"),
    role: formData.get("role") || "BUYER",
    idNumber: one("idNumber"), kraPin: one("kraPin")?.toUpperCase(),
    idDocUrl: one("idDoc"), kraPinDocUrl: one("kraPinDoc"), bizPermitUrl: one("bizPermit"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Email already registered. Please log in." };
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      name: parsed.data.name, email, phone: parsed.data.phone, passwordHash, role: parsed.data.role,
      idNumber: parsed.data.idNumber, kraPin: parsed.data.kraPin,
      idDocUrl: parsed.data.idDocUrl, kraPinDocUrl: parsed.data.kraPinDocUrl, bizPermitUrl: parsed.data.bizPermitUrl,
    },
  });
  redirect("/login?registered=1");
}

/** Seller: list a car (goes to PENDING review). */
export async function listCarAction(prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please log in to list a car." };
  const lister = await prisma.user.findUnique({ where: { id: session.user.id }, include: { dealerProfile: true } });
  if (!canList(lister)) return { error: "Verification required — finish it in Dashboard → Settings, then list." };
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
  // Attach dealer profile if seller is a dealer (lister already fetched for the gate above)
  const me = lister!;
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

export async function partInquiryAction(prev: unknown, formData: FormData) {
  const parsed = partInquirySchema.safeParse({
    partId: formData.get("partId"), name: formData.get("name"),
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

/** Seller: updates own profile + submits KYC documents for verification. */
export async function updateProfileAction(prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please log in." };
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const idNumber = String(formData.get("idNumber") || "").trim();
  const kraPin = String(formData.get("kraPin") || "").trim().toUpperCase();  const first = (k: string) => {
    const v = formData.getAll(k).filter(Boolean) as string[];
    return v[0] ?? null;
  };
  if (name.length < 2) return { error: "Enter your name." };
  if (kraPin && !/^[A-Z]\d{9}[A-Z]$/.test(kraPin)) return { error: "KRA PIN looks invalid (e.g. A123456789Z)." };
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name, phone: phone || null, idNumber: idNumber || null, kraPin: kraPin || null,
      image: first("avatar") ?? undefined,
      idDocUrl: first("idDoc") ?? undefined, kraPinDocUrl: first("kraPinDoc") ?? undefined,
      bizPermitUrl: first("bizPermit") ?? undefined,
    },
  });
  revalidatePath("/profile");
  revalidatePath("/dashboard/settings");
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
  await prisma.inquiry.updateMany({
    where: {
      id: inquiryId,
      OR: [
        { car: { is: { sellerId: session.user.id } } },
        { part: { is: { sellerId: session.user.id } } },
      ],
    },
    data: { read: true },
  });
  revalidatePath("/dashboard/inquiries");
}

/** Seller: list a spare part (goes to PENDING review). */
export async function listPartAction(prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please log in to list a part." };
  const lister = await prisma.user.findUnique({ where: { id: session.user.id }, include: { dealerProfile: true } });
  if (!canList(lister)) return { error: "Verification required — finish it in Dashboard → Settings, then list." };
  const parsed = listPartSchema.safeParse({
    title: formData.get("title"), category: formData.get("category"), condition: formData.get("condition"),
    price: formData.get("price"), negotiable: formData.get("negotiable") === "on",
    location: formData.get("location"), description: formData.get("description"),
    images: formData.getAll("images").filter(Boolean) as string[],
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  const d = parsed.data;
  const me = lister!;
  const slug = `${slugify(d.title)}-${Date.now().toString(36)}`;
  await prisma.part.create({
    data: {
      ...d, slug, status: "PENDING",
      sellerId: session.user.id, dealerId: me?.dealerProfile?.id ?? null,
      images: { create: d.images.map((url, i) => ({ url, isPrimary: i === 0, sortOrder: i })) },
    },
  });
  revalidatePath("/parts");
  redirect("/dashboard/listings?listed=part");
}

/** Admin: approve a pending part. */
export async function approvePartAction(partId: string) {
  await requireAdmin();
  await prisma.part.update({ where: { id: partId }, data: { status: "ACTIVE" } });
  revalidatePath("/admin/listings");
  revalidatePath("/parts");
}

/** Admin: reject a pending part. */
export async function rejectPartAction(partId: string) {
  await requireAdmin();
  await prisma.part.update({ where: { id: partId }, data: { status: "REJECTED" } });
  revalidatePath("/admin/listings");
}
/** Saved searches: store the current filter set for alerts. */
export async function saveSearchAction(prev: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Log in to save searches." };
  const name = String(formData.get("name") || "My search").slice(0, 60);
  let filters: Record<string, string> = {};
  try {
    const raw = JSON.parse(String(formData.get("filters") || "{}")) as Record<string, unknown>;
    for (const [k, v] of Object.entries(raw)) if (typeof v === "string" || typeof v === "number") filters[k] = String(v);
  } catch { return { error: "Bad filters." }; }
  const count = await prisma.savedSearch.count({ where: { userId: session.user.id } });
  if (count >= 10) return { error: "You already have 10 saved searches — delete one first." };
  await prisma.savedSearch.create({
    data: { userId: session.user.id, name, filters, lastNotifiedAt: new Date() },
  });
  revalidatePath("/dashboard/saved-searches");
  return { ok: true as const };
}

export async function deleteSavedSearchAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.savedSearch.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/dashboard/saved-searches");
}

export async function markNotificationsReadAction() {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.notification.updateMany({ where: { userId: session.user.id, read: false }, data: { read: true } });
  revalidatePath("/dashboard/notifications");
}

/** Admin: feature a car for 7 days (paid boost activation). */
export async function featureCarAction(carId: string) {
  await requireAdmin();
  await prisma.car.update({ where: { id: carId }, data: { status: "ACTIVE", verified: true, featured: true, featuredUntil: new Date(Date.now() + 7 * 24 * 3600 * 1000) } });
  revalidatePath("/admin/listings");
  revalidatePath("/cars");
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

/** Admin: send verification back for corrections with a note. */
export async function rejectVerificationAction(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") || "");
  const note = String(formData.get("note") || "").trim() || "Documents unclear — please re-upload sharper photos.";
  if (!userId) return;
  await prisma.user.update({ where: { id: userId }, data: { idVerified: false, verifyNote: note } });
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

/** Sign the current user out and return to the homepage. */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
