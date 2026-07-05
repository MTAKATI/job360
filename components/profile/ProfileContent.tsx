"use client";

import { useCallback, useState } from "react";
import type { JSX } from "react";
import { CompletionIndicator } from "@/components/profile/CompletionIndicator";
import { ConnectedAccounts } from "@/components/profile/ConnectedAccounts";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import {
  calculateProfileCompletion,
  type ProfileCompletionInput,
  type ProfileCompletionResult,
} from "@/lib/profile-completion";
import type { Profile, ProfileFormValues } from "@/types";

const EMPTY_PROFILE: ProfileCompletionInput = {
  full_name: null,
  phone: null,
  location: null,
  current_title: null,
  experience_level: null,
  years_experience: null,
  skills: [],
  work_experience: [],
  education: null,
  job_titles_seeking: [],
  remote_preference: null,
};

type Props = {
  initialProfile: Profile | null;
  signedResumeUrl: string | null;
};

export function ProfileContent({
  initialProfile,
  signedResumeUrl,
}: Props): JSX.Element {
  const [completion, setCompletion] = useState<ProfileCompletionResult>(() =>
    calculateProfileCompletion(initialProfile ?? EMPTY_PROFILE),
  );
  const [extractedProfile, setExtractedProfile] =
    useState<ProfileFormValues | null>(null);

  const handleProfileChange = useCallback(
    (profile: ProfileCompletionInput): void => {
      setCompletion(calculateProfileCompletion(profile));
    },
    [],
  );

  return (
    <>
      <CompletionIndicator
        percentage={completion.percentage}
        missingFields={completion.missingFields}
      />
      <ConnectedAccounts />
      <ResumeUpload
        hasUploadedResume={Boolean(initialProfile?.resume_pdf_url)}
        signedResumeUrl={signedResumeUrl}
        onProfileExtracted={setExtractedProfile}
      />
      <ProfileForm
        initialProfile={initialProfile}
        extractedProfile={extractedProfile}
        onProfileChange={handleProfileChange}
      />
    </>
  );
}
