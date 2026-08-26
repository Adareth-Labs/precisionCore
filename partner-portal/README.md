# PrecisionCore Automotive — Partner Portal

Next.js 15 App Router application for authenticated supplier collaboration across PrecisionCore Automotive’s partner network. The current implementation uses Supabase Auth for sessions and JWTs, Prisma/PostgreSQL for portal data, and S3-compatible object storage for document uploads.

## Architecture

```text
partners.precisioncore.example
├── Supabase Auth                 ← password, magic-link and OAuth sessions
├── PostgreSQL + Prisma           ← vendors, RFQs, PPAP, CAR, scorecards, capacity
├── S3-compatible object storage  ← RFQ and PPAP documents via pre-signed URLs
└── Next.js middleware            ← session validation + tier gating
```

## Access tiers

| Tier | Name | Access |
|---|---|---|
| 1 | Basic | Dashboard and basic supplier information |
| 2 | Qualified | + RFQ submission, PPAP, supplier scorecard |
| 3 | Strategic | + CAR workflow and capacity dashboard |

Tier is stored in the user’s Supabase `app_metadata` and mirrored on the linked `Vendor` record. Middleware uses the JWT metadata for fast route gating; server-side data access reads the vendor record as the source of truth.

## Authentication

The application uses Supabase Auth end-to-end. The login screen supports password, magic-link, Google and Azure sign-in. OAuth and magic-link callbacks are handled by `/auth/callback`, which exchanges the PKCE code for a session.

For production, set the tier and vendor identifier using Supabase server-side administration or a controlled database trigger. Never expose the Supabase service-role key to the browser.

## Quick start

```bash
npm install
npm run db:generate
npm run dev
```

Populate the required environment variables in `.env.local` before starting the app. Keep that file out of version control.

## Project structure

```text
portal/
├── middleware.ts
├── prisma/schema.prisma
└── src/
    ├── app/
    │   ├── auth/callback/
    │   ├── dashboard/
    │   ├── rfq/
    │   ├── ppap/
    │   ├── scorecard/
    │   ├── car/
    │   └── capacity/
    ├── components/
    ├── hooks/
    ├── lib/
    │   ├── auth.ts
    │   ├── db.ts
    │   ├── rbac.ts
    │   ├── s3.ts
    │   └── supabase/
    ├── styles/
    └── types/
```

## RBAC defense in depth

1. Middleware validates the Supabase user session and applies route-level tier gates.
2. Server routes and actions resolve the authenticated user and enforce the required tier before accessing gated records.
3. UI components hide or lock features for lower tiers, but UI state is never treated as the security boundary.

## Document uploads

Files are uploaded directly from the browser to S3-compatible storage using pre-signed URLs. PostgreSQL stores the metadata and ownership relationship.
