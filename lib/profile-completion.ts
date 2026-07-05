import type { Profile } from "@/types";

export type ProfileCompletionInput = Pick<
  Profile,
  | "full_name"
  | "phone"
  | "location"
  | "current_title"
  | "experience_level"
  | "years_experience"
  | "skills"
  | "work_experience"
  | "education"
  | "job_titles_seeking"
  | "remote_preference"
>;

export type ProfileCompletionResult = {
  percentage: number;
  missingFields: string[];
  isComplete: boolean;
};

type RequiredField = {
  label: string;
  isFilled: (profile: ProfileCompletionInput) => boolean;
};

function isNonEmptyString(value: string | null): boolean {
  return value !== null && value.trim() !== "";
}

const REQUIRED_FIELDS: RequiredField[] = [
  { label: "Full Name", isFilled: (p) => isNonEmptyString(p.full_name) },
  { label: "Phone", isFilled: (p) => isNonEmptyString(p.phone) },
  { label: "Location", isFilled: (p) => isNonEmptyString(p.location) },
  {
    label: "Current Title",
    isFilled: (p) => isNonEmptyString(p.current_title),
  },
  {
    label: "Experience Level",
    isFilled: (p) => p.experience_level !== null,
  },
  {
    label: "Years of Experience",
    isFilled: (p) => p.years_experience !== null,
  },
  {
    label: "Skills",
    isFilled: (p) => (p.skills?.length ?? 0) > 0,
  },
  {
    label: "Work Experience",
    isFilled: (p) => {
      const firstRole = p.work_experience?.[0];
      return Boolean(
        firstRole &&
          firstRole.companyName.trim() !== "" &&
          firstRole.jobTitle.trim() !== "" &&
          firstRole.startDate.trim() !== "",
      );
    },
  },
  {
    label: "Education",
    isFilled: (p) =>
      Boolean(
        p.education &&
          p.education.degree.trim() !== "" &&
          p.education.fieldOfStudy.trim() !== "" &&
          p.education.institutionName.trim() !== "" &&
          p.education.graduationYear.trim() !== "",
      ),
  },
  {
    label: "Job Titles Seeking",
    isFilled: (p) => (p.job_titles_seeking?.length ?? 0) > 0,
  },
  {
    label: "Remote Preference",
    isFilled: (p) => p.remote_preference !== null,
  },
];

export function calculateProfileCompletion(
  profile: ProfileCompletionInput,
): ProfileCompletionResult {
  const missingFields = REQUIRED_FIELDS.filter(
    (field) => !field.isFilled(profile),
  ).map((field) => field.label);

  const percentage = Math.round(
    ((REQUIRED_FIELDS.length - missingFields.length) / REQUIRED_FIELDS.length) *
      100,
  );

  return {
    percentage,
    missingFields,
    isComplete: missingFields.length === 0,
  };
}
