"use client";

import type { JSX, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { OAuthProvider } from "@/actions/auth";
import { GitHubIcon } from "@/components/auth/GitHubIcon";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

type OAuthButtonProps = {
  provider: OAuthProvider;
  children: ReactNode;
};

export function OAuthButton({
  provider,
  children,
}: OAuthButtonProps): JSX.Element {
  const { data, pending } = useFormStatus();
  const isActiveProvider = pending && data?.get("provider") === provider;

  return (
    <button
      type="submit"
      name="provider"
      value={provider}
      disabled={pending}
      className="inline-flex min-h-10 w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isActiveProvider ? (
        <span
          aria-hidden="true"
          className="size-5 animate-spin rounded-full border-2 border-border border-t-accent"
        />
      ) : provider === "google" ? (
        <GoogleIcon />
      ) : (
        <GitHubIcon />
      )}
      <span>{isActiveProvider ? "Connecting..." : children}</span>
    </button>
  );
}
