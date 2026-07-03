import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { PostHogIdentity } from "@/components/analytics/PostHogIdentity";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { requireUser } from "@/lib/auth";

const dashboardErrors: Record<string, string> = {
  signout: "We could not sign you out. Please try again.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}): Promise<JSX.Element> {
  const user = await requireUser();
  const { error } = await searchParams;
  const errorMessage = error ? dashboardErrors[error] : null;

  return (
    <main className="min-h-screen bg-background">
      <PostHogIdentity userId={user.id} />
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
          <Link href="/" aria-label="JobPilot home">
            <Image
              src="/public/logo.png"
              alt="JobPilot"
              width={118}
              height={40}
              className="h-[34px] w-auto"
              priority
            />
          </Link>
          <SignOutButton />
        </div>
      </header>

      <section className="mx-auto max-w-[1280px] p-8">
        {errorMessage ? (
          <p
            role="alert"
            className="mb-6 rounded-md border border-error bg-surface px-4 py-3 text-sm text-error"
          >
            {errorMessage}
          </p>
        ) : null}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Signed in
          </p>
          <h1 className="mt-3 text-3xl font-bold text-text-slate">
            Welcome to JobPilot
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Your secure session is active
            {user.email ? ` for ${user.email}` : ""}. The complete dashboard
            arrives in Phase 5; this protected page verifies the authentication
            flow today.
          </p>
        </div>
      </section>
    </main>
  );
}
