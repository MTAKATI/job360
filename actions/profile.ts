"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createInsforgeServer } from "@/lib/insforge-server";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import { capturePostHogServerEvent } from "@/lib/posthog-server";
import { buildResumeStorageKey } from "@/lib/resume-storage";
import type {
  Education,
  ProfileFormValues,
  WorkExperience,
} from "@/types";

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_WORK_EXPERIENCE_ROWS = 3;

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isNullableStringArray(value: unknown): value is string[] | null {
  return (
    value === null ||
    (Array.isArray(value) &&
      value.every((item) => typeof item === "string"))
  );
}

function isWorkExperience(value: unknown): value is WorkExperience {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    typeof Reflect.get(value, "companyName") === "string" &&
    typeof Reflect.get(value, "jobTitle") === "string" &&
    typeof Reflect.get(value, "startDate") === "string" &&
    typeof Reflect.get(value, "endDate") === "string" &&
    typeof Reflect.get(value, "currentlyWorking") === "boolean" &&
    typeof Reflect.get(value, "responsibilities") === "string"
  );
}

function isEducation(value: unknown): value is Education {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    typeof Reflect.get(value, "degree") === "string" &&
    typeof Reflect.get(value, "fieldOfStudy") === "string" &&
    typeof Reflect.get(value, "institutionName") === "string" &&
    typeof Reflect.get(value, "graduationYear") === "string"
  );
}

function isProfileFormValues(value: unknown): value is ProfileFormValues {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const yearsExperience = Reflect.get(value, "years_experience");
  const workExperience = Reflect.get(value, "work_experience");
  const education = Reflect.get(value, "education");
  const experienceLevel = Reflect.get(value, "experience_level");
  const remotePreference = Reflect.get(value, "remote_preference");
  const coverLetterTone = Reflect.get(value, "cover_letter_tone");
  const workAuthorization = Reflect.get(value, "work_authorization");

  return (
    isNullableString(Reflect.get(value, "full_name")) &&
    isNullableString(Reflect.get(value, "phone")) &&
    isNullableString(Reflect.get(value, "location")) &&
    isNullableString(Reflect.get(value, "current_title")) &&
    (experienceLevel === null ||
      experienceLevel === "junior" ||
      experienceLevel === "mid" ||
      experienceLevel === "senior" ||
      experienceLevel === "lead") &&
    (yearsExperience === null ||
      (typeof yearsExperience === "number" &&
        Number.isInteger(yearsExperience) &&
        yearsExperience >= 0)) &&
    isNullableStringArray(Reflect.get(value, "skills")) &&
    isNullableStringArray(Reflect.get(value, "industries")) &&
    (workExperience === null ||
      (Array.isArray(workExperience) &&
        workExperience.length <= MAX_WORK_EXPERIENCE_ROWS &&
        workExperience.every(isWorkExperience))) &&
    (education === null || isEducation(education)) &&
    isNullableStringArray(Reflect.get(value, "job_titles_seeking")) &&
    (remotePreference === null ||
      remotePreference === "remote" ||
      remotePreference === "onsite" ||
      remotePreference === "hybrid" ||
      remotePreference === "any") &&
    isNullableStringArray(Reflect.get(value, "preferred_locations")) &&
    isNullableString(Reflect.get(value, "salary_expectation")) &&
    (coverLetterTone === null ||
      coverLetterTone === "formal" ||
      coverLetterTone === "casual" ||
      coverLetterTone === "enthusiastic") &&
    isNullableString(Reflect.get(value, "linkedin_url")) &&
    isNullableString(Reflect.get(value, "portfolio_url")) &&
    (workAuthorization === null ||
      workAuthorization === "citizen" ||
      workAuthorization === "permanent_resident" ||
      workAuthorization === "visa_required")
  );
}

function trimNullable(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  return value.trim() || null;
}

