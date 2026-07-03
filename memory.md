# Memory — Database Schema Completion Session

Last updated: 2026-07-03 14:05 +02:00

## What was built

Feature 04 Database Schema is complete.

- Linked the project to the InsForge CLI (`npx @insforge/cli link`), installed
  InsForge agent skills, and added `@insforge/cli` as a dev dependency.
- Created migration `migrations/20260703133916_create-bursary-schema.sql`
  defining `profiles`, `agent_runs`, `jobs`, and `agent_logs` tables with all
  columns from `context/architecture.md`, applied via
  `npx @insforge/cli db migrations up`.
- Enabled RLS on all four tables with owner-scoped policies
  (`profiles.id` / `user_id` = `auth.uid()`); no DELETE policies since no
  feature needs them yet.
- Created the private `resumes` storage bucket with path-scoped RLS on
  `storage.objects` (first path segment of the object key must equal the
  caller's `sub`), matching `resumes/{user_id}/resume.pdf`.
- Added `types/index.ts` with `Profile`, `AgentRun`, `Job`, `AgentLog`,
  `WorkExperience`, `Education`, `CompanyResearch`, and related enum types
  matching the DB schema exactly.
- Updated `app/api/auth/callback/route.ts` to eagerly insert a minimal
  `profiles` row right after a successful `exchangeOAuthCode`, using a server
  client built from the response cookie jar so the insert carries the
  just-created session.
- Updated `context/progress-tracker.md` — Feature 04 marked complete, Phase 2
  started, next is Feature 05.

## Decisions made

- Schema/RLS/storage changes go through InsForge CLI migrations
  (`migrations/*.sql` + `db migrations up`), never hand-run through the
  dashboard or raw HTTP calls.
- `profiles` row creation is eager (at OAuth callback), not lazy — guarantees
  every FK referencing `profiles` can assume the row exists.
- `education` is a single jsonb object; `work_experience` is a jsonb array of
  up to 3 role objects. Field names are camelCase matching the profile form
  labels (e.g. `companyName`, `fieldOfStudy`).
- Duplicate-login safety uses Postgres error code `23505` (unique violation)
  caught and ignored on insert, rather than a select-then-insert race or an
  unsupported `.upsert()` (the installed `@insforge/sdk` version has no
  upsert method).

## Problems solved

- `@insforge/sdk` has no `.upsert()` — used plain `.insert()` and treated a
  `23505` Postgres error code as "already exists, ignore" instead.
- The profile-creation insert needed to run under the just-established
  session, not the stale pre-login cookie jar from `next/headers`. Fixed by
  building `createServerClient` with `cookies: response.cookies` (the same
  `NextResponse` whose cookies `exchangeOAuthCode` had just written to),
  rather than `createInsforgeServer()`'s `cookies()` read from `next/headers`.
- Verified live: one real Google login created exactly one `profiles` row
  with correct `id`/`email`/`full_name`; a second login (logout + login)
  produced no duplicate and did not touch `created_at`/`updated_at`.

## Current state

- TypeScript, lint, and production build all pass.
- `profiles`, `agent_runs`, `jobs`, `agent_logs` tables exist in the InsForge
  backend with RLS confirmed enabled and policies confirmed present via
  direct `db query` inspection.
- `resumes` bucket exists as private with path-scoped storage RLS.
- Feature 04 is marked complete in `progress-tracker.md`; Feature 05 Profile
  Page (Full UI) is next.
- No local dev server is currently running (stopped after verification).
- InsForge CLI is authenticated and linked (`.insforge/project.json`); no
  action needed to reconnect next session unless the token expires.

## Next session starts with

Run `/remember restore`, then begin Feature 05 — Profile Page Full UI (mock
data only, no save logic yet) per `context/build-plan.md`. Follow the UI-first
build plan: build the complete page with mock data, verify visually, before
wiring any Server Action logic (that is Feature 06).

## Open questions

- None outstanding for Feature 04. Feature 05 will need the exact shadcn/ui
  components already in the registry — check `context/ui-registry.md` before
  building new form primitives.
