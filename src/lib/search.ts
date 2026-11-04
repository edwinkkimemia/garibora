import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { CarFilters } from "@/lib/validations";

/**
 * Marketplace search: Kenyan synonyms + Postgres trigram similarity for
 * typo tolerance, with relevance ranking. Scales to thousands of cars;
 * beyond that, swap rankCarIds() for Meilisearch — the interface stays.
 */

// Kenyan market synonyms: model nicknames, grades, sheng-adjacent terms.
const SYNONYMS: Record<string, string[]> = {
  prado: ["land cruiser prado", "tx-l", "txl", "tz-g"],
  "land cruiser": ["land cruiser prado", "land cruiser 300", "lc300", "lc 300"],
  lc300: ["land cruiser 300"],
  hilux: ["double cab", "pickup"],
  ranger: ["pickup", "wildtrak"],
  navara: ["pickup"],
  "d-max": ["dmax", "pickup"],
  dmax: ["d-max", "pickup"],
  canter: ["truck", "commercial"],
  fuso: ["truck"],
  note: ["e-power", "epower", "medalist"],
  "e-power": ["note", "epower"],
  fit: ["gp5", "hybrid", "honda fit"],
  aqua: ["hybrid", "pixis"],
  fielder: ["wagon", "g touring"],
  axio: ["sedan", "corolla"],
  premio: ["sedan"],
  "c200": ["c-class", "c class", "mercedes"],
  "c-class": ["c200", "mercedes"],
  "glc": ["mercedes", "suv"],
  "x3": ["bmw", "suv"],
  "420i": ["4 series", "coupe", "bmw"],
  "cx-5": ["cx5", "mazda"],
  cx5: ["cx-5", "mazda"],
  rav4: ["rav 4", "adventure"],
  "rav 4": ["rav4"],
  "x-trail": ["xtrail", "nissan", "e-power"],
  xtrail: ["x-trail"],
  forester: ["xt", "eyesight", "subaru"],
  impreza: ["subaru", "awd"],
  outlander: ["mitsubishi", "phev"],
  delica: ["van", "d:5", "4wd"],
  hiace: ["van", "shuttle", "super gl"],
  noah: ["van", "voxy", "esquire"],
  voxy: ["van", "noah"],
  esquire: ["van", "noah"],
  serena: ["van", "highway star"],
  vitz: ["hatchback"],
  swift: ["hatchback", "rs"],
  demio: ["hatchback", "mazda2"],
  march: ["hatchback", "bolero"],
  passo: ["hatchback"],
  mira: ["kei", "hatchback"],
  tank: ["hatchback", "roomy"],
  solio: ["hatchback", "bandit"],
  probox: ["wagon", "van"],
  succeed: ["wagon"],
  wingroad: ["wagon"],
  legacy: ["touring", "wagon", "subaru"],
  caldina: ["wagon"],
  wish: ["van", "7 seater"],
  stream: ["van"],
  freed: ["van", "honda"],
  sienta: ["van"],
  stepwagon: ["van", "stepwgn", "spada"],
  biante: ["van"],
  elgrand: ["van", "rider"],
  caravan: ["van", "nv350"],
  hiaceReg: ["van"],
  premio2: ["sedan"],
  markx: ["mark x", "250g"],
  "mark x": ["markx"],
  crown: ["sedan"],
  allion: ["sedan"],
  sylphy: ["sedan", "bluebird"],
  teana: ["sedan"],
  latio: ["sedan"],
  grace: ["sedan", "hybrid", "honda"],
  civic: ["sedan", "honda"],
  accord: ["sedan"],
  axela: ["sedan", "mazda3"],
  atenza: ["sedan", "mazda6"],
  impreza2: ["sedan"],
  lancer: ["sedan", "ex", "evolution"],
  golf: ["hatchback", "tsi", "gti"],
  polo: ["hatchback", "vivo"],
  a4: ["sedan", "audi", "s-line"],
  a3: ["hatchback", "audi"],
  q3: ["suv", "audi"],
  q5: ["suv", "audi"],
  "320i": ["bmw", "sedan", "m sport"],
  x1: ["bmw", "suv"],
  x5: ["bmw", "suv"],
  a180: ["mercedes", "hatchback"],
  a200: ["mercedes", "gla"],
  gla: ["mercedes", "suv"],
  e200: ["mercedes", "sedan"],
  defender: ["4x4", "suv", "land rover"],
  discovery: ["suv", "land rover"],
  "range rover": ["suv", "sport", "evoque"],
  evoque: ["range rover", "suv"],
  rush: ["suv", "7 seater"],
  harrier: ["suv", "premium"],
  crv: ["cr-v", "suv", "honda"],
  "cr-v": ["crv"],
  vezel: ["suv", "hybrid", "honda"],
  "juke": ["suv", "nismo"],
  "dual": ["suv"],
  terios: ["suv", "kid", "daihatsu"],
  bego: ["suv", "daihatsu"],
  rush2: ["suv"],
  escudo: ["suv", "vitara", "suzuki"],
  vitara: ["escudo", "suv"],
  jimny: ["4x4", "sierra", "suzuki"],
  pajero: ["4x4", "suv", "mitsubishi"],
  "pajero mini": ["kei", "4x4"],
  rvr: ["suv", "mitsubishi"],
  eclipse: ["cross", "suv"],
  asx: ["suv", "mitsubishi", "rvr"],
  "cx-3": ["suv", "mazda"],
  "cx-30": ["suv", "mazda"],
  "cx-60": ["suv", "mazda"],
  "mx-5": ["mx5", "roadster", "convertible"],
  "mx5": ["mx-5", "roadster"],
  z4: ["roadster", "convertible", "bmw"],
  "86": ["gt86", "coupe", "toyota"],
  brz: ["coupe", "subaru"],
  mustang: ["coupe", "ford"],
  camaro: ["coupe"],
  challenger: ["coupe"],
  dyna: ["truck", "2-ton", "toyota"],
  elf: ["truck", "isuzu"],
  canter2: ["truck"],
  forward: ["truck", "isuzu"],
  atlas: ["truck", "nissan"],
  condor: ["truck"],
  "7 seater": ["7-seater", "suv", "van", "noah", "voxy", "wish", "rush"],
  "7-seater": ["7 seater"],
  hybrid: ["e-power", "fit", "aqua", "vezel", "note", "grace", "axio hybrid"],
  diesel: ["xd", "gd-6", "1gd", "2gd", "4jj1", "4jk1"],
  turbo: ["xt", "tsi", "twin-turbo", "v6"],
  "4wd": ["4x4", "awd", "four wheel"],
  "4x4": ["4wd", "awd"],
  matatu: ["van", "hiace", "shuttle", "14-seater", "psv"],
  shuttle: ["hiace", "van", "matatu"],
  psv: ["matatu", "shuttle", "hiace", "cost er"],
  first: ["beginner", "vitz", "march", "mira", "alto"],
  "ex-japan": ["import", "foreign used"],
  duty: ["paid", "kra", "crsp"],
  logbook: ["transfer", "tim s", "tims", "ntsa"],
};

