# UI Registry

Living document. Updated after every component is built. Read this before building any new component - match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes - match its exact classes
3. If no - build it following ui-rules.md and ui-tokens.md, then add it here

After building any component - update this file with the component name, file path, and exact classes used.

---

## Components

### Homepage Landing Page

File: app/page.tsx
Last updated: 2026-07-02

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-surface`, `bg-surface-tertiary`, `bg-surface-muted`, `landing-gradient` |
| Border           | `border-border`, `border-b`, `border-x`                               |
| Border radius    | `rounded-md`, `rounded-lg`, `rounded-xl`                               |
| Text - primary   | `text-text-slate`, `text-text-primary`                                 |
| Text - secondary | `text-text-secondary`, `text-text-dark`                                |
| Spacing          | `px-6`, `py-14`, `py-16`, `py-20`, `gap-3`, `gap-8`, `gap-10`          |
| Hover state      | `hover:text-accent`, `hover:bg-overlay-dark`, `hover:bg-surface-secondary` |
| Shadow           | `shadow-lg`, `shadow-2xl`                                              |
| Accent usage     | `bg-overlay`, `text-accent`, `border-accent`, `border-success`         |

**Pattern notes:**
Homepage sections are full-width bands inside a `max-w-[1440px]` shell with tokenized borders and backgrounds. CTAs use the dark overlay token for the primary action and tokenized white secondary buttons. Feature rows use white content areas, muted media panels, and a thin accent border on the first explanatory row.

### Authentication Login

File: app/(auth)/login/page.tsx, components/auth/OAuthButton.tsx, components/auth/GoogleIcon.tsx, components/auth/GitHubIcon.tsx
Last updated: 2026-07-03

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `landing-gradient`, `bg-surface`                                      |
| Border           | `border`, `border-border`                                             |
| Border radius    | `rounded-md`, `rounded-xl`                                            |
| Text - primary   | `text-text-slate`, `text-text-primary`                                |
| Text - secondary | `text-text-secondary`, `text-text-muted`                              |
| Typography       | `text-3xl font-bold`, `text-sm font-medium`, `text-xs font-semibold`  |
| Spacing          | `p-6`, `px-4`, `py-2`, `gap-3`, `space-y-3`                           |
| Hover state      | `hover:bg-surface-secondary`                                          |
| Focus state      | `focus-visible:ring-2`, `focus-visible:ring-accent`, `ring-offset-2`  |
| Disabled state   | `disabled:cursor-not-allowed`, `disabled:opacity-60`                  |
| Shadow           | `shadow-lg`                                                           |
| Accent usage     | `text-accent`, `border-t-accent`, `border-error`, `text-error`        |

**Pattern notes:**
Authentication uses a centered white card over the existing landing gradient. Both provider buttons share one form-level pending state, preventing overlapping OAuth starts. Provider buttons are full-width tokenized secondary buttons with consistent disabled, hover, and keyboard-focus states. Authentication errors retain a white surface with error-colored border and text so no unregistered background color is introduced.

### Protected Page Shell

File: app/dashboard/page.tsx, components/auth/SignOutButton.tsx
Last updated: 2026-07-03

| Property         | Class                                                                |
| ---------------- | -------------------------------------------------------------------- |
| Background       | `bg-background`, `bg-surface`                                        |
| Border           | `border`, `border-border`, `border-b`                                |
| Border radius    | `rounded-md`, `rounded-xl`                                           |
| Text - primary   | `text-text-slate`, `text-text-primary`                               |
| Text - secondary | `text-text-secondary`                                                |
| Typography       | `text-3xl font-bold`, `text-sm font-medium`, `text-xs font-semibold` |
| Spacing          | `p-8`, `p-6`, `px-4`, `py-3`, `py-2`, `mb-6`                        |
| Hover state      | `hover:bg-surface-secondary`                                         |
| Focus state      | `focus-visible:ring-2`, `focus-visible:ring-accent`, `ring-offset-2` |
| Shadow           | `shadow-lg`                                                          |
| Accent usage     | `text-accent`                                                        |

**Pattern notes:**
Protected pages use the shared `Navbar` (see below) over the application background and a `max-w-[1280px]` content shell. Human-readable action failures appear above the page card using a white error surface. The sign-out control is a dedicated Client Component rendered inside `Navbar` itself — every authenticated page gets it automatically, do not add a page-local sign-out button. This dashboard body is still an authentication verification placeholder; Feature 14 will replace it while retaining the shell and `Navbar` usage.

### App Navbar

File: components/layout/Navbar.tsx, components/auth/SignOutButton.tsx
Last updated: 2026-07-03

| Property         | Class                                            |
| ---------------- | ------------------------------------------------ |
| Background       | `bg-surface`                                      |
| Border           | `border-b`, `border-border`                       |
| Border radius    | `rounded-md`                                      |
| Text - active    | `text-accent`                                     |
| Text - inactive  | `text-text-dark`                                  |
| Typography       | `text-sm font-medium leading-5`                   |
| Spacing          | `h-16`, `max-w-[1280px]`, `px-6`, `gap-10`         |
| Hover state      | `hover:text-accent`, `hover:bg-surface-secondary`  |
| Focus state      | `focus-visible:ring-2`, `focus-visible:ring-accent`, `ring-offset-2` |
| Shadow           | none                                              |
| Accent usage     | `text-accent` (active nav link only)              |

**Pattern notes:**
Shared top navbar for every authenticated page (Dashboard, Find Jobs, Profile) — full-width white header, `/public/logo.png` mark, three nav links with `active` prop controlling the color-only active state (no underline) per ui-rules.md, and `SignOutButton` on the far right (`justify-between` across logo / nav / sign-out, same 3-item pattern as the homepage header). `Navbar` is the single place authenticated-page chrome lives — any new protected page renders `<Navbar active="..." />` instead of building its own header, and must NOT add a separate sign-out control since one is already included. `SignOutButton` (`border border-border bg-surface rounded-md px-4 py-2 text-sm font-medium text-text-primary`, `hover:bg-surface-secondary`) reuses the exact tokenized secondary-button classes established on the login page's OAuth buttons — match those classes for any other destructive/session-ending control.

### Profile Page — Full UI

File: app/profile/page.tsx, components/profile/CompletionIndicator.tsx, components/profile/ConnectedAccounts.tsx, components/profile/ResumeUpload.tsx, components/profile/ProfileForm.tsx
Last updated: 2026-07-04

| Property         | Class                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Background       | `bg-background`, `bg-surface`, `bg-surface-secondary`, `bg-surface-tertiary` |
| Border           | `border`, `border-border`, `border-dashed`, `border-border-muted`, `border-t` |
| Border radius    | `rounded-xl`, `rounded-lg`, `rounded-md`, `rounded-full`              |
| Text - primary   | `text-text-primary`                                                   |
| Text - secondary | `text-text-secondary`, `text-text-muted`                              |
| Typography       | `text-base font-semibold`, `text-sm font-semibold`, `text-xs font-medium uppercase tracking-wide` |
| Spacing          | `p-6`, `p-4`, `px-3 py-2`, `px-4 py-2`, `px-4 py-3`, `gap-2`, `gap-4`, `space-y-4`, `space-y-6` |
| Accent usage     | `bg-accent`, `text-accent`, `bg-accent/…` n/a — uses `text-accent` for links/icons |
| Error usage      | `text-error`, `bg-error/10` (missing-field pill background — no dedicated error-light token exists yet) |
| Shadow           | `shadow-lg`, `shadow-sm`                                              |

**Pattern notes:**
Completion ring is a hand-built SVG (`stroke="var(--color-error)"` with `strokeOpacity` for the track) since no percentage-ring primitive exists yet — reuse this pattern for any future progress ring. Resume upload uses a `<label>` wrapping a visually-hidden file input so "Select Resume" opens the native picker; Feature 06 adds PDF validation, pending/error states, private storage upload, and a signed current-resume link. Skill/industry tags and Work Experience remain controlled with local `useState`, while the Save Profile button sends one structured payload to the profile Server Action. Work Experience is capped at 3 rows per architecture.md. Form field labels share one `FieldLabel` helper (`text-xs font-medium uppercase tracking-wide text-text-secondary`) — reuse it for any new form section instead of re-typing the classes.

`ConnectedAccounts` was added later, direct developer request, not part of the original build-plan.md Feature 05 spec — matches `context/designs/` reference image exactly. Renders between the completion banner and the Resume card. Provider row: `rounded-lg border border-border bg-surface-secondary px-4 py-3`. Brand badge is a two-layer square (no dedicated brand-icon SVG file, unlike Google/GitHub in `components/auth/`) — outer neutral `flex size-10 items-center justify-center rounded-md bg-surface`, inner `flex size-6 items-center justify-center rounded bg-linkedin text-[11px] font-bold leading-none text-linkedin-foreground` with the literal text "in". Connect button is `rounded-full bg-linkedin px-5 py-2 text-sm font-medium text-linkedin-foreground hover:opacity-90` — pill-shaped, unlike every other primary/secondary button in this project (`rounded-md`); this is a deliberate brand-button exception, not a pattern to copy elsewhere. Static UI only — "Connect LinkedIn" has no OAuth wiring yet; this integration isn't in `project-overview.md`'s in-scope feature list, so a future session must decide where the InsForge/LinkedIn OAuth logic actually lives before wiring the button.

Feature 06 keeps these visual patterns intact while replacing mock state with real profile data. `ProfileForm` and `ResumeUpload` use the established disabled states and human-readable tokenized errors. The optional Cover Letter Tone select reuses `inputClasses` exactly, so it does not establish a new component pattern. `CompletionIndicator` receives derived data, and `ResumeUpload` reads signed-resume props directly so server revalidation cannot leave a stale local copy.

Feature 06 hardening adds a drag-active upload variant (order-accent bg-surface-tertiary) while preserving the same card shell, and formalizes form accessibility by wiring every visible field label through the shared FieldLabel helper with explicit htmlFor/id pairs. ProfileContent owns the live completion calculation for the page, so future profile-field changes should keep feeding that path instead of duplicating completion logic elsewhere.

Feature 07 extends the existing Resume card rather than introducing a new shell. After a successful upload, the
`Extract from Resume` action reuses the established accent-button classes (`rounded-md bg-accent px-4 py-2 text-sm
font-medium text-accent-foreground`, with the standard disabled opacity/cursor state). Extraction feedback uses
`text-error` for failures and `text-success-foreground` for the review-before-save status. AI results fill blank
controlled fields only; the existing Save Profile action remains the sole persistence boundary.
