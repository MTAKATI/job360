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
Protected pages use a white, bordered 64px header over the application background and a `max-w-[1280px]` content shell. Human-readable action failures appear above the page card using a white error surface. The sign-out control is a dedicated Client Component that preserves the established tokenized secondary-button styling while resetting PostHog identity before the server action runs. This dashboard is an authentication verification placeholder; Feature 14 will replace its body while retaining the shell patterns.
