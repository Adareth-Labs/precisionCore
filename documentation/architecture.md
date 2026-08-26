# Architecture Notes

## Authentication

Supabase Auth is used end-to-end. The partner portal uses SSR session cookies and `getUser()` validation. The API verifies Supabase JWTs using the project JWKS endpoint.

## Authorization

The portal uses three supplier tiers. Authorization metadata is kept in Supabase `app_metadata`; server-side application data is linked through the `Vendor.authUserId` field.

The API normalizes the same tier model to `BASIC`, `QUALIFIED`, and `STRATEGIC`.

## Storage

The applications are designed around S3-compatible storage and pre-signed upload/download URLs. Credentials are supplied through the runtime environment and are not part of the repository.
