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
  const shortCode = process.env.MPESA_SHORTCODE || "";
  const passkey = process.env.MPESA_PASSKEY || "";
  const transactionType = process.env.MPESA_TRANSACTION_TYPE || "CustomerBuyGoodsOnline";
  if (!consumerKey || !consumerSecret || !shortCode || !passkey) {
    throw new Error("M-Pesa is not configured (missing MPESA_* env vars).");
  }
  return { consumerKey, consumerSecret, shortCode, passkey, transactionType };
}

/** 07XX… / +254… / 254… → 2547XXXXXXXX. Throws on invalid numbers. */
export function normalizePhone(input: string): string {
  const d = input.replace(/[^0-9]/g, "");
  const msisdn = d.startsWith("0") ? `254${d.slice(1)}` : d.startsWith("254") ? d : `254${d}`;
  if (!/^254[17]\d{8}$/.test(msisdn)) throw new Error("Enter a valid Safaricom number, e.g. 0722 123 456.");
  return msisdn;
}

function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

async function accessToken(): Promise<string> {
  const { consumerKey, consumerSecret } = cfg();
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const res = await fetch(`${BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
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
  const { shortCode, passkey, transactionType } = cfg();
  if (!Number.isInteger(opts.amount) || opts.amount < 1) throw new Error("Invalid amount.");
  const token = await accessToken();
  const ts = timestamp();
  const password = Buffer.from(`${shortCode}${passkey}${ts}`).toString("base64");
  const res = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: ts,
      TransactionType: transactionType,
      Amount: opts.amount,
      PartyA: opts.phone,
      PartyB: shortCode,
      PhoneNumber: opts.phone,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL || "https://motiva.co.ke"}/api/mpesa/callback`,
      AccountReference: opts.accountRef.slice(0, 20),
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
