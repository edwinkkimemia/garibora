type ListableUser = {
  idVerified: boolean;
  verified: boolean;
  role: string;
  dealerProfile?: { verified: boolean } | null;
} | null | undefined;

/**
 * Sellers must be genuinely verified before listing: approved ID, a verified
 * dealer yard, or admin. (The legacy `verified` flag alone is NOT enough.)
 */
export function canList(u: ListableUser) {
  if (!u) return false;
  return u.idVerified || u.role === "ADMIN" || (u.dealerProfile?.verified ?? false);
}
