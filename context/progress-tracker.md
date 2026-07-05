# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 - Profile Page
**Last completed:** 07 AI Profile Extraction from Resume
**Next:** 08 Resume PDF Generation

---

## Progress

### Phase 1 - Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 - Profile Page

- [x] 05 Profile Page - Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
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
- Built the complete Profile page UI (mock data only, no save logic) matching `context/designs/profile.png`: `components/layout/Navbar.tsx` (shared top nav, reused for all authenticated pages going forward), `components/profile/CompletionIndicator.tsx` (attention banner + hand-built SVG completion ring), `components/profile/ResumeUpload.tsx` (dashed drop zone with a native hidden file input, no upload wiring yet), and `components/profile/ProfileForm.tsx` (Personal Info, Professional Info with skill/industry tag inputs, Work Experience capped at 3 roles with an "Add role" control, Education, Job Preferences, Save Profile button).
- `ProfileForm` remains a Client Component for tag, role, and checkbox interactions; Feature 06 now sends its structured state through the authenticated profile Server Action.
- Added `lucide-react` (already an approved dependency in code-standards.md) for icons used across the profile UI.
- No dedicated "error-light" token exists for the missing-field pills on the completion banner; used `bg-error/10` (opacity modifier on the existing `--color-error` token, not a hardcoded hex) to stay within the no-raw-hex-values rule.
- Visually verified `/profile` against `context/designs/profile.png` with a Playwright screenshot (temporarily bypassed `requireUser()` and the `proxy.ts` protected-route check behind a `SKIP_AUTH_FOR_VISUAL_QA` env var for the verification session only; both bypasses were reverted immediately after and are not present in the committed code).
- Fixed a post-login navigation bug: `/dashboard` (Feature 02, built before the shared `Navbar` existed) still used a bespoke inline header with only a logo and Sign Out button — no link to `/profile` or `/find-jobs` anywhere. It now renders `components/layout/Navbar.tsx` like the profile page does. Since dashboard's old header owned the only Sign Out control, `Navbar` now renders `SignOutButton` itself so every authenticated page (dashboard, profile, and future find-jobs) gets nav links and sign-out for free — do not add a page-local sign-out button next to `Navbar` again.
- Homepage CTA buttons (`app/page.tsx`) previously only changed their `href` for a logged-in visitor, never their label ("Start for free" / "Get Started" / "Find Your First Match" showed even with an active session). `Header`, `CtaButtons`, and `BottomCta` now take `isAuthenticated` and swap copy: "Go to Dashboard" (primary, all three) and "View Your Profile" (secondary CTA, replacing "Find Your First Match" when logged in).
- Added `components/profile/ConnectedAccounts.tsx` between the completion banner and the Resume card on `/profile`, per a direct developer request matching a reference design image — **this is not part of build-plan.md's original 17-feature spec.** Static UI only: a LinkedIn row with a two-layer brand badge (no dedicated SVG icon file, unlike Google/GitHub) and a pill-shaped "Connect LinkedIn" button (`rounded-full`, an intentional one-off exception to this project's `rounded-md` button standard). No OAuth wiring — "Not connected" is hardcoded, the button does nothing. A future session must decide where LinkedIn OAuth/connection logic actually lives (InsForge integration? new `connected_accounts` table/column?) before wiring it up; `architecture.md` and `project-overview.md` don't currently account for this feature at all.

---

## Notes

- Feature 06 wires the profile page to real InsForge data. `/profile` now loads the authenticated user's row server-side, pre-fills `ProfileForm`, derives the 11-field completion percentage and missing-field list, and generates a temporary signed URL for the current private resume.
- `actions/profile.ts` validates and normalizes profile payloads, scopes every read and write to the current user, persists `is_complete`, emits `profile_completed` only on the first incomplete-to-complete transition, and revalidates `/profile`.
- Feature 07 adds authenticated `POST /api/resume/extract`: it downloads the current user-scoped PDF from private InsForge Storage, extracts text with `pdf-parse`, and sends the text server-side to GPT-4o using an OpenAI Structured Output schema matching `ProfileFormValues`.
- Resume extraction never writes profile data automatically. The returned values fill only blank form fields, preserve existing user-entered values, leave preference-only fields unknown, and require the user to review and click Save Profile.
- Empty, image-only, or unreadable PDFs return the specified human-readable extraction error. The Resume card provides upload, extraction loading, success, and failure states using existing profile-page tokens.
- Feature 07 hardening validates work dates as `YYYY-MM` and graduation years as `YYYY` before applying any AI result. The authenticated route permits three extraction attempts per five-minute window per user, tracked through the existing RLS-protected `agent_logs` table, and fails closed if rate-limit state cannot be read or recorded.
- Resume uploads are validated as non-empty PDFs up to 5MB and replace `{user_id}/resume.pdf`. Feature 06 hardening now keeps `resume_pdf_url` aligned with its name by storing the uploaded file URL from InsForge, while `lib/resume-storage.ts` derives the stable private storage key from `user.id` when it needs a signed viewing URL.
- Completion requires full name, phone, location, current title, experience level, years of experience, skills, one minimally valid work role, complete education, job titles seeking, and remote preference. Optional fields never affect completion.
- The form now includes and persists the optional `cover_letter_tone` field defined by the schema and Feature 05 specification.
- /profile no longer falls back to a blank editable form when the initial profile read fails. It renders a human-readable load error instead, preventing accidental overwrites after transient backend failures.
- components/profile/ProfileContent.tsx is now the live completion wrapper it was meant to be: the completion banner updates as fields change, and the previous compile error from the missing onProfileChange prop on ProfileForm is gone.
- The resume upload card now supports actual drag-and-drop in addition to click-to-upload, and ProfileForm now wires every visible label to a concrete input id for assistive technology.

- Root layout now uses Inter via `next/font/google` as required by the UI rules.
- InsForge allows `http://localhost:3000/api/auth/callback` for local OAuth callbacks.
- Local auth configuration lives in ignored `.env.local`; committed variable names and placeholders live in `.env.example`.
- Auth implementation passes lint, TypeScript, production build, unauthenticated route checks, provider initiation checks, and complete Google and GitHub OAuth browser round-trips.
- Post-review hardening moved OAuth into `actions/`, added shared provider pending state, added exception handling and sign-out feedback, aligned UI spacing, and corrected InsForge SDK documentation.
- npm overrides Next.js's nested PostCSS to patched version 8.5.16; `npm audit` reports zero vulnerabilities and the production build remains green.
- PostHog configuration is optional at runtime: analytics safely no-ops when its public key or host is absent.
- PostHog initialization passes lint, TypeScript, and the production build.
