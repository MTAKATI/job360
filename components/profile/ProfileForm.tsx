"use client";

import { useEffect, useId, useState, useTransition } from "react";
import type { Dispatch, JSX, SetStateAction } from "react";
import { Plus, X } from "lucide-react";
import { saveProfile } from "@/actions/profile";
import type {
  CoverLetterTone,
  ExperienceLevel,
  Profile,
  ProfileFormValues,
  RemotePreference,
  WorkAuthorization,
  WorkExperience,
} from "@/types";

type WorkExperienceRow = WorkExperience;

const MAX_WORK_EXPERIENCE_ROWS = 3;

function parseExperienceLevel(value: string): ExperienceLevel | "" {
  if (
    value === "junior" ||
    value === "mid" ||
    value === "senior" ||
    value === "lead"
  ) {
    return value;
  }

  return "";
}

function parseRemotePreference(value: string): RemotePreference | "" {
  if (
    value === "remote" ||
    value === "onsite" ||
    value === "hybrid" ||
    value === "any"
  ) {
    return value;
  }

  return "";
}

function parseCoverLetterTone(value: string): CoverLetterTone | "" {
  if (
    value === "formal" ||
    value === "casual" ||
    value === "enthusiastic"
  ) {
    return value;
  }

  return "";
}

function parseWorkAuthorization(value: string): WorkAuthorization | "" {
  if (
    value === "citizen" ||
    value === "permanent_resident" ||
    value === "visa_required"
  ) {
    return value;
  }

  return "";
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor: string;
}): JSX.Element {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-secondary"
    >
      {children}
    </label>
  );
}

const inputClasses =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-text-muted";

function fillBlank(
  setter: Dispatch<SetStateAction<string>>,
  value: string | null,
): void {
  if (value) {
    setter((current) => current.trim() || value);
  }
}

function hasWorkExperienceContent(role: WorkExperienceRow): boolean {
  return (
    role.companyName.trim() !== "" ||
    role.jobTitle.trim() !== "" ||
    role.startDate.trim() !== "" ||
    role.endDate.trim() !== "" ||
    role.currentlyWorking ||
    role.responsibilities.trim() !== ""
  );
}

