/**
 * M-Pesa Daraja (STK push / C2B). Credentials come ONLY from env vars —
 * never hardcode them. See .env.example for the full list.
 */

const BASE = process.env.MPESA_ENV === "sandbox"
  ? "https://sandbox.safaricom.co.ke"
  : "https://api.safaricom.co.ke";

function cfg() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY || "";
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";
  // Store/H.O shortcode goes in BusinessShortCode + password; the Till goes in PartyB.
  const storeShortCode = process.env.MPESA_STORE_SHORTCODE || process.env.MPESA_SHORTCODE || "";
  const till = process.env.MPESA_TILL_NUMBER || process.env.MPESA_SHORTCODE || "";
  const passkey = process.env.MPESA_PASSKEY || "";
  const transactionType = process.env.MPESA_TRANSACTION_TYPE || "CustomerBuyGoodsOnline";
  if (!consumerKey || !consumerSecret || !storeShortCode || !till || !passkey) {
    throw new Error("M-Pesa is not configured (missing MPESA_* env vars).");
  }
  return { consumerKey, consumerSecret, storeShortCode, till, passkey, transactionType };
}

/** 07XX… / +254… / 254… → 2547XXXXXXXX. Throws on invalid numbers. */
export function normalizePhone(input: string): string {
  const d = input.replace(/[^0-9]/g, "");
  const msisdn = d.startsWith("0") ? `254${d.slice(1)}` : d.startsWith("254") ? d : `254${d}`;
  if (!/^254[17]\d{8}$/.test(msisdn)) throw new Error("Enter a valid Safaricom number, e.g. 0722 123 456.");
  return msisdn;
}

/** Safaricom requires East Africa Time (UTC+3), not server local time. */
function timestamp(): string {
  const now = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}`;
}

async function accessToken(): Promise<string> {
  const { consumerKey, consumerSecret } = cfg();
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await fetch(`${BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("M-Pesa auth failed — check Consumer Key/Secret.");
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("M-Pesa auth returned no token.");
  return data.access_token;
}

export type StkResult = { merchantRequestId: string; checkoutRequestId: string };

/** Sends an STK push to the phone. Amount in KES (whole shillings). */
export async function stkPush(opts: {
  phone: string; amount: number; accountRef: string; description: string;
}): Promise<StkResult> {
  const { storeShortCode, till, passkey, transactionType } = cfg();
  if (!Number.isInteger(opts.amount) || opts.amount < 1) throw new Error("Invalid amount.");
  const token = await accessToken();
  const ts = timestamp();
  const password = Buffer.from(`${storeShortCode}${passkey}${ts}`).toString("base64");
  const res = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      BusinessShortCode: storeShortCode,
      Password: password,
      Timestamp: ts,
      TransactionType: transactionType,
      Amount: opts.amount,
      PartyA: opts.phone,
      PartyB: till,
      PhoneNumber: opts.phone,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL || "https://motiva.co.ke"}/api/mpesa/callback`,
      AccountReference: opts.accountRef.slice(0, 12),
      TransactionDesc: opts.description.slice(0, 20),
    }),
  });
  const data = (await res.json()) as { ResponseCode?: string; ResponseDescription?: string; MerchantRequestID?: string; CheckoutRequestID?: string; errorMessage?: string };
  console.log("[mpesa/stk]", { to: opts.phone, amount: opts.amount, ResponseCode: data.ResponseCode, ResponseDescription: data.ResponseDescription, checkout: data.CheckoutRequestID, merchant: data.MerchantRequestID });
  if (data.ResponseCode !== "0" || !data.CheckoutRequestID) {
    throw new Error(data.ResponseDescription || data.errorMessage || "STK push rejected by M-Pesa.");
  }
  return { merchantRequestId: data.MerchantRequestID!, checkoutRequestId: data.CheckoutRequestID };
}

/** Server-side product catalogue — amounts are enforced here, never trusted from the client. */
export const PRODUCTS: Record<string, { amount: number; label: string }> = {
  BOOST_FEATURED_7D: { amount: 999, label: "Featured boost — 7 days" },
  BOOST_TOP_3D: { amount: 499, label: "Top slot — 3 days" },
  PLAN_GROWTH: { amount: 4999, label: "Dealer Growth — monthly" },
  PLAN_PREMIUM: { amount: 9999, label: "Dealer Premium — monthly" },
};

/**
 * Re-query a transaction's live status (covers delayed callbacks).
 * Returns "COMPLETED" | "FAILED" | "CANCELLED" | "PENDING".
 */
export async function queryStk(checkoutRequestId: string): Promise<"COMPLETED" | "FAILED" | "CANCELLED" | "PENDING"> {
  const { storeShortCode, passkey } = cfg();
  const token = await accessToken();
  const ts = timestamp();
  const password = Buffer.from(`${storeShortCode}${passkey}${ts}`).toString("base64");
  const res = await fetch(`${BASE}/mpesa/query/v1/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ BusinessShortCode: storeShortCode, Password: password, Timestamp: ts, CheckoutRequestID: checkoutRequestId }),
  });
  const data = (await res.json()) as { ResponseCode?: string; ResultCode?: string | number; ResultDesc?: string };
  if (data.ResponseCode !== "0") throw new Error(data.ResultDesc || "Status query failed.");
  const code = String(data.ResultCode ?? "");
  if (code === "0") return "COMPLETED";
  // 1032 = cancelled by user; 1/2001/1019 = failed; 1037 = timeout (keep polling)
  if (code === "1032") return "CANCELLED";
  if (code === "1" || code === "2001" || code === "1019") return "FAILED";
  return "PENDING";
}
