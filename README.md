# Motiva — Premium Car Marketplace (Kenya-first, East Africa ready)

**Gari bora. Deal clear.** Premium cars. Verified.

Next.js 15 (App Router) + TypeScript + PostgreSQL/Prisma + Tailwind + NextAuth v5. Mobile-first, KES pricing, WhatsApp-fast.

## Quick start

```bash
npm install
cp .env.example .env        # fill DATABASE_URL (Neon/Supabase), AUTH_SECRET, Google OAuth
openssl rand -base64 32     # → AUTH_SECRET

npm run db:push              # create tables (or: npm run db:migrate)
npm run db:seed              # 12 realistic Kenyan listings + dealers + blog posts
npm run dev                  # → http://localhost:3000
```

Demo login: `seller@motiva.co.ke` / `Password123!` (admin: `admin@motiva.co.ke`).

## Deploy (Vercel + Neon)

1. Create Postgres on [Neon](https://neon.tech) or Supabase → copy pooled `DATABASE_URL`.
2. Push to GitHub → import in Vercel → add env vars from `.env.example`.
3. Build command: `prisma generate && next build` (already in `package.json`).

## Features

- **Home**: hero + search, featured carousel, KE brands, categories, trust badges, fresh listings, seller CTA
- **Search**: make/model/year/price/mileage/gearbox/fuel/body/condition/location + 5 sorts + pagination
- **Detail**: gallery, full specs, dealer card, WhatsApp CTA, inquiry form, similar cars, Car JSON-LD
- **Auth**: email+password (bcrypt) + Google (NextAuth v5, Prisma adapter)
- **Sell**: validated multi-section form → PENDING review queue
- **Dashboard**: overview, listings (mark sold/delete), inquiries inbox
- **Extras**: favourites, profiles, verified dealers, blog (SEO), admin queue, sitemap/robots, dark mode, WhatsApp float

## Payments (placeholders)

- **M-Pesa Daraja**: env keys ready; add STK-push route in `src/lib/payments.ts` (escrow on sale).
- **Stripe**: keys ready for international cards / featured-listing boosts.

## Images

Sell forms upload straight to [Uploadthing](https://uploadthing.com) (12 photos max, 4MB each):

1. Create a free Uploadthing app → copy the token.
2. Set `UPLOADTHING_TOKEN` and `NEXT_PUBLIC_UPLOADTHING_ENABLED="true"` in Vercel env vars (and local `.env`).
3. Redeploy. Without the token, forms gracefully fall back to pasting image URLs.

## Search at scale

`searchCars()` uses Prisma `contains: insensitive` filters. To scale, add Meilisearch/Algolia and keep the same `CarFilters` interface — only `src/lib/queries.ts` changes.

## Project structure

```
prisma/schema.prisma + seed.ts
src/
  app/ (page, layout, cars, sell, dashboard, dealers, blog, admin, api/auth, sitemap)
  components/ (ui, layout, home, cars, sell)
  lib/ (prisma, auth, actions, queries, validations, utils, seo)
  config/site.ts   # brand name, tagline, locations, makes
```

Brand is configured via `NEXT_PUBLIC_BRAND_NAME` (default: Motiva) and `NEXT_PUBLIC_APP_URL` (production: https://motiva.co.ke).