function trimArray(values: string[] | null): string[] {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

function normalizeProfileFormValues(
  data: ProfileFormValues,
): ProfileFormValues {
  return {
    full_name: trimNullable(data.full_name),
    phone: trimNullable(data.phone),
    location: trimNullable(data.location),
    current_title: trimNullable(data.current_title),
    experience_level: data.experience_level,
    years_experience: data.years_experience,
    skills: trimArray(data.skills),
    industries: trimArray(data.industries),
    work_experience: (data.work_experience ?? []).map((role) => ({
      companyName: role.companyName.trim(),
      jobTitle: role.jobTitle.trim(),
      startDate: role.startDate.trim(),
      endDate: role.currentlyWorking ? "" : role.endDate.trim(),
      currentlyWorking: role.currentlyWorking,
      responsibilities: role.responsibilities.trim(),
    })),
    education: data.education
      ? {
          degree: data.education.degree.trim(),
          fieldOfStudy: data.education.fieldOfStudy.trim(),
          institutionName: data.education.institutionName.trim(),
          graduationYear: data.education.graduationYear.trim(),
        }
      : null,
    job_titles_seeking: trimArray(data.job_titles_seeking),
    remote_preference: data.remote_preference,
    preferred_locations: trimArray(data.preferred_locations),
    salary_expectation: trimNullable(data.salary_expectation),
    cover_letter_tone: data.cover_letter_tone,
    linkedin_url: trimNullable(data.linkedin_url),
    portfolio_url: trimNullable(data.portfolio_url),
    work_authorization: data.work_authorization,
  };
}

export async function saveProfile(
  data: ProfileFormValues,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isProfileFormValues(data)) {
      return { success: false, error: "Please check your profile details" };
    }

    const normalizedData = normalizeProfileFormValues(data);
    const user = await requireUser();
    const insforge = await createInsforgeServer();

    const { data: existing, error: readError } = await insforge.database
      .from("profiles")
      .select("is_complete")
      .eq("id", user.id)
      .single();

    if (readError || !existing) {
      console.error("[actions/profile/saveProfile]", readError);
      return { success: false, error: "Failed to load profile" };
    }

    const completion = calculateProfileCompletion(normalizedData);

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({ ...normalizedData, is_complete: completion.isComplete })
      .eq("id", user.id);

    if (updateError) {
      console.error("[actions/profile/saveProfile]", updateError);
      return { success: false, error: "Failed to save profile" };
    }

    if (!existing.is_complete && completion.isComplete) {
      await capturePostHogServerEvent(user.id, "profile_completed", {
        userId: user.id,
      });
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error: unknown) {
    console.error("[actions/profile/saveProfile]", error);
    return { success: false, error: "Failed to save profile" };
  }
}

export async function uploadResume(
  file: File,
): Promise<{ success: boolean; error?: string; resumeKey?: string }> {
  try {
    const user = await requireUser();
    const insforge = await createInsforgeServer();

    if (file.type !== "application/pdf") {
      return { success: false, error: "Only PDF files are supported" };
    }
    if (file.size === 0) {
      return { success: false, error: "File is empty" };
    }
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      return { success: false, error: "File must be 5MB or smaller" };
    }

    const path = buildResumeStorageKey(user.id);
    const blob = new Blob([await file.arrayBuffer()], {
      type: "application/pdf",
    });

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(path, blob);

    if (uploadError || !uploadData) {
      console.error("[actions/profile/uploadResume]", uploadError);
      return { success: false, error: "Failed to upload resume" };
    }

    const { error: dbError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: uploadData.url })
      .eq("id", user.id);

    if (dbError) {
      console.error("[actions/profile/uploadResume]", dbError);
      return { success: false, error: "Failed to save resume reference" };
    }

    revalidatePath("/profile");
    return { success: true, resumeKey: path };
  } catch (error: unknown) {
    console.error("[actions/profile/uploadResume]", error);
    return { success: false, error: "Failed to upload resume" };
  }
}