function TagInput({
  id,
  label,
  placeholder,
  tags,
  onAdd,
  onRemove,
}: {
  id: string;
  label: string;
  placeholder: string;
  tags: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}): JSX.Element {
  const [draft, setDraft] = useState("");

  const handleAdd = (): void => {
    const value = draft.trim();
    if (!value || tags.includes(value)) {
      return;
    }
    onAdd(value);
    setDraft("");
  };

  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className={`${inputClasses} flex-1`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium leading-5 text-text-primary transition-colors hover:bg-surface-secondary"
        >
          Add
        </button>
      </div>
      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1 text-sm font-medium text-text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                aria-label={`Remove ${tag}`}
                className="text-text-muted transition-colors hover:text-text-primary"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SectionHeading({ children }: { children: string }): JSX.Element {
  return (
    <h3 className="text-sm font-semibold leading-5 text-text-primary">
      {children}
    </h3>
  );
}

type Props = {
  initialProfile: Profile | null;
  extractedProfile?: ProfileFormValues | null;
  onProfileChange?: (profile: ProfileFormValues) => void;
};

export function ProfileForm({
  initialProfile,
  extractedProfile,
  onProfileChange,
}: Props): JSX.Element {
  const formId = useId();
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [email] = useState(initialProfile?.email ?? "");
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [location, setLocation] = useState(initialProfile?.location ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(
    initialProfile?.linkedin_url ?? "",
  );
  const [portfolioUrl, setPortfolioUrl] = useState(
    initialProfile?.portfolio_url ?? "",
  );
  const [workAuthorization, setWorkAuthorization] = useState<
    WorkAuthorization | ""
  >(initialProfile?.work_authorization ?? "");

  const [currentTitle, setCurrentTitle] = useState(
    initialProfile?.current_title ?? "",
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">(
    initialProfile?.experience_level ?? "",
  );
  const [yearsExperience, setYearsExperience] = useState(
    initialProfile?.years_experience !== null &&
      initialProfile?.years_experience !== undefined
      ? String(initialProfile.years_experience)
      : "",
  );
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills ?? []);
  const [industries, setIndustries] = useState<string[]>(
    initialProfile?.industries ?? [],
  );

  const [workExperience, setWorkExperience] = useState<WorkExperienceRow[]>(
    initialProfile?.work_experience ?? [],
  );

  const [highestDegree, setHighestDegree] = useState(
    initialProfile?.education?.degree ?? "",
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(
    initialProfile?.education?.fieldOfStudy ?? "",
  );
  const [institutionName, setInstitutionName] = useState(
    initialProfile?.education?.institutionName ?? "",
  );
  const [graduationYear, setGraduationYear] = useState(
    initialProfile?.education?.graduationYear ?? "",
  );

  const [jobTitlesSeeking, setJobTitlesSeeking] = useState(
    (initialProfile?.job_titles_seeking ?? []).join(", "),
  );
  const [remotePreference, setRemotePreference] = useState<
    RemotePreference | ""
  >(initialProfile?.remote_preference ?? "");
  const [salaryExpectation, setSalaryExpectation] = useState(
    initialProfile?.salary_expectation ?? "",
  );
  const [preferredLocations, setPreferredLocations] = useState(
    (initialProfile?.preferred_locations ?? []).join(", "),
  );
  const [coverLetterTone, setCoverLetterTone] = useState<
    CoverLetterTone | ""
  >(initialProfile?.cover_letter_tone ?? "");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!extractedProfile) {
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      fillBlank(setFullName, extractedProfile.full_name);
      fillBlank(setPhone, extractedProfile.phone);
      fillBlank(setLocation, extractedProfile.location);
      fillBlank(setLinkedinUrl, extractedProfile.linkedin_url);
      fillBlank(setPortfolioUrl, extractedProfile.portfolio_url);
      fillBlank(setCurrentTitle, extractedProfile.current_title);
      fillBlank(setSalaryExpectation, extractedProfile.salary_expectation);

      const workAuthorization = extractedProfile.work_authorization;
      if (workAuthorization) {
        setWorkAuthorization((current) => current || workAuthorization);
      }

      const level = extractedProfile.experience_level;
      if (level) {
        setExperienceLevel((current) => current || level);
      }

      const years = extractedProfile.years_experience;
      if (years !== null) {
        setYearsExperience((current) => current.trim() || String(years));
      }

      const remote = extractedProfile.remote_preference;
      if (remote) {
        setRemotePreference((current) => current || remote);
      }

      const tone = extractedProfile.cover_letter_tone;
      if (tone) {
        setCoverLetterTone((current) => current || tone);
      }

      setSkills((current) =>
        current.length > 0 ? current : (extractedProfile.skills ?? []),
      );
      setIndustries((current) =>
        current.length > 0 ? current : (extractedProfile.industries ?? []),
      );
      setWorkExperience((current) =>
        current.some(hasWorkExperienceContent)
          ? current
          : (extractedProfile.work_experience ?? []).slice(
              0,
              MAX_WORK_EXPERIENCE_ROWS,
            ),
      );

      fillBlank(
        setJobTitlesSeeking,
        extractedProfile.job_titles_seeking?.join(", ") || null,
      );
      fillBlank(
        setPreferredLocations,
        extractedProfile.preferred_locations?.join(", ") || null,
      );

      if (extractedProfile.education) {
        fillBlank(setHighestDegree, extractedProfile.education.degree);
        fillBlank(setFieldOfStudy, extractedProfile.education.fieldOfStudy);
        fillBlank(
          setInstitutionName,
          extractedProfile.education.institutionName,
        );
        fillBlank(setGraduationYear, extractedProfile.education.graduationYear);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [extractedProfile]);

  const fieldId = (name: string): string => `${formId}-${name}`;

  const updateWorkExperienceRow = (
    index: number,
    updates: Partial<WorkExperienceRow>,
  ): void => {
    setWorkExperience((rows) =>
      rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...updates } : row,
      ),
    );
  };

  const addWorkExperienceRow = (): void => {
    if (workExperience.length >= MAX_WORK_EXPERIENCE_ROWS) {
      return;
    }
    setWorkExperience((rows) => [
      ...rows,
      {
        companyName: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        responsibilities: "",
      },
    ]);
  };

  const profileDraft: ProfileFormValues = {
    full_name: fullName.trim() || null,
    phone: phone.trim() || null,
    location: location.trim() || null,
    current_title: currentTitle.trim() || null,
    experience_level: experienceLevel || null,
    years_experience:
      yearsExperience.trim() === "" ? null : Number(yearsExperience),
    skills,
    industries,
    work_experience: workExperience,
    education: {
      degree: highestDegree,
      fieldOfStudy,
      institutionName,
      graduationYear,
    },
    job_titles_seeking: jobTitlesSeeking
      .split(",")
      .map((title) => title.trim())
      .filter(Boolean),
    remote_preference: remotePreference || null,
    preferred_locations: preferredLocations
      .split(",")
      .map((locationValue) => locationValue.trim())
      .filter(Boolean),
    salary_expectation: salaryExpectation.trim() || null,
    cover_letter_tone: coverLetterTone || null,
    linkedin_url: linkedinUrl.trim() || null,
    portfolio_url: portfolioUrl.trim() || null,
    work_authorization: workAuthorization || null,
  };

  useEffect(() => {
    onProfileChange?.({
      full_name: fullName.trim() || null,
      phone: phone.trim() || null,
      location: location.trim() || null,
      current_title: currentTitle.trim() || null,
      experience_level: experienceLevel || null,
      years_experience:
        yearsExperience.trim() === "" ? null : Number(yearsExperience),
      skills,
      industries,
      work_experience: workExperience,
      education: {
        degree: highestDegree,
        fieldOfStudy,
        institutionName,
        graduationYear,
      },
      job_titles_seeking: jobTitlesSeeking
        .split(",")
        .map((title) => title.trim())
        .filter(Boolean),
      remote_preference: remotePreference || null,
      preferred_locations: preferredLocations
        .split(",")
        .map((locationValue) => locationValue.trim())
        .filter(Boolean),
      salary_expectation: salaryExpectation.trim() || null,
      cover_letter_tone: coverLetterTone || null,
      linkedin_url: linkedinUrl.trim() || null,
      portfolio_url: portfolioUrl.trim() || null,
      work_authorization: workAuthorization || null,
    });
  }, [
    coverLetterTone,
    currentTitle,
    experienceLevel,
    fieldOfStudy,
    fullName,
    graduationYear,
    highestDegree,
    industries,
    institutionName,
    jobTitlesSeeking,
    linkedinUrl,
    location,
    onProfileChange,
    phone,
    portfolioUrl,
    preferredLocations,
    remotePreference,
    salaryExpectation,
    skills,
    workAuthorization,
    workExperience,
    yearsExperience,
  ]);

  const handleSave = (): void => {
    setError(null);

    startTransition(async () => {
      const result = await saveProfile(profileDraft);
      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-lg">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Profile Information
      </h2>
      <p className="mt-1 text-sm font-medium leading-5 text-text-secondary">
        This context is used to accurately represent you in agent
        interactions.
      </p>

      <div className="mt-6 space-y-6 border-t border-border pt-6">
        <SectionHeading>Personal Info</SectionHeading>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor={fieldId("full-name")}>Full Name</FieldLabel>
            <input
              id={fieldId("full-name")}
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("email")}>Email</FieldLabel>
            <input
              id={fieldId("email")}
              type="email"
              value={email}
              disabled
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("phone")}>Phone Number</FieldLabel>
            <input
              id={fieldId("phone")}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1 (555) 000-0000"
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("location")}>Location</FieldLabel>
            <input
              id={fieldId("location")}
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City, Country"
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("linkedin-url")}>
              LinkedIn URL
            </FieldLabel>
            <input
              id={fieldId("linkedin-url")}
              type="url"
              value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("portfolio-url")}>
              Portfolio / GitHub
            </FieldLabel>
            <input
              id={fieldId("portfolio-url")}
              type="url"
              value={portfolioUrl}
              onChange={(event) => setPortfolioUrl(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("work-authorization")}>
              Work Authorization
            </FieldLabel>
            <select
              id={fieldId("work-authorization")}
              value={workAuthorization}
              onChange={(event) =>
                setWorkAuthorization(parseWorkAuthorization(event.target.value))
              }
              className={inputClasses}
            >
              <option value="">Select...</option>
              <option value="citizen">Citizen</option>
              <option value="permanent_resident">Permanent Resident</option>
              <option value="visa_required">Visa Required</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6 border-t border-border pt-6">
        <SectionHeading>Professional Info</SectionHeading>
        <div>
          <FieldLabel htmlFor={fieldId("current-title")}>
            Current/Recent Job Title
          </FieldLabel>
          <input
            id={fieldId("current-title")}
            type="text"
            value={currentTitle}
            onChange={(event) => setCurrentTitle(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor={fieldId("experience-level")}>
              Experience Level
            </FieldLabel>
            <select
              id={fieldId("experience-level")}
              value={experienceLevel}
              onChange={(event) =>
                setExperienceLevel(parseExperienceLevel(event.target.value))
              }
              className={inputClasses}
            >
              <option value="">Select...</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("years-experience")}>
              Years of Experience
            </FieldLabel>
            <input
              id={fieldId("years-experience")}
              type="number"
              min={0}
              value={yearsExperience}
              onChange={(event) => setYearsExperience(event.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
        <TagInput
          id={fieldId("skills")}
          label="Skills"
          placeholder="Add a skill"
          tags={skills}
          onAdd={(value) => setSkills((current) => [...current, value])}
          onRemove={(value) =>
            setSkills((current) => current.filter((skill) => skill !== value))
          }
        />
        <TagInput
          id={fieldId("industries")}
          label="Industries Worked In (Optional)"
          placeholder="E.g. FinTech, Healthcare"
          tags={industries}
          onAdd={(value) => setIndustries((current) => [...current, value])}
          onRemove={(value) =>
            setIndustries((current) =>
              current.filter((industry) => industry !== value),
            )
          }
        />
      </div>

      <div className="mt-6 space-y-6 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <SectionHeading>Work Experience</SectionHeading>
          <button
            type="button"
            onClick={addWorkExperienceRow}
            disabled={workExperience.length >= MAX_WORK_EXPERIENCE_ROWS}
            className="inline-flex items-center gap-1 text-sm font-medium leading-5 text-accent transition-colors hover:text-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add role
          </button>
        </div>

        {workExperience.map((role, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border border-border p-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor={fieldId(`company-${index}`)}>
                  Company Name
                </FieldLabel>
                <input
                  id={fieldId(`company-${index}`)}
                  type="text"
                  value={role.companyName}
                  onChange={(event) =>
                    updateWorkExperienceRow(index, {
                      companyName: event.target.value,
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <FieldLabel htmlFor={fieldId(`job-title-${index}`)}>
                  Job Title
                </FieldLabel>
                <input
                  id={fieldId(`job-title-${index}`)}
                  type="text"
                  value={role.jobTitle}
                  onChange={(event) =>
                    updateWorkExperienceRow(index, {
                      jobTitle: event.target.value,
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <FieldLabel htmlFor={fieldId(`start-date-${index}`)}>
                  Start Date
                </FieldLabel>
                <input
                  id={fieldId(`start-date-${index}`)}
                  type="month"
                  value={role.startDate}
                  onChange={(event) =>
                    updateWorkExperienceRow(index, {
                      startDate: event.target.value,
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <FieldLabel htmlFor={fieldId(`end-date-${index}`)}>
                    End Date
                  </FieldLabel>
                  <label
                    htmlFor={fieldId(`currently-working-${index}`)}
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-secondary"
                  >
                    <input
                      id={fieldId(`currently-working-${index}`)}
                      type="checkbox"
                      checked={role.currentlyWorking}
                      onChange={(event) =>
                        updateWorkExperienceRow(index, {
                          currentlyWorking: event.target.checked,
                          endDate: event.target.checked ? "" : role.endDate,
                        })
                      }
                      className="size-3.5 rounded border-border text-accent focus:ring-accent"
                    />
                    Currently working here
                  </label>
                </div>
                <input
                  id={fieldId(`end-date-${index}`)}
                  type="month"
                  value={role.endDate}
                  disabled={role.currentlyWorking}
                  onChange={(event) =>
                    updateWorkExperienceRow(index, {
                      endDate: event.target.value,
                    })
                  }
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor={fieldId(`responsibilities-${index}`)}>
                Key Responsibilities
              </FieldLabel>
              <textarea
                id={fieldId(`responsibilities-${index}`)}
                value={role.responsibilities}
                onChange={(event) =>
                  updateWorkExperienceRow(index, {
                    responsibilities: event.target.value,
                  })
                }
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4 border-t border-border pt-6">
        <SectionHeading>Education</SectionHeading>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor={fieldId("highest-degree")}>
              Highest Degree
            </FieldLabel>
            <select
              id={fieldId("highest-degree")}
              value={highestDegree}
              onChange={(event) => setHighestDegree(event.target.value)}
              className={inputClasses}
            >
              <option value="">Select...</option>
              <option value="high_school">High School</option>
              <option value="associate">Associate&apos;s</option>
              <option value="bachelor">Bachelor&apos;s</option>
              <option value="master">Master&apos;s</option>
              <option value="phd">PhD</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("field-of-study")}>
              Field of Study
            </FieldLabel>
            <input
              id={fieldId("field-of-study")}
              type="text"
              value={fieldOfStudy}
              onChange={(event) => setFieldOfStudy(event.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("institution-name")}>
              Institution Name
            </FieldLabel>
            <input
              id={fieldId("institution-name")}
              type="text"
              value={institutionName}
              onChange={(event) => setInstitutionName(event.target.value)}
              placeholder="E.g. State University"
              className={inputClasses}
            />
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("graduation-year")}>
              Graduation Year
            </FieldLabel>
            <input
              id={fieldId("graduation-year")}
              type="text"
              inputMode="numeric"
              value={graduationYear}
              onChange={(event) => setGraduationYear(event.target.value)}
              placeholder="YYYY"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4 border-t border-border pt-6">
        <SectionHeading>Job Preferences</SectionHeading>
        <div>
          <FieldLabel htmlFor={fieldId("job-titles-seeking")}>
            Job Titles Seeking
          </FieldLabel>
          <input
            id={fieldId("job-titles-seeking")}
            type="text"
            value={jobTitlesSeeking}
            onChange={(event) => setJobTitlesSeeking(event.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor={fieldId("remote-preference")}>
              Remote Preference
            </FieldLabel>
            <select
              id={fieldId("remote-preference")}
              value={remotePreference}
              onChange={(event) =>
                setRemotePreference(parseRemotePreference(event.target.value))
              }
              className={inputClasses}
            >
              <option value="">Select...</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor={fieldId("salary-expectation")}>
              Salary Expectation (Optional)
            </FieldLabel>
            <input
              id={fieldId("salary-expectation")}
              type="text"
              value={salaryExpectation}
              onChange={(event) => setSalaryExpectation(event.target.value)}
              placeholder="E.g. $120k+"
              className={inputClasses}
            />
          </div>
        </div>
        <div>
          <FieldLabel htmlFor={fieldId("preferred-locations")}>
            Preferred Locations (Optional)
          </FieldLabel>
          <input
            id={fieldId("preferred-locations")}
            type="text"
            value={preferredLocations}
            onChange={(event) => setPreferredLocations(event.target.value)}
            placeholder="E.g. New York, London"
            className={inputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor={fieldId("cover-letter-tone")}>
            Cover Letter Tone (Optional)
          </FieldLabel>
          <select
            id={fieldId("cover-letter-tone")}
            value={coverLetterTone}
            onChange={(event) =>
              setCoverLetterTone(parseCoverLetterTone(event.target.value))
            }
            className={inputClasses}
          >
            <option value="">Select...</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-md border border-error bg-surface px-4 py-3 text-sm text-error"
        >
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSave}
        className="mt-8 w-full rounded-md bg-accent px-4 py-3 text-sm font-medium leading-5 text-accent-foreground transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save Profile"}
      </button>
    </section>
  );
}
