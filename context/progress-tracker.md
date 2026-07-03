# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 - Profile Page
**Last completed:** 04 Database Schema
**Next:** 05 Profile Page - Full UI

---

## Progress

### Phase 1 - Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 - Profile Page

- [ ] 05 Profile Page - Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation

### Phase 3 - Find Jobs Page

- [ ] 09 Find Jobs Page - Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 - Job Details Page

- [ ] 12 Job Details Page - Full UI
- [ ] 13 Company Research Agent

### Phase 5 - Dashboard

- [ ] 14 Dashboard Page - Full UI
- [ ] 15 Stats Bar - Real Data
- [ ] 16 Recent Activity - Real Data
- [ ] 17 Analytics Charts - PostHog Data

---

## Decisions Made During Build

- Built homepage as static mock UI matching `context/designs/landing-page.png`.
- Homepage CTA links now resolve to `/login` or `/dashboard` from the current InsForge session.
- Used existing public assets at `/public/logo.png`, `/public/images/dashboard-demo.png`, `/public/images/jobs-lists.png`, `/public/images/agnet-log.png`, and `/public/images/user-icon.png`.
- Auth uses `@insforge/sdk/ssr` with server-side OAuth initiation, PKCE verifier cookies, a server callback exchange, and Next.js 16 `proxy.ts` session refresh.
- Google and GitHub are enabled in the InsForge backend.
- Protected routes are `/dashboard`, `/profile`, and `/find-jobs` including nested routes; protected pages also perform server-side user verification.
- `/dashboard` currently contains a small protected authentication verification state. Feature 14 will replace it with the complete dashboard UI.
- PostHog initializes before hydration through Next.js 16 `instrumentation-client.ts`, with manual pageviews and no autocapture, page-leave capture, or session recording.
- PostHog uses the authenticated InsForge user ID as the browser and server `distinctId`; login identifies on the dashboard and sign-out resets browser identity.
- The only typed custom events are `job_search_started`, `job_found`, `profile_completed`, and `company_researched`.
- Server-side event capture creates a short-lived PostHog client per call and always shuts it down after capture.
- InsForge CLI is linked to the Bursary360 backend project; schema/RLS/storage changes go through `db migrations` (SQL files in `migrations/`), never hand-run against the dashboard.
- `profiles`, `agent_runs`, `jobs`, and `agent_logs` tables are created with RLS enabled, scoped to `auth.uid()` (`profiles.id` for the profiles table, `user_id` for the other three). No DELETE policies exist yet — no feature needs them.
- `education` is stored as a single jsonb object; `work_experience` is a jsonb array of up to 3 role objects. Field names are camelCase and match the profile form labels.
- The `resumes` storage bucket is private and path-scoped: `storage.objects` RLS requires the first path segment of the object key to equal the caller's `sub`, matching the `resumes/{user_id}/resume.pdf` convention.
- The OAuth callback (`app/api/auth/callback/route.ts`) eagerly inserts a minimal `profiles` row right after a successful `exchangeOAuthCode`, using a server client built from the same response cookie jar so the insert carries the just-created session. A `23505` (unique violation) on repeat logins is expected and swallowed — the row is created once and never overwritten by later logins.
- Shared DB-backed types (`Profile`, `AgentRun`, `Job`, `AgentLog`, `WorkExperience`, `Education`, `CompanyResearch`) live in `types/index.ts`, matching the columns in architecture.md exactly.

---

## Notes

- Root layout now uses Inter via `next/font/google` as required by the UI rules.
- InsForge allows `http://localhost:3000/api/auth/callback` for local OAuth callbacks.
- Local auth configuration lives in ignored `.env.local`; committed variable names and placeholders live in `.env.example`.
- Auth implementation passes lint, TypeScript, production build, unauthenticated route checks, provider initiation checks, and complete Google and GitHub OAuth browser round-trips.
- Post-review hardening moved OAuth into `actions/`, added shared provider pending state, added exception handling and sign-out feedback, aligned UI spacing, and corrected InsForge SDK documentation.
- npm overrides Next.js's nested PostCSS to patched version 8.5.16; `npm audit` reports zero vulnerabilities and the production build remains green.
- PostHog configuration is optional at runtime: analytics safely no-ops when its public key or host is absent.
- PostHog initialization passes lint, TypeScript, and the production build.
