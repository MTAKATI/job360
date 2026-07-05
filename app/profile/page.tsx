import type { JSX } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { requireUser } from "@/lib/auth";
import { createInsforgeServer } from "@/lib/insforge-server";
import { getSignedResumeUrl } from "@/lib/resume-storage";

export default async function ProfilePage(): Promise<JSX.Element> {
  const user = await requireUser();
  const insforge = await createInsforgeServer();

  const { data: profile, error } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[app/profile/page]", error);

    return (
      <main className="min-h-screen bg-background">
        <Navbar active="profile" />

        <section className="mx-auto max-w-[1280px] p-8">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-lg">
            <h1 className="text-base font-semibold leading-6 text-text-primary">
              Profile unavailable right now
            </h1>
            <p className="mt-2 text-sm font-medium leading-5 text-text-secondary">
              We couldn&apos;t load your saved profile. Please refresh the page and
              try again in a moment.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const signedResumeUrl = profile?.resume_pdf_url
    ? await getSignedResumeUrl(insforge, user.id)
    : null;

  return (
    <main className="min-h-screen bg-background">
      <Navbar active="profile" />

      <section className="mx-auto max-w-[1280px] space-y-6 p-8">
        <ProfileContent initialProfile={profile} signedResumeUrl={signedResumeUrl} />
      </section>
    </main>
  );
}