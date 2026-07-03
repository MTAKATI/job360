"use client";

import type { JSX } from "react";
import { signOut } from "@/actions/auth";
import { resetPostHogUser } from "@/lib/posthog-client";

export function SignOutButton(): JSX.Element {
  return (
    <form action={signOut} onSubmit={resetPostHogUser}>
      <button
        type="submit"
        className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Sign out
      </button>
    </form>
  );
}
