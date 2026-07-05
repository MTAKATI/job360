import "server-only";

import type { InsForgeClient } from "@insforge/sdk";

export function buildResumeStorageKey(userId: string): string {
  return `${userId}/resume.pdf`;
}

export async function getSignedResumeUrl(
  insforge: InsForgeClient,
  userId: string,
): Promise<string | null> {
  try {
    const resumeKey = buildResumeStorageKey(userId);
    const { data, error } = await insforge.storage
      .from("resumes")
      .createSignedUrl(resumeKey);

    if (error || !data) {
      console.error("[lib/resume-storage]", error);
      return null;
    }

    return data.signedUrl;
  } catch (error: unknown) {
    console.error("[lib/resume-storage]", error);
    return null;
  }
}