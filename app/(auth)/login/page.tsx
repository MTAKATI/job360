import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signInWithOAuth } from "@/actions/auth";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { getCurrentUser } from "@/lib/auth";

const errorMessages: Record<string, string> = {
  oauth_start: "We could not start sign in. Please try again.",
  oauth_callback: "Sign in could not be completed. Please try again.",
  oauth_missing: "The sign-in link was incomplete or expired. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}): Promise<JSX.Element> {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <main className="landing-gradient flex min-h-screen flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center px-6">
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
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Welcome to JobPilot
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-text-slate">
              Your next role starts here
            </h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Sign in to find stronger job matches and research every company
              before you apply.
            </p>
          </div>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-6 rounded-md border border-error bg-surface px-4 py-3 text-sm text-error"
            >
              {errorMessage}
            </p>
          ) : null}

          <form action={signInWithOAuth} className="mt-7 space-y-3">
            <div>
              <OAuthButton provider="google">Continue with Google</OAuthButton>
            </div>
            <div>
              <OAuthButton provider="github">Continue with GitHub</OAuthButton>
            </div>
          </form>

          <p className="mt-7 text-center text-xs leading-5 text-text-muted">
            By continuing, you agree to use JobPilot responsibly and allow us
            to maintain your secure sign-in session.
          </p>
        </div>
      </section>
    </main>
  );
}