/** Expand a raw query with synonyms so "prado" also matches "TX-L". */
export function expandQuery(q: string): string[] {
  const base = q.toLowerCase().trim();
  if (!base) return [];
  const out = new Set<string>([base]);
  for (const [key, alts] of Object.entries(SYNONYMS)) {
    if (base.includes(key)) alts.forEach((a) => out.add(a));
    alts.forEach((a) => { if (base.includes(a) && a.length > 3) out.add(key); });
  }
  return [...out].slice(0, 8);
}

export type RankedHit = { id: string; s: number };

/**
 * Typo-tolerant retrieval: trigram similarity over title+make+model,
 * best-match per car across all expanded terms. Returns ranked ids.
 */
export async function rankCarIds(terms: string[], opts?: { listingType?: "SALE" | "RENT" | "BOTH"; limit?: number }): Promise<RankedHit[]> {
  if (!terms.length) return [];
  const lt = opts?.listingType === "RENT" ? "('RENT','BOTH')" : opts?.listingType === "BOTH" ? "('SALE','RENT','BOTH')" : "('SALE','BOTH')";
  const limit = Math.min(500, Math.max(50, opts?.limit ?? 200));
  // One row per car: best similarity across terms. The search_text expression
  // matches the GIN trigram index (car_search_trgm_idx) for speed.
  const unions = terms.map((_, i) => `SELECT id, (word_similarity(lower($${i + 1}), lower(title || ' ' || make || ' ' || model)) * ${i === 0 ? 1 : 0.85}) AS s FROM "Car" WHERE status = 'ACTIVE' AND "listingType"::text IN ${lt} AND word_similarity(lower($${i + 1}), lower(title || ' ' || make || ' ' || model)) > 0.35`).join(" UNION ALL ");
  const rows = (await prisma.$queryRawUnsafe<{ id: string; s: number }[]>(
    `SELECT id, MAX(s) AS s FROM (${unions}) AS q GROUP BY id ORDER BY s DESC LIMIT ${limit}`,
    ...terms
  ).catch(() => [] as { id: string; s: number }[])) as { id: string; s: number }[];
  return rows;
}
