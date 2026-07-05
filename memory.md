# Memory â€” Profile Page UI + Post-Login Navigation Fix Session

Last updated: 2026-07-04 15:47 +02:00

## What was built

Feature 05 (Profile Page â€” Full UI) is complete, plus a post-login navigation
bugfix and homepage CTA fix discovered while verifying it.

- `components/layout/Navbar.tsx` â€” shared top nav (Dashboard / Find Jobs /
  Profile) for every authenticated page, with the active link colored via a
  `active` prop (no underline, per ui-rules.md). Also renders `SignOutButton`
  on the far right â€” see "Decisions made" below for why.
- `components/profile/CompletionIndicator.tsx` â€” attention banner with a
  hand-built SVG completion ring (no existing ring primitive) and
  missing-field pills.
- `components/profile/ResumeUpload.tsx` â€” dashed drop-zone card with a
  `<label>`-wrapped hidden file input (real native picker, zero JS) and a
  "Generate Resume from Profile" button. No upload wiring yet â€” that's
  Feature 06.
- `components/profile/ProfileForm.tsx` â€” Client Component covering Personal
  Info, Professional Info (skill/industry tag inputs), Work Experience
  (capped at 3 roles, "Add role"), Education, and Job Preferences. Local
  `useState` only, no Server Action call yet (Feature 06 wires the save).
- `app/profile/page.tsx` â€” assembles the above behind `requireUser()`.
- Added `lucide-react` (already pre-approved in `code-standards.md`) for
  icons used across the new profile UI.
- Bugfix: `app/dashboard/page.tsx` now renders the shared `Navbar` instead of
  its old bespoke inline header (logo + Sign Out only, no nav links).
- Bugfix: `app/page.tsx` (homepage) CTA buttons (`Header`, `CtaButtons`,
  `BottomCta`) now take an `isAuthenticated` prop and swap copy â€” "Go to
  Dashboard" / "View Your Profile" â€” instead of always showing logged-out
  copy ("Start for free" / "Get Started" / "Find Your First Match").
- Updated `context/ui-registry.md` (App Navbar entry, Protected Page Shell
  entry, new Profile Page Full UI entry) and `context/progress-tracker.md`
  (Feature 05 marked complete, both bugfixes logged).

## Decisions made

- `Navbar` is now the single place authenticated-page chrome lives.
  `SignOutButton` was moved inside `Navbar` itself (rather than kept
  page-local) because swapping dashboard's old bespoke header for `Navbar`
  would otherwise have silently dropped the only sign-out control in the
  app. Any new protected page renders `<Navbar active="..." />` and must
  NOT add its own sign-out button â€” one is already included.
- No dedicated "error-light" design token exists for the missing-field
  pills on the completion banner. Used `bg-error/10` (an opacity modifier on
  the existing `--color-error` token) rather than a hardcoded hex, to stay
  inside the "no raw hex values" rule while still getting a light-pink pill.
- Work Experience is hard-capped at 3 rows (`MAX_WORK_EXPERIENCE_ROWS`),
  matching `architecture.md`'s `work_experience jsonb` column being "array
  of up to 3 roles."

## Problems solved

- **Root cause of "cannot navigate to the profile page after login":**
  `/dashboard` (built in Feature 02, before `Navbar` existed) had a bespoke
  header with only a logo and Sign Out button â€” no link to `/profile`
  anywhere. There was no in-app path to Profile after login. Fixed by
  switching dashboard to the shared `Navbar`.
- Playwright wasn't installed in this sandbox; `npx playwright install
  chromium` looked stalled on the first attempt (checked the download cache
  and saw ~0 bytes after several minutes) so it was killed â€” but it turned
  out to actually be mid-download (was at 70% of a 183MB file). Retried and
  let it finish this time. Lesson: check actual byte progress in the
  ms-playwright cache dir before assuming a stalled network, not just
  elapsed wall-clock time.
- Visually verified `/profile` and the dashboard-with-Navbar fix by
  temporarily bypassing `requireUser()` (in `lib/auth.ts`) and the
  `proxy.ts` protected-route check behind a `SKIP_AUTH_FOR_VISUAL_QA` env
  var, screenshotting with the Playwright CLI, then reverting both bypasses
  immediately. `git diff` on both files was confirmed empty afterward â€” this
  pattern is safe to reuse for future visual QA on protected pages in this
  sandbox (no real OAuth credentials available here).

## Current state

- TypeScript, lint, and production build all pass.
- `/profile` renders and matches `context/designs/profile.png` (verified via
  screenshot): attention banner + 70% completion ring, resume upload card,
  full profile form with all five sections.
- `/dashboard` now shows the shared Navbar (Dashboard/Find Jobs/Profile
  links + Sign Out) â€” Profile is reachable after login. `/find-jobs` still
  404s since that page doesn't exist yet (expected â€” Phase 3).
- Homepage CTA copy changes based on auth state, but this was only verified
  via typecheck/build, not a real logged-in screenshot (no real session
  cookie available in this sandbox without live OAuth).
- Feature 05 marked complete in `progress-tracker.md`; Feature 06 (Profile
  Save Logic) is next.
- `ui-registry.md` has entries for: App Navbar, Protected Page Shell, and
  Profile Page Full UI (CompletionIndicator, ResumeUpload, ProfileForm).
- No dev server currently running (stopped after verification).
- This session only refreshed the handoff; no new implementation work was added.

## Next session starts with

Run `/remember restore`, then begin Feature 06 â€” Profile Save Logic per
`context/build-plan.md`: a Server Action in `actions/profile.ts` that saves
`ProfileForm` fields to the `profiles` table, uploads the resume PDF to
`resumes/{user_id}/resume.pdf` with `upsert: true`, saves `resume_pdf_url`,
computes `is_complete` + completion percentage/missing fields, pre-fills the
form with existing data on return visits, and calls `revalidatePath('/profile')`
after save. `ProfileForm` is currently a self-contained Client Component with
local `useState` and no props â€” it will need to accept initial values as
props and call the new Server Action instead of just holding local state.

## Open questions

- None outstanding for Feature 05. Feature 06 will need to decide how
  `ProfileForm`'s local `useState` fields map onto Server Action submission
  (e.g. a single form `action` vs. individual field submission) â€” resolve
  this against `code-standards.md`'s Server Actions pattern before writing
  code.


