# Kendra

Mobile-first D2C sourcing platform. Next.js 15 App Router + Tailwind + Prisma + Postgres.

## First-time setup

```bash
cp .env.example .env             # default DATABASE_URL points at the docker DB
docker compose up -d             # starts Postgres on :5432
npm install                      # also runs `prisma generate` via postinstall
npm run db:push                  # create tables from schema.prisma
npm run db:seed                  # load 6 verified suppliers
npm run dev
```

Open http://localhost:3000.

## Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run db:push` | Sync `prisma/schema.prisma` to the DB (no migration files) |
| `npm run db:seed` | Reseed the 6 mock suppliers (idempotent — upserts by `legacyId`) |
| `npm run db:reset` | Drop everything and re-create |
| `npm run db:studio` | Open Prisma Studio for browsing data |

## Two-sided app

- **Buyers (primary):** Discover → supplier PDP → enquiry over WhatsApp. Bottom nav is Discover · Post Need · Saved · Profile.
- **Sellers:** Apply via Profile → "Are you a supplier? List your business". Submissions write to `Supplier` with `status: PENDING`; only `APPROVED` rows show up on Discover.

## Architecture

```
app/
  layout.jsx              next/font, html shell
  page.jsx                Server Component — fetches suppliers from Postgres
  globals.css
components/
  AppShell.jsx            Client wrapper — tab state, selected supplier, list-biz mode
  BottomNav.jsx           4-tab nav (Discover · Post Need · Saved · Profile)
  SupplierCard.jsx
  SupplierPDP.jsx         Inline (non-popup) supplier detail page
  SupplierMedia.jsx       Video + photos carousel
  Icons.jsx
  screens/
    DiscoverScreen.jsx    Search + category + Low-MOQ filters
    PostNeedScreen.jsx
    SavedScreen.jsx
    ProfileScreen.jsx     Buyer profile + seller-listing CTA
    ListScreen.jsx        Seller listing form (server action → Postgres)
lib/
  db.js                   Prisma client singleton (HMR-safe)
  suppliers.js            Server-only data fetcher (`getApprovedSuppliers`)
  actions.js              Server actions (`submitListing`, `submitRequirement`)
  theme.js                Color tokens
  data.js                 Static CATEGORIES
prisma/
  schema.prisma           Supplier, Offering, Review, BuyerRequirement
  seed.mjs                Upserts the 6 mock suppliers
docker-compose.yml        Local Postgres 16
.env.example              DATABASE_URL template
```

## Notes

- Listings submitted via the seller form land as `PENDING`. Mark them `APPROVED` in Prisma Studio to make them visible on Discover.
- Saved suppliers are still in-memory only — promotion to per-user persistence needs a User model + auth (out of scope).
- WhatsApp remains the only buyer→supplier connection channel; the app never builds in-app chat.
