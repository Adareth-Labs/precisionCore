# PrecisionCore API

Node.js REST API for the PrecisionCore partner portal. JWT auth via Supabase Auth, RBAC by supplier tier, RFQ state machine, PPAP management, CAR quality workflow, audit logging, and SMTP2Go email notifications.

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Language | TypeScript |
| ORM | Prisma + PostgreSQL |
| Auth | Supabase Auth (JWT via JWKS) |
| Storage | Cloudflare R2 / S3-compatible storage (pre-signed URLs) |
| Email | SMTP2Go (SMTP) |
| Logging | Winston + daily rotate |

## Architecture

```
Request → CORS → Helmet → Rate Limit → Auth Middleware → RBAC → Route Handler → Service → DB/S3/Email → Audit Log → Response
```

## Tier permissions

| Permission | BASIC | QUALIFIED | STRATEGIC |
|------------|-------|-----------|-----------|
| rfq:read | ✓ | ✓ | ✓ |
| rfq:create | | ✓ | ✓ |
| ppap:read | | ✓ | ✓ |
| ppap:upload | | ✓ | ✓ |
| car:read | | ✓ | ✓ |
| car:create | | ✓ | ✓ |
| document:certs | ✓ | ✓ | ✓ |
| document:cad | | ✓ | ✓ |
| document:roadmap | | | ✓ |

## RFQ State Machine

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → IN_PRODUCTION
                                 ↘ REJECTED
                 ↘ CLARIFICATION_REQUIRED → SUBMITTED
Any → CANCELLED
```

## Authentication

The API verifies Supabase Auth access tokens using the project JWKS endpoint. Authorization data is read from Supabase `app_metadata` and normalized to the API tiers `BASIC`, `QUALIFIED`, and `STRATEGIC`.

## Setup

```bash
cp .env.example .env
# Populate all values

npm install
npx prisma migrate dev
npm run dev
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Liveness check |
| GET | /health/ready | Readiness check (DB ping) |
| GET | /v1/rfq | List supplier RFQs |
| POST | /v1/rfq | Create RFQ |
| GET | /v1/rfq/:id | Get RFQ detail |
| POST | /v1/rfq/:id/transition | State machine event |
| POST | /v1/rfq/:id/documents/upload-url | Get S3 upload URL |
| GET | /v1/rfq/:id/documents/:docId/download | Get S3 download URL |
| GET | /v1/ppap | List PPAP submissions |
| POST | /v1/ppap | Create PPAP submission |
| POST | /v1/ppap/:id/documents/upload-url | Upload PPAP document |
| GET | /v1/quality | List CAR reports |
| POST | /v1/quality | Create CAR report |
| POST | /v1/quality/:id/transition | Advance CAR workflow |
| GET | /v1/suppliers/me | Supplier profile |
| GET | /v1/suppliers/me/scorecard | Supplier scorecard |
| GET | /v1/suppliers/me/audit-log | Audit trail |
| GET | /v1/documents/certs/:certId | Download certificate |
| GET | /v1/documents/cad/:key | Download CAD file |
| GET | /v1/documents/roadmap/:key | Download roadmap (STRATEGIC) |
