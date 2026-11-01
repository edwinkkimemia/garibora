import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format KES: 4,850,000 -> "KSh 4,850,000" */
export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Compact: 4,850,000 -> "KSh 4.9M" */
export function formatKESCompact(amount: number): string {
  if (amount >= 1_000_000) return `KSh ${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (amount >= 1_000) return `KSh ${Math.round(amount / 1_000)}K`;
  return formatKES(amount);
}

export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat("en-KE").format(km)} km`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export function whatsappLink(phone: string, text: string): string {
  const clean = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}
